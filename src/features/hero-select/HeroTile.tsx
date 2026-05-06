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

  const pickedTone = isPicked
    ? 'border-accent-brand ring-3 ring-accent-brand-soft'
    : 'border-border-subtle';
  const eligibilityTone = isEligible ? '' : 'opacity-40 saturate-50';
  return (
    <button
      type="button"
      onClick={() => isEligible && onPick(hero.id)}
      disabled={!isEligible}
      aria-disabled={!isEligible}
      aria-pressed={isEligible ? isPicked : undefined}
      title={!isEligible ? (overlayLabel ?? undefined) : undefined}
      aria-label={hero.name}
      className={`overflow-hidden rounded-xl border bg-bg-raised text-start transition-all duration-fast disabled:cursor-not-allowed ${pickedTone} ${eligibilityTone}`}
    >
      <div
        className="relative flex aspect-card items-center justify-center"
        // eslint-disable-next-line react/forbid-dom-props -- per-hero gradient hue, no token equivalent
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
            className="text-8xl font-bold tracking-display text-white/85"
          >
            {initial}
          </span>
        )}
        {overlayLabel !== null && (
          <span
            className={`absolute start-2.5 top-2.5 rounded-sm px-2 py-0.5 text-tiny font-semibold uppercase tracking-wide text-white/90 backdrop-blur ${status === 'retired' ? 'bg-state-warning/70' : 'bg-black/60'}`}
          >
            {overlayLabel}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="text-base font-semibold tracking-heading">{hero.name}</div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-text-muted">
          <span>{className}</span>
          <span>·</span>
          <span className="font-mono">{t('hero_select.tile.life_amount', { n: hero.life })}</span>
          <span className={`ms-auto rounded-sm px-2 py-0.5 font-medium ${tileLabelClass(status)}`}>
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

function tileLabelClass(status: PresentationStatus): string {
  if (status === 'legal') return 'text-tiny bg-state-success-soft text-state-success';
  if (status === 'retired') return 'text-tiny bg-state-warning-soft text-state-warning';
  return 'text-tiny border border-border-subtle text-text-faint';
}
