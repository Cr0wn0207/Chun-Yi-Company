import { useEffect } from 'react';
import logoCompany from '../assets/logo-company.png';
import './SplashScreen.css';

export default function SplashScreen({ onComplete }) {
  useEffect(() => {
    const root = document.documentElement;
    const prevOverflow = document.body.style.overflow;
    root.classList.add('is-splash');
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    const timer = window.setTimeout(() => {
      onComplete();
    }, 2000);

    return () => {
      window.clearTimeout(timer);
      root.classList.remove('is-splash');
      document.body.style.overflow = prevOverflow;
    };
  }, [onComplete]);

  return (
    <div className="splash-screen" role="presentation" aria-hidden>
      <div className="splash-screen__logo">
        <img src={logoCompany} alt="" className="splash-screen__logo-mark" draggable={false} />
      </div>
    </div>
  );
}
