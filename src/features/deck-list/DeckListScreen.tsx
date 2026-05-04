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
        className="mx-auto w-full flex-1"
        style={{ maxWidth: 1200, padding: mobile ? '20px 16px' : '32px 40px' }}
      >
        <div className="mb-6 flex items-center">
          <h1
            className="m-0 font-semibold"
            style={{
              fontSize: mobile ? 22 : 26,
              letterSpacing: '-0.015em',
            }}
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
              <label className="ms-1 inline-flex items-center gap-1.5 text-[12px] text-text-secondary">
                <input
                  type="checkbox"
                  checked={groupByFormat}
                  onChange={(e) => setGroupByFormat(e.target.checked)}
                  style={{ accentColor: 'var(--accent-brand)' }}
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
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active}
      className="flex h-6 w-7 items-center justify-center rounded-sm transition-colors duration-fast"
      style={{
        background: active ? 'var(--bg-elevated)' : 'transparent',
        color: active ? 'var(--text-primary)' : 'var(--text-muted)',
      }}
    >
      {children}
    </button>
  );
}
