# Azulejo licence worker

Cloudflare Worker that turns a Stripe Payment Link purchase into a signed Azulejo Pro licence and emails it to the buyer.

## Flow

1. Buyer pays through a Stripe Payment Link.
2. Stripe sends `checkout.session.completed` to `POST /stripe-webhook`.
3. Worker verifies the Stripe signature, signs an ECDSA P-256 licence with `LICENSE_PRIVATE_KEY`, and sends it with Resend.
4. Buyer opens the app, goes to **A2 模考 → Licença**, and pastes the token.

The Stripe Payment Link success URL should be:

```
https://beango2025.github.io/azulejo/#/pro/success
```

## Deploy

```bash
cd server
npx wrangler deploy
npx wrangler secret put STRIPE_WEBHOOK_SECRET
npx wrangler secret put LICENSE_PRIVATE_KEY
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put FROM_EMAIL
npx wrangler secret put REPLY_TO
```

For local development:

```bash
cp .dev.vars.example .dev.vars
npx wrangler dev
```

Add a Stripe webhook endpoint pointing to:

```
https://<worker-subdomain>.workers.dev/stripe-webhook
```

Subscribe only to `checkout.session.completed`.

## How to put the private key in a secret

The key is the same one used by `tools/make-license.mjs`:

```bash
cd ..
npx wrangler secret put LICENSE_PRIVATE_KEY --config server/wrangler.toml < .secrets/license-private.pem
```

Or paste the PEM when prompted. Never commit `.secrets/` or `.dev.vars`.

## Test without Stripe

The worker exposes `GET /health`:

```bash
curl https://<worker-subdomain>.workers.dev/health
```

For a full test, use Stripe CLI:

```bash
stripe listen --forward-to localhost:8787/stripe-webhook
stripe trigger checkout.session.completed
```

`checkout.session.completed` test events may not include a customer email; use a real test-mode Checkout Session with an email.

## Private exam bank (optional)

The public app still ships a local fallback bank. To make the full 60-exam bank private:

1. Create a KV namespace:

```bash
npx wrangler kv namespace create EXAM_BANK
```

2. Put the returned id into `wrangler.toml` under `[[kv_namespaces]]`.
3. Export the current bank locally:

```bash
node tools/export-exam-bank.mjs
```

4. Upload it:

```bash
npx wrangler kv key put bank --binding=EXAM_BANK --path=server/exam-bank.json
```

5. Store the public licence key:

```bash
npx wrangler secret put LICENSE_PUBLIC_JWK
```

Paste the contents of `.secrets/license-public.jwk.json`.

6. Set `examApiUrl` in `js/config.js` to:

```text
https://<worker-subdomain>.workers.dev/exam-bank
```

The endpoint returns the bank only for a valid, unexpired licence. Once verified in production, remove the full `js/exam-bank.js` from the public deployment and keep only a 6-exam preview. The full bank is gitignored at `server/exam-bank.json`.

**Important:** deleting a file from the current commit does not remove it from Git history. For real protection, make the repository private or rewrite history before publishing.

## Notes

- Licences are valid for 365 days by default; override with Stripe metadata `days`.
- `plan` metadata defaults to `pro`.
- This worker does not store orders; add D1/KV if you need idempotency, refunds or resends.
- `RESEND_API_KEY`/`FROM_EMAIL` are optional only for local debugging; production delivery needs both.
