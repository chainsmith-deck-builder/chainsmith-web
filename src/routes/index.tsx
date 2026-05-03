import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/')({
  component: HomePage,
});

export function HomePage() {
  const { t } = useTranslation('common');

  // Literal t() calls so i18next-parser can statically extract the keys —
  // a template-string key would silently drop out of the locale JSON. See
  // .claude/rules/i18n.md.
  const checklist = [
    t('home.items.stack'),
    t('home.items.routing'),
    t('home.items.styling'),
    t('home.items.i18n'),
    t('home.items.tests'),
    t('home.items.lint'),
  ];

  return (
    <main
      id="main-content"
      aria-label={t('home.main_landmark')}
      className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center gap-8 px-6 py-16"
    >
      <header className="space-y-3">
        <p className="font-mono text-sm uppercase tracking-widest text-text-muted">
          {t('app.name')}
        </p>
        <h1 className="text-4xl font-semibold text-text-primary sm:text-5xl">{t('home.title')}</h1>
        <p className="max-w-prose text-text-muted">{t('home.subtitle')}</p>
      </header>
      <section
        aria-labelledby="checklist-heading"
        className="rounded-xl border border-border-subtle bg-bg-raised p-6"
      >
        <h2
          id="checklist-heading"
          className="font-mono text-xs uppercase tracking-widest text-text-muted"
        >
          {t('home.checklist_heading')}
        </h2>
        <ul className="mt-4 space-y-2 text-text-primary">
          {checklist.map((text) => (
            <li key={text} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent-brand"
              />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
