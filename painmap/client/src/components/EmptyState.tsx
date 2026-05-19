import { useTranslation } from 'react-i18next';
import type { ZoneId } from './BodyMap/zones';

interface Props {
  // Kept for backwards compatibility with PageShell wiring; the picker is
  // now the body map itself, so this prop is unused inside this component.
  onPickZone?: (zoneId: ZoneId) => void;
}

export function EmptyState(_props: Props) {
  const { t } = useTranslation();
  return (
    <div className="empty-state">
      <h2 className="es-headline">{t('emptyState.headline')}</h2>
      <p className="es-sub">{t('emptyState.sub')}</p>
    </div>
  );
}
