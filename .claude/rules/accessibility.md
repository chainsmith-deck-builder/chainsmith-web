# Accessibility rules

WCAG 2.1 AA is a **hard requirement** for this project. It is not aspirational, it is not "we'll get to it." Every PR that ships UI is expected to clear AA on the changed surface.

The Notion design direction calls this out: a polished, design-led FaB tool that fails accessibility is not a polished tool.

## Semantic HTML first

- Use the right element. `<button>` for actions, `<a href>` for navigation, `<nav>`, `<main>`, `<aside>`, `<header>`, `<footer>` for landmarks, `<dialog>` for modals.
- A `<div onClick>` is a bug. So is a `<span role="button">` when a `<button>` would do.
- Reach for ARIA only when semantics aren't enough. Misused ARIA is worse than no ARIA — the first rule of ARIA is don't use ARIA.

## Keyboard

- **Every interactive element is keyboard-reachable.** Tab moves forward, Shift+Tab moves back, Enter/Space activates, Esc dismisses.
- **Focus is always visible.** The default Tailwind focus ring is removed by `preflight`; replace it project-wide with `focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-brand` (or the equivalent token utility) in the global styles. Never set `outline: none` without an equivalent visible replacement.
- **Tab order matches visual order.** If you find yourself reaching for `tabIndex={-1}` on user-actionable elements, the layout is wrong, not the tabindex.
- **Custom keyboard shortcuts** (e.g. the deck editor's keyboard-first search) live in one hook (`useKeyboardShortcuts`) so they're discoverable, documented, and easy to disable when a modal is open.
- **Focus traps**: modals, command palettes, and other "owned" surfaces trap focus while open and restore focus to the triggering element on close. Use a battle-tested utility (`focus-trap-react`) rather than rolling our own.

## Screen readers

- **Every interactive element has an accessible name.** Visible text is the default. When there isn't visible text (an icon-only button), use `aria-label` with a translated string from i18n — never a hardcoded English label.
- **Live regions** for dynamic announcements: form errors, toast notifications, "deck saved" confirmations. Use `aria-live="polite"` for non-urgent, `aria-live="assertive"` only for actually-urgent (e.g. "your changes weren't saved").
- **Descriptions** via `aria-describedby` for fields with help text or error text. Don't bury context in a tooltip the screen reader can't reach.
- **Status vs alert**: `role="status"` for in-progress feedback ("loading…"), `role="alert"` for errors that need immediate attention.

## Color and contrast

- **4.5:1** for body text against its background. **3:1** for large text (≥ 18pt or 14pt bold) and for meaningful non-text (icons, borders that convey information).
- Tokens that fail contrast are **bugs**, not preferences. The token review pass when adding a new color includes running it through a contrast checker against every surface it lands on.
- **Color is not the only signal.** If state is conveyed by color (legal/illegal, owned/unowned), it's also conveyed by an icon, label, or pattern. A user with color blindness must see the same information.
- The pitch color reservation in `css.md` (red/yellow/blue for data viz only) intersects with this rule: the data-viz components must include a non-color signal too, since pitch values are common color-confusion targets.

## Forms

- **Every input has an associated `<label>`.** Visible whenever possible. When the design genuinely needs no visible label (a search input with placeholder text), use `aria-label` with a translated string.
- **Error association**: errors are linked via `aria-describedby` to the input, and announced via an `aria-live` region. Marking a field invalid (`aria-invalid="true"`) is also required.
- **Required fields** are marked with `aria-required="true"`, plus a visual indicator that does not rely solely on a red asterisk.
- **Autocomplete** attributes on every relevant field (`autocomplete="email"`, `autocomplete="current-password"`). Helps password managers, autofill, and assistive tech.

## Images and icons

- **Decorative images**: `alt=""`. The empty alt is required, not optional — omitting `alt` falls back to the filename, which is worse than nothing.
- **Card images**: `alt={card.name}` (with the localized name when available — see `i18n.md`).
- **Icon-only buttons**: the visible icon is decorative (`aria-hidden="true"` on the SVG), and the button itself carries an `aria-label`.
- **Icons with adjacent text**: the icon is decorative; the text is the accessible name. Don't double up.

## Modals and overlays

- Modals use the native `<dialog>` element where possible, with the `showModal()` API for the inert-background behavior.
- Open: focus moves into the dialog (typically to the first focusable control or to a heading). Close: focus returns to the trigger. Esc closes. Click-outside closes.
- The page behind a modal is `inert`, not `aria-hidden="true"` on a sibling — `inert` is supported widely enough now.

## Reduced motion and high contrast

- `prefers-reduced-motion: reduce` disables non-essential animation. Use Tailwind's `motion-safe:` / `motion-reduce:` variants. Spinners and progress indicators are the only animations that should bypass this.
- `prefers-contrast: more` — bump border weights and contrast on critical surfaces. This is a stretch goal, not a launch blocker, but tokens are structured so the override is one variable change.

## Tooling

- **`eslint-plugin-jsx-a11y`** is on with the `recommended` config. Lints catch what they can.
- **`@axe-core/playwright`** runs on every page-level Playwright test. The check asserts **zero** axe violations on the page-as-rendered. Suppressing a rule requires a code comment naming the rule, why the suppression is necessary, and a follow-up to fix it.
- **Manual keyboard pass** before merging anything user-facing. Tab through it. Hit Enter on every actionable element. Hit Esc in every modal.
- **Manual screen-reader pass** for new flows: VoiceOver on macOS, NVDA on Windows. Not on every commit, but before any "ship the deck editor v1"-shaped milestone.

## What we don't do

- **No ARIA roles invented from scratch.** Stick to the published vocabulary.
- **No "skip to content" link omitted.** It belongs at the top of every layout.
- **No `<h1>` skipped or misused.** One `<h1>` per route, headings nest properly (no jumping from `<h1>` to `<h4>`).
- **No reliance on hover for critical information.** Hover-only tooltips fail keyboard and touch users; pair every hover with a focus-equivalent.
