import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import Logo from './Logo';
import './Header.css';

const DROPDOWN_CLOSE_DELAY = 400;

export default function Header() {
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const closeTimerRef = useRef(null);

  const openDropdown = (key) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveDropdown(key);
  };

  const scheduleCloseDropdown = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
      closeTimerRef.current = null;
    }, DROPDOWN_CLOSE_DELAY);
  };

  useEffect(() => () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
  }, []);

  const navItems = [
    {
      key: 'services',
      label: t('nav.services.label'),
      path: '/services',
      children: [
        { label: t('nav.services.all'), path: '/services' },
        { label: t('nav.services.digital'), path: '/services/digital-transformation' },
        { label: t('nav.services.ai'), path: '/services/ai-data' },
        { label: t('nav.services.cloud'), path: '/services/cloud-infrastructure' },
        { label: t('nav.services.system'), path: '/services/system-development' },
        { label: t('nav.services.consulting'), path: '/services/it-consulting' },
        { label: t('nav.services.cx'), path: '/services/customer-experience' },
      ],
    },
    {
      key: 'about',
      label: t('nav.about.label'),
      path: '/about',
      children: [
        { label: t('nav.about.message'), path: '/about#message' },
        { label: t('nav.about.vision'), path: '/about#vision' },
        { label: t('nav.about.overview'), path: '/about#overview' },
        { label: t('nav.about.history'), path: '/about#history' },
      ],
    },
    { key: 'news', label: t('nav.news'), path: '/news' },
    { key: 'contact', label: t('nav.contact'), path: '/contact' },
  ];

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo" onClick={() => setMobileOpen(false)}>
          <Logo variant="header" />
        </Link>

        <div className="header-right">
          <nav className={`header-nav ${mobileOpen ? 'header-nav--open' : ''}`}>
            <ul className="nav-list">
              {navItems.map((item) => (
                <li
                  key={item.key}
                  className="nav-item"
                  onMouseEnter={() => item.children && openDropdown(item.key)}
                  onMouseLeave={scheduleCloseDropdown}
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </NavLink>

                  {item.children && (
                    <div
                      className={`dropdown ${activeDropdown === item.key ? 'dropdown--visible' : ''}`}
                      onMouseEnter={() => openDropdown(item.key)}
                      onMouseLeave={scheduleCloseDropdown}
                    >
                      <div className="dropdown-panel">
                        <p className="dropdown-title">{item.label}</p>
                        <ul>
                          {item.children.map((child) => (
                            <li key={child.path}>
                              <Link to={child.path} onClick={() => setMobileOpen(false)}>
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </li>
              ))}
              <li className="nav-item nav-item--lang">
                <LanguageSwitcher />
              </li>
            </ul>
          </nav>
        </div>

        <button
          className={`hamburger ${mobileOpen ? 'hamburger--open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={t('common.menu')}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
