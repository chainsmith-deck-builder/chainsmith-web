# Clean code rules

Project-specific clean-code preferences for TypeScript and React in this repo. The spine is the same as the backend's `chainsmith/.claude/rules/clean-code.md`; the language-specific rules differ.

This file overlaps with `react.md` and any global `~/.claude/CLAUDE.md`. Where they differ, the more specific wins (this file > `react.md` > global). For React-component-specific patterns (hooks, state, file layout), see `react.md`.

## Functions

- **One job per function.** A function is a verb. If the name needs an "and," split it. *Validate, then save* is two functions, not one.
- **Don't extract for the sake of extraction.** Single-use helpers that exist only to make a parent function shorter usually hurt readability — the reader jumps around, and the name lies about how reusable the code is. Inline beats extract when the helper would be called once and is not independently testable.
- **Depth over surface.** A 200-line component that reads top-to-bottom is often clearer than five 40-line components with overlapping props. Apply Ousterhout's "deep module" idea to components and functions both.
- **Parameter count is a smell, not a hard rule.** Three is fine, four is fine, six is a smell — the fix is a typed object, not stuffing fields into context.
- **Pure where possible, side-effecting where necessary, never both.** A function either computes a value or performs IO. Mixing them makes testing painful. Component render is pure; effects do IO. Respect the boundary.

## Naming

- **Names reveal intent, not implementation.** `card` beats `fetchedCardData`. `legalDecks` beats `filteredArray`. Prefer the shorter form when context makes the implementation obvious.
- **Use domain language.** When the FaB rules say *hero*, *pitch*, *talent*, the code says hero, pitch, talent. Don't invent generic synonyms (*item*, *value*, *category*) for things that already have a name in the domain. See `fab-domain.md` for the canonical vocabulary.
- **Length scales with scope.** A `.map` callback variable can be `c`. A function-level variable used across 30 lines should be `legalCards`. A store field referenced from many call sites should be unambiguous on its own (`legalCardsByFormat`).
- **Verbs for functions, nouns for types and values.** `validateDeck` not `deckValidation`. `Card` not `CardData`. `isLegal` not `legalityCheck`.
- **Prefer concrete over generic.** `decks` beats `items`. `parseDeckExport` beats `processInput`.
- **Components**: PascalCase, noun-shaped: `DeckEditor`, `CardThumbnail`, `PitchTotalsBar`. Hooks: camelCase starting with `use`. Stores: camelCase ending in `Store`.

## TypeScript specifics

- **No `any`.** Use `unknown` and narrow at the boundary. Generated code is the only allowed exception, and even there we don't widen back to `any`.
- **No non-null assertions** (`!`) outside generated code. If the value is always present, encode that in the type. If it isn't, handle the absent case.
- **Prefer `type` over `interface`** unless declaration merging is genuinely needed. Both work; pick one and stick with it.
- **Discriminated unions over flag-bag objects.** A request that's either a guest or an authenticated user is two variants of a union, not `{ kind?: string; userId?: string; sessionId?: string }`.
- **`readonly` arrays and props by default.** Mutate inside the function with a fresh array or object; don't mutate inputs.
- **Branded types** for IDs that should not be interchangeable (`DeckId`, `CardId`). The brand is a single nominal-typing trick (`type DeckId = string & { readonly __brand: 'DeckId' }`) and lives in `src/api/ids.ts`.
- **`satisfies`** when you want the value's literal type preserved while checking it against a wider shape — better than annotating with the wider type.
- **Const assertions** (`as const`) on lookup tables. Tuples for fixed-shape data.

## Comments

- **Explain *why*, not *what*.** The code shows what. Comments exist for context the reader can't deduce: a workaround, a non-obvious tradeoff, a link to a bug, a domain rule that justifies an otherwise odd-looking branch.
- **Comments are not a failure.** A short comment explaining intent is cheaper than a heroic rename, and some context (LSS rulings, security advisories, performance tradeoffs, why a `useEffect` exists) genuinely cannot live in a name.
- **Update or delete drifting comments.** A wrong comment is worse than no comment. If you change behavior, scan for comments above and below the change.
- **Module-level doc comments earn their keep.** A short note at the top of `features/deck-editor/deckEditorStore.ts` explaining what state shape the editor expects saves a future reader twenty minutes.
- **No commit-message comments in code.** "Added to fix #1234" belongs in the commit, not the source.

## Avoiding over-engineering

The most common failure mode in LLM-generated code is solving problems that don't exist yet. Rules to push back:

- **YAGNI.** Don't add a prop, generic, theme variant, or config option unless something in this repo uses it now. "We might want this later" is an issue, not code.
- **No speculative abstractions.** One implementation, no factory. One value, no enum-of-strings. Concrete code is cheaper to generalize later than a wrong abstraction is to undo.
- **No premature `Component` / `ComponentContainer` / `ComponentPresenter` splits.** One component until the split earns its keep.
- **No premature memoization.** `memo()`, `useMemo`, `useCallback` are added when profiling shows a measurable win.
- **No wrapper types without a reason.** A branded type exists to enforce an invariant. A wrapper component exists to encapsulate behavior. Neither exists to be tidy.
- **No defensive `Optional` / undefined returns.** If the function cannot return undefined, its type should not say it can.
- **No "just in case" `export`.** Exports are the smallest set callers need. Treat the module's surface as part of its design.
- **Don't anticipate features.** Don't add a feature flag, a theme variant, or a localized-card-text path until a real call site needs it. (The i18n infrastructure for card text *is* a real call site once the backend exposes localized printings — see `i18n.md`.)

## When to break a rule

Every rule above has exceptions. The bar for breaking one is:

1. Name the rule you are breaking, in a code comment or the PR description.
2. Explain why the alternative is worse for this specific case.
3. Be willing to defend it in review.

If you can't do all three, follow the rule.
