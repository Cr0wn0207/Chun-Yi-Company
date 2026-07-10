import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import './Footer.css';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-top-bar">
        <div className="container">
          <a
            href="#"
            className="back-to-top"
            aria-label="Back to top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            BACK TO TOP
            <span className="back-to-top-caret" aria-hidden>^</span>
          </a>
        </div>
      </div>

      <div className="footer-body">
        <div className="container footer-inner">
        <div className="footer-main">
          <div className="footer-left">
            <p className="footer-group-title">CHUN YI TEAM</p>
            <ul className="footer-links">
              <li><Link to="/contact">{t('nav.contact')}</Link></li>
              <li><Link to="/about">{t('footer.about')}</Link></li>
              <li><Link to="/news">{t('nav.news')}</Link></li>
              <li><Link to="/services">{t('nav.services.label')}</Link></li>
            </ul>
          </div>

          <div className="footer-mark" aria-hidden>CY</div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} Chun Yi Team. {t('footer.rights')}
          </p>
          <div className="footer-legal">
            <a href="#">{t('footer.privacy')}</a>
            <a href="#">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}
