import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import NewsItem from '../components/NewsItem';
import { api } from '../api/client';
import { useLanguage } from '../i18n/LanguageContext';
import ceoPhoto from '../assets/ceo.png';
import VisionDiagram from '../components/VisionDiagram';
import './Home.css';
import './HomeTypography.css';

const TOPIC_IMAGES = [
  ceoPhoto,
  'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=600&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
];

export default function Home() {
  const { locale, messages } = useLanguage();
  const [services, setServices] = useState([]);
  const [news, setNews] = useState([]);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    api.getServices().then(setServices).catch(console.error);
    api.getNews({ limit: 8 }).then(setNews).catch(console.error);
    api.getCompany().then(setCompany).catch(console.error);
  }, [locale]);

  useEffect(() => {
    document.body.classList.add('home-page');
    return () => document.body.classList.remove('home-page');
  }, []);

  return (
    <div className="page-home">
      <Hero />

      {company && (
        <section className={`section vision-section vision-section--lang-${locale}`}>
          <div className="container vision-grid">
            <div className="vision-copy">
              <p className="vision-lead">{company.vision}</p>
              <p className="vision-body">{company.mission}</p>
            </div>
            <div className="vision-diagram-col">
              <VisionDiagram
                centerText={messages.home.diagramCenter}
                segments={messages.home.diagramLabels.map((label) => ({ label }))}
              />
            </div>
          </div>
        </section>
      )}

      <section className="section topics-section">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">{messages.home.topicsTitle}</h2>
          </div>
          <div className="topics-grid">
            {messages.home.topics.map((topic, index) => (
              <Link
                key={topic.link}
                to={topic.link}
                className="topic-card"
              >
                <div className="topic-card-visual">
                  <div
                    className={`topic-card-bg${index === 0 ? ' topic-card-bg--ceo' : ''}`}
                    style={{ backgroundImage: `url(${TOPIC_IMAGES[index % TOPIC_IMAGES.length]})` }}
                  />
                  <span className="topic-card-edge topic-card-edge--right" aria-hidden />
                </div>
                <div className="topic-card-caption">
                  <h3>{topic.title}</h3>
                  <p>{topic.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section services-section services-section--featured">
        <div className="container">
          <div className="section-head services-section-head">
            <div>
              <h2 className="section-title services-section-title">
                {messages.home.serviceTitle.split(/\s*[|/]\s*/).map((part, i, arr) => (
                  i < arr.length - 1 ? (
                    <span key={part}>
                      {part}
                      <span className="services-section-title-slash"> / </span>
                    </span>
                  ) : (
                    <span key={part}>{part}</span>
                  )
                ))}
              </h2>
              <p className="section-subtitle services-section-subtitle">{messages.home.serviceSubtitle}</p>
            </div>
            <div className="services-section-actions">
              <Link to="/services" className="services-action-btn">
                <span className="services-action-btn-inner">{messages.home.serviceBtnCase}</span>
              </Link>
              <Link to="/services" className="services-action-btn">
                <span className="services-action-btn-inner">{messages.home.serviceBtnAll}</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="services-grid services-grid--featured">
          {services.map((service, index) => (
            <ServiceCard key={service._id} service={service} index={index} variant="featured" />
          ))}
        </div>
      </section>

      <section className="section news-section news-section--release">
        <div className="container">
          <div className="news-release-layout">
            <aside className="news-release-aside">
              <h2 className="news-release-title">{messages.home.newsTitle}</h2>
              <Link to="/news" className="news-release-rss">{messages.home.newsRss}</Link>
            </aside>
            <div className="news-release-main">
              <div className="news-list news-list--release">
                {news.map((item) => (
                  <NewsItem key={item._id} item={item} variant="release" />
                ))}
              </div>
              <Link to="/news" className="news-release-more">
                <span className="news-release-more-inner">
                  {messages.home.newsViewAll}
                  <span className="news-release-more-arrow" aria-hidden>→</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
