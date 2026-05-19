import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function SiteFooter() {
  const { t } = useTranslation();
  return (
    <footer className="site-footer">
      <span className="sf-brand">{t('footer.painmapLabel')}</span>
      <Link className="sf-link" to="/about">{t('nav.about')}</Link>
      <Link className="sf-link" to="/evidence">{t('nav.evidence')}</Link>
      <Link className="sf-link" to="/clinician-finder">{t('footer.clinicianShort')}</Link>
      <Link className="sf-link" to="/legal">{t('footer.legalLabel')}</Link>
      <span className="sf-spacer" />
      <span className="sf-copy">© {new Date().getFullYear()}</span>
    </footer>
  );
}
