import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import App from './App';
import logoCompany from './assets/logo-company.png';
import './styles/global.css';

function setHeadIcon(rel, href) {
  const existing = document.querySelector(`link[rel="${rel}"]`);
  if (existing) {
    existing.href = href;
    return;
  }

  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;
  document.head.appendChild(link);
}

setHeadIcon('apple-touch-icon', logoCompany);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);
