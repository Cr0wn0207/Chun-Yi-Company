import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { setToken } from '../../auth/authStorage';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useLanguage } from '../../i18n/LanguageContext';
import { usePageMeta } from '../../hooks/usePageMeta';
import '../../components/LanguageSwitcher.css';
import './AdminLogin.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  usePageMeta('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from || '/admin';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('expired') === '1') {
      setError(t('admin.login.sessionExpired'));
    }
  }, [t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await api.login({ username, password });
      setToken(result.token);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || t('admin.login.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__top">
        <LanguageSwitcher />
      </div>
      <div className="admin-login__card">
        <div className="admin-login__brand">
          <span className="admin-login__mark">CY</span>
          <div>
            <p className="admin-login__eyebrow">CHUN YI COMPANY</p>
            <h1 className="admin-login__title">{t('admin.login.title')}</h1>
          </div>
        </div>

        <form className="admin-login__form" onSubmit={handleSubmit} noValidate>
          {error && <p className="admin-login__error" role="alert">{error}</p>}

          <label className="admin-login__field">
            <span>{t('admin.login.username')}</span>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label className="admin-login__field">
            <span>{t('admin.login.password')}</span>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          <button type="submit" className="admin-login__submit" disabled={loading}>
            {loading ? t('admin.login.signingIn') : t('admin.login.signIn')}
          </button>
        </form>

        <p className="admin-login__back">
          <Link to="/">← {t('admin.login.backToSite')}</Link>
        </p>
      </div>
    </div>
  );
}
