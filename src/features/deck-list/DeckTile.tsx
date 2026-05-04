import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DeckSummary } from '../../domain/types';
import { getHero } from '../../domain/heroes';
import { Icon } from '../../components/Icon';
import { ValidityBadge } from '../../components/ValidityBadge';
import { TileMenu } from './TileMenu';

// Demo deck hardcoded violation count — when wiring real validation, swap to
// the count returned by the validation engine.
const DEMO_VIOLATION_COUNT = 3;

type Props = {
  deck: DeckSummary;
};

export function DeckTile({ deck }: Props) {
  const { t } = useTranslation('deck');
  const { t: commonT } = useTranslation('common');
  const [hover, setHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const hero = getHero(deck.heroId);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setMenuOpen(false);
      }}
      className="group relative cursor-pointer overflow-hidden rounded-xl border bg-bg-raised transition-colors duration-fast hover:border-border-default hover:bg-bg-overlay"
      style={{ borderColor: hover ? 'var(--border-default)' : 'var(--border-subtle)' }}
    >
      {/* Hero portrait area — locked to 5:7 to match card art ratio */}
      <div
        className="relative flex aspect-card items-center justify-center"
        style={{
          background: `radial-gradient(70% 70% at 50% 30%, oklch(0.45 0.13 ${hero.hue}) 0%, oklch(0.16 0.07 ${hero.hue}) 80%)`,
        }}
      >
        <div
          aria-hidden="true"
          className="font-sans font-bold"
          style={{
            fontSize: 96,
            color: 'rgba(255,255,255,0.85)',
            letterSpacing: '-0.04em',
            textShadow: '0 2px 12px rgba(0,0,0,0.4)',
          }}
        >
          {hero.initial}
        </div>
        <span
          className="absolute bottom-3 left-3.5 font-medium uppercase"
          style={{
            color: 'rgba(255,255,255,0.78)',
            fontSize: 9.5,
            letterSpacing: '0.1em',
          }}
        >
          {hero.cls}
        </span>
        {/* Tile menu trigger */}
        <div className="absolute right-2 top-2">
          {hover && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((o) => !o);
              }}
              aria-label={t('list.tile.menu')}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur"
            >
              <Icon.more />
            </button>
          )}
          {menuOpen && <TileMenu onClose={() => setMenuOpen(false)} />}
        </div>
      </div>
      <div className="p-3.5">
        <div className="mb-1 flex items-center gap-1.5">
          <VisibilityIcon visibility={deck.visibility} />
          <span
            className="text-[14px] font-semibold text-text-primary"
            style={{ letterSpacing: '-0.005em' }}
          >
            {deck.name}
          </span>
        </div>
        <div className="mb-2.5 text-[11.5px] text-text-muted">{hero.name}</div>
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span
            className="font-medium uppercase text-text-muted"
            style={{ fontSize: 9.5, letterSpacing: '0.1em' }}
          >
            {deck.format.split(' ')[0]}
          </span>
          <span className="font-mono text-text-secondary">{deck.count}</span>
          {deck.valid ? (
            <ValidityBadge legal compact />
          ) : (
            <ValidityBadge
              legal={false}
              customLabel={commonT('validity.issues_short', { count: DEMO_VIOLATION_COUNT })}
              compact
            />
          )}
          <span className="ms-auto text-text-faint">{deck.editedRelative}</span>
        </div>
      </div>
    </div>
  );
}

function VisibilityIcon({ visibility }: { visibility: DeckSummary['visibility'] }) {
  if (visibility === 'private') return <span className="text-text-muted"><Icon.lock /></span>;
  if (visibility === 'unlisted') return <span className="text-text-muted"><Icon.link /></span>;
  return <span className="text-text-muted"><Icon.globe /></span>;
}
