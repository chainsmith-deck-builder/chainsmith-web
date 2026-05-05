import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { GlobalHeader } from '../../components/GlobalHeader';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { useCards } from './useCards';
import { BrowseCardTile } from './BrowseCardTile';
import { BrowseFilters } from './BrowseFilters';
import { AdvancedFilters } from './AdvancedFilters';
import { CardDetailPanel } from './CardDetailPanel';
import { EMPTY_FILTERS, countAdvancedActive, type FilterValues } from './filterValues';

const SEARCH_DEBOUNCE_MS = 300;

// Pre-fetch the next page when the sentinel button gets within this much of
// the viewport, so cards stream in slightly before the user reaches the end.
const INFINITE_SCROLL_ROOT_MARGIN = '400px';

export function BrowseCardsScreen() {
  const { t } = useTranslation('catalog');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedText, setDebouncedText] = useState('');
  const [filters, setFilters] = useState<FilterValues>(EMPTY_FILTERS);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Debounce: typing rapidly shouldn't fire a request per keystroke. The
  // cancel-on-rerun guarantees only the last edit's timer survives.
  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedText(searchInput), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [searchInput]);

  const params = useMemo(
    () => ({
      ...(debouncedText.trim().length > 0 ? { text: debouncedText.trim() } : {}),
      ...(filters.classes.length > 0 ? { classes: filters.classes } : {}),
      ...(filters.types.length > 0 ? { types: filters.types } : {}),
      ...(filters.pitch !== undefined ? { pitch: filters.pitch } : {}),
      ...(filters.talents.length > 0 ? { talents: filters.talents } : {}),
      ...(filters.costMin !== undefined ? { costMin: filters.costMin } : {}),
      ...(filters.costMax !== undefined ? { costMax: filters.costMax } : {}),
      ...(filters.format !== undefined ? { format: filters.format } : {}),
    }),
    [debouncedText, filters],
  );

  const advancedActive = countAdvancedActive(filters);

  const cardsQuery = useCards(params);
  const cards = useMemo(
    () => cardsQuery.data?.pages.flatMap((p) => p.items) ?? [],
    [cardsQuery.data],
  );
  const hasMore = Boolean(cardsQuery.hasNextPage);
  const { fetchNextPage, isFetchingNextPage } = cardsQuery;

  // Infinite scroll: observe the load-more button as the sentinel. The
  // button stays visible and clickable as a keyboard / no-IO fallback (see
  // .claude/rules/accessibility.md) — auto-fetch is the mouse-scroll
  // shortcut, not the only path forward.
  const loadMoreRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: INFINITE_SCROLL_ROOT_MARGIN },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="flex min-h-dvh flex-col overflow-auto bg-bg-base text-text-primary">
      <GlobalHeader active="browse" />
      <main
        id="main-content"
        aria-label={t('browse.title')}
        className="mx-auto w-full flex-1"
        style={{ maxWidth: 1200, padding: '28px 40px' }}
      >
        <h1
          className="m-0 mb-1.5 font-semibold"
          style={{ fontSize: 26, letterSpacing: '-0.015em' }}
        >
          {t('browse.title')}
        </h1>
        <p className="m-0 mb-5 text-[13px] text-text-muted">{t('browse.subtitle')}</p>

        <div className="relative mb-3">
          <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-text-muted">
            <Icon.search />
          </span>
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t('browse.search_placeholder')}
            aria-label={t('browse.search_placeholder')}
            className="block h-10 w-full rounded-md border border-border-subtle bg-bg-input ps-9 pe-3 text-[13.5px] text-text-primary outline-none"
          />
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-1.5">
          <BrowseFilters values={filters} onChange={setFilters} />
          <button
            type="button"
            aria-expanded={advancedOpen}
            aria-controls="browse-advanced-panel"
            onClick={() => setAdvancedOpen((prev) => !prev)}
            className="inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[12.5px] font-medium transition-colors duration-fast hover:bg-bg-raised"
            style={{
              color:
                advancedActive > 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: advancedActive > 0 ? 'var(--accent-brand-soft)' : 'transparent',
            }}
          >
            <Icon.filter />
            {advancedActive > 0
              ? t('browse.filter.advanced_active', { count: advancedActive })
              : t('browse.filter.advanced')}
          </button>
          <span
            className="ms-auto self-center font-mono text-[11.5px] text-text-muted"
            aria-live="polite"
          >
            {hasMore
              ? t('browse.result_count_more', { shown: cards.length })
              : t('browse.result_count_all', { shown: cards.length })}
          </span>
        </div>

        {advancedOpen && (
          <div id="browse-advanced-panel">
            <AdvancedFilters values={filters} onChange={setFilters} />
          </div>
        )}

        {cardsQuery.isPending && (
          <div role="status" className="py-8 text-[13px] text-text-muted">
            {t('browse.loading')}
          </div>
        )}

        {cardsQuery.isError && (
          <div
            role="alert"
            className="rounded-xl border border-border-subtle bg-bg-raised p-6 text-[13px] text-text-secondary"
          >
            <p className="m-0 font-semibold text-text-primary">{t('browse.error.title')}</p>
            <button
              type="button"
              onClick={() => void cardsQuery.refetch()}
              className="mt-3 inline-flex h-8 items-center rounded-md border border-border-subtle bg-bg-base px-3 text-[12.5px] font-medium hover:bg-bg-overlay"
            >
              {t('browse.error.retry')}
            </button>
          </div>
        )}

        {cardsQuery.isSuccess && cards.length === 0 && (
          <p className="py-8 text-[13px] text-text-muted">{t('browse.empty')}</p>
        )}

        {cards.length > 0 && (
          <div
            className="grid gap-3.5"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}
          >
            {cards.map((c) => (
              <BrowseCardTile
                key={c.id}
                card={c}
                onClick={(card) => setSelectedCardId(card.id)}
              />
            ))}
          </div>
        )}

        {hasMore && (
          <div className="mt-7 flex justify-center">
            <Button
              ref={loadMoreRef}
              variant="secondary"
              onClick={() => void fetchNextPage()}
              disabled={isFetchingNextPage}
              aria-busy={isFetchingNextPage}
            >
              {isFetchingNextPage ? t('browse.loading_more') : t('browse.load_more_button')}
            </Button>
          </div>
        )}
      </main>

      <CardDetailPanel cardId={selectedCardId} onClose={() => setSelectedCardId(null)} />
    </div>
  );
}
