import type { Format, Hero } from '../../domain/types';
import { useTranslation } from 'react-i18next';

type Props = {
  hero: Hero;
  format: Format;
  isPicked: boolean;
  onPick: (id: string) => void;
};

export function HeroTile({ hero, format, isPicked, onPick }: Props) {
  const { t } = useTranslation('deck');
  const { t: tCommon } = useTranslation('common');
  const isEligible = hero.formats.includes(format);
  return (
    <button
      type="button"
      onClick={() => isEligible && onPick(hero.id)}
      disabled={!isEligible}
      aria-disabled={!isEligible}
      title={!isEligible ? tCommon('validity.not_legal_in', { format }) : undefined}
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
          background: `radial-gradient(80% 80% at 50% 25%, oklch(0.5 0.15 ${hero.hue}) 0%, oklch(0.18 0.08 ${hero.hue}) 80%)`,
        }}
      >
        <span
          aria-hidden="true"
          className="font-bold"
          style={{
            fontSize: 64,
            color: 'rgba(255,255,255,0.85)',
            letterSpacing: '-0.04em',
          }}
        >
          {hero.initial}
        </span>
        {!isEligible && (
          <span
            className="absolute left-2 top-2 rounded-sm bg-black/60 px-1.5 py-0.5 font-semibold uppercase text-white/85 backdrop-blur"
            style={{ fontSize: 10, letterSpacing: '0.02em' }}
          >
            {tCommon('validity.not_legal_in', { format: format.split(' ')[0] })}
          </span>
        )}
      </div>
      <div className="p-3">
        <div className="text-[13px] font-semibold" style={{ letterSpacing: '-0.005em' }}>
          {hero.name}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-text-muted">
          <span>{hero.cls}</span>
          <span>·</span>
          <span className="font-mono">{t('hero_select.tile.life_amount', { n: hero.life })}</span>
          <span
            className="ms-auto rounded-sm px-1.5 py-0.5 font-medium"
            style={{
              fontSize: 10,
              background: isEligible ? 'var(--state-success-soft)' : 'transparent',
              border: isEligible ? 'none' : '1px solid var(--border-subtle)',
              color: isEligible ? 'var(--state-success)' : 'var(--text-faint)',
            }}
          >
            {isEligible ? t('hero_select.tile.legal') : t('hero_select.tile.locked')}
          </span>
        </div>
      </div>
    </button>
  );
}
