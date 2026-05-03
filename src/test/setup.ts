import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './msw/server';

// Boot i18next for all tests so `t()` returns real English strings rather
// than raw keys. Per .claude/rules/testing.md, tests assert on the rendered
// translation, not the key.
import '../i18n';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());
