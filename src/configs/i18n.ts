import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { version } from '@/version';

const ld = new LanguageDetector(undefined, {
    convertDetectedLanguage(lng) {
        if (!lng) {
            return "en";
        }
        return lng.split("-")[0];
    },
});

const be = new Backend(undefined, {
  loadPath: '/locales/{{lng}}/{{ns}}.json',
  queryStringParams: {
    v: version
  }
});

i18n
  .use(be)
  .use(ld)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ["en", "ro"],
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });


export default i18n;