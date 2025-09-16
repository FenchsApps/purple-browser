"use client";

import { createContext, useState, useEffect, ReactNode } from 'react';
import { getCookie, setCookie } from '@/lib/cookies';
import en from '@/locales/en.json';
import ru from '@/locales/ru.json';
import de from '@/locales/de.json';
import fr from '@/locales/fr.json';

const translations: { [key: string]: any } = { en, ru, de, fr };

type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
};

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    const savedLanguage = getCookie('language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguageState(lang);
      setCookie('language', lang);
    }
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
