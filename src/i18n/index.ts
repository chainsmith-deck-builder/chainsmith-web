import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ICU from 'i18next-icu';

import commonEn from './locales/en/common.json';
import errorsEn from './locales/en/errors.json';
import deckEn from './locales/en/deck.json';
import catalogEn from './locales/en/catalog.json';
import accountEn from './locales/en/account.json';

export const defaultNS = 'common' as const;

export const resources = {
  en: {
    common: commonEn,
    errors: errorsEn,
    deck: deckEn,
    catalog: catalogEn,
    account: accountEn,
  },
} as const;

await i18next
  .use(ICU)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en'],
    defaultNS,
    ns: ['common', 'errors', 'deck', 'catalog', 'account'],
    resources,
    // React handles HTML escaping; i18next interpolation should not double-escape.
    interpolation: { escapeValue: false },
    detection: {
      order: ['htmlTag', 'localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    returnNull: false,
  });

export default i18next;
