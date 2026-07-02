import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { useLanguage } from '../../i18n/LanguageContext';
import './AdminShared.css';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.getMe().then(setUser).catch(() => {});
  }, []);

  return (
    <>
      <section className="admin-panel">
        <h2>
          {t('admin.dashboard.welcome')}
          {user ? `, ${user.username}` : ''}
        </h2>
        <p className="admin-panel__desc">{t('admin.dashboard.desc')}</p>
      </section>

      <section className="admin-grid">
        <Link to="/admin/news" className="admin-card">
          <h3>{t('admin.dashboard.newsTitle')}</h3>
          <p>{t('admin.dashboard.newsDesc')}</p>
        </Link>
        <Link to="/admin/company" className="admin-card">
          <h3>{t('admin.dashboard.companyTitle')}</h3>
          <p>{t('admin.dashboard.companyDesc')}</p>
        </Link>
        <Link to="/admin/inquiries" className="admin-card">
          <h3>{t('admin.dashboard.inquiriesTitle')}</h3>
          <p>{t('admin.dashboard.inquiriesDesc')}</p>
        </Link>
      </section>
    </>
  );
}
