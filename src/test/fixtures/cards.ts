// Card fixture factory typed against the generated API schema. Designed
// for browse-grid rendering: a small mix of pitch values, types, and
// classes that exercises the tile's fallbacks.

import type { CardSummary, LegalitySummary } from '../../api/types';
import { makeLegality } from './heroes';

export function makeCard(overrides: Partial<CardSummary> = {}): CardSummary {
  const base: CardSummary = {
    id: overrides.id ?? 'card-fixture',
    name: overrides.name ?? 'Test Card',
    types: overrides.types ?? ['action'],
    classes: overrides.classes ?? [],
    talents: overrides.talents ?? [],
    legalitySummary:
      overrides.legalitySummary ?? (makeLegality() satisfies LegalitySummary),
  };
  return {
    ...base,
    ...(overrides.cost !== undefined ? { cost: overrides.cost } : {}),
    ...(overrides.pitch !== undefined ? { pitch: overrides.pitch } : {}),
    ...(overrides.power !== undefined ? { power: overrides.power } : {}),
    ...(overrides.defense !== undefined ? { defense: overrides.defense } : {}),
    ...(overrides.defaultPrinting !== undefined
      ? { defaultPrinting: overrides.defaultPrinting }
      : {}),
  };
}
