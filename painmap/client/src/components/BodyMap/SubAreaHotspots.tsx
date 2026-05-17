import { useTranslation } from 'react-i18next';
import { SUB_AREA_HOTSPOTS, type BodyView, type ZoneId } from './zones';
import { isRtlLanguage } from '../../i18n';

interface Props {
  view: BodyView;
  zoneId: ZoneId;
  selectedSubAreaId: string | null;
  prefersReducedMotion: boolean;
  viewBoxScale: number;
  onSelect: (subAreaId: string) => void;
}

export function SubAreaHotspots({
  view,
  zoneId,
  selectedSubAreaId,
  prefersReducedMotion,
  viewBoxScale,
  onSelect,
}: Props) {
  const { t, i18n } = useTranslation();
  const isRtl = isRtlLanguage(i18n.language || 'en');
  const spots = SUB_AREA_HOTSPOTS[view][zoneId];
  if (!spots) return null;

  const ringR = 9 * viewBoxScale;
  const dotR = 3.5 * viewBoxScale;
  const fontSize = 11 * viewBoxScale;
  const labelOffsetX = (isRtl ? -11 : 11) * viewBoxScale;
  const labelOffsetY = 3 * viewBoxScale;
  const strokeW = Math.max(0.5, 1 * viewBoxScale);

  return (
    <>
      {spots.map((s, i) => {
        const isSelected = selectedSubAreaId === s.subAreaId;
        const localized = t(`hotspots.${s.labelKey}`, { defaultValue: s.label });
        const isHebrew = (i18n.language || 'en').startsWith('he');
        return (
          <g
            key={`${s.subAreaId}-${i}`}
            className={`subhot ${isSelected ? 'is-selected' : ''}`}
            transform={`translate(${s.x},${s.y})`}
            style={{
              cursor: 'pointer',
              animation: prefersReducedMotion ? 'none' : 'subFadeIn 280ms ease-out both',
              animationDelay: `${i * 40}ms`,
            }}
            onClick={() => onSelect(s.subAreaId)}
            role="button"
            tabIndex={0}
            aria-label={t('bodyMap.selectAria', { label: localized })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(s.subAreaId);
              }
            }}
          >
            <circle r={20} fill="transparent" />
            <circle
              className="subhot-ring"
              r={ringR}
              fill="var(--bg)"
              stroke="var(--accent)"
              strokeWidth={strokeW}
              opacity={isSelected ? 1 : 0.95}
            />
            <circle className="subhot-dot" r={dotR} fill="var(--accent)" opacity={isSelected ? 1 : 0.6} />
            {s.showLabel && (
              <text
                x={labelOffsetX}
                y={labelOffsetY}
                fontSize={fontSize}
                fill="var(--ink)"
                fontFamily={isHebrew ? "'Heebo', sans-serif" : "'JetBrains Mono', monospace"}
                letterSpacing={isHebrew ? '0' : '0.05em'}
                textAnchor={isRtl ? 'end' : 'start'}
              >
                {isHebrew ? localized : localized.toUpperCase()}
              </text>
            )}
          </g>
        );
      })}
    </>
  );
}
