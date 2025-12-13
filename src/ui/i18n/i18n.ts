import i18n from 'i18next';
import 'intl-pluralrules';

import { initReactI18next } from 'react-i18next';

import { caCA } from './locales/ca-CA';
import { enEN } from './locales/en-EN';
import { esES } from './locales/es-ES';

const resources = {
  // Long codes mapping to same resources
  'en-EN': { translation: enEN },
  'es-ES': { translation: esES },
  'ca-CA': { translation: caCA },
};

i18n.use(initReactI18next).init({
  resources,
  compatibilityJSON: 'v4',
  lng: 'en-EN',
  fallbackLng: 'en-EN',
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
  react: {
    bindI18n: 'languageChanged loaded',
    bindI18nStore: 'added removed',
    useSuspense: false,
  },
});

export default i18n;
