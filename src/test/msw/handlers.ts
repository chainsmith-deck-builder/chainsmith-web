import type { RequestHandler } from 'msw';

// Empty by default. Per-test handlers go in the test file via `server.use(...)`.
// Shared fixtures land here once a real endpoint is exercised by more than one test.
export const handlers: RequestHandler[] = [];

// All handlers should hit the same base URL the runtime client uses, so the
// path matching mirrors production. Pinned for tests by vitest.config.ts so
// MSW's URL matchers stay deterministic regardless of the dev .env.
const TEST_API_BASE_URL = 'http://api.test';

export function apiUrl(path: `/${string}`): string {
  return `${TEST_API_BASE_URL}${path}`;
}
