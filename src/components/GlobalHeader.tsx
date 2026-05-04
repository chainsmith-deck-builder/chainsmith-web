import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';

type Props = {
  active?: 'editor' | 'decks' | 'browse';
  signedIn?: boolean;
};

// Site chrome shown on every screen except the deck editor (which has its
// own context-bar). Logo + nav + sign-in/avatar.
export function GlobalHeader({ active = 'decks', signedIn = true }: Props) {
  const { t } = useTranslation('common');
  return (
    <header className="flex h-14 flex-shrink-0 items-center gap-6 border-b border-border-subtle bg-bg-base px-6">
      <Link to="/" className="flex items-center gap-2">
        <span
          className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-brand text-[13px] font-bold text-white"
          style={{ letterSpacing: '-0.04em' }}
        >
          C
        </span>
        <span className="text-[14.5px] font-semibold" style={{ letterSpacing: '-0.01em' }}>
          {t('app.name')}
        </span>
      </Link>
      <nav className="flex gap-1">
        <NavLink active={active === 'editor'}>{t('nav.deck_builder')}</NavLink>
        <NavLink active={active === 'decks'}>{t('nav.my_decks')}</NavLink>
        <NavLink active={active === 'browse'}>{t('nav.browse_cards')}</NavLink>
      </nav>
      <div className="ms-auto flex items-center gap-2">
        {signedIn ? (
          <span
            aria-hidden="true"
            className="flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-semibold text-white"
            style={{ background: 'oklch(0.5 0.10 30)' }}
          >
            JM
          </span>
        ) : (
          <button
            type="button"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border-subtle bg-bg-raised px-3.5 text-[13px] font-medium text-text-primary transition-colors duration-fast hover:bg-bg-overlay"
          >
            {t('actions.sign_in')}
          </button>
        )}
      </div>
    </header>
  );
}

function NavLink({ active = false, children }: { active?: boolean; children: React.ReactNode }) {
  return (
    <span
      className="cursor-pointer rounded-md px-2.5 py-1.5 text-[13px] font-medium"
      style={{
        color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
        background: active ? 'var(--bg-raised)' : 'transparent',
      }}
    >
      {children}
    </span>
  );
}
