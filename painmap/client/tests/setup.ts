import '@testing-library/jest-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../src/locales/en/common.json';
import he from '../src/locales/he/common.json';

// Initialise i18n synchronously for tests — no language detection, no async
// loading. Components that call useTranslation() will get real English strings.
i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: { en: { common: en }, he: { common: he } },
  defaultNS: 'common',
  interpolation: { escapeValue: false },
});
