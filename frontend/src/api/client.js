import {
  buildCompany,
  buildNews,
  buildServices,
  mergeCompanyWithLocale,
  mergeNewsItemWithLocale,
  mergeNewsListWithLocale,
  mergeServiceWithLocale,
  mergeServicesWithLocale,
} from '../i18n/content';
import { LOCALES as ALL_LOCALES } from '../i18n/locales/index.js';
import { getCurrentLocale } from '../i18n/localeStore';
import { clearToken, getToken } from '../auth/authStorage';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const API_BASE = import.meta.env.VITE_API_URL || '/api';

const delay = (data) => new Promise((resolve) => setTimeout(() => resolve(data), 200));

function getLocaleMessages(locale = getCurrentLocale()) {
  return ALL_LOCALES[locale] || ALL_LOCALES.ko;
}

function resolveLocale(locale) {
  return locale || getCurrentLocale();
}

function getLocalizedMock() {
  const messages = getLocaleMessages();
  return {
    company: buildCompany(messages),
    services: buildServices(messages),
    news: buildNews(messages),
    contactSuccess: messages.contact.success,
  };
}

function redirectToAdminLogin() {
  clearToken();
  const path = window.location.pathname;
  if (path.startsWith('/admin') && path !== '/admin/login') {
    window.location.replace('/admin/login?expired=1');
  }
}

async function request(endpoint, options = {}, locale = getCurrentLocale()) {
  const { headers: optionHeaders = {}, ...fetchOptions } = options;
  const hadAuth = Boolean(optionHeaders.Authorization);
  let response;

  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': resolveLocale(locale),
        ...optionHeaders,
      },
    });
  } catch {
    throw new Error('Cannot reach API server. Is the backend running on port 5000?');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (response.status === 401 && hadAuth) {
      redirectToAdminLogin();
    }
    throw new Error(error.message || `Request failed (${response.status})`);
  }

  return response.json();
}

function authRequest(endpoint, options = {}) {
  const token = getToken();
  if (!token) {
    return Promise.reject(new Error('Not authenticated'));
  }

  return request(endpoint, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}

export const api = {
  getCompany: async (locale) => {
    const activeLocale = resolveLocale(locale);
    const messages = getLocaleMessages(activeLocale);
    if (USE_MOCK) return delay(buildCompany(messages));
    const apiCompany = await request('/company', {}, activeLocale);
    return mergeCompanyWithLocale(apiCompany, messages, activeLocale);
  },

  getServices: async (locale) => {
    const activeLocale = resolveLocale(locale);
    const messages = getLocaleMessages(activeLocale);
    if (USE_MOCK) return delay(buildServices(messages));
    const apiServices = await request('/services', {}, activeLocale);
    return mergeServicesWithLocale(apiServices, messages, activeLocale);
  },

  getService: async (slug, locale) => {
    const activeLocale = resolveLocale(locale);
    const messages = getLocaleMessages(activeLocale);
    if (USE_MOCK) {
      const service = buildServices(messages).find((s) => s.slug === slug) || null;
      return delay(service);
    }
    const apiService = await request(`/services/${slug}`, {}, activeLocale);
    return mergeServiceWithLocale(apiService, messages, slug, activeLocale);
  },

  getNews: async (params = {}, locale) => {
    const activeLocale = resolveLocale(locale);
    const messages = getLocaleMessages(activeLocale);
    if (USE_MOCK) {
      let items = [...buildNews(messages)];
      if (params.category) {
        items = items.filter((item) => item.category === params.category);
      }
      if (params.limit) {
        items = items.slice(0, Number(params.limit));
      }
      return delay(items);
    }

    const query = new URLSearchParams(params).toString();
    const apiNews = await request(`/news${query ? `?${query}` : ''}`, {}, activeLocale);
    return mergeNewsListWithLocale(apiNews, messages, activeLocale);
  },

  getNewsItem: async (id, locale) => {
    const activeLocale = resolveLocale(locale);
    const messages = getLocaleMessages(activeLocale);
    if (USE_MOCK) {
      const item = buildNews(messages).find((n) => n._id === id) || null;
      return delay(item);
    }
    const apiItem = await request(`/news/${id}`, {}, activeLocale);
    return mergeNewsItemWithLocale(apiItem, messages, activeLocale);
  },

  submitContact: (data) => {
    if (USE_MOCK) {
      return delay({
        message: getLocalizedMock().contactSuccess,
        id: 'mock-contact',
      });
    }
    return request('/contact', { method: 'POST', body: JSON.stringify(data) });
  },

  login: (data) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMe: () => {
    const token = getToken();
    if (!token) {
      return Promise.reject(new Error('Not authenticated'));
    }

    return request('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  adminGetNews: async (locale) => {
    const activeLocale = resolveLocale(locale);
    const messages = getLocaleMessages(activeLocale);
    const items = await authRequest('/admin/news');
    return mergeNewsListWithLocale(items, messages, activeLocale);
  },

  adminGetNewsItem: async (id, locale) => {
    const activeLocale = resolveLocale(locale);
    const messages = getLocaleMessages(activeLocale);
    const item = await authRequest(`/admin/news/${id}`);
    return mergeNewsItemWithLocale(item, messages, activeLocale);
  },

  adminCreateNews: (data) =>
    authRequest('/admin/news', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  adminUpdateNews: (id, data) =>
    authRequest(`/admin/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  adminDeleteNews: (id) =>
    authRequest(`/admin/news/${id}`, { method: 'DELETE' }),

  adminGetCompany: () => authRequest('/admin/company'),

  adminUpdateCompany: (data) =>
    authRequest('/admin/company', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  adminGetContacts: () => authRequest('/admin/contacts'),

  adminUpdateContactStatus: (id, status) =>
    authRequest(`/admin/contacts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  adminDeleteContact: (id) =>
    authRequest(`/admin/contacts/${id}`, { method: 'DELETE' }),
};
