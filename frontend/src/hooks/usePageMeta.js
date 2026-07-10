import { useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getPageMeta } from '../i18n/meta';

function upsertMeta(name, content, attr = 'name') {
  if (!content) return;

  const selector = attr === 'property' ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let el = document.querySelector(selector);

  if (!el) {
    el = document.createElement('meta');
    if (attr === 'property') el.setAttribute('property', name);
    else el.setAttribute('name', name);
    document.head.appendChild(el);
  }

  el.setAttribute('content', content);
}

function clearRobotsMeta() {
  document.querySelector('meta[name="robots"]')?.remove();
}

export function usePageMeta(pageKey, overrides = {}) {
  const { locale } = useLanguage();
  const { title: overrideTitle, description: overrideDescription } = overrides;

  useEffect(() => {
    const { title, description, robots } = getPageMeta(locale, pageKey, {
      title: overrideTitle,
      description: overrideDescription,
    });

    document.title = title;
    upsertMeta('description', description);
    upsertMeta('og:title', title, 'property');
    upsertMeta('og:description', description, 'property');
    upsertMeta('og:type', 'website', 'property');
    upsertMeta('og:site_name', 'Chun Yi Company', 'property');
    upsertMeta('twitter:card', 'summary', 'name');
    upsertMeta('twitter:title', title);
    upsertMeta('twitter:description', description);

    if (robots) {
      upsertMeta('robots', robots);
    } else {
      clearRobotsMeta();
    }
  }, [locale, pageKey, overrideTitle, overrideDescription]);
}
