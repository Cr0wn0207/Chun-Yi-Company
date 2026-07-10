import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { buildOfficeMapEmbed, buildOfficeMapExternalUrl } from '../i18n/content';
import { useLanguage } from '../i18n/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import CoverHero from '../components/CoverHero';
import ceoPhoto from '../assets/ceo.png';
import './About.css';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80';

const SECTION_HEAD_IMAGES = {
  message: 'https://images.unsplash.com/photo-1614850523296-d3c0fdae1c8e?w=1920&q=80',
  vision: 'https://images.unsplash.com/photo-1454165804606-c3b57bc86b2a?w=1920&q=80',
  overview: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80',
  history: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80',
};

export default function About() {
  const { locale, t, messages } = useLanguage();
  usePageMeta('about');
  const [company, setCompany] = useState(null);

  useEffect(() => {
    api.getCompany().then(setCompany).catch(console.error);
  }, [locale]);

  if (!company) {
    return (
      <div className="page-hero">
        <div className="container"><p>{t('common.loading')}</p></div>
      </div>
    );
  }

  return (
    <>
      <CoverHero
        title={t('about.heroTitle')}
        subtitle={t('about.title')}
        image={HERO_IMAGE}
      />

      <section id="message" className="ceo-message-section">
        <div
          className="about-panel__head about-panel__head--image about-panel__head--subtle"
          style={{ '--panel-head-image': `url(${SECTION_HEAD_IMAGES.message})` }}
        >
          <div className="container">
            <h2 className="about-panel__title">{t('about.ceoMessage')}</h2>
          </div>
        </div>

        <div className="container about-panel__surface about-panel__surface--message">
          <div className="ceo-message-body">
            <div className="ceo-message-copy">
              {company.ceoMessage.split('\n\n').map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="ceo-message-paragraph">
                  {paragraph}
                </p>
              ))}
              <div className="ceo-message-sign">
                <p className="ceo-message-date">{t('about.ceoDate')}</p>
                <p className="ceo-message-name">{t('about.ceoTitle')}</p>
              </div>
            </div>

            <figure className="ceo-message-figure">
              <div className="ceo-message-photo-wrap">
                <img src={ceoPhoto} alt={t('about.ceoPhotoAlt')} className="ceo-message-photo" />
              </div>
            </figure>
          </div>
        </div>
      </section>

      <section id="vision" className="about-panel about-panel--alt">
        <div
          className="about-panel__head about-panel__head--image"
          style={{ '--panel-head-image': `url(${SECTION_HEAD_IMAGES.vision})` }}
        >
          <div className="container">
            <h2 className="about-panel__title">{t('about.philosophy')}</h2>
          </div>
        </div>
        <div className="container about-panel__body about-panel__surface">
          <div className="philosophy-grid">
            <article className="philosophy-card">
              <span className="philosophy-card__label">{t('about.vision')}</span>
              <p>{company.vision}</p>
            </article>
            <article className="philosophy-card">
              <span className="philosophy-card__label">{t('about.mission')}</span>
              <p>{company.mission}</p>
            </article>
          </div>
          <div className="philosophy-values">
            {company.values.map((value) => (
              <span key={value} className="philosophy-value">{value}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="overview" className="about-panel">
        <div
          className="about-panel__head about-panel__head--image"
          style={{ '--panel-head-image': `url(${SECTION_HEAD_IMAGES.overview})` }}
        >
          <div className="container">
            <h2 className="about-panel__title">{t('about.overview')}</h2>
          </div>
        </div>
        <div className="container about-panel__body about-panel__surface about-panel__surface--overview">
          <div className="overview-layout">
            <table className="overview-table">
              <tbody>
                <tr><th>{t('about.companyName')}</th><td>{company.name}</td></tr>
                <tr><th>{t('about.founded')}</th><td>{company.founded}{t('about.yearSuffix')}</td></tr>
                <tr><th>{t('about.address')}</th><td>{company.address}</td></tr>
                <tr><th>{t('about.phone')}</th><td>{company.phone}</td></tr>
                <tr><th>{t('about.email')}</th><td>{company.email}</td></tr>
              </tbody>
            </table>

            <div className="overview-map">
              <h3 className="overview-map__title">{t('about.mapTitle')}</h3>
              <div className="overview-map__frame">
                <iframe
                  title={t('about.mapTitle')}
                  src={buildOfficeMapEmbed()}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <p className="overview-map__address">{messages.company.address}</p>
              <a
                className="overview-map__link"
                href={buildOfficeMapExternalUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('about.openInGoogleMaps', 'Open in Google Maps')}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="history" className="about-panel about-panel--alt">
        <div
          className="about-panel__head about-panel__head--image"
          style={{ '--panel-head-image': `url(${SECTION_HEAD_IMAGES.history})` }}
        >
          <div className="container">
            <h2 className="about-panel__title">{t('about.history')}</h2>
          </div>
        </div>
        <div className="container about-panel__body about-panel__surface about-panel__surface--history">
          <div className="history-track">
            {company.history.map((item, index) => (
              <article key={`${item.year}-${index}`} className="history-item">
                <span className="history-item__year">{item.year}</span>
                <p className="history-item__event">{item.event}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
