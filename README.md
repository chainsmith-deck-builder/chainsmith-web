# Chainsmith Web

The web client for [Chainsmith](https://github.com/chainsmith-deck-builder), a deck builder for the Flesh and Blood TCG. Talks to the headless `chainsmith` Rust backend over HTTP. The only UI client in active scope; iOS and Android live in separate repos.

> **Project phase:** `pre-launch`. Component APIs, route shapes, and translation keys can be broken freely until real users have data. See [`CLAUDE.md`](CLAUDE.md) for what changes when we cut over to `production`.

---

## Stack

| Layer                  | Tool                                                                                                      |
| ---------------------- | --------------------------------------------------------------------------------------------------------- |
| Build & dev            | Vite, ESM, pnpm                                                                                           |
| UI                     | React 19, TypeScript with `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`              |
| Routing                | TanStack Router (file-based, type-safe)                                                                   |
| Server state           | TanStack Query, hydrated from the typed API client                                                        |
| Client state           | Zustand for cross-cutting, `useState` everywhere else                                                     |
| Styling                | Tailwind on top of role-named design tokens, dark-first                                                   |
| API client             | `openapi-typescript` for types + `openapi-fetch` for runtime, generated from the backend's `openapi.json` |
| Auth                   | Supabase JS client (anon key only — backend verifies JWTs)                                                |
| i18n                   | `react-i18next` with `i18next-icu` for ICU plurals; typed against the English locale JSON                 |
| Unit / component tests | Vitest + React Testing Library                                                                            |
| E2E + accessibility    | Playwright + `@axe-core/playwright`                                                                       |
| HTTP mocking           | MSW                                                                                                       |
| Lint & format          | ESLint (with `jsx-a11y` and `i18next/no-literal-string`), Prettier with the Tailwind class-order plugin   |

---

## Quick start

### Prerequisites

- **Node.js** ≥ 22 (`node --version`)
- **pnpm** ≥ 10 — install via `npm install -g pnpm` or `corepack enable`
- **gitleaks** for the pre-commit secrets scan — `winget install Gitleaks.Gitleaks` on Windows; see [the gitleaks README](https://github.com/gitleaks/gitleaks#installing) elsewhere

### First-time setup

```bash
# Install dependencies. Generates the TanStack Router route tree as a postinstall step.
pnpm install

# Copy the env template and fill in real values.
cp .env.example .env

# Wire up the git hooks (pre-commit secrets/lint/test gate, commit-msg format check).
git config core.hooksPath .githooks

# Install Playwright's browser. Add firefox/webkit when ready to run the full e2e suite.
pnpm exec playwright install chromium
```

### Day-to-day

```bash
pnpm dev                # Start the dev server on http://localhost:5173
pnpm test               # Vitest in watch mode
pnpm test:e2e           # Build, then run Playwright + axe (chromium only)
pnpm typecheck          # Tsc, no emit
pnpm lint               # ESLint with --max-warnings=0
pnpm format             # Prettier, write
```

---

## All commands

```bash
# Dev
pnpm dev                  # Vite dev server

# Build
pnpm build                # Generate routes, typecheck, build production bundle into ./dist
pnpm preview              # Serve the prod build locally on http://localhost:4173

# Tests
pnpm test                 # Vitest (watch mode)
pnpm test --run           # Vitest, single run for CI
pnpm test:e2e             # pnpm build && Playwright (chromium project)
pnpm test:e2e:all         # pnpm build && Playwright (all browser projects)

# Quality gates
pnpm typecheck            # tsc --noEmit
pnpm lint                 # ESLint, --max-warnings=0
pnpm lint:fix             # ESLint --fix
pnpm format               # Prettier --write
pnpm format:check         # Prettier --check (CI gate)

# Codegen
pnpm api:generate         # Regenerate src/api/schema.d.ts from the SHA pinned in .api-version
pnpm i18n:extract         # Walk src for t() calls, update src/i18n/locales/en/*.json
pnpm routes:generate      # Regenerate src/routeTree.gen.ts (auto-runs on install)
```

---

## Project layout

```
chainsmith-web/
├── .claude/rules/              # Project-specific rules (read these before changing code)
├── .githooks/                  # pre-commit and commit-msg hooks
├── docs/                       # Design brief, architecture notes
├── public/                     # Static assets served at the root
├── scripts/                    # Codegen helpers (api, i18n)
├── src/
│   ├── api/                    # openapi-fetch client + generated schema.d.ts
│   ├── components/             # Reusable UI components (no route knowledge)
│   ├── features/               # Feature folders (components + hooks + stores grouped by domain)
│   ├── hooks/                  # Cross-feature hooks
│   ├── i18n/                   # i18next bootstrap, locale JSON, typed key augmentation
│   ├── lib/                    # Pure utilities
│   ├── providers/              # ThemeProvider, AuthProvider, etc.
│   ├── routes/                 # TanStack Router file-based routes
│   ├── stores/                 # Cross-feature Zustand stores
│   ├── styles/                 # tokens.css (CSS variables) + global.css (Tailwind entrypoint)
│   ├── test/                   # Vitest setup, MSW handlers, fixtures
│   ├── main.tsx                # Entry: mounts QueryClient + Router + i18n
│   └── routeTree.gen.ts        # Generated by tsr; gitignored
├── tests/e2e/                  # Playwright specs
├── .api-version                # 40-char chainsmith commit SHA pinning the API client surface
├── .env.example                # Required VITE_* variables (anon-key Supabase + API base URL)
├── .gitleaks.toml              # Secret-scan allowlist for build artifacts
├── eslint.config.js            # Flat config; jsx-a11y, i18next, react, react-hooks
├── i18next-parser.config.ts    # Extraction config for `pnpm i18n:extract`
├── playwright.config.ts        # Three browser projects, axe-core baked into specs
├── tailwind.config.ts          # Maps utilities to design-token CSS variables
├── tsconfig.json               # Strict + exact-optional + no-unchecked-indexed-access
├── tsr.config.json             # TanStack Router CLI config (ignores test files)
├── vite.config.ts              # Router plugin + React plugin + prod CSP injector
└── vitest.config.ts            # jsdom, MSW setup, coverage exclusions
```

---

## Hard requirements

These hold regardless of phase. Each has a rules file with the full story.

- **WCAG 2.1 AA accessibility** — every interactive element keyboard-reachable, focus-visible, announced correctly. ESLint enforces what it can; Playwright + axe-core covers the rest. Zero violations is the merge gate. See [`.claude/rules/accessibility.md`](.claude/rules/accessibility.md).
- **Strict testing discipline** — happy path + negative path + variants for every behavior. No snapshot-as-coverage. A failing test is a finding, not a chore. See [`.claude/rules/testing.md`](.claude/rules/testing.md).
- **No hardcoded user-visible strings** — every label, error, toast, `aria-label`, and non-card `alt` goes through i18n from day one. Enforced by `eslint-plugin-i18next` and an extraction-drift check in the pre-commit hook. See [`.claude/rules/i18n.md`](.claude/rules/i18n.md).
- **Strict TypeScript** — no `any`, no non-null assertions outside generated code. Errors from the backend are narrowed against the typed `ErrorCode` union. See [`.claude/rules/api-client.md`](.claude/rules/api-client.md).

---

## Working with the backend

The web client never imports backend code. The contract is the OpenAPI spec emitted by `chainsmith` to `openapi.json`.

- **`.api-version`** holds a 40-char commit SHA from `chainsmith-deck-builder/chainsmith`. `pnpm api:generate` reads it, fetches the spec at that revision, and rewrites `src/api/schema.d.ts`.
- The script falls back to `../chainsmith/openapi.json` when the network is unreachable, so a local sibling checkout works offline.
- A scheduled GitHub Action will bump the pin to `main` HEAD weekly, regenerate, and open a PR. If the regenerated types break typecheck, the PR fails — that is the intended drift signal.

The backend is at <https://github.com/chainsmith-deck-builder/chainsmith>; consult its [`CLAUDE.md`](../chainsmith/CLAUDE.md) for the producer-side rules on this contract.

---

## Conventions, in one place

| Topic                                                                 | Rule file                                                          |
| --------------------------------------------------------------------- | ------------------------------------------------------------------ |
| React patterns, hooks, state ownership, file layout                   | [`.claude/rules/react.md`](.claude/rules/react.md)                 |
| Function design, naming, comments, anti-over-engineering              | [`.claude/rules/clean-code.md`](.claude/rules/clean-code.md)       |
| Tailwind, design tokens, dark-first theming, motion                   | [`.claude/rules/css.md`](.claude/rules/css.md)                     |
| WCAG AA, semantic HTML, ARIA, keyboard, contrast                      | [`.claude/rules/accessibility.md`](.claude/rules/accessibility.md) |
| Vitest, RTL, Playwright, MSW, what to test and what not to            | [`.claude/rules/testing.md`](.claude/rules/testing.md)             |
| react-i18next, namespaces, ICU plurals, locale routing, RTL readiness | [`.claude/rules/i18n.md`](.claude/rules/i18n.md)                   |
| openapi-fetch, generated types, error narrowing, query keys           | [`.claude/rules/api-client.md`](.claude/rules/api-client.md)       |
| Client-side secrets posture, XSS, CSP, dependency hygiene             | [`.claude/rules/security.md`](.claude/rules/security.md)           |
| Conventional Commits 1.0 — enforced mechanically by `commit-msg`      | [`.claude/rules/commits.md`](.claude/rules/commits.md)             |
| FaB terminology used in labels, copy, and aria-text                   | [`.claude/rules/fab-domain.md`](.claude/rules/fab-domain.md)       |

The visual-design source of truth is [`docs/design-brief.md`](docs/design-brief.md). When the brief and the rules disagree, the rules win — flag the conflict and update both rather than silently override.

---

## Definition of done

A change is done when:

- TypeScript check passes with no errors
- ESLint passes with no errors (including `jsx-a11y` and `i18next/no-literal-string`)
- Unit and component tests pass, including negative and variant cases for the changed code
- Playwright tests pass for changed routes, with zero new axe-core violations
- All new user-visible strings are extracted into `src/i18n/locales/en/*.json` and the extraction-drift check is clean
- If `.api-version` moved, regenerated API types compile and any changed shapes are reflected in callers
- Manual smoke test in a real browser for the changed flow

---

## What lives elsewhere

| Concern                                | Where                                                                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| HTTP API, validation engine, DB schema | [`chainsmith`](https://github.com/chainsmith-deck-builder/chainsmith)                                                    |
| Card images                            | LSS's CDN at `cards.fabtcg.com` (hot-linked, never proxied — see [`security.md`](.claude/rules/security.md#card-images)) |
| iOS / Android clients                  | Separate repos, not in active scope                                                                                      |
| Cross-repo issue tracking              | The `tracker` repo in the same org                                                                                       |
