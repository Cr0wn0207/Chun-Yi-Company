import ko from './ko.js';
import en from './en.js';
import ja from './ja.js';
import zh from './zh.js';
import de from './de.js';
import es from './es.js';
import fr from './fr.js';
import pt from './pt.js';
import vi from './vi.js';
import th from './th.js';
import { ADMIN_EN, ADMIN_JA, ADMIN_KO } from './adminTranslations.js';

function withAdmin(locale, admin) {
  return { ...locale, admin };
}

export const LOCALES = {
  ko: withAdmin(ko, ADMIN_KO),
  en: withAdmin(en, ADMIN_EN),
  ja: withAdmin(ja, ADMIN_JA),
  zh: withAdmin(zh, ADMIN_EN),
  de: withAdmin(de, ADMIN_EN),
  es: withAdmin(es, ADMIN_EN),
  fr: withAdmin(fr, ADMIN_EN),
  pt: withAdmin(pt, ADMIN_EN),
  vi: withAdmin(vi, ADMIN_EN),
  th: withAdmin(th, ADMIN_EN),
};

export const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'ja', label: '日本語', short: 'JA' },
  { code: 'ko', label: '한국어', short: 'KO' },
  { code: 'zh', label: '中文', short: 'ZH' },
  { code: 'de', label: 'Deutsch', short: 'DE' },
  { code: 'es', label: 'Español', short: 'ES' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'pt', label: 'Português', short: 'PT' },
  { code: 'vi', label: 'Tiếng Việt', short: 'VI' },
  { code: 'th', label: 'ไทย', short: 'TH' },
];

export const HTML_LANG = {
  ko: 'ko',
  en: 'en',
  ja: 'ja',
  zh: 'zh-CN',
  de: 'de',
  es: 'es',
  fr: 'fr',
  pt: 'pt',
  vi: 'vi',
  th: 'th',
};

export const DEFAULT_LOCALE = 'ja';
