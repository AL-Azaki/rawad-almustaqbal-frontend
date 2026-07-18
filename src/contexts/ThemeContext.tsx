import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from './SettingsContext';

type Theme = 'light' | 'dark';
type Language = 'ar' | 'en';

interface ThemeContextType {
  theme: Theme;
  language: Language;
  toggleTheme: () => void;
  toggleLanguage: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, loading } = useSettings();
  const { i18n } = useTranslation();
  
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('ar');

  // Initialize from LocalStorage or Settings Defaults
  useEffect(() => {
    if (loading) return; // Wait for settings to load if we need fallbacks

    const storedTheme = localStorage.getItem('theme_preference') as Theme | null;
    const initialTheme = storedTheme || (settings?.theme as Theme) || 'light';
    
    const storedLang = localStorage.getItem('language_preference') as Language | null;
    const initialLang = storedLang || (settings?.language as Language) || 'ar';

    setTheme(initialTheme);
    setLanguage(initialLang);
  }, [loading, settings]);

  // Apply Theme Side Effects
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Apply Language Side Effects
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, i18n]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme_preference', newTheme);
  };

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
    localStorage.setItem('language_preference', newLang);
  };

  return (
    <ThemeContext.Provider value={{ theme, language, toggleTheme, toggleLanguage }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
