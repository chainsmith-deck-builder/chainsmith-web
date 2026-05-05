import { useTranslation } from 'react-i18next';

import type { Hero } from '../../api/types';
import {
  presentationStatusFor,
  type PresentationStatus,
  type UiFormatId,
} from '../../api/format';
import { heroHue, heroInitial } from './heroPresentation';

type Props = {
  hero: Hero;
  format: UiFormatId;
  isPicked: boolean;
  onPick: (id: string) => void;
};

export function HeroTile({ hero, format, isPicked, onPick }: Props) {
  const { t } = useTranslation('deck');
  const { t: tCommon } = useTranslation('common');
  const { t: tCatalog } = useTranslation('catalog');
  const status = presentationStatusFor(hero.legalitySummary, format);
  const isEligible = status === 'legal';
  const initial = heroInitial(hero.name);
  const hue = heroHue(hero.name);
  const primaryClass = hero.classes[0];
  const className = primaryClass ? tCatalog(`class.${primaryClass}`) : '';
  const imageUrl = hero.defaultPrinting?.imageUrl ?? null;

  const overlayLabel = overlayLabelFor(status, format, tCommon);
  const tileLabel = tileLabelFor(status, t);

  return (
    <button
      type="button"
      onClick={() => isEligible && onPick(hero.id)}
      disabled={!isEligible}
      aria-disabled={!isEligible}
      title={!isEligible ? overlayLabel ?? undefined : undefined}
      aria-label={hero.name}
      className="overflow-hidden rounded-xl border bg-bg-raised text-start transition-all duration-fast disabled:cursor-not-allowed"
      style={{
        borderColor: isPicked ? 'var(--accent-brand)' : 'var(--border-subtle)',
        boxShadow: isPicked ? '0 0 0 3px var(--accent-brand-soft)' : 'none',
        opacity: isEligible ? 1 : 0.42,
        filter: isEligible ? 'none' : 'saturate(0.4)',
      }}
    >
      <div
        className="relative flex aspect-card items-center justify-center"
        style={{
          background: `radial-gradient(80% 80% at 50% 25%, oklch(0.5 0.15 ${hue}) 0%, oklch(0.18 0.08 ${hue}) 80%)`,
        }}
      >
        {imageUrl ? (
          // Full card image: the upstream the-fab-cube dataset doesn't
          // publish portrait-only crops, and per-card transform crops look
          // uneven across set frames. The 5:7 tile slot matches a card's
          // own aspect, so showing the full card reads as a hero card.
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="font-bold"
            style={{
              fontSize: 96,
              color: 'rgba(255,255,255,0.85)',
              letterSpacing: '-0.04em',
            }}
          >
            {initial}
          </span>
        )}
        {overlayLabel !== null && (
          <span
            className="absolute left-2.5 top-2.5 rounded-sm px-2 py-0.5 font-semibold uppercase backdrop-blur"
            style={{
              fontSize: 11,
              letterSpacing: '0.02em',
              background: status === 'retired' ? 'rgba(199, 138, 41, 0.7)' : 'rgba(0,0,0,0.6)',
              color: 'rgba(255,255,255,0.92)',
            }}
          >
            {overlayLabel}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="text-[15px] font-semibold" style={{ letterSpacing: '-0.005em' }}>
          {hero.name}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[12.5px] text-text-muted">
          <span>{className}</span>
          <span>·</span>
          <span className="font-mono">{t('hero_select.tile.life_amount', { n: hero.life })}</span>
          <span
            className="ms-auto rounded-sm px-2 py-0.5 font-medium"
            style={tileLabelStyle(status)}
          >
            {tileLabel}
          </span>
        </div>
      </div>
    </button>
  );
}

function overlayLabelFor(
  status: PresentationStatus,
  format: UiFormatId,
  tCommon: ReturnType<typeof useTranslation<'common'>>['t'],
): string | null {
  if (status === 'legal') return null;
  if (status === 'retired') return tCommon('validity.retired_to_ll');
  return tCommon('validity.not_legal_in', { format: tCommon(`format_short.${format}`) });
}

function tileLabelFor(
  status: PresentationStatus,
  t: ReturnType<typeof useTranslation<'deck'>>['t'],
): string {
  switch (status) {
    case 'legal':
      return t('hero_select.tile.legal');
    case 'retired':
      return t('hero_select.tile.retired');
    case 'ineligible':
      return t('hero_select.tile.locked');
  }
}

function tileLabelStyle(status: PresentationStatus): React.CSSProperties {
  if (status === 'legal') {
    return {
      fontSize: 11,
      background: 'var(--state-success-soft)',
      color: 'var(--state-success)',
    };
  }
  if (status === 'retired') {
    return {
      fontSize: 11,
      background: 'var(--state-warning-soft)',
      color: 'var(--state-warning)',
    };
  }
  return {
    fontSize: 11,
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-faint)',
  };
}
