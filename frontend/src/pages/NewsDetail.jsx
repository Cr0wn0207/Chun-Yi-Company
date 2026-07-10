import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useLanguage } from '../i18n/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { getDateLocale } from '../i18n/content';
import './NewsDetail.css';

export default function NewsDetail() {
  const { id } = useParams();
  const { locale, t } = useLanguage();
  const [item, setItem] = useState(null);

  usePageMeta('newsDetail', {
    title: item?.title,
    description: item?.summary || item?.content,
  });

  useEffect(() => {
    api.getNewsItem(id).then(setItem).catch(console.error);
  }, [id, locale]);

  if (!item) {
    return (
      <div className="page-hero">
        <div className="container"><p>{t('common.loading')}</p></div>
      </div>
    );
  }

  const date = new Date(item.publishedAt).toLocaleDateString(getDateLocale(locale), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <p className="news-detail-meta">
            <span className={`news-item-category news-item-category--${item.category}`}>
              {t(`news.categories.${item.category}`)}
            </span>
            <time>{date}</time>
          </p>
          <h1>{item.title}</h1>
        </div>
      </div>

      <section className="section">
        <div className="container news-detail-body">
          <p>{item.summary || item.content || t('common.noContent')}</p>
          <Link to="/news" className="view-more">{t('common.backToNews')}</Link>
        </div>
      </section>
    </>
  );
}
