import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
// Import static translation files
import enTranslation from './i18n/en/translation.json';
import knTranslation from './i18n/kn/translation.json';

/**
 * i18next configuration for Swachha Parisara.
 * English has full content for Phase 0.
 * Kannada, Tulu, Konkani, Beary are scaffolded as empty — can be filled later without refactoring.
 */
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: { translation: enTranslation },
      // Scaffolded for future — with placeholder values for Kannada
      kn: { translation: knTranslation },
      tu: { translation: {} }, // Tulu - out of scope
      kk: { translation: {} }, // Konkani - out of scope
      by: { translation: {} }, // Beary - out of scope
    }
  });

export default i18n;