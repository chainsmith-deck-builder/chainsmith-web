import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GlobalHeader } from '../../components/GlobalHeader';
import { Pill } from '../../components/Pill';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { DEMO_DECKS } from '../../domain/decks';
import { DeckTile } from './DeckTile';
import { DeckListItem } from './DeckListItem';
import { EmptyState } from './EmptyState';

type Props = {
  /** When true, render the empty-state instead of the populated list. */
  empty?: boolean;
  mobile?: boolean;
};

export function DeckListScreen({ empty = false, mobile = false }: Props) {
  const { t } = useTranslation('deck');
  const { t: tCommon } = useTranslation('common');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [groupByFormat, setGroupByFormat] = useState(false);

  const decks = empty ? [] : DEMO_DECKS;

  return (
    <div className="flex min-h-dvh flex-col overflow-auto bg-bg-base text-text-primary">
      <GlobalHeader active="decks" />
      <main
        id="main-content"
        aria-label={t('list.title')}
        className={`mx-auto w-full max-w-6xl flex-1 ${mobile ? 'px-4 py-5' : 'px-10 py-8'}`}
      >
        <div className="mb-6 flex items-center">
          <h1
            className={`m-0 font-semibold tracking-heading ${mobile ? 'text-xl' : 'text-display'}`}
          >
            {t('list.title')}
          </h1>
          <Button variant="primary" className="ms-auto">
            <Icon.plus /> {t('list.new_deck')}
          </Button>
        </div>

        {decks.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Pill active>
                {t('list.filters.format', { value: tCommon('format.all') })} <Icon.chevron />
              </Pill>
              <Pill>
                {t('list.filters.sort', { value: t('list.filters.sort_last_edited') })}{' '}
                <Icon.chevron />
              </Pill>
              <label className="ms-1 inline-flex items-center gap-1.5 text-xs text-text-secondary">
                <input
                  type="checkbox"
                  checked={groupByFormat}
                  onChange={(e) => setGroupByFormat(e.target.checked)}
                  className="accent-accent-brand"
                />
                {t('list.filters.group_by_format')}
              </label>
              <div className="ms-auto flex gap-1 rounded-md bg-bg-raised p-0.5">
                <ViewToggleButton
                  active={view === 'grid'}
                  onClick={() => setView('grid')}
                  ariaLabel={t('list.view.grid')}
                >
                  <Icon.grid />
                </ViewToggleButton>
                <ViewToggleButton
                  active={view === 'list'}
                  onClick={() => setView('list')}
                  ariaLabel={t('list.view.list')}
                >
                  <Icon.list />
                </ViewToggleButton>
              </div>
            </div>

            {view === 'grid' ? (
              <div
                className="grid gap-4"
                // eslint-disable-next-line react/forbid-dom-props -- mobile-vs-desktop responsive grid template; not on Tailwind utility scale
                style={{
                  gridTemplateColumns: mobile
                    ? '1fr'
                    : 'repeat(auto-fill, minmax(240px, 1fr))',
                }}
              >
                {decks.map((d) => (
                  <DeckTile key={d.id} deck={d} />
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-border-subtle bg-bg-raised">
                {decks.map((d, i) => (
                  <DeckListItem key={d.id} deck={d} divider={i > 0} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function ViewToggleButton({
  active,
  onClick,
  ariaLabel,
  children,
}: {
  active: boolean;
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  const tone = active ? 'bg-bg-elevated text-text-primary' : 'bg-transparent text-text-muted';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active}
      className={`flex h-6 w-7 items-center justify-center rounded-sm transition-colors duration-fast ${tone}`}
    >
      {children}
    </button>
  );
}
