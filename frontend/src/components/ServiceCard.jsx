import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import './ServiceCard.css';

const CARD_IMAGES = [
  'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&q=80',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80',
];

export default function ServiceCard({ service, index = 0, variant = 'default' }) {
  const { t } = useLanguage();
  const bg = CARD_IMAGES[index % CARD_IMAGES.length];
  const isFeatured = variant === 'featured';

  return (
    <Link
      to={`/services/${service.slug}`}
      className={`service-card${
        isFeatured
          ? ` service-card--featured service-card--featured-${index % 2 === 0 ? 'left' : 'right'}`
          : ''
      }`}
    >
      <div className="service-card-bg" style={{ backgroundImage: `url(${bg})` }} />
      <div className="service-card-overlay" />
      <div className="service-card-body">
        {isFeatured ? (
          <>
            <div className="service-card-text">
              <h3 className="service-card-title">{service.title}</h3>
              <p className="service-card-subtitle">{service.subtitle}</p>
            </div>
            <span className="service-card-arrow" aria-hidden>→</span>
          </>
        ) : (
          <>
            <h3 className="service-card-title">{service.title}</h3>
            <p className="service-card-subtitle">{service.subtitle}</p>
            <span className="service-card-link">{t('common.viewMore')}</span>
          </>
        )}
      </div>
    </Link>
  );
}
