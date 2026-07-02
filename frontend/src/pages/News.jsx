import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import NewsItem from '../components/NewsItem';
import CoverHero from '../components/CoverHero';
import { api } from '../api/client';
import { useLanguage } from '../i18n/LanguageContext';
import './News.css';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&q=80';

const CATEGORY_KEYS = ['', 'press', 'notice', 'event'];

export default function News() {
  const { locale, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const [news, setNews] = useState([]);

  useEffect(() => {
    const params = category ? { category, limit: 50 } : { limit: 50 };
    api.getNews(params).then(setNews).catch(console.error);
  }, [category, locale]);

  return (
    <>
      <CoverHero
        title={t('news.heroTitle')}
        subtitle={t('news.pageTitle')}
        image={HERO_IMAGE}
      />

      <section className="section news-page-section">
        <div className="container">
          <p className="news-page-desc">{t('news.pageDesc')}</p>

          <div className="news-filters">
            {CATEGORY_KEYS.map((value) => (
              <button
                key={value || 'all'}
                type="button"
                className={`filter-btn ${category === value ? 'filter-btn--active' : ''}`}
                onClick={() => setSearchParams(value ? { category: value } : {})}
              >
                {t(`news.categories.${value || 'all'}`)}
              </button>
            ))}
          </div>
          <div className="news-list">
            {news.map((item) => (
              <NewsItem key={item._id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
