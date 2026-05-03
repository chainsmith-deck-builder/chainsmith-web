# Chainsmith Web — Design Brief

## 1. Purpose and audience

This brief is the source of truth for the visual and behavioral design of the Chainsmith web client v1. It is written for designers (Claude design and humans) who need to translate product decisions into screens, components, and interactions.

It is **not** a replacement for the engineering rules. The token system, accessibility floor, i18n posture, security posture, and component-style discipline live in `chainsmith-web/.claude/rules/` and are referenced where relevant. Where this brief and the rules disagree, the rules win — flag the conflict and update both rather than silently override.

It is also **not** a design system reference. The token definitions live in `src/styles/tokens.css` and `tailwind.config.ts`. This brief codifies the visual signatures and behaviors that sit on top of those tokens.

## 2. Product summary

Chainsmith is a web-first deck builder for the Flesh and Blood TCG. v1 covers the lifecycle of a single deck: pick a hero, pick a format, build a 60-card deck (plus equipment loadout and optional matchup variants), validate it against the format's legality rules, share it as a read-only link, and export it as plaintext or an image for posting elsewhere.

What it explicitly **does not** do, today or in v1:

- Match playing or simulation
- Combat-chain resolution or goldfishing
- Tournament or event management
- Card-collection tracking (no "I own these cards" model)
- Pricing data
- Cross-deck popularity / meta analytics

Several of these are noted in `Section 11 — Out of scope` and `Section 12 — Future considerations` with the conditions under which they could be reconsidered.

## 3. Design language

### 3.1 Tokens (canonical source: `src/styles/tokens.css`)

The token system is dark-first with violet warmth. Highlights, with full definitions in `tokens.css` and the mapping in `tailwind.config.ts`:

- **Base palette**: `--bg-base` (deep neutral with violet warmth, near `#0B0A0D`), `--bg-raised`, `--bg-overlay`, `--text-primary`, `--text-muted`, `--border-subtle`. Names are roles, not hex.
- **Brand accent**: pitch red (`--accent-brand`, ~`#C41E3A`). Used sparingly — primary CTAs, selected state, focus accent.
- **Semantic state**: `--state-success`, `--state-warning`, `--state-danger`, `--state-info`. Components reference these, never raw hex.
- **Pitch viz colors**: red 1, yellow 2, blue 3, namespaced `--viz-pitch-1/2/3`. **Reserved for data visualization only** — never UI chrome. Per `accessibility.md`, every pitch viz pairs the color with a non-color signal (numeric label, pip count, or pattern) since pitch is a common color-confusion target.
- **Typography**: Inter for UI, Geist Mono with `font-feature-settings: "tnum"` for numeric stats so digits align in tables and counters.
- **Spacing**: 4px base scale (4, 8, 12, 16, 24, 32, 48, 64). No arbitrary values.
- **Radius**: `rounded-md` (6px) for card thumbnails, `rounded-xl` (12px) for panels and modals, `rounded-full` for pills and avatars. Nothing else.
- **Motion**: `--motion-fast` (150ms ease-out) for default transitions, `--motion-slow` (300ms cap) for cinematic moments only. Every animated utility respects `prefers-reduced-motion`.

### 3.2 Visual signatures

These are the concrete patterns that make Chainsmith look like Chainsmith. Treat them as house style.

**Cards-as-hero.** Card art is the dominant visual element in the editor and browse views. When the LSS CDN provides art, render it. When it doesn't (`imageUrl === null`), fall back to a card-shaped frame with a soft pitch-colored radial gradient as the background and the card's **name, pitch, cost, and class** typeset on top. The gradient alone is not enough — visitors need to know what card they're looking at.

**Pitch color throughout.** Red 1 / yellow 2 / blue 3 is consistent across pitch dots on tiles, color indicators in deck-list rows, the pitch-distribution viz, the pitch-grouping section dividers in the deck list (`PITCH 1` / `PITCH 2` / `PITCH 3`), and the soft-gradient fallback for missing card art.

**All-caps section headers** in dim text for sidebar and deck-list sections (`EQUIPMENT & OTHER`, `PITCH 1`). Small letterspacing, muted color, count right-aligned where applicable.

**Small-caps metadata tags** on card tiles (`WIZARD ATTACK`, `GENERIC`, `LEGS`) — small uppercase, dim, sit at the bottom-left of the tile.

**Pill filter chips with embedded dropdowns.** Class / Type / Pitch as pill-shaped triggers that open dropdowns inline. The Pitch chip shows the three pitch colors as inline pip indicators when "Any" is the selection.

**Inline `−` / `+` quantity steppers** with the count between them. No separate "remove" affordance — minus to zero removes the row.

**Hero block** at the top of the deck list and shared-deck view: a colored circular avatar (initial-derived if no portrait) with hero name, class, and life on the right. Functions as a deck-identity anchor.

**Subtle elevation through tone, not shadow.** Raised surfaces step up via `--bg-raised` and `--bg-overlay`, with `--border-subtle` as a near-invisible boundary. No drop shadows, no harsh dividers.

**Density.** Information-rich but breathing. Generous vertical rhythm, never crammed rows. Card grids fit 6–8 across at desktop widths; deck-list rows are tight enough that 60 cards fit without infinite scroll on a typical viewport.

**Bottom action bar** in the editor. Spans the editor width, holds load-more (centered) and deck-level secondary actions (Export, etc.) right-aligned.

### 3.3 Iconography

**Lucide icons** as the project icon set. Line-style, consistent stroke weight. No mixing icon families. Decorative icons get `aria-hidden="true"`; icon-only buttons get an `aria-label` from i18n (per `accessibility.md`).

### 3.4 Layout proportions (desktop, ≥1280px)

The deck-builder editor is the most layout-rich screen and sets the benchmark:

- **Top chrome**: 56px header (logo + nav + account avatar) + 48px deck-context bar (back, title, badges, header actions).
- **Three columns** below the chrome:
  - Left sidebar: ~14% width (clamped to 220–280px). Card preview + analytics.
  - Center: fills remaining width. Search + card grid.
  - Right sidebar: ~26% width (clamped to 340–400px). Deck list.
- **Bottom action bar**: 56px, spans the editor's full width.

Other screens use a single content column at `max-width: 1200px` centered, with the same top chrome.

## 4. Information architecture

### 4.1 Routes (TanStack Router, file-based)

| Route | Auth | Purpose |
|---|---|---|
| `/` | — | Redirects to `/decks` if signed in, `/sign-in` otherwise |
| `/decks` | required | Deck list page |
| `/decks/new` | required | Hero + format select |
| `/decks/:id` | required | Deck builder editor |
| `/cards` | optional | Browse the full card catalog |
| `/shared/:id` | optional | Read-only deck view from a share link |
| `/account` | required | Profile, theme, language, sign-out, delete account |
| `/sign-in` | none | Sign-in form |
| `/sign-up` | none | Sign-up form |

Locale is a path prefix — every route is actually `/:locale/...` (e.g. `/en/decks`). See `i18n.md`.

### 4.2 Top navigation (v1)

Three items in the global header, plus the account avatar:

- **Deck Builder** — links to the most recent deck if any, else `/decks`
- **My Decks** — `/decks`
- **Browse Cards** — `/cards`
- **Account avatar** (top-right) — opens a menu with `Account`, `Sign out`

Items deferred to future iterations (do not add to v1 nav): `Meta` (cross-deck popularity), `Collection` (owned-cards tracking), `Tournaments`, `Playtest`. See Section 11.

### 4.3 What's gated by auth

Signed-out visitors can:

- Browse the full card catalog (`/cards`)
- View a shared deck (`/shared/:id`)
- See `/sign-in` and `/sign-up`

Everything else redirects to `/sign-in?next=...`. Public surfaces never expose user-specific data.

## 5. Page specifications

### 5.1 Deck list (`/decks`)

**Purpose.** Show the signed-in user's decks; entry point to creating a new deck or resuming an in-progress one.

**Layout.** Single content column, max-width 1200px. Top: page heading "My Decks" with a primary `+ New Deck` CTA. Below: filter / group / sort bar. Below: deck tiles or rows depending on view toggle.

**Filter and group bar (sticky below page heading):**

- **Format filter** (multi-select): defaults to all. Filters which decks are visible. Even with only Classic Constructed live today, this filter ships from day one — Silver Age is expected soon.
- **Group by format** (toggle): when on, decks are grouped under format section headers (`CLASSIC CONSTRUCTED`, `SILVER AGE`, etc.) with a count per group.
- **Sort**: dropdown with options `Last edited` (default), `Created date`, `Name (A–Z)`, `Hero`. Sort by format is intentionally not offered; grouping by format covers it.
- **View toggle** (right-aligned): grid / list icons.

**Grid view (default).**

- 3–4 tiles per row at desktop; 1–2 on tablet; 1 on phone.
- Each tile: hero portrait (cropped to a 5:7 aspect, top), deck name (bold), format badge, card count (e.g. "60/60" or "54/60" if incomplete), last-edited timestamp, validity dot (green / red), visibility icon (lock / chain / globe — only shown when not private).
- Hover or focus: subtle elevation lift (`--bg-raised` background swap, no shadow).
- Tile menu (hidden until hover/focus): `Open`, `Duplicate`, `Rename`, `Delete`.

**List view.**

- Same data points in a single horizontal row per deck. Hero portrait shrinks to a 56px circular avatar at the start; the rest is text.
- Same row menu as grid tile.

**Actions.**

- **Create deck** (primary CTA): navigates to `/decks/new`.
- **Duplicate**: clones the deck with name `<original> (copy)` and navigates to the new deck's editor.
- **Delete**: triggers a 5-second undo toast. No modal. The deck is soft-deleted server-side; the toast's `Undo` action restores it. Once the toast closes, the delete commits.

**Empty state.**

- Centered illustration (a stylized card-back outline or pitch-pip arrangement — designer's call), heading "Create your first deck", subtext explaining what Chainsmith is in two sentences, primary CTA `+ New Deck`.
- No featured / example decks in v1 (would require a curated content pipeline we don't have).

### 5.2 Hero select (`/decks/new`)

**Purpose.** Pick a hero and format, then enter the deck builder.

**Layout.** Single content column, max-width 1200px. Combined screen — format selector and hero grid live together on one page so the user can adjust either independently.

**Format selector** (pinned at top below page heading):

- Pill-style segmented control with format options (`Classic Constructed`, `Blitz`, `Commoner` initially). Single-select.
- Selecting a format **live-filters** the hero grid to format-eligible heroes.

**Search and filters** (between format selector and hero grid):

- Name search input.
- Class filter (multi-select dropdown).
- Talent filter (multi-select dropdown).

**Hero grid.**

- 4–6 tiles per row at desktop; 2 on phone.
- Each tile: hero portrait (cropped to 5:7), hero name, class label, life total (and intellect if relevant), small format-eligibility chips below the name when ambiguous (e.g. "Blitz only" for Young heroes).
- Click a tile → deck is created server-side with auto-generated name (`Untitled <Hero> deck`) and the user is navigated to the editor.

**No naming step.** Naming is deferred to the editor's inline rename. Reduces friction between intent and editing.

### 5.3 Deck builder (`/decks/:id`)

**Purpose.** The product. Everything else exists to bring the user here.

#### 5.3.1 Top chrome

**Header bar (56px)** — global:

- Logo + product name (left)
- Top nav (`Deck Builder`, `My Decks`, `Browse Cards`)
- Search icon, account avatar (right)

**Deck context bar (48px)** — local:

- `←` Back (returns to `/decks`)
- Deck title — click to rename inline (editable text input with autosize)
- Status badges: hero class (`Wizard`), card count (`54/60`), validity (`Legal` green / `3 violations` red — links to sidebar)
- Right-aligned actions: autosave status (`Saved 2s ago` / `Saving…`), `+ Variant`, `Share`, `Export`, overflow menu (`Duplicate`, `Delete`)

#### 5.3.2 Three-column body

**Left sidebar** (~14%, 220–280px):

- **Card preview slot** (top): when a card row is hovered or focused in the deck list, or selected in the search grid, its full image renders here at the gallery size (200x280, 5:7). Below the image: name, type tags, defense if any, abbreviated rules text. If nothing is selected, the slot shows a muted "Hover a card to preview" placeholder.
- **Analytics section** (below the preview slot): see Section 5.3.5.
- **Violations section** (only when validation has violations): a small list of violation chips, each linking back to the offending row in the deck list.

**Center column** (fills):

- **Find Cards header**: "Find cards" title + "Search the full catalog · ~N cards" subtitle. View toggle (grid / list) right-aligned.
- **Search input**: full-width, magnifier icon on the left, clear-button when populated.
- **Filter chips** (always-visible): `Class`, `Type`, `Pitch`. The Pitch chip shows the three colored pip indicators inline.
- **Advanced filters** (collapsible panel, collapsed by default): `Cost range`, `Talent`, `Set / Edition`, `Rarity`, `Power range`, `Defense range`, `Keywords`. `Clear all` link top-right.
- **Implicit filters** (always on, not visible): `Format` (set to deck's format) and `legalForHero` (set to deck's hero). The user can't disable these — viewing illegal cards in this context would be misleading.
- **Result count**: "734 cards match · Showing 24" above the grid.
- **Card grid**: 6–8 across at desktop. Each tile uses card art when available, typographic-on-gradient fallback when not. Pitch pip top-left, copies-in-deck badge top-right (when count > 0). Click row to open the **card detail drawer** (Section 5.3.6). Hover a card to populate the left preview slot. Inline `+` button on each tile to add one copy.
- **Load more** at bottom: "Load more (N remaining)" centered. Cursor pagination per `api-client.md`.

**Right sidebar** (~26%, 340–400px):

- **Hero block** (top): colored circular hero avatar, hero name (bold), class · life subtitle.
- **Equipment & Other section** (always pinned below hero block):
  - **Six equipment slots** in a 2x3 grid: head, chest, arms, legs, mainHand, offHand. Each slot is a fixed-aspect-ratio tile showing the equipped card art if filled, or "+ Equip <slot name>" empty state if not. Clicking an empty slot opens the search filtered to that slot's eligible equipment.
  - Below: any "other" cards that aren't pitch-grouped (heroes-as-card if relevant, weapons that don't fit a slot in the current format).
- **Deck section** (below Equipment & Other), grouped by pitch:
  - Three section headers: `PITCH 1` (red dot), `PITCH 2` (yellow dot), `PITCH 3` (blue dot). Each shows the section count right-aligned.
  - Each card row: pitch dot indicator (left), card name (with quantity prefix if > 1, e.g. "3× Blazing Aether"), type label below the name, `−`/`+` steppers and quantity badge right-aligned.
  - **Toggle for grouping by type** (Action / Attack Action / Defense Reaction / Instant) lives as a small icon button at the top-right of the deck section. Default is pitch grouping.
- **No tabs** in single-loadout state. The `+ Variant` action lives in the deck context bar (Section 5.3.1).
- **When variants exist** (loadouts.length > 1): a tab strip appears above the hero block — `[Pool] [Main] [Variant 2] [+]`. The Pool tab shows the union of all loadouts' cards (the universe). Each variant tab shows its slice. Switching tabs swaps the deck list contents below.

#### 5.3.3 Loadout / variant model

- **Single loadout (default).** New decks have one unnamed loadout. The right sidebar is single-pane. Pool concept is hidden — the deck *is* the loadout.
- **Adding a variant.** User clicks `+ Variant` in the deck context bar. A modal asks for the variant's name (e.g. "vs. Bravo"). The new variant is created as a **clone of the current loadout's contents**. The right sidebar transitions to tabbed view: `[Pool] [Main] [Variant 2] [+]`. The "Main" tab is the original (still unnamed at the data layer; "Main" is a UI convenience).
- **Pool semantics.** Pool is the universe of cards across all loadouts. When the user is on a variant tab and removes a card, it leaves that variant only. Pool retains it. To remove from Pool, the user removes it from all loadouts (or uses an explicit "Remove from pool" action in the card-detail drawer when the card has been pulled from every loadout — design call: provide this affordance to avoid orphan pool entries).

#### 5.3.4 Add and remove gestures

- **Add one copy**: click `+` on a search-result tile, or press `Enter` while the row is focused.
- **Remove one copy**: click `−` on a deck-list row, or press `Backspace` while the row is focused. Removing the last copy removes the row.
- **Set a specific quantity**: click the quantity badge to open a small numeric input.
- **Drag-and-drop**: not in v1. Not accessible without significant work; defer.

#### 5.3.5 Analytics sidebar contents (v1)

Eight metrics, in this order top-to-bottom. Computed client-side from the loaded card data — see `Section 10` for the rationale and the exception condition.

1. **Pitch distribution.** Horizontal bar split by red / yellow / blue, with each pitch's count and percentage.
2. **Average pitch value.** Single number, e.g. "2.1 avg pitch".
3. **Net resource.** Sum of all card pitch values minus sum of all card costs. Positive = deck pays for itself; negative = net resource sink. Displayed as a single signed number with a label.
4. **% 0-cost cards.** Single percentage, e.g. "62% are 0-cost".
5. **Go-again count.** Total cards with the "Go again" keyword.
6. **Card-type breakdown.** Small color-coded list (Action N, Attack Action N, Defense Reaction N, Instant N, Equipment N).
7. **Equipment slot coverage.** A small 2x3 grid of slot pips (head, chest, arms, legs, mainHand, offHand) — filled if equipped, empty if not. When any slot is empty, a small warning chip appears below: "1 slot empty".
8. **Defense value distribution.** A small bar chart with bars for defense 0 / 1 / 2 / 3.

The analytics section is designed to scale: adding a metric in v2 is a new component, not a redesign. Cross-deck popularity (when added) lives below the existing metrics in a separate "Meta" subsection.

#### 5.3.6 Card detail drawer

- Slides in from the right edge of the viewport (overlays the right sidebar). On mobile, full-screen.
- Contents: full card image (480x672), all printings as a vertical list (set, edition, foiling, treatment, rarity, collector number, artist, release date), localized rules text, format legality summary across all formats.
- **Printing picker**: each printing row has a "Use this printing" button. Selecting swaps the deck's reference to that printing.
- **Add / remove controls**: same `−`/`+` steppers as the deck list, so the user can manage quantity from inside the drawer.
- Close on `Esc`, click outside, or drawer-header `×`.

#### 5.3.7 Validation rendering

- **Live revalidation** with a 300ms debounce on every deck-mutating change. Server-side via `POST /validate`. **Performance note: this is a hot path; the backend SLA target is sub-100ms p95.** See Section 10.
- **Three rendering surfaces**, all kept in sync:
  - **Inline badge** on the offending deck-list row: a small red dot + tooltip with the violation code's localized message.
  - **Sidebar violations section** (left sidebar): a small list of violation chips, each clickable to scroll the deck list to the offending row.
  - **Top-of-editor banner**: appears when the deck is illegal. "3 violations — see sidebar." Dismissible per session via `×`. Reappears on the next new violation.
- All violation messages keyed off the backend's `code` field via the typed `errors.json` namespace (per `api-client.md`).

#### 5.3.8 Autosave

- **By checkpoint.** Card add / remove / printing swap fires an immediate save. Inline edits (deck name, variant name, deck description if added later) batch with a 2s debounce.
- **Autosave status indicator** in the header: `Saved 2s ago` (idle), `Saving…` (in-flight), `Save failed — retry` (on error, with a retry button).
- **Conflict handling**: last-write-wins. If a save races with a save from another tab, the latest write wins and a toast warns: "This deck was edited in another tab — your last change is the saved version." CRDT / OT deferred far past v1.
- **Offline behavior**: read-only mode with a top-of-editor offline banner ("You're offline — changes can't be saved"). Edits are blocked, not queued. Banner clears on reconnect; if the user tries to edit while offline, an inline tooltip explains. Offline edit queue deferred to v2.

#### 5.3.9 Undo / redo

- **Per-session undo stack**, depth ~50. Cleared when the editor unmounts or a new deck is opened. No persistence across reloads.
- Keyboard: `Cmd/Ctrl+Z` (undo), `Cmd/Ctrl+Shift+Z` (redo). Visual affordance optional in v1 (the keyboard-shortcut overlay documents them).

### 5.4 Browse Cards (`/cards`)

**Purpose.** A signed-in or signed-out visitor browses the full card catalog without a deck context.

**Layout.** Single content column, max-width 1200px. Same `Find cards` UI as the deck-builder center column, full-width:

- Search input
- Visible filter chips (Class, Type, Pitch)
- Advanced filter panel
- Card grid with the same gradient/typographic fallback rule
- Load more

**Differences from the editor's center column:**

- No `+` add affordance on tiles — there's no deck context.
- Click a tile → opens the card detail drawer (without `−`/`+` controls).
- "Implicit filters" don't apply — there's no hero or format context.

### 5.5 Shared deck view (`/shared/:id`)

**Purpose.** The read-only view a share-link recipient sees. Designed to be screenshot-friendly and signup-funnel-friendly.

**Layout.** Single content column, max-width 1200px.

- **Top callout** (only for signed-out visitors): "Sign in to clone this deck" with a primary `Sign in` CTA. Dismissible per session.
- **Hero block** (same as editor right-sidebar): hero avatar, name, class, life.
- **Deck list** (read-only): same pitch-grouped layout as the editor right sidebar, but no `−`/`+` steppers, no rename, no quantity inputs. Card rows are clickable to open the card detail drawer (read-only).
- **Analytics panel** (collapsible, expanded by default): the same eight metrics as the editor sidebar.
- **Equipment grid**: same 2x3 layout as the editor.
- **Owner attribution** (footer): "Created by <display name>" (or "Anonymous" if the owner has no public display name). Created and last-edited timestamps.
- **Action**: `Clone this deck` button (primary). For signed-in visitors: clones into their account and opens the editor. For signed-out visitors: prompts sign-in, clones on success.

**No editor chrome**: no search panel, no card grid, no add affordances. The shared view is a deck *profile*, not an editor.

### 5.6 Account (`/account`)

**Purpose.** Profile, preferences, and account management.

**Layout.** Single content column, max-width 800px. Sections stacked, each with a clear heading.

**Sections (in order):**

1. **Profile.** Display name (editable, inline), avatar (upload or generate from initials), email (read-only — managed by Supabase).
2. **Preferences.**
   - Theme: dark / light segmented control. Dark is default per `css.md`.
   - Language: locale picker (English at launch; structure in place for additional locales per `i18n.md`).
3. **Sign out.** Single button. Clears the Supabase session and forces a full reload to `/sign-in`.
4. **Delete account.** Destructive action behind a confirm modal that requires the user to type their email to enable the destructive button. Calls a backend endpoint to soft-delete the account; banishment of decks follows backend retention policy.

### 5.7 Sign-in / Sign-up

**Purpose.** Auth onboarding.

**Layout.** Centered card on a full-page background, max-width 420px.

**Sign-in form:**

- Email + password fields
- Sign-in button (primary)
- "Forgot password" link
- Divider: "or continue with"
- OAuth buttons: Google, Discord
- Footer link: "Don't have an account? Sign up"

**Sign-up form:**

- Email + password (with a confirm field) + display name
- Sign-up button (primary)
- Same OAuth options
- Footer link: "Already have an account? Sign in"

**Behaviors:**

- After sign-in, redirect honors a `?next=` query param (e.g. `/sign-in?next=/decks/abc`).
- Errors render inline under the relevant field, tied via `aria-describedby`, and announced via `aria-live` per `accessibility.md`.
- OAuth buttons display the provider's brand color and logo, but on press the loading state matches the rest of the app's affordances (no provider-branded spinners).

## 6. Cross-cutting patterns

### 6.1 Loading

**Skeletons everywhere.** No spinners except for genuinely indeterminate operations under 1s (e.g. a save flush — and even that prefers an inline status indicator over a spinner).

- **Card grid**: skeleton tiles that match the 5:7 aspect ratio. Background animates with a subtle shimmer (`motion-safe:` only).
- **Deck list rows**: skeleton row with a circular avatar placeholder + two text-line placeholders.
- **Analytics sidebar**: skeleton bars sized to the eventual data shape.
- **Card detail drawer**: skeleton image + skeleton text lines.

Skeletons match the slot dimensions exactly so layout doesn't shift on load.

### 6.2 Errors

- **Network / API errors (fatal at the page level):** full-pane error message with a heading, body explaining what failed, primary action `Retry`, secondary action `Report this` linking to the tracker repo. Render below the top chrome so the user can still navigate away.
- **Inline errors (form fields):** rendered below the field, tied via `aria-describedby`, announced via `aria-live="polite"`.
- **Toast errors (transient operation failures):** bottom-center, 5-second auto-dismiss, with an action where applicable (e.g. `Retry`).

### 6.3 Empty states

- **Empty deck list**: handled in 5.1.
- **Empty deck (just hero)**: editor opens with the search input focused and a muted message in the right sidebar where rows would be: "Add cards to get started." Hero block remains.
- **Empty search results**: the card grid is replaced with a centered message: "No cards match your filters" + `Clear filters` link.
- **Empty pool (multi-loadout decks where all loadouts are empty):** "This deck has no cards yet" with `+ Add cards` CTA.

### 6.4 Toasts

- Bottom-center, max 5 visible at once, default auto-dismiss 5 seconds.
- Variants: `success`, `info`, `warning`, `danger`.
- Actions inline (e.g. delete-deck `Undo`). One primary action per toast.
- Live-region: `aria-live="polite"` for `success` / `info`, `aria-live="assertive"` for `warning` / `danger`.

### 6.5 Modals

- Native `<dialog>` element with `showModal()` for inert-background behavior.
- Focus moves into the dialog on open (first focusable control or the heading), returns to the trigger on close.
- Esc closes; click-outside closes; explicit `×` button in the top-right of the dialog header closes.
- Used for: variant-create form, delete-account confirm, share modal.

### 6.6 Drawers

- Slide in from the right edge on desktop (320–480px width depending on content).
- Full-screen on phones.
- Same focus-trap and Esc-to-close behaviors as modals.
- Used for: card detail.

### 6.7 Banners

- Top-of-editor for legal-status alerts (illegal deck, offline mode, save-failed status).
- Dismissible per session for non-critical (illegal-deck banner). Non-dismissible for critical (offline mode — clears on reconnect).
- Color-coded by severity using semantic state tokens.

## 7. Mobile adaptations

The desktop three-column layout collapses to a single column with tabbed navigation on phones (breakpoint: `< 768px`).

### 7.1 Deck builder on mobile

- **Top chrome**: header collapses to logo + hamburger (left) + account avatar (right). Deck context bar collapses to back arrow + deck title (truncated) + overflow menu containing all actions.
- **Bottom tab bar**: three full-width tabs — `Search`, `Deck`, `Stats`. Each is a button with an icon and a label. Active tab indicator is a top-edge accent bar.
- **Each tab is a full-screen view:**
  - `Search` — the center column at full width.
  - `Deck` — the right sidebar at full width.
  - `Stats` — the left sidebar (analytics + violations) at full width.
- **Card preview slot**: not surfaced on mobile (no hover). Tapping a card opens the detail drawer (full-screen).
- **Card detail drawer**: full-screen on mobile, with a swipe-down-to-dismiss gesture and a header `×`.
- **Tab persistence**: the user's last-active tab persists across navigation within the editor.

### 7.2 Deck list on mobile

- Single-column scroll of full-width tiles.
- Same metadata as desktop, stacked: hero portrait crop top, deck name, badges, timestamps below.
- Filter / sort controls collapse into a `Filters` sheet that opens from the bottom edge.

### 7.3 Hero select on mobile

- Format selector remains pinned at top.
- Hero grid: 2 columns.
- Search and filter controls collapse into a bottom sheet accessed via a `Filters` button.

### 7.4 Browse cards on mobile

- Search input full-width pinned at top.
- Filter chips horizontally scrollable.
- Card grid: 2–3 across.

### 7.5 Shared deck view on mobile

- Hero block, deck list, analytics, equipment grid stacked vertically.
- Analytics collapses into an expandable section (collapsed by default to keep the deck list above the fold).

## 8. Keyboard shortcuts

A `?` overlay shows the full table. Shortcuts respect `inert` modals and are disabled while a modal is open.

| Shortcut | Action |
|---|---|
| `/` or `Cmd/Ctrl+K` | Focus the search input |
| `Enter` (on a search result row) | Add one copy of the focused card |
| `Backspace` (on a deck-list row) | Remove one copy of the focused card |
| `+` / `−` | Increment / decrement the focused row's quantity |
| `Cmd/Ctrl+Z` | Undo |
| `Cmd/Ctrl+Shift+Z` | Redo |
| `Esc` | Close drawer / modal / overlay |
| `?` | Show keyboard shortcuts overlay |

A Cmd+K **command palette** (`Add card by name…`, `Switch to variant X`, `Export as plaintext`, `Toggle list view`) is **deferred to post-v1**.

## 9. Accessibility

WCAG 2.1 AA is a hard requirement. Full rules in `chainsmith-web/.claude/rules/accessibility.md`. Page-specific notes:

- **Card grid** uses `role="grid"` with arrow-key navigation between cells; tab moves between sections, not between cells.
- **Hero portraits** are interactive elements with semantic `<a>` (links) inside `<li>`s; accessible name is the hero's name (localized when available).
- **Validity dots** are paired with a text label or icon (color is never the only signal).
- **Pitch indicators** are paired with a numeric label or pip count.
- **Filter chips** are buttons with a `aria-expanded` for the dropdown state.
- **Steppers** use `<button>` elements with `aria-label="Add one"` / `aria-label="Remove one"` (localized).
- **Card preview slot** updates use `aria-live="polite"` so screen readers announce the new card without interrupting.
- **Drawers and modals** trap focus and restore focus to the trigger on close.

## 10. API dependencies

The brief assumes the following backend behaviors exist by the time the corresponding UI ships. These are flagged so the API team and the design team can coordinate.

| Dependency | Status | Notes |
|---|---|---|
| **`PATCH /decks/:id`** (or `PUT`) | **Required** before launch | Without this, autosave is impossible — the current API only supports `DELETE` + `POST`, which would change the deck's ID on every save. |
| **`GET /shared/:id`** | **Required** for share feature | Resolves an unlisted or public deck for any viewer. The current API has no public deck-fetch endpoint. |
| **`GET /decks/public`** browse endpoint | Optional for v1 | Required if a "browse public decks" surface ships. Out of scope for v1 nav (Section 11). |
| **`POST /validate` performance** | **SLA: sub-100ms p95** | Hot path. Live revalidation with 300ms debounce hammers it on every edit. The brief assumes the backend optimizes for this — caching, minimal payload, indexed lookups. |
| **Card images served by LSS CDN** | Already true | `imageUrl` may be `null`; client renders the typographic-on-gradient fallback (Section 3.2). |
| **No new analytics endpoints for v1** | — | All v1 analytics are computed client-side from already-loaded card data (Section 5.3.5). |
| **Deck status field (`Draft` etc.)** | Not required | The mock showed a "Draft" status badge; v1 drops it. |
| **Cross-deck popularity endpoint** | Future | Required if `Meta` page reappears. See Section 12. |
| **User collection endpoint** | Future | Required if `Collection` page reappears. See Section 12. |
| **Deck import (plaintext, fabdb, fabrary)** | Future | v1 ships export only. |

## 11. Out of scope for v1

These are explicitly excluded from v1. Each has a precondition for reconsideration.

- **`Meta` page (cross-deck popularity).** Requires backend aggregation across users' decks. Reconsider when there's enough user data for the metrics to be meaningful and the API team commits to the aggregation work.
- **`Collection` page (owned-card tracking).** Requires an entire user-collection model the API doesn't have. Reconsider when there's user demand and the API team commits.
- **JSON export and external tool integrations** (fabdb, fabrary). Out of v1 to avoid maintaining mapping shims that break when those tools change. Reconsider when there's a specific user request and a stable upstream contract.
- **Cmd+K command palette.** Defer until v1 keyboard shortcuts are validated as insufficient.
- **Offline edit queue.** v1 is read-only when offline. Reconsider if user research shows brewers regularly building offline.
- **CRDT / operational-transform concurrent editing.** Last-write-wins is sufficient for the 99% case (one tab per deck). Reconsider only if multi-device co-editing becomes a real workflow.
- **Saved searches / search history.** Adds storage and UI for marginal value.
- **Playtest mode / goldfishing / match simulation.** Out per `fab-domain.md` — Chainsmith is a deck builder, not a game.
- **Tournament management / event integration.** Same.
- **Pricing data.** Same.

## 12. Future considerations

- **Cross-deck popularity analytics.** Once user volume warrants it, surface "% of competitive Briar lists running this card" and similar in the analytics sidebar. Requires backend aggregation; revisit per Section 11.
- **Mobile native apps.** iOS and Android in their own repos (per `CLAUDE.md`). Design language and IA defined here are reusable; component implementation will diverge.
- **Theme variants beyond dark/light.** Tokens are structured to support `prefers-contrast: more` (per `css.md`). Stretch goal, not a launch blocker.
- **Deck primer / write-up section.** Long-form deck description (rendered as text only per `security.md`, with explicit markdown handling deferred until a scoped need exists).
- **Banned-list change notifications.** When the LSS B&R updates and a user's deck becomes illegal, surface this somewhere — possibly an in-app notification on next visit, possibly an email. Backend dependency.
- **Deck cloning from share links for signed-in users.** v1 has the basic clone action; later, surface "clones of this deck" or fork attribution.

---

**Brief version:** v1.0 — initial pre-launch design brief. Update this version line and add a changelog section when the brief is materially revised.
