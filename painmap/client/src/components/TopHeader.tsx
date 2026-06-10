import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function TopHeader() {
  const { t, i18n } = useTranslation();
  const base = (i18n.language || 'en').split('-')[0];
  const setLang = (lng: 'en' | 'he') => {
    if (base !== lng) i18n.changeLanguage(lng);
  };

  return (
    <header className="top-header">
      <Link to="/" className="brand" aria-label={t('brand.homeAria')}>
        <span className="brand-mark" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="9.5" stroke="var(--ink)" strokeWidth="1" />
            <circle cx="11" cy="11" r="3" fill="var(--accent)" />
            <line x1="11" y1="1" x2="11" y2="21" stroke="var(--ink)" strokeWidth="0.5" opacity="0.5" />
            <line x1="1" y1="11" x2="21" y2="11" stroke="var(--ink)" strokeWidth="0.5" opacity="0.5" />
          </svg>
        </span>
        <span className="brand-name">{t('brand.name')}</span>
        <span className="brand-version">{t('brand.tagline')}</span>
      </Link>
      <nav className="top-nav" aria-label={t('nav.primary')}>
        <Link className="nav-link nav-emph text-accent" to="/flow/assessment">{t('assessment.title')}</Link>
        <Link className="nav-link" to="/routine">{t('nav.routine')}</Link>
        <Link className="nav-link" to="/about">{t('nav.about')}</Link>
        <Link className="nav-link" to="/clinician-finder">{t('nav.findPhysio')}</Link>
        <div className="lang-toggle" role="group" aria-label={t('lang.toggleAria')}>
          <button
            type="button"
            className={base === 'en' ? 'lang-btn active' : 'lang-btn'}
            aria-pressed={base === 'en'}
            onClick={() => setLang('en')}
          >
            EN
          </button>
          <button
            type="button"
            className={base === 'he' ? 'lang-btn active' : 'lang-btn'}
            aria-pressed={base === 'he'}
            onClick={() => setLang('he')}
          >
            עברית
          </button>
        </div>
      </nav>
    </header>
  );
}
