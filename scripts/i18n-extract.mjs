// Wraps `i18next-parser` to normalize CRLF → LF on the emitted locale JSON.
// Without this the pre-commit drift check fails on Windows because the
// parser writes CRLF while the committed baseline is LF.

import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

execSync('i18next "src/**/*.{ts,tsx}"', { stdio: 'inherit' });

const localesDir = 'src/i18n/locales';
for (const locale of readdirSync(localesDir)) {
  const localeDir = join(localesDir, locale);
  if (!statSync(localeDir).isDirectory()) continue;
  for (const file of readdirSync(localeDir)) {
    if (!file.endsWith('.json')) continue;
    const path = join(localeDir, file);
    const original = readFileSync(path, 'utf8');
    const normalized = original.replace(/\r\n/g, '\n');
    if (normalized !== original) {
      writeFileSync(path, normalized);
    }
  }
}
