import { useTranslation } from 'react-i18next';
import { useZones } from '../api/exercises';
import { ZONE_LABELS, type ZoneId } from './BodyMap/zones';

interface Props {
  zoneId: ZoneId;
  onPickSubArea: (subAreaId: string, primaryExerciseId: string | null) => void;
}

export function ZonePrompt({ zoneId, onPickSubArea }: Props) {
  const { t } = useTranslation();
  const { data: zones, isLoading } = useZones();
  const zone = zones?.find((z) => z.id === zoneId);
  const localizedZoneName = t(`zones.${zoneId}`, {
    defaultValue: ZONE_LABELS[zoneId] ?? zone?.name ?? '',
  });

  if (isLoading) {
    return (
      <div className="zone-prompt">
        <div className="zp-eyebrow">{t('zonePrompt.eyebrow')}</div>
        <h2 className="zp-headline">{t('zonePrompt.loading')}</h2>
      </div>
    );
  }

  if (!zone) {
    return (
      <div className="zone-prompt">
        <div className="zp-eyebrow">{t('zonePrompt.eyebrow')}</div>
        <h2 className="zp-headline">{t('zonePrompt.notFoundHeadline')}</h2>
        <p className="zp-sub">{t('zonePrompt.notFoundSub')}</p>
      </div>
    );
  }

  return (
    <div className="zone-prompt">
      <div className="zp-eyebrow">{t('zonePrompt.eyebrow')} / {localizedZoneName.toUpperCase()}</div>
      <h2 className="zp-headline">{t('zonePrompt.selectHeadline')}</h2>
      <p className="zp-sub">
        {t('zonePrompt.selectSubPrefix')}{localizedZoneName.toLowerCase()}{t('zonePrompt.selectSubSuffix')}
      </p>
      <div className="zp-list">
        {zone.subAreas.map((sa) => (
          <button
            key={sa.id}
            type="button"
            className="zp-item"
            onClick={() => onPickSubArea(sa.id, sa.primaryExerciseId)}
          >
            <span className="zp-item-label">{sa.name}</span>
            <span className="zp-item-loc">
              {sa.description ?? ''}
            </span>
            <span className="zp-item-arrow">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
