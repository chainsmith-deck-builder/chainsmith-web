import { useQuery } from '@tanstack/react-query';

import { api } from '../../api/client';
import { queryKeys } from '../../api/queryKeys';

// Fetches the full hero list and lets the UI partition it into eligible /
// ineligible buckets via `legalitySummary`. We deliberately don't pass the
// `format` query param: the picker shows ineligible heroes too (greyed out)
// and a single cache entry covers all three UI formats.
export function useHeroes() {
  return useQuery({
    queryKey: queryKeys.heroes.list(),
    queryFn: fetchHeroes,
  });
}

// The backend's `DEFAULT_LIMIT` is 50 and `MAX_LIMIT` is 200. The hero
// catalog is small (~135 heroes total), so one request with a generous
// limit returns the full set without paging.
const HERO_FETCH_LIMIT = 200;

// Narrow on `result.error` first — reading `result.response.status` after
// a `data` check trips TypeScript into typing `result.response` as `never`,
// even though both branches of FetchResponse carry a Response. Falling
// back to a generic Error keeps the unhappy path readable.
async function fetchHeroes() {
  const result = await api.GET('/heroes', {
    params: { query: { limit: HERO_FETCH_LIMIT } },
  });
  if (result.error) throw result.error;
  return result.data?.items ?? [];
}
