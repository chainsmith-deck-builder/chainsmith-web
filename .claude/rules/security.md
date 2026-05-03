# Security rules

Browser-side security. Lighter than the backend's `chainsmith/.claude/rules/security.md` because the web client doesn't issue tokens, hold a database, or own the API contract — but the parts that matter still matter. The threat model is "an internet-exposed SPA holding session state for a logged-in user."

## Secrets in client bundles

- **Nothing secret ships in client bundles.** Anything in a `VITE_*` env var is **public** by definition — it's compiled into the JavaScript that ships to every visitor. Treat `VITE_*` as a staging ground for non-secret config (API base URL, Supabase project URL, Supabase **anon** key).
- The Supabase **service-role** key never exists in this repo. It does not appear in `.env.example`, in CI, in build scripts, or in any code path. The web client has no use for it.
- `.env` is gitignored. `.env.example` documents the required `VITE_*` variables with placeholder values.
- `gitleaks` runs in `.githooks/pre-commit` and in CI. A hit blocks the commit; investigate before suppressing.

## Tokens and sessions

- The Supabase JS client owns token storage and refresh. **Don't** roll custom JWT handling in the browser. **Don't** put tokens in `localStorage` ourselves — Supabase's storage adapter is the only path.
- Token reads happen through the auth context (see `api-client.md`). Components do not see raw tokens. Logs do not see raw tokens.
- Sign-out clears the Supabase session and the in-memory token. Force a full reload after sign-out so no in-memory state from the signed-in session leaks into the signed-out app.

## XSS

- **Never `dangerouslySetInnerHTML`.** Card text from the backend is plain text; render it through React, which escapes by default.
- FaB-specific rendering (pitch icons inline in card text, e.g. `[1]` rendered as a red pip) goes through a small symbol-replacer that emits React nodes — not a regex that builds HTML strings. Output type is `ReactNode[]`, not `string`.
- If a future feature genuinely needs to render HTML from a third party (e.g. a user-authored deck description with markdown), sanitize with **DOMPurify** configured with a strict allowlist, and document the call site with a comment naming the rule and the threat. Default-deny, opt-in.
- User-authored content (deck names, descriptions, profile fields) is rendered as text only. We do not parse markdown in user-authored fields without an explicit, scoped rule for that field.

## Content Security Policy

Ship a strict CSP, either via a meta tag in `index.html` or (preferred when hosting allows) via an HTTP header. The starting policy:

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' https://cards.fabtcg.com data:;
font-src 'self' data:;
connect-src 'self' <api host> https://<project>.supabase.co;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

- **No `'unsafe-inline'` for scripts.** Vite's prod build doesn't need it.
- **No `'unsafe-eval'`.** No code path in this app needs it. Adding a dependency that needs `eval` is a code-review red flag.
- **`style-src 'unsafe-inline'`** is grudgingly allowed for inline styles Vite emits during dev / for Tailwind-generated runtime styles. Revisit with nonces or hashes if the pattern can be expressed without it.
- **`img-src` allows `https://cards.fabtcg.com`** to permit hot-linking LSS card art. This matches the backend security rule (`chainsmith/.claude/rules/security.md#card-images`) — we hot-link images directly, no proxying. `data:` allows blur-up placeholders.
- **`frame-ancestors 'none'`** prevents clickjacking.

CSP changes go through review; loosening the policy requires a written justification.

## Card images

- Card images load from `https://cards.fabtcg.com/...` directly via `<img src={printing.imageUrl} />`.
- **No proxying through our origin.** Don't introduce a `/images/...` route in this app or a CDN edge worker that re-serves the image. The backend's security rule covers the same ground for the same reason: hot-linking is the same posture every other FaB tool takes; proxying is a stronger infringement claim than direct linking.
- When `printing.imageUrl` is `null` (upstream omitted it), render a typographic fallback. Never substitute our own image for the missing card art.

## Dependencies

- **`pnpm audit`** runs in CI on every PR and on a nightly schedule. A high-severity advisory blocks merge until it's addressed (fix, mitigate, or accept-with-justification documented in the PR).
- **Lockfile** (`pnpm-lock.yaml`) is committed.
- **Pinned versions** in `package.json` — no `^` ranges, no `latest`. Use exact versions like `"react": "19.0.0"`. Renovate handles bumps with a PR per dependency.
- Before adding a new dependency: check its maintenance status, recent release activity, and download stats. Prefer well-maintained packages from established orgs (TanStack, Vercel, Vite, React core team) over single-maintainer hobby projects for anything load-bearing.

## Supply chain

- The build pipeline runs in CI on a clean runner with a pinned Node and pnpm version. We don't trust local node_modules to ship to production.
- The deploy artifact is the `dist/` produced by `pnpm build` in CI; no developer machine produces production builds.
- A future hardening step is publishing build provenance (SLSA, GitHub artifact attestations) — not in scope for pre-launch but documented as a follow-up.

## Data hygiene

- **No PII in logs.** Don't `console.log(user)`. If you need to log something derived from a user, log the user ID only, never the email.
- **No PII in analytics.** When analytics is added (post-MVP), the contract is ID-only events; PII never leaves the user's browser.
- **No card-collection data sent to third parties.** A user's collection is data they trust us with; it doesn't leave our backend.

## Disclosure

This project does not yet have a published security policy. When it does, link it from this file. Until then, the response to any security report is to treat it seriously and fix it quickly, even informally.
