import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationUz from'./UzTranslate.json'
import translationRu from './RuTranslate.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      uz: {
        translation: translationUz
      },
      ru: {
        translation: translationRu
      }
    },
    lng: "uz", // Xususiy til
    fallbackLng: "uz",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
