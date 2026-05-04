import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GlobalHeader } from '../../components/GlobalHeader';
import { Button } from '../../components/Button';
import { Section } from './Section';
import { Field } from './Field';

type Theme = 'dark' | 'light';

export function AccountScreen() {
  const { t } = useTranslation('account');
  const [theme, setTheme] = useState<Theme>('dark');

  return (
    <div className="flex min-h-dvh flex-col overflow-auto bg-bg-base text-text-primary">
      <GlobalHeader active="decks" />
      <main
        id="main-content"
        aria-label={t('page_title')}
        className="mx-auto w-full flex-1"
        style={{ maxWidth: 800, padding: '32px 40px' }}
      >
        <h1
          className="mb-6 font-semibold"
          style={{ fontSize: 26, letterSpacing: '-0.015em' }}
        >
          {t('page_title')}
        </h1>

        <Section title={t('section.profile')}>
          <div className="mb-4 flex items-center gap-4">
            <div
              aria-hidden="true"
              className="flex h-14 w-14 items-center justify-center rounded-full text-[22px] font-semibold text-white"
              style={{ background: 'oklch(0.5 0.10 30)' }}
            >
              JM
            </div>
            <Button variant="secondary">{t('field.change_avatar')}</Button>
          </div>
          <Field label={t('field.display_name')} value="frostbrew" />
          <Field label={t('field.email')} value="jordan@example.com" readOnly />
        </Section>

        <Section title={t('section.preferences')}>
          <div className="mb-4">
            <div
              className="mb-1.5 font-medium uppercase text-text-muted"
              style={{ fontSize: 11.5, letterSpacing: '0.1em' }}
            >
              {t('field.theme')}
            </div>
            <div className="inline-flex rounded-md border border-border-subtle bg-bg-raised p-0.5">
              {(['dark', 'light'] as const).map((tone) => (
                <button
                  key={tone}
                  type="button"
                  onClick={() => setTheme(tone)}
                  aria-pressed={theme === tone}
                  className="rounded-sm px-3.5 py-1.5 text-[12px] font-medium"
                  style={{
                    background: theme === tone ? 'var(--bg-elevated)' : 'transparent',
                    color: theme === tone ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}
                >
                  {tone === 'dark' ? t('field.theme_dark') : t('field.theme_light')}
                </button>
              ))}
            </div>
          </div>
          <Field label={t('field.language')} value="English (United States)" select />
        </Section>

        <Section title={t('section.sign_out')}>
          <Button variant="secondary">{t('section.sign_out')}</Button>
        </Section>

        <Section title={t('section.delete_account')} danger>
          <p
            className="mb-3 text-[12.5px] text-text-muted"
            style={{ lineHeight: 1.5 }}
          >
            {t('delete.explanation')}
          </p>
          <Button variant="dangerOutline">{t('delete.button')}</Button>
        </Section>
      </main>
    </div>
  );
}
