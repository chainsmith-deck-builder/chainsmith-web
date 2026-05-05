import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './msw/server';

// Boot i18next for all tests so `t()` returns real English strings rather
// than raw keys. Per .claude/rules/testing.md, tests assert on the rendered
// translation, not the key.
import '../i18n';

// jsdom doesn't ship IntersectionObserver. Components that use it (infinite
// scroll, lazy-load) would otherwise throw at mount. The stub is inert —
// tests exercise pagination through the keyboard-fallback button rather
// than by simulating viewport intersection.
class IntersectionObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: readonly number[] = [];
}
globalThis.IntersectionObserver =
  IntersectionObserverStub as unknown as typeof IntersectionObserver;

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());
