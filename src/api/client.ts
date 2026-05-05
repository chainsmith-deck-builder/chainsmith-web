import createClient from 'openapi-fetch';
import type { paths } from './schema';

// Auth middleware that attaches the Supabase JWT lands here once AuthProvider
// is wired up. See .claude/rules/api-client.md.
//
// The `fetch` override is deliberate: openapi-fetch captures `globalThis.fetch`
// at client-creation time, but MSW's `setupServer` patches `globalThis.fetch`
// later, in `beforeAll`. Without this thunk, tests would hit the network
// because the captured reference predates MSW's patch.
export const api = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? '/',
  fetch: (...args) => globalThis.fetch(...args),
});
