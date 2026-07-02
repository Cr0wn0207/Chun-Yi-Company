import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { getDateLocale } from '../i18n/content';
import './NewsItem.css';

export default function NewsItem({ item, variant = 'default' }) {
  const { locale, t } = useLanguage();
  const dateLocale = getDateLocale(locale);
  const isRelease = variant === 'release';

  const date = new Date(item.publishedAt)
    .toLocaleDateString(dateLocale, { year: 'numeric', month: '2-digit', day: '2-digit' })
    .replace(/\//g, '.');

  return (
    <Link to={`/news/${item._id}`} className={`news-item${isRelease ? ' news-item--release' : ''}`}>
      <time className="news-item-date">{date}</time>
      <span className={`news-item-category news-item-category--${item.category}`}>
        {t(`news.categories.${item.category}`) || item.category}
      </span>
      <span className="news-item-title">{item.title}</span>
      <span className="news-item-arrow" aria-hidden>→</span>
    </Link>
  );
}
