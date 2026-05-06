import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';

type ActiveKey = 'editor' | 'decks' | 'browse';

type Props = {
  active?: ActiveKey;
  signedIn?: boolean;
};

// Site chrome shown on every screen except the deck editor (which has its
// own context-bar). Logo + nav + sign-in/avatar.
export function GlobalHeader({ active = 'decks', signedIn = true }: Props) {
  const { t } = useTranslation('common');
  return (
    <header className="flex h-14 flex-shrink-0 items-center gap-6 border-b border-border-subtle bg-bg-base px-6">
      <Link to="/" className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-brand text-sm font-bold tracking-display text-white">
          C
        </span>
        <span className="text-sm font-semibold tracking-heading">{t('app.name')}</span>
      </Link>
      <nav className="flex gap-1">
        <NavLink to="/decks/new" active={active === 'editor'}>
          {t('nav.deck_builder')}
        </NavLink>
        <NavLink to="/" active={active === 'decks'}>
          {t('nav.my_decks')}
        </NavLink>
        <NavLink to="/browse" active={active === 'browse'}>
          {t('nav.browse_cards')}
        </NavLink>
      </nav>
      <div className="ms-auto flex items-center gap-2">
        {signedIn ? (
          <span
            aria-hidden="true"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-avatar-fallback text-xs font-semibold text-white"
          >
            JM
          </span>
        ) : (
          <Link
            to="/sign-in"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border-subtle bg-bg-raised px-3.5 text-sm font-medium text-text-primary transition-colors duration-fast hover:bg-bg-overlay"
          >
            {t('actions.sign_in')}
          </Link>
        )}
      </div>
    </header>
  );
}

function NavLink({
  to,
  active,
  children,
}: {
  to: '/' | '/browse' | '/decks/new';
  active: boolean;
  children: ReactNode;
}) {
  const tone = active
    ? 'bg-bg-raised text-text-primary'
    : 'bg-transparent text-text-secondary';
  return (
    <Link
      to={to}
      className={`rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors duration-fast ${tone}`}
    >
      {children}
    </Link>
  );
}
