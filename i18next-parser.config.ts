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
  // Conservative: never delete keys the parser doesn't see. The parser is a
  // static lexer — it doesn't track variable bindings — so any aliased call
  // like `tCommon('actions.duplicate')` that we miss in `lexers.functions`
  // would otherwise wipe valid keys out of the JSON on every extract.
  keepRemoved: true,
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
    // We alias `t` per namespace (`tCommon`, `tDeck`, `tCatalog`) when a file
    // reads from multiple namespaces. The parser doesn't follow the
    // `useTranslation('foo').t` binding, so list the alias names here or the
    // parser silently skips those calls.
    ts: [{ lexer: 'JavascriptLexer', functions: ['t', 'tCommon', 'tDeck', 'tCatalog'] }],
    tsx: [{ lexer: 'JsxLexer', functions: ['t', 'tCommon', 'tDeck', 'tCatalog'] }],
    default: [{ lexer: 'JavascriptLexer', functions: ['t', 'tCommon', 'tDeck', 'tCatalog'] }],
  },
};

export default config;
