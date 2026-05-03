import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import i18next from 'eslint-plugin-i18next';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'src/routeTree.gen.ts',
      'src/api/schema.d.ts',
    ],
  },
  // App + test code
  {
    files: ['src/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
    ],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      i18next,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      // `Route` is the TanStack Router file-based-route convention; whitelisting
      // it lets route files co-locate their component with the route definition.
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true, allowExportNames: ['Route'] },
      ],
      // Strict TypeScript per .claude/rules/clean-code.md
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      // i18n hard requirement per .claude/rules/i18n.md
      'i18next/no-literal-string': [
        'error',
        {
          mode: 'jsx-text-only',
          'jsx-attributes': {
            include: ['alt', 'aria-label', 'aria-description', 'title', 'placeholder'],
          },
          callees: { exclude: ['t', 'i18nKey', 'cn', 'clsx'] },
          words: {
            exclude: ['^[A-Z_][A-Z0-9_]*$', '^[\\d\\s.,$%/+\\-:×]+$'],
          },
        },
      ],
    },
  },
  // Test files: relax i18next/no-literal-string — fixtures and assertions
  // legitimately use raw English strings.
  {
    files: ['src/**/*.{test,spec}.{ts,tsx}', 'tests/**/*.{ts,tsx}', 'src/test/**/*.{ts,tsx}'],
    rules: {
      'i18next/no-literal-string': 'off',
    },
  },
  // Build / config files run in Node and use Node globals
  {
    files: [
      'vite.config.ts',
      'vitest.config.ts',
      'playwright.config.ts',
      'tailwind.config.ts',
      'i18next-parser.config.ts',
      'scripts/**/*.{ts,mjs,js}',
    ],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: globals.node,
    },
  },
);
