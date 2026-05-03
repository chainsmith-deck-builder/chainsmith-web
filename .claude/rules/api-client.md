# API client rules

The web client consumes the `chainsmith` backend's HTTP API. The backend's contract is OpenAPI 3.x, emitted via `utoipa` macros, and committed as `openapi.json` in the backend repo. See `chainsmith/.claude/rules/api-contract.md` for the producer-side rules. This file covers the consumer side.

## Type generation

- **Types** come from `openapi-typescript`, run against the OpenAPI spec at the SHA pinned in `.api-version`. Output lands in `src/api/schema.d.ts`.
- **Runtime client** is `openapi-fetch`, configured in `src/api/client.ts`.
- **No hand-rolled fetch wrappers.** No axios. No manually-typed request and response shapes. The whole point of openapi-fetch is that the path, method, params, and response type are checked together.
- The `.api-version` file is one line: a 40-character commit SHA from `chainsmith-deck-builder/chainsmith`. A scheduled GitHub Action bumps it to `main` HEAD weekly, regenerates types, and opens a PR. If the regenerated types break typecheck, the PR fails — that's the intended drift signal.

## The client

`src/api/client.ts` exports a single configured client used by the rest of the app:

```ts
import createClient from 'openapi-fetch';
import type { paths } from './schema';

export const api = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
});
```

A middleware layer attaches the JWT from the Supabase session on every request and handles 401s by routing to the sign-in flow. That's the only middleware. Don't add request loggers, retry logic, or response transformers here — TanStack Query handles retries, the browser handles logging, and transforming responses widens the gap between the typed schema and what callers see.

## TanStack Query keys

- Query keys are tuples that mirror the operation tag and the params:

  ```ts
  ['decks', 'list', { format, limit }]
  ['decks', 'detail', { id }]
  ['cards', 'search', { query, filters }]
  ```

- The first segment is the OpenAPI tag (mirrors how operations are grouped in the spec — `Decks`, `Catalog`, `Validation`, `Health`, etc.).
- The second segment is the operation kind (`list`, `detail`, `search`, etc.).
- The third segment, when present, is a params object. Use a stable param shape so cache hits land.
- Mutations invalidate the smallest correct prefix on success: a deck update invalidates `['decks', 'detail', { id }]` and `['decks', 'list']` but not `['cards']`.

A small helper module (`src/api/queryKeys.ts`) exports key factories so the convention is enforced statically.

## Error handling

- Every response is typed. Error bodies match the backend's `{ error: { code, message, details? } }` shape.
- The `code` field is a string union exported from the generated schema. Switch on it with exhaustiveness:

  ```ts
  switch (err.code) {
    case 'deck_not_found':
      return t('errors.deck_not_found');
    case 'deck_validation_failed':
      return t('errors.deck_validation_failed', { details: err.details });
    // every code listed; default is unreachable
  }
  ```

- New backend codes light up as TypeScript exhaustiveness errors, *and* as missing keys in `errors.json` (see `i18n.md`). Both signals point you at the same fix.
- The `message` field is for humans and may change without warning. Don't switch on it. Don't display it raw in production — show the translated message keyed by `code`.
- `details` is structured context (validation failures, banned cards, etc.). Type it precisely per error code, don't widen to `unknown`.

## Auth

- The Supabase JS client owns session storage and refresh. It runs in the browser, talks to Supabase's auth endpoints, and emits session-change events.
- A small `AuthProvider` listens for session changes and stashes the current JWT in a context the API client middleware reads. Tokens never appear in components.
- We use **only** the Supabase **anon** key in the client bundle. The service-role key is server-side only and does not exist in this repo at all.
- Route guards use the auth context, not raw token reads. A user who isn't signed in can't visit `/decks/new` — the route redirects to `/sign-in?next=...`.
- Sign-out clears the Supabase session, which clears the in-memory token, which causes the next API call to either fail with 401 or hit the public endpoints.

## Caching, retries, polling

- TanStack Query defaults are mostly right. Don't override `staleTime` / `gcTime` per query unless there's a measurable reason. Tune at the `QueryClient` config level if a global change is needed.
- **Retries**: default of 3 with exponential backoff is fine for GETs. **Mutations don't retry by default** — a duplicate POST is worse than a failed POST. Add a retry only when the operation is idempotent and you've confirmed the backend is.
- **Polling**: avoid. If you find yourself polling, the backend should be giving you a websocket or SSE stream and isn't yet. Open an issue rather than papering over with `refetchInterval`.

## Pagination

- The backend uses cursor-based pagination (see `chainsmith/.claude/rules/api-contract.md`). Use TanStack Query's `useInfiniteQuery` for paginated reads.
- The cursor is opaque to the client — don't parse it, don't construct one yourself.
- Page size lives at the call site, not in a global constant. Different views want different page sizes.

## What not to do

- **Don't** call the API outside `src/api/`. Components and hooks consume the typed client; they don't construct fetch calls.
- **Don't** add a separate `/api/v2` namespace in this repo. Versioning is the backend's responsibility per its api-contract rules; the web client follows the SHA pin.
- **Don't** mock the API by patching `fetch`. Use MSW (see `testing.md`) so request/response shapes are still typed against the real schema.
- **Don't** narrow error types via `as` casts. If you need a narrower type, the discriminator is `code`; switch on it.
- **Don't** introduce a "client SDK" package. The generated types + `openapi-fetch` is the SDK.
