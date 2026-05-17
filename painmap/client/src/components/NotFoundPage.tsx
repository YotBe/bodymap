import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="not-found">
      <div className="not-found-card">
        <h1 className="not-found-headline">{t('notFound.headline')}</h1>
        <p className="not-found-sub">{t('notFound.sub')}</p>
        <div className="not-found-actions">
          <Link to="/" className="not-found-btn">
            {t('notFound.returnHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
