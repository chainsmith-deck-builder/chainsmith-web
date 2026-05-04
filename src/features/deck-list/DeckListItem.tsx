import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DeckSummary } from '../../domain/types';
import { getHero } from '../../domain/heroes';
import { Icon } from '../../components/Icon';
import { ValidityBadge } from '../../components/ValidityBadge';
import { TileMenu } from './TileMenu';

type Props = {
  deck: DeckSummary;
  divider: boolean;
};

export function DeckListItem({ deck, divider }: Props) {
  const { t } = useTranslation('deck');
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
      className="relative flex cursor-pointer items-center gap-3.5 px-3.5 py-2.5 transition-colors duration-fast"
      style={{
        background: hover ? 'var(--bg-overlay)' : 'transparent',
        borderTop: divider ? '1px solid var(--border-subtle)' : 'none',
      }}
    >
      <div
        aria-hidden="true"
        className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full font-semibold text-[#F2EEE6]"
        style={{
          background: `radial-gradient(60% 60% at 30% 25%, oklch(0.55 0.14 ${hero.hue}) 0%, oklch(0.22 0.08 ${hero.hue}) 80%)`,
          fontSize: 22,
          letterSpacing: '-0.02em',
        }}
      >
        {hero.initial}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center gap-1.5">
          <VisibilityIcon visibility={deck.visibility} />
          <span className="text-[14px] font-semibold" style={{ letterSpacing: '-0.005em' }}>
            {deck.name}
          </span>
        </div>
        <div className="text-[11.5px] text-text-muted">
          {hero.name} · {hero.cls}
        </div>
      </div>
      <span
        className="font-medium uppercase text-text-muted"
        style={{ width: 110, fontSize: 9.5, letterSpacing: '0.1em' }}
      >
        {deck.format}
      </span>
      <span
        className="text-end font-mono text-[12px] text-text-secondary"
        style={{ width: 50 }}
      >
        {deck.count}
      </span>
      <span style={{ width: 100, fontSize: 11 }}>
        <ValidityBadge legal={deck.valid} compact />
      </span>
      <span className="text-end text-text-faint" style={{ width: 90, fontSize: 11 }}>
        {deck.editedRelative}
      </span>
      <div className="relative" style={{ width: 28 }}>
        {hover && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((o) => !o);
            }}
            aria-label={t('list.tile.menu')}
            className="flex h-6 w-6 items-center justify-center rounded-md border border-border-subtle bg-bg-elevated text-text-secondary"
          >
            <Icon.more />
          </button>
        )}
        {menuOpen && <TileMenu onClose={() => setMenuOpen(false)} />}
      </div>
    </div>
  );
}

function VisibilityIcon({ visibility }: { visibility: DeckSummary['visibility'] }) {
  if (visibility === 'private') return <span className="text-text-muted"><Icon.lock /></span>;
  if (visibility === 'unlisted') return <span className="text-text-muted"><Icon.link /></span>;
  return <span className="text-text-muted"><Icon.globe /></span>;
}
