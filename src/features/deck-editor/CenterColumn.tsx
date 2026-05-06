import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Card } from '../../domain/types';
import { CARDS } from '../../domain/cards';
import { CardTile } from '../../components/CardTile';
import { Pill } from '../../components/Pill';
import { PitchDot } from '../../components/PitchDot';
import { Icon } from '../../components/Icon';

type Props = {
  deckQtyById: Record<string, number>;
  onCardHover?: (card: Card) => void;
  onCardClick?: (card: Card) => void;
  onAdd?: (card: Card) => void;
};

export function CenterColumn({ deckQtyById, onCardHover, onCardClick, onAdd }: Props) {
  const { t } = useTranslation('deck');
  const { t: tCatalog } = useTranslation('catalog');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [pitchFilter, setPitchFilter] = useState<1 | 2 | 3 | null>(null);
  const [search, setSearch] = useState('');
  const [advOpen, setAdvOpen] = useState(false);

  const filtered = useMemo(() => {
    return CARDS.filter((c) => {
      if (pitchFilter && c.pitch !== pitchFilter) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [pitchFilter, search]);

  return (
    <main className="flex flex-1 min-w-0 flex-col overflow-hidden bg-bg-base">
      {/* Header */}
      <div className="border-b border-border-subtle px-5 pb-3 pt-4">
        <div className="mb-3 flex items-baseline justify-between">
          <div>
            <h2 className="m-0 text-base font-semibold tracking-heading">
              {t('editor.search.title')}
            </h2>
            <div className="mt-0.5 text-tiny text-text-muted">
              {t('editor.search.subtitle_count')} ·{' '}
              <span className="font-mono">
                {t('editor.search.of_total', { shown: CARDS.length, total: 1247 })}
              </span>
            </div>
          </div>
          <div className="flex gap-1 rounded-md bg-bg-raised p-0.5">
            <ViewToggle
              active={view === 'grid'}
              onClick={() => setView('grid')}
              ariaLabel={t('list.view.grid')}
            >
              <Icon.grid />
            </ViewToggle>
            <ViewToggle
              active={view === 'list'}
              onClick={() => setView('list')}
              ariaLabel={t('list.view.list')}
            >
              <Icon.list />
            </ViewToggle>
          </div>
        </div>

        {/* Search input */}
        <div className="relative mb-2.5">
          <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-text-muted">
            <Icon.search />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('editor.search.placeholder')}
            aria-label={t('editor.search.placeholder')}
            className="block h-9 w-full rounded-md border border-border-subtle bg-bg-input px-9 text-sm text-text-primary outline-none"
          />
          <span
            title={t('editor.search.kbd_focus_hint')}
            className="absolute end-2.5 top-1/2 -translate-y-1/2 rounded-sm bg-bg-raised px-1.5 py-0.5 font-mono text-tiny leading-none text-text-faint"
          >
            /
          </span>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Pill active>
            {t('editor.search.filter_class', { value: 'Wizard' })} <Icon.chevron />
          </Pill>
          <Pill>
            {t('editor.search.filter_type')} <Icon.chevron />
          </Pill>
          <Pill
            active={pitchFilter !== null}
            onClick={() => setPitchFilter(pitchFilter ? null : 2)}
          >
            <PitchFilterChipBody pitch={pitchFilter} />
            <Icon.chevron />
          </Pill>
          <button
            type="button"
            onClick={() => setAdvOpen((o) => !o)}
            className="ms-1 inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs text-text-secondary transition-colors duration-fast hover:bg-bg-raised hover:text-text-primary"
          >
            <Icon.filter /> {tCatalog('browse.filter.advanced')}
          </button>
          <span className="ms-auto font-mono text-tiny text-text-muted">
            {t('editor.search.match_count', { n: filtered.length, shown: filtered.length })}
          </span>
        </div>

        {advOpen && (
          <div className="mt-2.5 grid grid-cols-4 gap-3 rounded-lg border border-border-subtle bg-bg-raised p-3">
            {ADVANCED_FIELDS.map((f) => (
              <div key={f.key}>
                <div className="mb-1 text-2xs font-medium uppercase tracking-widest text-text-muted">
                  {t(f.key)}
                </div>
                <div className="flex h-7 items-center rounded-md border border-border-subtle bg-bg-input px-2.5 text-tiny text-text-faint">
                  {t('editor.search.advanced_field_any')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card grid */}
      <div className="flex-1 overflow-auto p-4">
        <div
          className="grid gap-3"
          // eslint-disable-next-line react/forbid-dom-props -- responsive auto-fill grid template; no Tailwind utility
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(122px, 1fr))' }}
        >
          {filtered.map((c) => {
            const tile = (
              <CardTile
                card={c}
                inDeck={deckQtyById[c.id] ?? 0}
                {...(onAdd ? { onAdd } : {})}
                {...(onCardClick ? { onClick: onCardClick } : {})}
              />
            );
            return (
              <div
                key={c.id}
                onMouseEnter={() => onCardHover?.(c)}
                onFocus={() => onCardHover?.(c)}
              >
                {tile}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function ViewToggle({
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
      aria-pressed={active}
      aria-label={ariaLabel}
      className={`flex h-6 w-7 items-center justify-center rounded-sm ${tone}`}
    >
      {children}
    </button>
  );
}

function PitchFilterChipBody({ pitch }: { pitch: 1 | 2 | 3 | null }) {
  const { t } = useTranslation('deck');
  const { t: tCommon } = useTranslation('common');
  if (pitch) {
    return (
      <span className="inline-flex items-center gap-1">
        {tCommon('pitch.label_short')} ·{' '}
        <PitchDot pitch={pitch} size={7} /> <span className="font-mono">{pitch}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1">
      {tCommon('pitch.label_short')} · <PitchDot pitch={1} size={6} />
      <PitchDot pitch={2} size={6} /> <PitchDot pitch={3} size={6} />
      <span className="text-text-muted">{t('editor.search.filter_pitch_any')}</span>
    </span>
  );
}

const ADVANCED_FIELDS = [
  { key: 'editor.advanced_field.cost' },
  { key: 'editor.advanced_field.talent' },
  { key: 'editor.advanced_field.set' },
  { key: 'editor.advanced_field.rarity' },
  { key: 'editor.advanced_field.power' },
  { key: 'editor.advanced_field.defense' },
  { key: 'editor.advanced_field.keywords' },
  { key: 'editor.advanced_field.format' },
] as const;
