// Config for `pnpm i18n:extract`.
//
// Walks src/ for `t(...)` calls and `<Trans>` components, then writes the
// keys it finds into src/i18n/locales/en/<namespace>.json.
//
// The pre-commit hook reruns this and fails if the output drifts from what
// is committed — same posture as the backend's openapi.json freshness check.

import type { UserConfig } from 'i18next-parser';

const config: UserConfig = {
  defaultNamespace: 'common',
  defaultValue: (_locale, _namespace, _key, value) => value ?? '',
  keepRemoved: false,
  keySeparator: '.',
  namespaceSeparator: ':',
  locales: ['en'],
  output: 'src/i18n/locales/$LOCALE/$NAMESPACE.json',
  input: ['src/**/*.{ts,tsx}'],
  sort: true,
  failOnWarnings: false,
  failOnUpdate: false,
  createOldCatalogs: false,
  // Pin to LF so the pre-commit drift check is platform-independent — without
  // this, parser runs on Windows write CRLF and disagree with the LF-committed
  // baseline.
  lineEnding: 'lf',
  contextSeparator: '_',
  pluralSeparator: '_',
  lexers: {
    ts: ['JavascriptLexer'],
    tsx: ['JsxLexer'],
    default: ['JavascriptLexer'],
  },
};

export default config;
