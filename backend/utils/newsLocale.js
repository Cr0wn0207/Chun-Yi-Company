export function getNewsLocaleBucket(item, locale) {
  if (!item) return null;

  const fromMap = item.locales?.get?.(locale) || item.locales?.[locale];
  if (fromMap) return fromMap;

  if (locale === 'ko' && item.title) {
    return {
      title: item.title,
      summary: item.summary || '',
      content: item.content || '',
    };
  }

  return null;
}

export function toAdminNewsListItem(item, locale) {
  const bucket = getNewsLocaleBucket(item, locale) || {};

  return {
    _id: item._id,
    seedKey: item.seedKey,
    category: item.category,
    publishedAt: item.publishedAt,
    featured: item.featured,
    title: bucket.title || item.title || '',
    summary: bucket.summary || '',
    content: bucket.content || '',
  };
}

export function toAdminNewsForm(item, locale) {
  const bucket = getNewsLocaleBucket(item, locale) || {};

  return {
    _id: item._id,
    editingLocale: locale,
    seedKey: item.seedKey,
    category: item.category,
    publishedAt: item.publishedAt,
    featured: item.featured,
    title: bucket.title || '',
    summary: bucket.summary || '',
    content: bucket.content || '',
  };
}
