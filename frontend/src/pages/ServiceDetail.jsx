import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useLanguage } from '../i18n/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import './ServiceDetail.css';

export default function ServiceDetail() {
  const { slug } = useParams();
  const { locale, t } = useLanguage();
  const [service, setService] = useState(null);

  usePageMeta('serviceDetail', {
    title: service?.title,
    description: service?.subtitle || service?.description,
  });

  useEffect(() => {
    api.getService(slug).then(setService).catch(console.error);
  }, [slug, locale]);

  if (!service) {
    return (
      <div className="page-hero">
        <div className="container"><p>{t('common.loading')}</p></div>
      </div>
    );
  }

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <p className="service-breadcrumb">
            <Link to="/services">{t('services.breadcrumb')}</Link> / {service.title}
          </p>
          <h1>{service.title}</h1>
          <p>{service.subtitle}</p>
        </div>
      </div>

      <section className="section">
        <div className="container service-detail">
          <p className="service-description">{service.description}</p>
          <Link to="/contact" className="btn btn-primary">{t('common.contact')}</Link>
        </div>
      </section>
    </>
  );
}
