import { useContext } from 'react';
import { LanguageContext } from '@/context/language-context';

export const languages = [
  { name: 'English (US)', value: 'en' },
  { name: 'Русский', value: 'ru' },
  { name: 'Deutsch', value: 'de' },
  { name: 'Français', value: 'fr' },
];

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
