import { useEffect, useState } from 'react';
import ServiceCard from '../components/ServiceCard';
import CoverHero from '../components/CoverHero';
import { api } from '../api/client';
import { useLanguage } from '../i18n/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import './Services.css';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80';

export default function Services() {
  const { locale, t } = useLanguage();
  usePageMeta('services');
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.getServices().then(setServices).catch(console.error);
  }, [locale]);

  return (
    <>
      <CoverHero
        title={t('services.heroTitle')}
        subtitle={t('services.pageTitle')}
        image={HERO_IMAGE}
      />

      <section className="section services-page-section">
        <div className="container">
          <p className="services-page-desc">{t('services.pageDesc')}</p>
          <div className="services-page-grid">
            {services.map((service, index) => (
              <ServiceCard key={service._id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
