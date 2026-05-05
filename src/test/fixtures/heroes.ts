// Hero fixture factory typed against the generated API schema.
//
// Designed to cover hero-list rendering: a small spread of classes/talents
// across the three UI formats (CC, Blitz, Commoner) plus a Living-Legend-
// retired hero so the "not legal in CC" presentation has a real fixture.

import type { Hero, LegalitySummary } from '../../api/types';

const ALL_LEGAL: LegalitySummary = {
  cc: 'legal',
  blitz: 'legal',
  commoner: 'legal',
  silverAge: 'legal',
  livingLegend: 'legal',
  upf: 'legal',
};

export function makeHero(overrides: Partial<Hero> = {}): Hero {
  return {
    id: overrides.id ?? 'hero-fixture',
    name: overrides.name ?? 'Test Hero',
    kind: overrides.kind ?? 'adult',
    classes: overrides.classes ?? ['wizard'],
    talents: overrides.talents ?? [],
    life: overrides.life ?? 20,
    essenceGrants: overrides.essenceGrants ?? [],
    legalitySummary: overrides.legalitySummary ?? ALL_LEGAL,
    ...(overrides.arcane !== undefined ? { arcane: overrides.arcane } : {}),
    ...(overrides.intellect !== undefined ? { intellect: overrides.intellect } : {}),
    ...(overrides.defaultPrinting !== undefined
      ? { defaultPrinting: overrides.defaultPrinting }
      : {}),
  };
}

export function makeLegality(overrides: Partial<LegalitySummary> = {}): LegalitySummary {
  return { ...ALL_LEGAL, ...overrides };
}
