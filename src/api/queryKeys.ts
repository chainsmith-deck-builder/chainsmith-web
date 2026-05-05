// TanStack Query key factory. Per .claude/rules/api-client.md, keys are
// resource-first tuples that map onto the OpenAPI operation grouping:
//
//   [resource, kind]                  // e.g. ['heroes', 'list']
//   [resource, kind, params]          // e.g. ['heroes', 'list', { format }]
//   [resource, 'detail', { id }]      // detail queries
//
// Mutations invalidate the smallest correct prefix. Adding a key means
// adding a factory here, not constructing tuples at call sites.

import type { Class, FormatId, HeroKind, Talent } from './types';

export type HeroesListParams = {
  readonly text?: string;
  readonly classes?: readonly Class[];
  readonly talents?: readonly Talent[];
  readonly kind?: HeroKind;
  readonly format?: FormatId;
  readonly limit?: number;
};

export const queryKeys = {
  heroes: {
    list: (params?: HeroesListParams) =>
      params === undefined
        ? (['heroes', 'list'] as const)
        : (['heroes', 'list', params] as const),
  },
} as const;
