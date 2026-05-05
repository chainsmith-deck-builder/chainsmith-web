// Ergonomic re-exports of the most-used schema types. The generated
// `schema.d.ts` is the source of truth — this barrel is just for shorter
// imports in feature code. Add a re-export when a feature first needs the
// type, not preemptively (per .claude/rules/clean-code.md).

import type { components } from './schema';

export type Hero = components['schemas']['HeroSummary'];
export type HeroKind = components['schemas']['HeroKind'];
export type Class = components['schemas']['Class'];
export type Talent = components['schemas']['Talent'];
export type FormatId = components['schemas']['FormatId'];
export type FormatStatus = components['schemas']['FormatStatus'];
export type LegalitySummary = components['schemas']['LegalitySummary'];
export type EssenceGrant = components['schemas']['EssenceGrant'];
export type PrintingSummary = components['schemas']['PrintingSummary'];
export type CardId = components['schemas']['CardId'];

export type CardSummary = components['schemas']['CardSummary'];
export type CardType = components['schemas']['CardType'];

export type ErrorBody = components['schemas']['ErrorBody'];
export type ErrorCode = components['schemas']['ErrorCode'];
