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
    <div className={`flex items-center gap-3 ${compact ? 'py-1' : 'py-1.5'}`}>
      <HeroAvatar heroId={heroId} size={compact ? 36 : 44} />
      <div className="min-w-0 flex-1">
        <div
          className={`font-semibold leading-tight tracking-heading text-text-primary ${compact ? 'text-xs' : 'text-sm'}`}
        >
          {hero.name}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 text-tiny text-text-muted">
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
