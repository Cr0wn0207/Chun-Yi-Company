import logoCompany from '../assets/logo-company.png';
import './Logo.css';

export default function Logo({ variant = 'header' }) {
  if (variant === 'footer') {
    return (
      <div className="logo-brand logo-brand--footer">
        <div className="logo-stack">
          <div className="logo-mark" aria-hidden>
            <img src={logoCompany} alt="" className="logo-mark-img" draggable={false} />
          </div>
          <p className="logo-wordmark">
            <span className="logo-name-line" aria-hidden />
            CHUN YI COMPANY
            <span className="logo-name-line" aria-hidden />
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="logo-brand logo-brand--header">
      <div className="logo-mark" aria-hidden>
        <img src={logoCompany} alt="" className="logo-mark-img" draggable={false} />
      </div>
      <p className="logo-wordmark">
        <span className="logo-name-line" aria-hidden />
        CHUN YI COMPANY
        <span className="logo-name-line" aria-hidden />
      </p>
    </div>
  );
}
