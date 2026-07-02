import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import './Hero.css';

const SLIDE_IMAGES = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&q=80',
];

export default function Hero() {
  const { messages, t, locale } = useLanguage();
  const slides = messages.hero.slides;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setCurrent(0);
  }, [messages]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className={`hero hero--lang-${locale}`}>
      <div className="hero-slides">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === current ? 'hero-slide--active' : ''}`}
            style={{ backgroundImage: `url(${SLIDE_IMAGES[index % SLIDE_IMAGES.length]})` }}
          >
            <div className="hero-overlay" />
            <div className="container hero-content">
              <div className="hero-text-wrap">
                <h1 className="hero-title">
                  {slide.title.split('\n').map((line, lineIndex) => (
                    <span key={lineIndex} className="hero-title-line">
                      {line}
                    </span>
                  ))}
                </h1>
                <p className="hero-subtitle">{slide.subtitle}</p>
                <Link to={slide.link} className="hero-cta">
                  <span className="hero-cta-inner">
                    <span className="hero-cta-text">{slide.linkText}</span>
                    <span className="hero-cta-arrow" aria-hidden>›</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <aside className="hero-side" aria-label="Slide navigation">
        <button
          type="button"
          className="hero-side-arrow"
          onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
          aria-label={t('common.prevSlide')}
        >
          ↑
        </button>
        <div className="hero-side-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`hero-side-dot ${index === current ? 'hero-side-dot--active' : ''}`}
              onClick={() => setCurrent(index)}
              aria-label={`${t('common.slide')} ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="hero-side-arrow"
          onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
          aria-label={t('common.nextSlide')}
        >
          ↓
        </button>
        <span className="hero-side-scroll">SCROLL DOWN</span>
      </aside>
    </section>
  );
}
