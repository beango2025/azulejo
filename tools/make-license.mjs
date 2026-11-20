import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const args = process.argv.slice(2);
const get = (name, fallback = '') => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};
const email = get('email');
const days = Number(get('days', '365'));
const plan = get('plan', 'pro');
const level = get('level', '').toUpperCase();
if (!email || !Number.isFinite(days) || days <= 0) {
  console.error('Uso: node tools/make-license.mjs --email aluno@example.com --level A2 [--days 365]');
  console.error('Ou:  node tools/make-license.mjs --email aluno@example.com --plan pro [--days 365]');
  process.exit(1);
}
const keyPath = path.join(process.cwd(), '.secrets/license-private.pem');
if (!fs.existsSync(keyPath)) {
  console.error('Falta .secrets/license-private.pem');
  process.exit(1);
}
const now = Date.now();
const payload = level
  ? { sub: email, plan: 'level', levels: [level], iat: now, exp: now + Math.round(days * 86400000) }
  : { sub: email, plan, iat: now, exp: now + Math.round(days * 86400000) };
const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
const signature = crypto.sign('sha256', Buffer.from(body), {
  key: fs.readFileSync(keyPath, 'utf8'),
  dsaEncoding: 'ieee-p1363'
}).toString('base64url');
const token = `${body}.${signature}`;
console.log(token);
console.error(`Licença ${level || plan} para ${email}, ${days} dias.`);
