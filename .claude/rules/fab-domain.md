# Flesh and Blood domain rules (web)

This file captures the FaB-specific knowledge the **web client** needs for labels, copy, `aria-label`s, search filters, and component naming. Validation-engine and format-rule definitions live in the backend (`chainsmith/.claude/rules/fab-domain.md`) — that's the source of truth for what's legal in a deck. This file is the source of truth for what we **call** things in the UI.

Defer to the official Comprehensive Rules and the Living Legend / B&R announcements at fabtcg.com for anything not stated here.

## Terminology

Use these exact terms in copy, labels, and identifiers. Don't invent synonyms.

- **Hero**: A card that defines the deck. Decks are built around exactly one hero.
- **Class**: The faction the hero belongs to (Guardian, Warrior, Wizard, Mechanologist, Brute, Ninja, Runeblade, Ranger, Illusionist, and so on). Most non-hero cards are restricted to one class plus Generic.
- **Talent**: A subtype that further restricts deck inclusion (Light, Shadow, Elemental, Earth, Ice, Lightning, etc.). Some heroes have talents, some do not.
- **Pitch**: A card's pitch value, color-coded as Red (1 resource), Yellow (2), Blue (3).
- **Equipment**: Cards that go in equipment slots (head, chest, arms, legs, weapons, off-hand). Slot rules vary by format.
- **Combat chain**: The sequence of attacks and defenses played in a turn. Namesake of the product. Not modeled by the deck builder.
- **Living Legend**: A rotation status that retires powerful heroes from Classic Constructed once their LL points threshold is hit. Cards from those heroes' sets remain legal where the format allows.
- **Young hero**: A reduced-statline version of a hero used in Blitz and certain other formats.

## Formats the UI surfaces

Format selection in the UI matches the backend's supported set. Initial scope:

- **Classic Constructed (CC)**: the flagship constructed format
- **Blitz**: short-game format, Young heroes only, restricted equipment loadout
- **Commoner**: Common-rarity-only, Young heroes only

Limited formats (Draft, Sealed) are out of scope for the deck builder — don't add UI affordances for them. If the backend ever exposes them, that's the trigger to revisit.

## What the UI shows about cards

The web client renders these card fields, sourced from the backend's typed API:

- `name`, `pitch`, `cost`, `power`, `defense`
- `types`, `class`, `talents`, `keywords`
- `printings` (set, edition, rarity, art variant) — drives the printing picker
- `imageUrl` (per printing) — drives card art rendering, hot-linked from LSS

It does **not** render upstream `unique_id` or other internal identifiers in user-visible text — those are for `key` props and queries only.

## Card image rendering

- Three discrete sizes mapping to design-system tokens: `80x112` thumbnail (search results, deck list items), `200x280` gallery (browse view), `480x672` full (card detail modal).
- 5:7 aspect ratio is locked. Don't break it.
- Skeleton loaders match the slot dimensions exactly so layout doesn't shift on image load.
- **Typographic fallback** when `imageUrl` is `null`: render a card-shaped frame with the card's name, pitch, cost, and class — not a generic "missing image" icon.
- Blur-up placeholders for gallery views; lazy load off-screen cards.
- Hot-link from `https://cards.fabtcg.com/...` per `security.md`. No proxying.

## Pitch color reservation

The three FaB pitch colors (red 1, yellow 2, blue 3) are **reserved for data visualization only** — pip indicators, deck-stat bar charts, pitch-count breakdowns. They are never used as UI chrome (buttons, links, focus rings, error states). Tokens for these colors are namespaced under `--viz-pitch-1/2/3` so the rule is hard to violate by accident. See `css.md`.

This intersects with `accessibility.md`: pitch color is a common color-confusion target, so any data viz that distinguishes pitch values must include a non-color signal too (numeric label, pip count, pattern).

## Card name and rules text translation

See `i18n.md` for the full rule. Summary: UI chrome always translates; card names and rules text use upstream localized data when available, English otherwise. There is one helper (`localizedCardName(card, locale)`) that components use instead of reading `card.name` directly, and the same applies to rules text.

## Banned and restricted lists

The UI does not maintain its own banned/restricted lists. The backend's API surfaces a card's `legalityByFormat` and any restriction status, and the UI renders that. When LSS announces a B&R update:

1. The backend updates its constants (per `chainsmith/.claude/rules/fab-domain.md`)
2. The web client picks up the new shape on the next backend SHA pin bump
3. UI tests covering "banned card is shown as such in the editor" stay green if the data flow is right; if they fail, the data flow needs work — *not* a hardcoded ban list in the web client

## Search and filter vocabulary

Filter labels in the search UI use the canonical terms above:

- "Hero" not "Character" or "Leader"
- "Class" not "Faction"
- "Talent" not "Affinity"
- "Pitch" not "Resource"
- "Equipment" not "Gear"
- "Set" not "Expansion"

Translation keys for filter labels follow the same vocabulary: `catalog.filters.class`, `catalog.filters.talent`, `catalog.filters.pitch`. The English value of each key is the canonical term.

## What the deck builder does not do

These are explicitly not in scope for this product. Don't build affordances for them, don't link to them, don't suggest them in copy:

- Match playing or simulation
- Combat chain resolution
- Goldfishing or playtest mode
- Tournament or event management
- Price tracking (deferred to a v2+ feature, not implied today)

If a feature request implies any of these, push back and confirm with the product owner before building.
