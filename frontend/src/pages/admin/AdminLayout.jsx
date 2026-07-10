import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useLanguage } from '../../i18n/LanguageContext';
import { usePageMeta } from '../../hooks/usePageMeta';
import { clearToken } from '../../auth/authStorage';
import '../../components/LanguageSwitcher.css';
import './AdminShared.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  usePageMeta('admin');

  const NAV_ITEMS = [
    { to: '/admin', label: t('admin.nav.dashboard'), end: true },
    { to: '/admin/news', label: t('admin.nav.news') },
    { to: '/admin/company', label: t('admin.nav.company') },
    { to: '/admin/inquiries', label: t('admin.nav.inquiries') },
  ];

  const handleLogout = () => {
    clearToken();
    navigate('/admin/login', { replace: true });
  };

  const isActive = (to, end) => {
    if (end) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header__inner">
          <div>
            <p className="admin-header__eyebrow">CHUN YI COMPANY</p>
            <h1 className="admin-header__title">{t('admin.title')}</h1>
          </div>
          <div className="admin-header__actions">
            <LanguageSwitcher />
            <button type="button" className="admin-header__logout" onClick={handleLogout}>
              {t('admin.logout')}
            </button>
          </div>
        </div>
      </header>

      <nav className="admin-nav">
        <div className="admin-nav__inner">
          {NAV_ITEMS.map(({ to, label, end }) => (
            <Link
              key={to}
              to={to}
              className={`admin-nav__link${isActive(to, end) ? ' admin-nav__link--active' : ''}`}
            >
              {label}
            </Link>
          ))}
          <Link to="/" className="admin-nav__link admin-nav__link--site">
            {t('admin.publicSite')}
          </Link>
        </div>
      </nav>

      <div className="admin-page__inner">
        <Outlet />
      </div>
    </div>
  );
}
