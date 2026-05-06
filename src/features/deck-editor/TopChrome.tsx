import { useTranslation } from 'react-i18next';
import { Icon } from '../../components/Icon';
import { ValidityBadge } from '../../components/ValidityBadge';
import { getHero } from '../../domain/heroes';

type Props = {
  deckTitle: string;
  validation: 'legal' | 'illegal';
  variants: boolean;
  activeTab: string;
  poolCount: number;
  loadoutCount: number;
  onShowDrawer?: () => void;
};

export function TopChrome({
  deckTitle,
  validation,
  variants,
  activeTab,
  poolCount,
  loadoutCount,
  onShowDrawer,
}: Props) {
  const { t } = useTranslation('deck');
  const { t: tCommon } = useTranslation('common');
  const isPool = variants && activeTab === 'Pool';
  const count = isPool ? poolCount : loadoutCount;
  const cap = isPool ? 80 : 60;
  const heroClass = getHero('iyslander').cls;

  return (
    <>
      {/* Header bar (56px) */}
      <header className="flex h-14 flex-shrink-0 items-center gap-6 border-b border-border-subtle bg-bg-base px-5">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-brand text-sm font-bold tracking-display text-white">
            C
          </span>
          <span className="text-sm font-semibold tracking-heading">{tCommon('app.name')}</span>
        </div>
        <nav className="ms-4 flex gap-1">
          <NavLink active>{tCommon('nav.deck_builder')}</NavLink>
          <NavLink>{tCommon('nav.my_decks')}</NavLink>
          <NavLink>{tCommon('nav.browse_cards')}</NavLink>
        </nav>
        <div className="ms-auto flex items-center gap-2">
          <button
            type="button"
            aria-label={tCommon('actions.search')}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-text-secondary transition-colors duration-fast hover:bg-bg-raised hover:text-text-primary"
          >
            <Icon.search />
          </button>
          <span
            aria-hidden="true"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-avatar-fallback text-xs font-semibold text-white"
          >
            JM
          </span>
        </div>
      </header>

      {/* Deck context bar (48px) */}
      <div className="flex h-12 flex-shrink-0 items-center gap-3 border-b border-border-subtle bg-bg-base px-5">
        <button
          type="button"
          aria-label={t('editor.back_to_decks')}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-text-secondary transition-colors duration-fast hover:bg-bg-raised hover:text-text-primary"
        >
          <Icon.arrowLeft />
        </button>
        <div className="flex min-w-0 items-baseline gap-2.5">
          <span className="text-sm font-semibold tracking-heading text-text-primary">
            {deckTitle}
          </span>
          <span className="text-2xs font-medium uppercase tracking-widest text-text-faint">
            {t('editor.rename_hint')}
          </span>
        </div>
        <div className="ms-3.5 flex items-center gap-2">
          <span className="inline-flex h-5 items-center gap-1.5 rounded-full border border-border-subtle bg-bg-raised px-3 text-tiny font-medium text-text-secondary">
            {heroClass}
          </span>
          <span
            className="inline-flex h-5 items-center gap-1.5 rounded-full border border-border-subtle bg-bg-raised px-3 text-tiny font-medium text-text-secondary"
            title={isPool ? t('editor.capacity.pool') : ''}
          >
            <span className="font-mono">
              {count}/{cap}
            </span>
            {isPool && (
              <span className="text-2xs font-medium uppercase tracking-widest text-text-faint">
                {t('editor.capacity.pool')}
              </span>
            )}
          </span>
          <button type="button" onClick={onShowDrawer} className="bg-transparent">
            {validation === 'illegal' ? (
              <ValidityBadge
                legal={false}
                customLabel={tCommon('validity.violations', { count: 3 })}
              />
            ) : (
              <ValidityBadge legal={true} />
            )}
          </button>
        </div>
        <div className="ms-auto flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-tiny text-text-muted">
            <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-state-success" />
            {t('editor.saved_seconds_ago', { seconds: 2 })}
          </span>
          <button
            type="button"
            className="inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs text-text-secondary transition-colors duration-fast hover:bg-bg-raised hover:text-text-primary"
          >
            <Icon.plus /> {t('editor.variant')}
          </button>
          <button
            type="button"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border-subtle bg-bg-raised px-3 text-sm font-medium text-text-primary transition-colors duration-fast hover:bg-bg-overlay"
          >
            <Icon.share /> {tCommon('actions.share')}
          </button>
          <button
            type="button"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border-subtle bg-bg-raised px-3 text-sm font-medium text-text-primary transition-colors duration-fast hover:bg-bg-overlay"
          >
            <Icon.download /> {tCommon('actions.export')}
          </button>
          <button
            type="button"
            aria-label={tCommon('actions.more_options')}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-text-secondary transition-colors duration-fast hover:bg-bg-raised hover:text-text-primary"
          >
            <Icon.more />
          </button>
        </div>
      </div>
    </>
  );
}

function NavLink({ active = false, children }: { active?: boolean; children: React.ReactNode }) {
  const tone = active ? 'bg-bg-raised text-text-primary' : 'bg-transparent text-text-secondary';
  return (
    <span className={`cursor-pointer rounded-md px-2.5 py-1.5 text-sm font-medium ${tone}`}>
      {children}
    </span>
  );
}
