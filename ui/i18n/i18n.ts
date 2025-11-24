import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { enEN } from './locales/en-EN';
import { esES } from './locales/es-ES';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enEN,
    },
    es: {
      translation: esES,
    },
  },
  lng: 'en',
  fallbackLng: 'en',

  interpolation: {
    escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
  },
});
