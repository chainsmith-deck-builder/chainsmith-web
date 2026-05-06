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
      className={`relative flex cursor-pointer items-center gap-3.5 px-3.5 py-2.5 transition-colors duration-fast ${hover ? 'bg-bg-overlay' : 'bg-transparent'} ${divider ? 'border-t border-border-subtle' : ''}`}
    >
      <div
        aria-hidden="true"
        className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-xl font-semibold tracking-tight text-text-on-art"
        // eslint-disable-next-line react/forbid-dom-props -- per-hero gradient hue, no token equivalent
        style={{
          background: `radial-gradient(60% 60% at 30% 25%, oklch(0.55 0.14 ${hero.hue}) 0%, oklch(0.22 0.08 ${hero.hue}) 80%)`,
        }}
      >
        {hero.initial}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center gap-1.5">
          <VisibilityIcon visibility={deck.visibility} />
          <span className="text-sm font-semibold tracking-heading">{deck.name}</span>
        </div>
        <div className="text-tiny text-text-muted">
          {hero.name} · {hero.cls}
        </div>
      </div>
      <span className="w-28 text-2xs font-medium uppercase tracking-widest text-text-muted">
        {deck.format}
      </span>
      <span className="w-12 text-end font-mono text-xs text-text-secondary">{deck.count}</span>
      <span className="w-24 text-tiny">
        <ValidityBadge legal={deck.valid} compact />
      </span>
      <span className="w-24 text-end text-tiny text-text-faint">{deck.editedRelative}</span>
      <div className="relative w-7">
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
