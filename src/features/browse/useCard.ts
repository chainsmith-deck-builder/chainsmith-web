import { useQuery } from '@tanstack/react-query';

import { api } from '../../api/client';
import { queryKeys } from '../../api/queryKeys';

// Single-card detail: full Card record + all Printings. Disabled when no
// id is selected (the detail panel is closed). When the user clicks
// through different cards in rapid succession TanStack Query gives back
// any cached entry instantly while a fresh fetch may also fly.
export function useCard(id: string | null) {
  return useQuery({
    queryKey: id !== null ? queryKeys.cards.detail(id) : ['cards', 'detail', { id: '' }],
    queryFn: () => fetchCard(id ?? ''),
    enabled: id !== null,
  });
}

// Narrow on `result.error` first — see useHeroes for why the reverse
// order (data check before reading response) trips TS into typing
// `result.response` as `never`.
async function fetchCard(id: string) {
  const result = await api.GET('/cards/{id}', { params: { path: { id } } });
  if (result.error) throw result.error;
  return result.data;
}
