import { useTranslation } from 'react-i18next';
import { HeroAvatar } from './HeroAvatar';
import { getHero } from '../domain/heroes';

type Props = {
  heroId: string;
  compact?: boolean;
};

export function HeroBlock({ heroId, compact = false }: Props) {
  const { t } = useTranslation('deck');
  const hero = getHero(heroId);
  return (
    <div
      className="flex items-center gap-3"
      style={{ padding: compact ? '4px 0' : '6px 0' }}
    >
      <HeroAvatar heroId={heroId} size={compact ? 36 : 44} />
      <div className="min-w-0 flex-1">
        <div
          className="font-semibold text-text-primary"
          style={{
            fontSize: compact ? 13 : 14.5,
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
          }}
        >
          {hero.name}
        </div>
        <div
          className="mt-0.5 flex items-center gap-1.5 text-text-muted"
          style={{ fontSize: 11.5 }}
        >
          <span>{hero.cls}</span>
          <span className="block h-0.5 w-0.5 rounded-full bg-text-faint" />
          <span className="font-mono">{t('hero_select.tile.life_amount', { n: hero.life })}</span>
          {hero.talents.length > 0 && (
            <>
              <span className="block h-0.5 w-0.5 rounded-full bg-text-faint" />
              <span>{hero.talents.join(' · ')}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
