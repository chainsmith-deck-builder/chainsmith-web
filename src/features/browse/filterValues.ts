// Shape and helpers for the catalog browse filter state. Lives in its own
// module so React Fast Refresh stays happy — `BrowseFilters.tsx` next door
// only exports components, and the constants/types here can be imported
// alongside without invalidating the component's HMR boundary.

import type { UiFormatId } from '../../api/format';
import type { CardType, Class, Talent } from '../../api/types';

export type FilterValues = {
  readonly classes: readonly Class[];
  readonly types: readonly CardType[];
  readonly pitch: 1 | 2 | 3 | undefined;
  readonly talents: readonly Talent[];
  readonly costMin: number | undefined;
  readonly costMax: number | undefined;
  readonly format: UiFormatId | undefined;
};

export const EMPTY_FILTERS: FilterValues = {
  classes: [],
  types: [],
  pitch: undefined,
  talents: [],
  costMin: undefined,
  costMax: undefined,
  format: undefined,
};

// How many *dimensions* of advanced filtering are applied (talent, cost
// min, cost max, format). Multi-selecting two talents counts as one
// dimension — the surfaced "N applied" count maps to user intent rather
// than raw selection count.
export function countAdvancedActive(values: FilterValues): number {
  return (
    (values.talents.length > 0 ? 1 : 0) +
    (values.costMin !== undefined ? 1 : 0) +
    (values.costMax !== undefined ? 1 : 0) +
    (values.format !== undefined ? 1 : 0)
  );
}
