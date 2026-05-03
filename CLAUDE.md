# Chainsmith Web

Vite + React + TypeScript SPA for the Chainsmith Flesh and Blood deck builder. Talks to the headless `chainsmith` backend over HTTP. The only UI client in active scope; future iOS and Android clients live in their own repos.

This repo contains the web client. No server code, no validation engine, no DB access. The backend owns all of that.

## Stack

- Build and dev: Vite, ESM, pnpm
- UI: React 19, TypeScript with `strict`, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes` on
- Styling: Tailwind CSS with a small in-house design system layered on top, no off-the-shelf component libraries
- Routing: TanStack Router (file-based, type-safe routes)
- Server state: TanStack Query, hydrated from the typed API client
- Client state: Zustand for cross-cutting state, `useState` everywhere else
- API client: `openapi-typescript` for types + `openapi-fetch` for runtime, generated from the backend's `openapi.json`
- Auth: Supabase JS client, anon key only — the backend verifies JWTs and owns the data plane
- i18n: `react-i18next` with `i18next-icu` for ICU plurals and `i18next-resources-for-ts` for typed keys
- Testing: Vitest + React Testing Library for unit and component, Playwright + `@axe-core/playwright` for end-to-end and accessibility
- HTTP mocking in tests: MSW
- Lint and format: ESLint with `eslint-plugin-jsx-a11y` and `eslint-plugin-i18next`, Prettier

## Project phase

**Current phase**: `pre-launch` <!-- Change to `production` when real users have data -->

The phase governs how aggressive the rules in `.claude/rules/` are about backwards compatibility. In `pre-launch` we can break component APIs, rename routes, and reshuffle translation keys. In `production` we cannot — public routes become append-only, translation keys become stable identifiers, and the rules tighten accordingly.

If you are unsure which phase you are in, read this file. Do not assume.

## Hard requirements (regardless of phase)

- **WCAG 2.1 AA accessibility.** Not aspirational. Every interactive element is keyboard-reachable, focus-visible, and announced correctly. ESLint enforces what it can; Playwright + axe-core covers the rest. See `.claude/rules/accessibility.md`.
- **Strict testing discipline.** Negative cases and variants are required, not optional. No snapshot-as-coverage. If a test fails, investigate before rewriting it. See `.claude/rules/testing.md`.
- **No hardcoded user-visible strings.** Every label, error, toast, `aria-label`, and non-card `alt` text goes through the i18n layer from day one. Enforced by `eslint-plugin-i18next` and an extraction-drift check in the pre-commit hook. See `.claude/rules/i18n.md`.
- **Strict TypeScript.** No `any`, no non-null assertions outside generated code. Errors from the backend are narrowed against the typed `ErrorCode` union from `openapi.json`. See `.claude/rules/api-client.md`.

## Rules files

Read these for their respective domains:

- `.claude/rules/react.md`: component patterns, hooks discipline, state ownership, file layout
- `.claude/rules/clean-code.md`: function design, naming, comments, anti-over-engineering, TS specifics
- `.claude/rules/css.md`: Tailwind, design tokens, dark-first theming, motion
- `.claude/rules/accessibility.md`: WCAG AA, semantic HTML, ARIA, keyboard, contrast, axe-core
- `.claude/rules/testing.md`: testing discipline, Vitest, RTL, Playwright, MSW
- `.claude/rules/i18n.md`: react-i18next, namespaces, ICU plurals, locale routing, RTL readiness, card-text rule
- `.claude/rules/api-client.md`: openapi-fetch, generated types, error narrowing, TanStack Query keys
- `.claude/rules/security.md`: client-side secrets posture, XSS, CSP, card images, dependency hygiene
- `.claude/rules/commits.md`: Conventional Commits / Commitizen-style commit messages
- `.claude/rules/fab-domain.md`: FaB terminology used for labels, copy, and aria-text

## Git hooks

Two hooks live in `.githooks/`, wired up by one `git config core.hooksPath .githooks` per clone:

- **`pre-commit`** — scans staged changes for secrets via `gitleaks`, then runs `pnpm typecheck`, `pnpm lint`, `pnpm test --run`, and an i18n drift check (reruns extraction and fails if `src/i18n/locales/en/*.json` differs from what is committed).
- **`commit-msg`** — validates the commit subject line against `.claude/rules/commits.md` (Conventional Commits 1.0). Pure bash, no commitlint dependency.

One-time setup per clone:

```bash
git config core.hooksPath .githooks
```

If `gitleaks` is not on PATH, install it (see the [gitleaks readme](https://github.com/gitleaks/gitleaks)). The pre-commit hook hard-fails when gitleaks is missing — secret scanning is not optional.

## Common commands

```bash
# Run the dev server
pnpm dev

# Production build
pnpm build

# Preview the production build locally
pnpm preview

# Unit and component tests (Vitest, watch mode)
pnpm test

# Unit and component tests, single run for CI
pnpm test --run

# End-to-end and accessibility tests (Playwright)
pnpm test:e2e

# TypeScript check (no emit)
pnpm typecheck

# Lint
pnpm lint

# Extract i18n keys from source into src/i18n/locales/en/*.json
pnpm i18n:extract

# Regenerate the API client types from the pinned backend SHA in .api-version
pnpm api:generate
```

## Definition of done

A change is done when:

- TypeScript check passes with no errors
- ESLint passes with no errors (including `jsx-a11y` and `i18next/no-literal-string`)
- Unit and component tests pass, including negative and variant cases for the changed code
- Playwright tests pass for changed routes, with zero new axe-core violations
- All new user-visible strings are extracted into `src/i18n/locales/en/*.json` and the extraction drift check is clean
- If the backend SHA pin in `.api-version` moved, regenerated API types compile and any changed shapes are reflected in callers
- Manual smoke test in a real browser for the changed flow

## What lives in this repo vs elsewhere

In this repo:

- The Vite + React + TS web client
- Generated TypeScript API types and the typed fetch client (in `src/api/`, regenerated from the backend's pinned `openapi.json`)
- i18n source-of-truth locale files for English (`src/i18n/locales/en/`)
- E2E and accessibility tests covering web flows

Not in this repo:

- HTTP API, validation engine, DB schema (all in `chainsmith`)
- Card images (loaded directly from LSS's CDN, see `.claude/rules/security.md#card-images`)
- iOS or Android clients (separate repos, not in active scope)
- Cross-repo issue tracking (use the `tracker` repo in the same org)
