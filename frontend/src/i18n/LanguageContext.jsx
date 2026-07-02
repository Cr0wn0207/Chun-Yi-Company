import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LOCALE, HTML_LANG, LOCALES } from './locales/index.js';
import { setCurrentLocale } from './localeStore.js';

const STORAGE_KEY = 'chunyi-locale';

const LanguageContext = createContext(null);

function getNested(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return LOCALES[saved] ? saved : DEFAULT_LOCALE;
  });

  const messages = LOCALES[locale];

  const setLocale = (next) => {
    if (!LOCALES[next]) return;
    setLocaleState(next);
    setCurrentLocale(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  useEffect(() => {
    setCurrentLocale(locale);
    document.documentElement.lang = HTML_LANG[locale] || locale;
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      messages,
      t: (key, fallback = '') => getNested(messages, key) ?? fallback,
    }),
    [locale, messages]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
