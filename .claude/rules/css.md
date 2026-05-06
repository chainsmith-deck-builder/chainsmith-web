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
- **Size scale**: Tailwind defaults (`text-xs` through `text-3xl`) plus three project additions for gaps the design needed: `text-2xs` (10px micro labels), `text-tiny` (11px small labels), `text-display` (26px page headings). Don't reach for `text-[13px]`-style arbitrary sizes — `eslint-plugin-tailwindcss` blocks them.
- **Tracking scale**: Tailwind defaults (`tracking-tighter` through `tracking-widest`) plus five role-named project tokens: `tracking-display` (-0.04em wordmark), `tracking-heading` (-0.01em page/section heads), `tracking-label` (0.12em small-caps UI labels), `tracking-allcaps` (0.18em hero all-caps), `tracking-spread` (0.5em numeric display).
- **Elevation**: `shadow-dropdown`, `shadow-modal`, `shadow-drawer` for the three sizes of overlay surface. Don't invent ad-hoc box-shadow values.

### Motion

- Default transition: `150ms ease-out`. Token: `--motion-fast`. No bounce, no overshoot.
- Longer transitions only for genuinely cinematic moments (route enter/exit, modal open). Cap at `300ms`. Token: `--motion-slow`.
- Every animated utility respects `prefers-reduced-motion: reduce` — Tailwind's `motion-safe:` and `motion-reduce:` variants are the right way to express this.

## Theming

- **Dark-first.** The default theme is dark. Tokens in `tokens.css` are defined under `:root` for dark, and overridden under `[data-theme="light"]`.
- The theme is set on the `<html>` element by `ThemeProvider`. No per-component theme passing.
- Components must not reference theme directly. They reference token utilities (`bg-bg-base`, `text-text-primary`) and the theme system swaps the underlying values.

## Logical properties

- Use **logical** Tailwind utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `border-s-*`, `border-e-*`, `rounded-s-*`, `rounded-e-*`) rather than physical (`ml-*`, `mr-*`, `pl-*`, `pr-*`, `left-*`, `right-*`, `border-l-*`, `border-r-*`, `rounded-l-*`, `rounded-r-*`).
- Enforced by the local `chainsmith/no-physical-tailwind-direction` rule wired into `eslint.config.js`. Disable comments require a justification — typically only when an icon or visual is intentionally direction-locked (e.g. a glyph that must always sit on the literal left edge, regardless of locale).
- This pays the styling debt for RTL up front, before we ship any RTL locales (see `i18n.md` on RTL readiness).

## No inline `style` attribute

Default-deny. Any `style={{ ... }}` on a DOM element is a lint error (`react/forbid-dom-props`). The pattern of "paste the design mock's pixel values into `style`" is exactly what we are guarding against.

There is one escape hatch, and it requires a justifying comment on the line above:

```tsx
// eslint-disable-next-line react/forbid-dom-props -- runtime-computed bar height
<div style={{ height: `${percent}%` }} />
```

The disable comment **must name why** a static utility class can't express this. The legitimate categories are narrow:

1. **Runtime numeric values with no token equivalent.** A chart bar whose height is `${value}%`. A `<PitchDot>` whose `width: size` comes from a numeric prop. A computed `transform: rotate(${deg}deg)`.
2. **Conditional CSS variables that lint can't see through.** Rare. Almost always rewritable as `clsx('bg-bg-overlay', focused && 'bg-bg-elevated')`. Reach for it only when the value space is genuinely runtime-dynamic.
3. **CSS Grid template strings** that aren't on a Tailwind utility (`gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))'`). Prefer the Tailwind grid utilities when they fit.

Anything else — `fontSize: 11.5`, `letterSpacing: '0.1em'`, `padding: '32px 40px'`, raw `oklch(...)` colors, custom `boxShadow` strings — is a violation regardless of whether you remember to add the disable comment. Add a token (see Typography / Elevation / Color above) or a Tailwind utility instead.

## Reach for tokens, not arbitrary values

Tailwind's arbitrary-value escape hatch (`text-[13px]`, `bg-[#abc]`, `p-[17px]`, `shadow-[0_2px_8px_rgba(0,0,0,0.3)]`) is **also** a lint error (`tailwindcss/no-arbitrary-value`). If the value you want isn't on the scale, the answer is one of:

1. Round to the nearest scale step. The design's micro-decisions (`fontSize: 9.5` vs `10` vs `10.5`) almost never survive contact with users; pick the nearest token.
2. Add a token if the value is reused in three or more places and represents a real role (a new elevation, a new label-size for a new component class). PR that adds the token also adds it to `tokens.css` *and* `tailwind.config.ts` in the same commit.
3. If neither fits — that's the rare "genuinely dynamic" case in the section above; use `style={...}` with a disable comment that says so.

## Class string discipline

- Class ordering is enforced by `prettier-plugin-tailwindcss` on save / format. Don't hand-order.
- Variant-heavy class strings get extracted via `clsx` (or the project's `cn(...)` helper) into a `const` above the JSX. Don't ship 200-character single-line `className` props.
- Avoid `className={'...' + cond && '...'}` string concatenation. Use `clsx`/`cn`.
- `tailwindcss/no-custom-classname` blocks unrecognized class names — if lint flags one, it's almost always a typo or a missing utility.

## Anti-patterns

- No `!important`. If you need it, the cascade is fighting you and the right fix is upstream.
- No deep selectors (`.foo .bar > .baz`). Tailwind's flat utility model exists to avoid this.
- No `@apply` outside `tokens.css`.
- No hex colors in component files. Tokens or nothing.
- No new fonts without a design review.
