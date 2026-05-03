import { useTranslation } from 'react-i18next';

// First focusable element on every layout, per .claude/rules/accessibility.md.
// Hidden until focused, then jumps the user past the global chrome to <main>.
export function SkipToContent() {
  const { t } = useTranslation('common');
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-bg-overlay focus:px-4 focus:py-2 focus:text-text-primary"
    >
      {t('home.skip_to_content')}
    </a>
  );
}
