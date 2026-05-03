# Testing rules

Strict testing discipline applies regardless of phase. This is not negotiable. The spine of this document mirrors the backend's `chainsmith/.claude/rules/testing.md`; the layers, tools, and naming differ.

## What "tested" means

A function, hook, component, or flow is tested when it has:

1. At least one happy-path test confirming it does what its name says.
2. At least one negative-path test confirming it fails the way it should when given bad input.
3. Variant coverage for every meaningfully distinct input class. "It works for one input" is not coverage.

Snapshot tests do not count as coverage on their own. They confirm the output has not changed, not that it is correct. A snapshot test is acceptable as a regression guard alongside real assertions, never instead of them.

## When a test fails

A failing test is a finding, not a chore. Investigate before rewriting it.

The order of operations:

1. Read what the test is asserting and what actually happened.
2. Decide whether the production code is wrong or the test is wrong.
3. If the production code is wrong, fix the production code. Do not weaken the assertion to make the test pass.
4. If the test is wrong, fix the test, and add a comment explaining what the test was originally trying to assert and why the new version is correct.
5. If you cannot tell which is wrong, stop and ask before changing either.

Never delete a failing test to "clean up" without an explicit, documented reason.

## Layers

Three layers, each with a clear remit. Don't stack tests across layers — a behavior is owned by exactly one of them.

### Unit (Vitest)

- Pure utilities, formatters, validators, parsers, reducers, Zustand stores, custom hooks via `@testing-library/react`'s `renderHook`.
- No DOM rendering beyond what `renderHook` does. No HTTP. No router.
- Live next to the file under test as `<thing>.test.ts` or `<thing>.test.tsx`.

### Component (Vitest + React Testing Library)

- User-visible behavior of components and small feature units.
- **Query by role and accessible name** (`getByRole('button', { name: ... })`), never by `data-testid` unless there's no semantic handle. If you need a testid, the component is probably under-accessible — fix that first.
- Always render with the i18n provider configured for English so assertions are made against the rendered translation, not the key.
- Use `userEvent` (not `fireEvent`) for interactions. Async events use `await userEvent...` and `findBy*` queries.
- Assert on what the user perceives (text, role, state announced to AT), not on internal state or implementation details.

### End-to-end and accessibility (Playwright + axe-core)

- One test per critical user flow: deck creation, deck editing, deck sharing, search, sign-in.
- Run against a Vite preview build with **MSW** seeding API responses — the backend is not a dependency of E2E tests.
- Every page-level test runs `@axe-core/playwright`'s scan and asserts **zero violations**. Suppressing a rule requires a code comment per `accessibility.md`.
- Cover three browser engines: Chromium, Firefox, WebKit. Mobile-viewport variants are added when a flow has mobile-specific UX, not preemptively.

## Mocking

- **MSW** (`msw`) is the only HTTP mocking layer. Handlers live in `src/test/msw/handlers.ts` and are reused by both Vitest (`setupServer`) and Playwright (browser worker).
- **Never** `vi.mock('fetch')`, `vi.mock('axios')`, or hand-rolled fetch monkeypatches. They drift from production behavior and don't compose.
- Module mocks via `vi.mock(...)` are reserved for genuine third-party code that can't be controlled (e.g. `@supabase/supabase-js` for sign-in flows in unit tests). They get a comment explaining why.
- Time: `vi.useFakeTimers()` for tests that depend on timers, with explicit advance/reset.

## What to test

- **Pure functions**: every branch.
- **Hooks**: every state transition + every observable side effect.
- **Stores**: every action + every selector that has logic beyond a property read.
- **Components**: every meaningful user interaction (click, keyboard, form submit) and every visible state (loading, error, empty, populated).
- **Routes**: rendered correctly when accessed directly, navigation in and out, params parsed correctly, loaders surface their loading state.
- **Deck-editor reducer / store**: the validation-engine equivalent in this repo. It carries the FaB rule logic that the user sees most directly. It gets the same canonical happy / canonical illegal / boundary / regression coverage that the backend validation engine gets in `chainsmith/.claude/rules/testing.md`.

## What not to test

- Generated code (`src/api/schema.d.ts`, openapi-fetch internals).
- Pure data structures with no behavior.
- Trivial wrappers that do nothing but forward to a tested function.
- Third-party libraries' behavior.
- React's behavior. If you find yourself testing that `useState` updates state, stop.
- Visual styling for its own sake. Visual regression is a job for Chromatic or Playwright screenshot tests, scoped to design-system primitives, and explicitly opt-in.

## Test naming

- **Unit / hooks / stores**: `it('does <thing> when <condition>', ...)`. The name reads as a sentence. Avoid `test('foo')`.
- **Components**: same shape, scoped to user-visible behavior. `it('shows the empty state when the deck has no cards', ...)`.
- **E2E**: `<feature>_<scenario>` (`deck_editor_rejects_illegal_card`, `auth_signs_in_with_email`).
- Generic `test_foo` style names are not acceptable — they describe nothing.

## Test data

- Fixtures live in `src/test/fixtures/` as TypeScript modules typed against the API schema.
- Card fixtures are a small representative subset, not the full upstream dataset. Each fixture file has a top-of-file comment explaining what scenarios it's designed to cover.
- Don't share mutable fixture objects across tests. Export factory functions (`makeCard()`) that return fresh objects.

## i18n in tests

- Tests run against the **English** locale resources. They assert on rendered English text.
- Translation keys are not asserted directly. If a test must assert on a key (rare — typically only the i18n infrastructure tests), use a constant from a shared `keys.ts`, never an inline string.
- Don't mock `react-i18next`. Use the real provider with the real English resources — that's what the user sees.

## Coverage

- We don't worship a coverage percentage. Coverage is a tool for finding gaps, not a target to game.
- The CI surface is a coverage report you can read, plus failing tests when meaningful coverage drops on changed files. Don't add tests just to hit a number, and don't delete tests just because coverage allows it.
