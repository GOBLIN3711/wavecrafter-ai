'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { translations, type Language, type TranslationKey } from '@/lib/i18n';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKey;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  const saved = localStorage.getItem('wavecrafter-lang');
  if (saved === 'en' || saved === 'ru') return saved;
  return 'ru';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('wavecrafter-lang', lang);
    document.documentElement.lang = lang;
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'ru' : 'en');
  }, [language, setLanguage]);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
