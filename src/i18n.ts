import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Language resources
const resources = {
  en: {
    translation: require('../app/locales/en.json')
  },
  fr: {
    translation: require('../app/locales/fr.json')
  },
  ar: {
    translation: require('../app/locales/ar.json')
  }
};

// Configuration
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// Helper function to change language
export const changeLanguage = async (lng: string) => {
  await AsyncStorage.setItem('userLanguage', lng);
  await i18n.changeLanguage(lng);
};

export default i18n;