// Augments react-i18next's `t()` so keys are checked against the English
// locale JSON at compile time. New keys light up as type errors until the
// JSON is updated. See .claude/rules/i18n.md.

import 'i18next';
import type commonEn from './locales/en/common.json';
import type errorsEn from './locales/en/errors.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof commonEn;
      errors: typeof errorsEn;
    };
    returnNull: false;
  }
}
