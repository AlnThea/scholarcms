'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { dictionary } from '@/constants/locales';

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key) => key,
  mounted: false,
});

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [mounted, setMounted] = useState(false);

  // Sync state from localStorage after initial hydration
  useEffect(() => {
    const saved = localStorage.getItem('scholarcms_lang');
    if (saved && (saved === 'en' || saved === 'id')) {
      setLanguage(saved);
    } else {
      localStorage.setItem('scholarcms_lang', 'en');
      setLanguage('en');
    }
    setMounted(true);
  }, []);

  const changeLanguage = (lang) => {
    if (lang !== 'en' && lang !== 'id') return;
    setLanguage(lang);
    localStorage.setItem('scholarcms_lang', lang);
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'id' : 'en';
    changeLanguage(nextLang);
  };

  const t = (key) => {
    if (!key) return '';
    const currentDict = dictionary[language] || dictionary['en'];
    if (currentDict && currentDict[key] !== undefined) {
      return currentDict[key];
    }
    // Fallback to English dictionary if key missing in current language
    const fallbackDict = dictionary['en'];
    if (fallbackDict && fallbackDict[key] !== undefined) {
      return fallbackDict[key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, toggleLanguage, t, mounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
