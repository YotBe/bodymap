import { useTranslation } from 'react-i18next';

interface Props {
  onDismiss: () => void;
}

export function SafetyBanner({ onDismiss }: Props) {
  const { t } = useTranslation();
  return (
    <div className="safety-banner">
      <span className="sb-text">{t('safetyBanner.text')}</span>
      <button
        type="button"
        className="sb-dismiss"
        onClick={onDismiss}
        aria-label={t('safetyBanner.dismiss')}
      >
        ×
      </button>
    </div>
  );
}
