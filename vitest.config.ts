import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['tests/**', 'node_modules/**', 'dist/**'],
    // Pin VITE_API_BASE_URL for tests so MSW handlers and the runtime client
    // agree on the host. The dev .env points at localhost:8080; tests use a
    // synthetic origin so handlers don't accidentally match a dev backend.
    env: {
      VITE_API_BASE_URL: 'http://api.test',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'src/routeTree.gen.ts',
        'src/api/schema.d.ts',
        'src/test/**',
        '**/*.config.{ts,js,mjs}',
      ],
    },
  },
});
