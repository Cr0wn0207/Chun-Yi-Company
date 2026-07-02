import { useId } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { LANGUAGES } from '../i18n/locales/index.js';
import './LanguageSwitcher.css';

function GlobeIcon() {
  return (
    <svg className="lang-switcher-globe" viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M3 12h18M12 3c2.4 2.7 3.8 5.8 3.8 9s-1.4 6.3-3.8 9M12 3c-2.4 2.7-3.8 5.8-3.8 9s1.4 6.3 3.8 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();
  const selectId = useId();

  return (
    <div className="lang-switcher">
      <span className="lang-switcher-icon" aria-hidden>
        <GlobeIcon />
      </span>
      <label htmlFor={selectId} className="lang-switcher-label">
        {t('admin.language')}
      </label>
      <select
        id={selectId}
        className="lang-switcher-select"
        value={locale}
        onChange={(e) => setLocale(e.target.value)}
        aria-label={t('admin.language')}
      >
        {LANGUAGES.map(({ code, label }) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
