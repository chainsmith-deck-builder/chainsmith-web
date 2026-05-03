# CSS rules

Tailwind utilities first, with a small in-house design-token layer underneath. No off-the-shelf component libraries (no shadcn-by-default, no MUI, no Chakra). The design system in this repo is the source of truth for visual decisions.

## Where styles live

- **`src/styles/tokens.css`** — CSS custom properties for color, spacing, radius, motion, typography. The only file in the repo where `@apply` chains are acceptable, and only inside `:root` and `[data-theme="..."]` selectors that define tokens.
- **`tailwind.config.ts`** — maps Tailwind utilities to those CSS variables (`colors.bg.base = 'var(--bg-base)'`, etc.). Adding a token means editing both files.
- **Component files** — Tailwind class strings inline. No component-scoped `.module.css`, no styled-components, no Emotion, no CSS-in-JS.

## Design tokens

The token system codifies the design-system decisions on the Notion deck-builder MVP page. Authoritative values live in `tokens.css`; this file lists the conventions.

### Color

- **Base palette**: dark base `#0B0A0D` with violet warmth, surface steps for elevation. Tokens are named by *role* (`--bg-base`, `--bg-raised`, `--bg-overlay`, `--text-primary`, `--text-muted`, `--border-subtle`), not by hex.
- **Brand accent**: pitch red `#C41E3A`, exposed as `--accent-brand`. Used sparingly for primary CTAs and selected states.
- **FaB pitch colors** (red 1, yellow 2, blue 3) are reserved for **data visualization only** — bar charts, pip indicators, deck-stat breakdowns. They are never UI chrome (buttons, links, focus rings). Tokens for them live under `--viz-pitch-1/2/3` to make this hard to violate by accident.
- **Semantic colors**: `--state-success`, `--state-warning`, `--state-danger`, `--state-info`. Use these in components, never raw hex.

### Spacing

- **4px base scale**: 4, 8, 12, 16, 24, 32, 48, 64. Tailwind's default `1, 2, 3, 4, 6, 8, 12, 16` step covers it.
- Don't introduce custom spacing values in component class strings. If a layout needs a non-scale value, the layout is wrong; rework it before adding a token.

### Radius

- The full set: `6px` (`rounded-md`), `10px` (`rounded-lg`), `12px` (`rounded-xl`), and pill (`rounded-full`). Nothing in between, nothing larger.
- Card thumbnails use `rounded-md`. Modals and panels use `rounded-xl`. Avatars and tags use `rounded-full`. Document any exception inline.

### Typography

- **Sans**: Inter, used for everything UI.
- **Mono**: Geist Mono with `font-feature-settings: "tnum"` enabled for tabular figures — used for numeric stats, deck counts, and pitch totals so digits align across rows.
- **No display fonts.** No fantasy typefaces. No script faces. The brand is restrained.
- Type scale tokens: `--text-xs` through `--text-3xl`, mapped to Tailwind's `text-xs` through `text-3xl`. Don't reach for `text-[13px]`-style arbitrary sizes.

### Motion

- Default transition: `150ms ease-out`. Token: `--motion-fast`. No bounce, no overshoot.
- Longer transitions only for genuinely cinematic moments (route enter/exit, modal open). Cap at `300ms`. Token: `--motion-slow`.
- Every animated utility respects `prefers-reduced-motion: reduce` — Tailwind's `motion-safe:` and `motion-reduce:` variants are the right way to express this.

## Theming

- **Dark-first.** The default theme is dark. Tokens in `tokens.css` are defined under `:root` for dark, and overridden under `[data-theme="light"]`.
- The theme is set on the `<html>` element by `ThemeProvider`. No per-component theme passing.
- Components must not reference theme directly. They reference token utilities (`bg-bg-base`, `text-text-primary`) and the theme system swaps the underlying values.

## Logical properties

- Use **logical** CSS properties (`margin-inline-start`, `padding-block-end`, `inset-inline-start`) rather than physical (`margin-left`, `padding-bottom`, `left`).
- Tailwind's logical-property utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`) are preferred over the physical `ml-*`, `mr-*`, `pl-*`, `pr-*`, `left-*`, `right-*`.
- This pays the styling debt for RTL up front, before we ship any RTL locales (see `i18n.md` on RTL readiness).

## Class string discipline

- Order classes consistently: layout → box model → typography → color → motion → state. Use `eslint-plugin-tailwindcss`'s `classnames-order` rule to enforce.
- Variant-heavy class strings get extracted via `clsx` (or the project's existing `cn(...)` helper) into a `const` above the JSX. Don't ship 200-character single-line `className` props.
- Avoid `className={'...' + cond && '...'}` string concatenation. Use `clsx`/`cn`.
- No inline `style={{ ... }}` for anything that has a token equivalent. The only acceptable inline style is for genuinely dynamic values that aren't on the token scale (e.g. a chart bar's computed width percentage).

## Anti-patterns

- No `!important`. If you need it, the cascade is fighting you and the right fix is upstream.
- No deep selectors (`.foo .bar > .baz`). Tailwind's flat utility model exists to avoid this.
- No `@apply` outside `tokens.css`.
- No hex colors in component files. Tokens or nothing.
- No `px`-suffixed arbitrary values (`px-[17px]`). Use the scale.
- No new fonts without a design review.
