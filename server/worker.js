/**
 * Azulejo licence delivery worker (Cloudflare Workers).
 *
 * Stripe Payment Link -> checkout.session.completed -> signed licence -> email.
 * Secrets:
 *   STRIPE_WEBHOOK_SECRET
 *   LICENSE_PRIVATE_KEY   (PKCS#8 PEM, the same key used by tools/make-license.mjs)
 *   RESEND_API_KEY
 *   FROM_EMAIL
 *   REPLY_TO (optional)
 */

const enc = new TextEncoder();

function b64url(bytes) {
  let binary = '';
  const view = new Uint8Array(bytes);
  for (let i = 0; i < view.length; i += 1) binary += String.fromCharCode(view[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function pemToArrayBuffer(pem) {
  const body = String(pem || '')
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\s+/g, '');
  const raw = atob(body);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i);
  return bytes.buffer;
}

function hex(bytes) {
  return [...new Uint8Array(bytes)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

async function verifyStripeSignature(payload, header, secret) {
  if (!header) return false;
  const parts = Object.fromEntries(header.split(',').map(part => part.split('=')));
  if (!parts.t || !parts.v1) return false;
  const timestamp = Number(parts.t);
  if (!Number.isFinite(timestamp) || Math.abs(Date.now() / 1000 - timestamp) > 300) return false;
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(`${parts.t}.${payload}`));
  const expected = hex(signature);
  if (expected.length !== parts.v1.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i += 1) mismatch |= expected.charCodeAt(i) ^ parts.v1.charCodeAt(i);
  return mismatch === 0;
}

export async function signLicense({ email, plan = 'pro', days = 365, order = '', privateKey }) {
  if (!email || !privateKey) throw new Error('email and privateKey are required');
  const now = Date.now();
  const payload = { sub: email, plan, iat: now, exp: now + Math.round(days * 86400000) };
  if (order) payload.order = order;
  const body = b64url(enc.encode(JSON.stringify(payload)));
  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(privateKey),
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, enc.encode(body));
  return `${body}.${b64url(signature)}`;
}

async function sendEmail(env, to, token, sessionId) {
  if (!env.RESEND_API_KEY || !env.FROM_EMAIL) {
    console.log('RESEND_NOT_CONFIGURED', { to, sessionId });
    return { sent: false };
  }
  const subject = 'O teu acesso ao Azulejo Pro';
  const text = [
    'Olá,',
    '',
    'Obrigado pela compra do Azulejo Pro / A2 CIPLE Mock Pack.',
    '',
    'Abre este link e cola a licença na secção «Licença»:',
    'https://beango2025.github.io/azulejo/#/pro',
    '',
    'LICENÇA:',
    token,
    '',
    'A licença é verificada no teu dispositivo. Guarda este email.',
    '',
    'Azulejo · Português europeu'
  ].join('\n');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL,
      to: [to],
      reply_to: env.REPLY_TO || undefined,
      subject,
      text
    })
  });
  if (!response.ok) throw new Error(`Resend ${response.status}: ${await response.text()}`);
  return { sent: true };
}

async function handleStripe(request, env) {
  const payload = await request.text();
  const valid = await verifyStripeSignature(payload, request.headers.get('stripe-signature'), env.STRIPE_WEBHOOK_SECRET);
  if (!valid) return json({ error: 'invalid signature' }, 400);
  let event;
  try { event = JSON.parse(payload); } catch { return json({ error: 'invalid json' }, 400); }
  if (event.type !== 'checkout.session.completed') return json({ received: true, ignored: event.type });
  const session = event.data?.object || {};
  const email = session.customer_details?.email || session.customer_email;
  if (!email) return json({ error: 'missing customer email' }, 422);
  try {
    const token = await signLicense({
      email,
      plan: session.metadata?.plan || 'pro',
      days: Number(session.metadata?.days || 365),
      order: session.id,
      privateKey: env.LICENSE_PRIVATE_KEY
    });
    const delivery = await sendEmail(env, email, token, session.id);
    return json({ received: true, delivered: delivery.sent, order: session.id });
  } catch (error) {
    console.error('LICENSE_ERROR', error.message);
    return json({ error: 'licence generation failed' }, 500);
  }
}

function b64urlToBytes(value) {
  const pad = value.length % 4 ? '='.repeat(4 - (value.length % 4)) : '';
  const raw = atob(value.replace(/-/g, '+').replace(/_/g, '/') + pad);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

async function verifyLicense(token, publicJwk) {
  const [body, signature] = String(token || '').split('.');
  if (!body || !signature || !publicJwk) return null;
  let payload;
  try { payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(body))); } catch { return null; }
  if (!payload.sub || Number(payload.exp) < Date.now()) return null;
  try {
    const key = await crypto.subtle.importKey('jwk', publicJwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
    const ok = await crypto.subtle.verify(
      { name: 'ECDSA', hash: 'SHA-256' },
      key,
      b64urlToBytes(signature),
      enc.encode(body)
    );
    return ok ? payload : null;
  } catch {
    return null;
  }
}

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, OPTIONS',
  'access-control-allow-headers': 'authorization, content-type'
};

function corsJson(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...CORS }
  });
}

async function handleExamBank(request, env) {
  const auth = request.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!token) return corsJson({ error: 'missing licence' }, 401);
  let publicJwk;
  try { publicJwk = JSON.parse(env.LICENSE_PUBLIC_JWK || 'null'); } catch { publicJwk = null; }
  const payload = await verifyLicense(token, publicJwk);
  if (!payload) return corsJson({ error: 'invalid or expired licence' }, 403);
  if (!env.EXAM_BANK) return corsJson({ error: 'exam bank not configured' }, 503);
  const raw = await env.EXAM_BANK.get('bank');
  if (!raw) return corsJson({ error: 'exam bank empty' }, 503);
  return new Response(raw, {
    headers: { 'content-type': 'application/json; charset=utf-8', ...CORS }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    if (request.method === 'GET' && url.pathname === '/health') return corsJson({ ok: true, service: 'azulejo-license' });
    if (request.method === 'GET' && url.pathname === '/exam-bank') return handleExamBank(request, env);
    if (request.method === 'POST' && url.pathname === '/stripe-webhook') return handleStripe(request, env);
    return corsJson({ error: 'not found' }, 404);
  }
};
