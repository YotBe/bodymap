import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function SiteFooter() {
  const { t } = useTranslation();
  return (
    <footer className="site-footer">
      <div className="sf-col">
        <div className="sf-label">{t('footer.painmapLabel')}</div>
        <div className="sf-text">{t('footer.painmapText')}</div>
      </div>
      <div className="sf-col">
        <div className="sf-label">{t('footer.aboutLabel')}</div>
        <Link className="sf-link" to="/about">
          {t('footer.aboutLink')}
        </Link>
        <Link className="sf-link" to="/clinician-finder">
          {t('footer.clinicianLink')}
        </Link>
      </div>
      <div className="sf-col">
        <div className="sf-label">{t('footer.evidenceLabel')}</div>
        <div className="sf-text">
          {t('footer.evidenceText')}{' '}
          <Link to="/evidence" className="sf-inline">
            {t('footer.evidenceFull')}
          </Link>
        </div>
      </div>
      <div className="sf-col">
        <div className="sf-label">{t('footer.legalLabel')}</div>
        <Link className="sf-link" to="/legal">
          {t('footer.disclaimerLink')}
        </Link>
        <Link className="sf-link" to="/legal#privacy">
          {t('footer.privacyLink')}
        </Link>
        <Link className="sf-link" to="/legal#terms">
          {t('footer.termsLink')}
        </Link>
      </div>
    </footer>
  );
}
