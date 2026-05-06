import { useTranslation } from 'react-i18next';
import { Icon } from '../../components/Icon';

export function SignInScreen() {
  const { t } = useTranslation('account');
  const { t: tCommon } = useTranslation('common');
  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg-base p-5 text-text-primary">
      <main
        id="main-content"
        aria-label={t('sign_in.title')}
        className="w-full max-w-sm"
      >
        <div className="mb-6 flex items-center justify-center gap-2">
          <span
            aria-hidden="true"
            className="flex h-7 w-7 items-center justify-center rounded-md bg-accent-brand text-sm font-bold text-white"
          >
            C
          </span>
          <span className="text-base font-semibold tracking-heading">{tCommon('app.name')}</span>
        </div>

        <div className="rounded-xl border border-border-subtle bg-bg-raised p-7">
          <h1 className="m-0 mb-1.5 text-xl font-semibold tracking-heading">
            {t('sign_in.title')}
          </h1>
          <p className="m-0 mb-5 text-xs text-text-muted">{t('sign_in.subtitle')}</p>

          <SignInField label={t('sign_in.email_label')} type="email" autoComplete="email" />
          <SignInField
            label={t('sign_in.password_label')}
            type="password"
            autoComplete="current-password"
          />

          <button
            type="submit"
            className="mt-1 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md bg-accent-brand text-sm font-medium text-white transition-colors duration-fast hover:bg-accent-brand-hover"
          >
            {t('sign_in.submit')}
          </button>

          <a
            href="#forgot"
            className="mt-3.5 block text-center text-tiny text-text-muted hover:text-text-secondary"
          >
            {t('sign_in.forgot_password')}
          </a>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border-subtle" />
            <span className="text-2xs font-medium uppercase tracking-widest text-text-faint">
              {t('sign_in.or_continue_with')}
            </span>
            <div className="h-px flex-1 bg-border-subtle" />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md border border-border-subtle bg-bg-raised text-sm font-medium text-text-primary transition-colors duration-fast hover:bg-bg-overlay"
            >
              <Icon.google /> {t('sign_in.continue_google')}
            </button>
            <button
              type="button"
              className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md border border-border-subtle bg-bg-raised text-sm font-medium text-text-primary transition-colors duration-fast hover:bg-bg-overlay"
            >
              <Icon.discord /> {t('sign_in.continue_discord')}
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-text-muted">
          {t('sign_in.no_account_prompt')}{' '}
          <a href="#sign-up" className="font-medium text-accent-brand">
            {t('sign_in.sign_up')}
          </a>
        </p>
      </main>
    </div>
  );
}

function SignInField({
  label,
  type,
  autoComplete,
}: {
  label: string;
  type: 'email' | 'password';
  autoComplete: string;
}) {
  return (
    <div className="mb-3">
      <label className="mb-1.5 block text-tiny font-medium uppercase tracking-widest text-text-muted">
        {label}
      </label>
      <input
        type={type}
        autoComplete={autoComplete}
        aria-label={label}
        className="block h-9 w-full rounded-md border border-border-subtle bg-bg-input px-3 text-sm text-text-primary outline-none"
      />
    </div>
  );
}
