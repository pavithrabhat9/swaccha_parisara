import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { STORAGE_KEYS } from './services/storageAdapter';
import enTranslation from './i18n/en/translation.json';
import knTranslation from './i18n/kn/translation.json';

/**
 * Production i18next configuration for Swachha Parisara.
 * - Normalizes regional language tags (`en-IN` -> `en`, `kn-IN` -> `kn`) via `load: 'languageOnly'`.
 * - Persists user language choice in `localStorage` under `STORAGE_KEYS.LANGUAGE` (`swachha_lang`).
 * - Synchronizes `<html lang="...">` on initialization and `languageChanged` for screen-reader a11y.
 * - Scaffolds ISO 639-3 regional codes (`tcy` Tulu, `kok` Konkani, `bea` Beary) matching `LanguageSheet`.
 */
const syncDocumentLang = (lng) => {
  if (typeof document !== 'undefined' && lng) {
    const normalized = String(lng).split('-')[0];
    document.documentElement.lang = normalized;
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: 'en',
    supportedLngs: ['en', 'kn', 'tcy', 'kok', 'bea'],
    load: 'languageOnly',
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: STORAGE_KEYS.LANGUAGE,
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: { translation: enTranslation },
      kn: { translation: knTranslation },
      tcy: { translation: {} }, // Tulu (scaffolded)
      kok: { translation: {} }, // Konkani (scaffolded)
      bea: { translation: {} }, // Beary (scaffolded)
    },
  })
  .then(() => {
    syncDocumentLang(i18n.resolvedLanguage || i18n.language || 'en');
  });

i18n.on('languageChanged', syncDocumentLang);

export default i18n;
