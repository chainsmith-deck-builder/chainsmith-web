// Augments react-i18next's `t()` so keys are checked against the English
// locale JSON at compile time. New keys light up as type errors until the
// JSON is updated. See .claude/rules/i18n.md.

import 'i18next';
import type commonEn from './locales/en/common.json';
import type errorsEn from './locales/en/errors.json';
import type deckEn from './locales/en/deck.json';
import type catalogEn from './locales/en/catalog.json';
import type accountEn from './locales/en/account.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof commonEn;
      errors: typeof errorsEn;
      deck: typeof deckEn;
      catalog: typeof catalogEn;
      account: typeof accountEn;
    };
    returnNull: false;
    // ICU MessageFormat uses single braces for placeholders. Tell i18next's
    // TypeScript-side template parser to recognize `{name}` rather than the
    // default `{{name}}` so `t(key, { name })` typechecks.
    interpolationPrefix: '{';
    interpolationSuffix: '}';
  }
}
