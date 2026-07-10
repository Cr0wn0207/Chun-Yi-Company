import { LOCALES as ALL_LOCALES } from './locales/index.js';
import { getCurrentLocale } from './localeStore';

export const OFFICE_MAP_QUERY = '埼玉県志木市本町六丁目8-12';
export const OFFICE_MAP_COORDS = { lat: 35.837, lng: 139.5803 };

export function buildOfficeMapEmbed() {
  const { lat, lng } = OFFICE_MAP_COORDS;
  const pad = 0.0045;
  const bbox = [lng - pad, lat - pad, lng + pad, lat + pad].join(',');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export function buildOfficeMapExternalUrl() {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(OFFICE_MAP_QUERY)}`;
}

const SERVICE_SLUGS = [
  'digital-transformation',
  'ai-data',
  'cloud-infrastructure',
  'system-development',
  'it-consulting',
  'customer-experience',
];

const SERVICE_ICONS = {
  'digital-transformation': 'digital',
  'ai-data': 'ai',
  'cloud-infrastructure': 'cloud',
  'system-development': 'dev',
  'it-consulting': 'consulting',
  'customer-experience': 'cx',
};

const NEWS_META = [
  { id: 'news-1', category: 'press', publishedAt: '2026-06-28T00:00:00.000Z', featured: true },
  { id: 'news-2', category: 'notice', publishedAt: '2026-06-25T00:00:00.000Z', featured: true },
  { id: 'news-3', category: 'event', publishedAt: '2026-06-20T00:00:00.000Z', featured: false },
  { id: 'news-4', category: 'press', publishedAt: '2026-06-15T00:00:00.000Z', featured: false },
  { id: 'news-5', category: 'notice', publishedAt: '2026-06-10T00:00:00.000Z', featured: false },
];

const SEED_TITLE_KEYS = {
  'CYTeam (Chun Yi Team), 클라우드 네이티브 솔루션 사업 확대': 'news-1',
  'Chun Yi Team, 클라우드 네이티브 솔루션 사업 확대': 'news-1',
  '신규 파트너십 체결 — 글로벌 클라우드 프로바이더와 협력': 'news-2',
  '2026 디지털 트랜스포메이션 세미나 개최 안내': 'news-3',
  '자사 개발 DevOps 플랫폼 v2.0 출시': 'news-4',
  '정보보안 인증 ISO 27001 갱신 완료': 'news-5',
};

function resolveSeedKey(item) {
  return item?.seedKey || SEED_TITLE_KEYS[item?.title] || null;
}

export function buildCompany(messages) {
  const c = messages.company;
  return {
    _id: 'mock-company',
    name: c.name,
    tagline: c.tagline,
    vision: c.vision,
    mission: c.mission,
    founded: '2020',
    address: c.address,
    phone: '02-1234-5678',
    email: 'contact@chunyi-team.com',
    ceoMessage: c.ceoMessage,
    values: c.values,
    history: c.history,
  };
}

function readLocaleBucket(apiCompany, locale) {
  if (!apiCompany?.locales) return null;
  return apiCompany.locales[locale] || null;
}

function readLegacyBucket(apiCompany, locale) {
  if (locale !== 'ko' || !apiCompany?.name) return null;
  return {
    name: apiCompany.name,
    tagline: apiCompany.tagline,
    vision: apiCompany.vision,
    mission: apiCompany.mission,
    address: apiCompany.address,
    ceoMessage: apiCompany.ceoMessage,
    values: apiCompany.values,
    history: apiCompany.history,
  };
}

function pickLocalizedField(source, localized, key) {
  const value = source?.[key];
  if (key === 'values' || key === 'history') {
    return Array.isArray(value) && value.length ? value : localized[key];
  }
  return value || localized[key];
}

export function mergeCompanyWithLocale(apiCompany, messages) {
  const localized = buildCompany(messages);
  if (!apiCompany) return localized;

  const locale = getCurrentLocale();
  const source = readLocaleBucket(apiCompany, locale) || readLegacyBucket(apiCompany, locale) || {};

  return {
    _id: apiCompany._id,
    founded: apiCompany.founded || localized.founded,
    phone: apiCompany.phone || localized.phone,
    email: apiCompany.email || localized.email,
    name: pickLocalizedField(source, localized, 'name'),
    tagline: pickLocalizedField(source, localized, 'tagline'),
    vision: pickLocalizedField(source, localized, 'vision'),
    mission: pickLocalizedField(source, localized, 'mission'),
    address: pickLocalizedField(source, localized, 'address'),
    ceoMessage: pickLocalizedField(source, localized, 'ceoMessage'),
    values: pickLocalizedField(source, localized, 'values'),
    history: pickLocalizedField(source, localized, 'history'),
  };
}

export function mergeServicesWithLocale(apiServices, messages) {
  const localized = buildServices(messages);
  if (!Array.isArray(apiServices)) return localized;

  return apiServices.map((item) => {
    const match = localized.find((entry) => entry.slug === item.slug);
    if (!match) return item;
    return {
      ...item,
      title: match.title,
      subtitle: match.subtitle,
      description: match.description,
    };
  });
}

export function mergeServiceWithLocale(apiService, messages, slug) {
  const localized = buildServices(messages).find((entry) => entry.slug === slug);
  if (!apiService || !localized) return apiService;
  return {
    ...apiService,
    title: localized.title,
    subtitle: localized.subtitle,
    description: localized.description,
  };
}

export function buildServices(messages) {
  const items = messages.services.items;
  return SERVICE_SLUGS.map((slug, index) => ({
    _id: `mock-svc-${index + 1}`,
    slug,
    icon: SERVICE_ICONS[slug],
    order: index + 1,
    title: items[slug].title,
    subtitle: items[slug].subtitle,
    description: items[slug].description,
  }));
}

export function buildNews(messages) {
  const items = messages.news.items;
  return NEWS_META.map((meta) => ({
    _id: `mock-${meta.id}`,
    seedKey: meta.id,
    category: meta.category,
    publishedAt: meta.publishedAt,
    featured: meta.featured,
    title: items[meta.id].title,
    summary: items[meta.id].summary,
  }));
}

function readNewsLocaleBucket(item, locale) {
  if (!item?.locales) return null;
  return item.locales[locale] || null;
}

function readNewsLegacyBucket(item, locale) {
  if (locale !== 'ko' || !item?.title) return null;
  return {
    title: item.title,
    summary: item.summary || '',
    content: item.content || '',
  };
}

function readNewsI18nBucket(item, messages, locale) {
  if (locale === 'ko') return null;
  const seedKey = resolveSeedKey(item);
  if (!seedKey) return null;
  const i18nItem = messages.news.items[seedKey];
  if (!i18nItem) return null;
  return {
    title: i18nItem.title,
    summary: i18nItem.summary,
    content: item.content || '',
  };
}

export function mergeNewsItemWithLocale(item, messages) {
  if (!item) return item;

  const locale = getCurrentLocale();
  const source =
    readNewsLocaleBucket(item, locale) ||
    readNewsLegacyBucket(item, locale) ||
    readNewsI18nBucket(item, messages, locale) ||
    {};

  return {
    _id: item._id,
    seedKey: resolveSeedKey(item),
    category: item.category,
    publishedAt: item.publishedAt,
    featured: item.featured,
    title: source.title || item.title || '',
    summary: source.summary ?? item.summary ?? '',
    content: source.content ?? item.content ?? '',
  };
}

export function mergeNewsListWithLocale(apiNews, messages) {
  if (!Array.isArray(apiNews)) return buildNews(messages);
  return apiNews.map((item) => mergeNewsItemWithLocale(item, messages));
}

export function getDateLocale(locale) {
  const map = {
    ko: 'ko-KR',
    en: 'en-US',
    ja: 'ja-JP',
    zh: 'zh-CN',
    de: 'de-DE',
    es: 'es-ES',
    fr: 'fr-FR',
    pt: 'pt-BR',
    vi: 'vi-VN',
    th: 'th-TH',
  };
  return map[locale] || 'en-US';
}

const INQUIRY_LABEL_TO_VALUE = new Map();
Object.values(ALL_LOCALES).forEach((messages) => {
  messages.contact?.inquiryOptions?.forEach((option) => {
    INQUIRY_LABEL_TO_VALUE.set(option.label, option.value);
  });
});

export function resolveInquirySubjectLabel(subject, inquiryType, messages) {
  const value = inquiryType || INQUIRY_LABEL_TO_VALUE.get(subject);
  if (!value) return subject || '';
  return messages.contact.inquiryOptions.find((option) => option.value === value)?.label || subject || '';
}
