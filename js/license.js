/* Azulejo Pro — offline signed licence verification. */
(function () {
  'use strict';

  const PUBLIC_JWK = {
    kty: 'EC',
    x: 'xWOF_7kO0zMmmlBYk7L4AMarVrVBIB3PM-hs8IaT2Ik',
    y: 'CxWQ_PiI-V3aiJu0HjK-BD0rGk-rviWzTZUHH2_UoUk',
    crv: 'P-256'
  };
  const STORAGE = 'azulejo.license';

  function b64urlToBytes(value) {
    const pad = value.length % 4 ? '='.repeat(4 - (value.length % 4)) : '';
    const raw = atob(value.replace(/-/g, '+').replace(/_/g, '/') + pad);
    return Uint8Array.from(raw, char => char.charCodeAt(0));
  }

  function decodePayload(part) {
    try {
      return JSON.parse(new TextDecoder().decode(b64urlToBytes(part)));
    } catch {
      return null;
    }
  }

  async function verify(token) {
    const clean = String(token || '').trim();
    const parts = clean.split('.');
    if (parts.length !== 2) return { ok: false, reason: 'Formato inválido.' };
    const payload = decodePayload(parts[0]);
    if (!payload || !payload.sub || !payload.exp) return { ok: false, reason: 'Licença incompleta.' };
    try {
      const key = await crypto.subtle.importKey('jwk', PUBLIC_JWK, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
      const ok = await crypto.subtle.verify(
        { name: 'ECDSA', hash: 'SHA-256' },
        key,
        b64urlToBytes(parts[1]),
        new TextEncoder().encode(parts[0])
      );
      if (!ok) return { ok: false, reason: 'Assinatura inválida.' };
      if (Number(payload.exp) < Date.now()) return { ok: false, reason: 'Licença expirada.' };
      return { ok: true, payload };
    } catch {
      return { ok: false, reason: 'Não foi possível verificar a licença.' };
    }
  }

  function current() {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && parsed.token && parsed.payload ? parsed : null;
    } catch {
      return null;
    }
  }

  function isPro() {
    const active = current();
    return Boolean(active && Number(active.payload.exp) > Date.now());
  }

  async function activate(token) {
    const result = await verify(token);
    if (!result.ok) return result;
    const record = { token: String(token).trim(), payload: result.payload, activatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE, JSON.stringify(record));
    return { ok: true, payload: result.payload };
  }

  function clear() {
    localStorage.removeItem(STORAGE);
  }

  window.AZ_LICENSE = { verify, activate, current, isPro, clear, publicKey: PUBLIC_JWK };
})();
