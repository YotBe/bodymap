import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/common.json';
import he from './locales/he/common.json';

export const SUPPORTED_LANGUAGES = ['en', 'he'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const RTL_LANGUAGES: ReadonlySet<string> = new Set(['he']);

export function isRtlLanguage(lng: string): boolean {
  return RTL_LANGUAGES.has(lng.split('-')[0]);
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: en },
      he: { common: he },
    },
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
    defaultNS: 'common',
    ns: ['common'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'painmap.lang',
      caches: ['localStorage'],
    },
  });

export default i18n;
