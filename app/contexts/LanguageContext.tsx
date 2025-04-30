// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import * as Localization from 'expo-localization';
// import { I18n } from 'i18n-js';
// import en from '../locales/en.json';
// import fr from '../locales/fr.json';
// import ar from '../locales/ar.json';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { I18nManager } from 'react-native';

// // Define your translation keys
// type TranslationKeys = keyof typeof en;

// type LanguageContextType = {
//   i18n: I18n;
//   t: (key: TranslationKeys, params?: Record<string, any>) => string;
//   locale: string;
//   setLocale: (locale: string) => Promise<void>;
//   isRTL: boolean;
//   availableLanguages: { code: string; name: string; isRTL: boolean }[];
// };

// type LanguageProviderProps = {
//   children: React.ReactNode;
//   onLanguageChange?: (isRTL: boolean) => void;
// };

// const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, onLanguageChange }) => {
//   const [locale, setLocaleState] = useState('en');
//   const [isRTL, setIsRTL] = useState(false);

//   const availableLanguages = [
//     { code: 'en', name: 'English', isRTL: false },
//     { code: 'fr', name: 'Français', isRTL: false },
//     { code: 'ar', name: 'العربية', isRTL: true },
//   ];

//   const i18n = new I18n({
//     en,
//     fr,
//     ar,
//   });

//   i18n.enableFallback = true;
//   i18n.locale = locale;

//   // Enhanced translation function with parameter support
//   const t = useCallback((key: TranslationKeys, params: Record<string, any> = {}): string => {
//     let translation = i18n.t(key);
    
//     // Log missing translations in development
//     if (__DEV__ && translation.includes('[missing "')) {
//       console.warn(`Missing translation for key: ${key}`);
//     }

//     // Handle parameter replacement
//     Object.keys(params).forEach(param => {
//       translation = translation.replace(new RegExp(`\\{\\{${param}\\}\\}`, 'g'), params[param]);
//     });

//     // Handle simple pluralization
//     if (params.count !== undefined) {
//       translation = translation.replace(
//         /{{count, plural, one{(.+?)} other{(.+?)}}}/g,
//         params.count === 1 ? '$1' : '$2'
//       );
//     }

//     return translation;
//   }, [locale]);

//   const setLocale = useCallback(async (newLocale: string) => {
//     const languageConfig = availableLanguages.find(lang => lang.code === newLocale) || availableLanguages[0];
//     const newIsRTL = languageConfig.isRTL;
    
//     try {
//       await AsyncStorage.setItem('userLanguage', newLocale);
//       setLocaleState(newLocale);
//       setIsRTL(newIsRTL);
      
//       // Update RTL settings
//       if (I18nManager.isRTL !== newIsRTL) {
//         I18nManager.forceRTL(newIsRTL);
//         I18nManager.allowRTL(newIsRTL);
//       }
      
//       onLanguageChange?.(newIsRTL);
//     } catch (error) {
//       console.error('Failed to save language preference', error);
//     }
//   }, [onLanguageChange]);

//   // Initialize language on app start
//   useEffect(() => {
//     const initLanguage = async () => {
//       try {
//         // First try to load saved language
//         const savedLanguage = await AsyncStorage.getItem('userLanguage');
//         if (savedLanguage) {
//           await setLocale(savedLanguage);
//           return;
//         }
        
//         // Fallback to device language
//         const deviceLanguage = Localization.locale.split('-')[0];
//         const supportedLanguage = availableLanguages.find(lang => 
//           lang.code === deviceLanguage
//         );
        
//         if (supportedLanguage) {
//           await setLocale(deviceLanguage);
//         } else {
//           await setLocale('en'); // Default to English
//         }
//       } catch (error) {
//         console.error('Failed to initialize language', error);
//         await setLocale('en'); // Fallback to English
//       }
//     };

//     initLanguage();
//   }, []);

//   // Update i18n locale when changed
//   useEffect(() => {
//     i18n.locale = locale;
//   }, [locale]);

//   const contextValue = {
//     i18n,
//     t,
//     locale,
//     setLocale,
//     isRTL,
//     availableLanguages,
//   };

//   return (
//     <LanguageContext.Provider value={contextValue}>
//       {children}
//     </LanguageContext.Provider>
//   );
// };

// export const useLanguage = (): LanguageContextType => {
//   const context = useContext(LanguageContext);
//   if (!context) {
//     throw new Error('useLanguage must be used within a LanguageProvider');
//   }
//   return context;
// };
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import en from '../locales/en.json';
import fr from '../locales/fr.json';
import ar from '../locales/ar.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';

// Define your translation keys
type TranslationKeys = keyof typeof en;

type LanguageContextType = {
  i18n: I18n;
  t: (key: TranslationKeys, params?: Record<string, any>) => string;
  locale: string;
  setLocale: (locale: string) => Promise<void>;
  isRTL: boolean;
  availableLanguages: { code: string; name: string; isRTL: boolean }[];
};

type LanguageProviderProps = {
  children: React.ReactNode;
  onLanguageChange?: (isRTL: boolean) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, onLanguageChange }) => {
  const [locale, setLocaleState] = useState('en');
  const [isRTL, setIsRTL] = useState(false);

  const availableLanguages = [
    { code: 'en', name: 'English', isRTL: false },
    { code: 'fr', name: 'Français', isRTL: false },
    { code: 'ar', name: 'العربية', isRTL: true },
  ];

  const i18n = new I18n({
    en,
    fr,
    ar,
  });

  i18n.enableFallback = true;
  i18n.locale = locale;

  // Enhanced translation function with parameter support
  const t = useCallback((key: TranslationKeys, params: Record<string, any> = {}): string => {
    let translation = i18n.t(key);
    
    // Log missing translations in development
    if (__DEV__ && translation.includes('[missing "')) {
      console.warn(`Missing translation for key: ${key}`);
    }

    // Handle parameter replacement
    Object.keys(params).forEach(param => {
      translation = translation.replace(new RegExp(`\\{\\{${param}\\}\\}`, 'g'), params[param]);
    });

    // Handle simple pluralization
    if (params.count !== undefined) {
      translation = translation.replace(
        /{{count, plural, one{(.+?)} other{(.+?)}}}/g,
        params.count === 1 ? '$1' : '$2'
      );
    }

    return translation;
  }, [locale]);

  const setLocale = useCallback(async (newLocale: string) => {
    const languageConfig = availableLanguages.find(lang => lang.code === newLocale) || availableLanguages[0];
    const newIsRTL = languageConfig.isRTL;
    
    try {
      await AsyncStorage.setItem('userLanguage', newLocale);
      setLocaleState(newLocale);
      setIsRTL(newIsRTL);

      // Update RTL settings only when needed
      if (I18nManager.isRTL !== newIsRTL) {
        // Do not call forceRTL if you don't want the layout mirrored
        // I18nManager.forceRTL(newIsRTL);
        // I18nManager.allowRTL(newIsRTL);
      }
      
      onLanguageChange?.(newIsRTL);
    } catch (error) {
      console.error('Failed to save language preference', error);
    }
  }, [onLanguageChange]);

  // Initialize language on app start
  useEffect(() => {
    const initLanguage = async () => {
      try {
        // First try to load saved language
        const savedLanguage = await AsyncStorage.getItem('userLanguage');
        if (savedLanguage) {
          await setLocale(savedLanguage);
          return;
        }
        
        // Fallback to device language
        const deviceLanguage = Localization.locale.split('-')[0];
        const supportedLanguage = availableLanguages.find(lang => 
          lang.code === deviceLanguage
        );
        
        if (supportedLanguage) {
          await setLocale(deviceLanguage);
        } else {
          await setLocale('en'); // Default to English
        }
      } catch (error) {
        console.error('Failed to initialize language', error);
        await setLocale('en'); // Fallback to English
      }
    };

    initLanguage();
  }, []);

  // Update i18n locale when changed
  useEffect(() => {
    i18n.locale = locale;
  }, [locale]);

  const contextValue = {
    i18n,
    t,
    locale,
    setLocale,
    isRTL,
    availableLanguages,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
