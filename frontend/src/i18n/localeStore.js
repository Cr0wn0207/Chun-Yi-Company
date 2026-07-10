import { DEFAULT_LOCALE, LOCALES } from './locales/index.js';

export const STORAGE_KEY = 'chunyi-locale';

function readStoredLocale() {
  if (typeof localStorage === 'undefined') return DEFAULT_LOCALE;
  const saved = localStorage.getItem(STORAGE_KEY);
  return LOCALES[saved] ? saved : DEFAULT_LOCALE;
}

let currentLocale = readStoredLocale();

export function getCurrentLocale() {
  return currentLocale;
}

export function setCurrentLocale(locale) {
  currentLocale = locale;
}
