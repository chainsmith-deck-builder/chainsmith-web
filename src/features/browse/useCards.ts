import { useInfiniteQuery } from '@tanstack/react-query';

import { api } from '../../api/client';
import { queryKeys, type CardsListParams } from '../../api/queryKeys';

// Backend defaults to 50 per page with MAX_LIMIT=200; 50 keeps the page
// snappy and the load-more button hot for users browsing casually.
const PAGE_SIZE = 50;

export function useCards(params: CardsListParams) {
  return useInfiniteQuery({
    queryKey: queryKeys.cards.list({ ...params, limit: PAGE_SIZE }),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => fetchCards(params, pageParam),
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
}

// Page fetcher. Same narrowing trick as useHeroes — read `result.error`
// before `result.data` so TypeScript keeps the FetchResponse union intact.
async function fetchCards(params: CardsListParams, cursor: string | undefined) {
  const result = await api.GET('/cards', {
    params: {
      query: {
        ...(params.text ? { text: params.text } : {}),
        ...(params.classes && params.classes.length > 0
          ? { classes: params.classes.join(',') }
          : {}),
        ...(params.talents && params.talents.length > 0
          ? { talents: params.talents.join(',') }
          : {}),
        ...(params.types && params.types.length > 0
          ? { types: params.types.join(',') }
          : {}),
        ...(params.pitch !== undefined ? { pitch: params.pitch } : {}),
        ...(params.costMin !== undefined ? { costMin: params.costMin } : {}),
        ...(params.costMax !== undefined ? { costMax: params.costMax } : {}),
        ...(params.format !== undefined ? { format: params.format } : {}),
        ...(params.legalForHero !== undefined ? { legalForHero: params.legalForHero } : {}),
        limit: PAGE_SIZE,
        ...(cursor !== undefined ? { cursor } : {}),
      },
    },
  });
  if (result.error) throw result.error;
  return {
    items: result.data?.items ?? [],
    nextCursor: result.data?.nextCursor ?? null,
  };
}
