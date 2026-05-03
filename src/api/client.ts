import createClient from 'openapi-fetch';
import type { paths } from './schema';

// Auth middleware that attaches the Supabase JWT lands here once AuthProvider
// is wired up. See .claude/rules/api-client.md.
export const api = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? '/',
});
