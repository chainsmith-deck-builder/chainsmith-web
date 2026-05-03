import type { RequestHandler } from 'msw';

// Empty by default. Per-test handlers go in the test file via `server.use(...)`.
// Shared fixtures land here once a real endpoint is exercised by more than one test.
export const handlers: RequestHandler[] = [];
