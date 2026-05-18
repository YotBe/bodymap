import { useTranslation } from 'react-i18next';
import { useZones } from '../api/exercises';
import { ZONE_LABELS, type ZoneId } from './BodyMap/zones';

interface Props {
  onPickZone: (zoneId: ZoneId) => void;
}

export function EmptyState({ onPickZone }: Props) {
  const { t } = useTranslation();
  const { data: zones, isLoading, isError } = useZones();

  return (
    <div className="empty-state">
      <h2 className="es-headline">{t('emptyState.headline')}</h2>
      <p className="es-sub">{t('emptyState.sub')}</p>
      <div className="es-valueprop" role="note">{t('emptyState.valueProp')}</div>

      <div className="es-list">
        <div className="es-list-label">{t('emptyState.orPickZone')}</div>
        {isLoading && <div className="es-zone-subs">{t('emptyState.loading')}</div>}
        {isError && <div className="es-zone-subs">{t('emptyState.loadError')}</div>}
        {zones?.map((z) => (
          <button
            key={z.id}
            type="button"
            className="es-zone"
            onClick={() => onPickZone(z.id as ZoneId)}
          >
            <div className="es-zone-row">
              <div className="es-zone-name">
                {t(`zones.${z.id}`, { defaultValue: ZONE_LABELS[z.id as ZoneId] ?? z.name })}
              </div>
              <div className="es-zone-chev">→</div>
            </div>
            <div className="es-zone-subs">
              {z.subAreas.map((s) => s.name).join(' · ')}
            </div>
          </button>
        ))}
      </div>

      <div className="es-footer">
        <span className="es-footer-mono">{t('emptyState.footer')}</span>
      </div>
    </div>
  );
}
