import { useTranslation } from 'react-i18next';
import { HIT_PATHS, type BodyView, type ZoneId, ZONE_LABELS } from './zones';

interface Props {
  view: BodyView;
  enabledZones: ZoneId[];
  hoverZone: ZoneId | null;
  selectedZone: ZoneId | null;
  onZoneEnter: (zoneId: ZoneId) => void;
  onZoneLeave: () => void;
  onZoneClick: (zoneId: ZoneId) => void;
}

export function HitRegions({
  view,
  enabledZones,
  hoverZone,
  selectedZone,
  onZoneEnter,
  onZoneLeave,
  onZoneClick,
}: Props) {
  const paths = HIT_PATHS[view];
  const { t } = useTranslation();

  return (
    <g className="hit-layer">
      {(Object.entries(paths) as [ZoneId, string][]).map(([id, d]) => {
        const enabled = enabledZones.includes(id);
        const isSelected = selectedZone === id;
        const isHover = hoverZone === id;
        let fillOpacity = 0.08;
        let stroke: string = 'transparent';
        if (isSelected) {
          fillOpacity = 0.8;
          stroke = 'var(--accent)';
        } else if (isHover && enabled) {
          fillOpacity = 0.4;
        }
        const localizedLabel = t(`zones.${id}`, { defaultValue: ZONE_LABELS[id] });
        return (
          <path
            key={id}
            d={d}
            fill={enabled ? 'var(--accent-soft)' : 'transparent'}
            fillOpacity={enabled ? fillOpacity : 0}
            stroke={stroke}
            strokeWidth={1.2}
            className={`hit ${enabled ? '' : 'hit-disabled'} ${isSelected ? 'is-selected' : ''}`}
            style={{
              cursor: enabled ? 'pointer' : 'default',
              transition: 'fill-opacity 180ms ease-out',
              touchAction: 'manipulation',
            }}
            onMouseEnter={() => enabled && onZoneEnter(id)}
            onMouseLeave={onZoneLeave}
            // Select on pointerup (not click): on touch devices the first tap on a
            // hover-styled SVG path is frequently swallowed activating the hover state,
            // so the synthetic click never fires. pointerup fires reliably for both
            // touch and mouse.
            onPointerUp={() => enabled && onZoneClick(id)}
            tabIndex={enabled ? 0 : -1}
            role="button"
            aria-label={
              enabled
                ? t('bodyMap.selectAria', { label: localizedLabel })
                : t('bodyMap.unavailableAria', { label: localizedLabel })
            }
            onKeyDown={(e) => {
              if (enabled && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onZoneClick(id);
              }
            }}
          />
        );
      })}
    </g>
  );
}
