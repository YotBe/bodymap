import { useTranslation } from 'react-i18next';
import { SUB_AREA_HOTSPOTS, type BodyView, type ZoneId } from './zones';
import { isRtlLanguage } from '../../i18n';

interface Props {
  view: BodyView;
  zoneId: ZoneId;
  selectedSubAreaId: string | null;
  isMobile: boolean;
  prefersReducedMotion: boolean;
  /** The current (possibly mid-animation) SVG viewBox, e.g. "100 100 200 300". */
  viewBox: string;
  onSelect: (subAreaId: string) => void;
}

export function SubAreaHotspots({
  view,
  zoneId,
  selectedSubAreaId,
  isMobile,
  prefersReducedMotion,
  viewBox,
  onSelect,
}: Props) {
  const { t, i18n } = useTranslation();
  const isRtl = isRtlLanguage(i18n.language || 'en');
  const isHebrew = (i18n.language || 'en').startsWith('he');
  const spots = SUB_AREA_HOTSPOTS[view][zoneId];
  if (!spots) return null;

  const [vbX, vbY, vbW] = viewBox.split(' ').map(Number);
  const viewBoxScale = (vbW || 400) / 400;

  const ringR = 9 * viewBoxScale;
  const dotR = 3.5 * viewBoxScale;
  const fontSize = 11 * viewBoxScale;
  const labelOffsetX = (isRtl ? -11 : 11) * viewBoxScale;
  const labelOffsetY = 3 * viewBoxScale;
  const strokeW = Math.max(0.5, 1 * viewBoxScale);
  // Larger transparent tap target on touch so each marker clears ~44px CSS.
  const hitR = (isMobile ? 28 : 20) * Math.max(viewBoxScale, 0.55);

  // Mobile reveal-pill geometry (in SVG user units). The font has a minimum so
  // it stays legible inside the tightly-zoomed mobile viewBox.
  const pillFont = Math.max(9, 12 * viewBoxScale);
  const pillPadX = pillFont * 0.8;
  const pillPadY = pillFont * 0.45;
  const charW = pillFont * 0.62;
  const pillH = pillFont + pillPadY * 2;
  const pillGap = 6 * viewBoxScale;

  return (
    <>
      {spots.map((s, i) => {
        const isSelected = selectedSubAreaId === s.subAreaId;
        const localized = t(`hotspots.${s.labelKey}`, { defaultValue: s.label });
        const pillText = isHebrew ? localized : localized.toUpperCase();
        const chevron = isRtl ? '‹' : '›';
        const pillLabel = isRtl ? `${chevron}  ${pillText}` : `${pillText}  ${chevron}`;
        const pillW = pillLabel.length * charW + pillPadX * 2;
        // Keep the pill fully inside the viewBox: clamp its horizontal shift,
        // and flip it below the marker if there's no room above.
        const edge = 4 * viewBoxScale;
        const minCx = vbX + edge + pillW / 2;
        const maxCx = vbX + vbW - edge - pillW / 2;
        const pillDX = Math.max(minCx, Math.min(maxCx, s.x)) - s.x;
        const fitsAbove = s.y - (ringR + pillGap + pillH) >= vbY + edge;
        const pillCY = fitsAbove
          ? -(ringR + pillGap + pillH / 2)
          : ringR + pillGap + pillH / 2;
        return (
          <g
            key={`${s.subAreaId}-${i}`}
            className={`subhot ${isSelected ? 'is-selected' : ''}`}
            transform={`translate(${s.x},${s.y})`}
            style={{
              cursor: 'pointer',
              animation: prefersReducedMotion ? 'none' : 'subFadeIn 280ms ease-out both',
              animationDelay: `${i * 40}ms`,
              touchAction: 'manipulation',
            }}
            // pointerup fires reliably on first tap (touch) and on mouse; the
            // synthetic click is unreliable for SVG taps on mobile.
            onPointerUp={() => onSelect(s.subAreaId)}
            role="button"
            tabIndex={0}
            aria-label={
              isMobile && isSelected
                ? t('bodyMap.selectedOpenAria', { label: localized })
                : t('bodyMap.selectAria', { label: localized })
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(s.subAreaId);
              }
            }}
          >
            <circle r={hitR} fill="transparent" />
            <circle
              className="subhot-ring"
              r={ringR}
              fill="var(--bg)"
              stroke="var(--accent)"
              strokeWidth={strokeW}
              opacity={isSelected ? 1 : 0.95}
            />
            <circle className="subhot-dot" r={dotR} fill="var(--accent)" opacity={isSelected ? 1 : 0.6} />

            {/* Desktop: static label beside the marker (no overlap at this zoom). */}
            {s.showLabel && !isMobile && (
              <text
                x={labelOffsetX}
                y={labelOffsetY}
                fontSize={fontSize}
                fill="var(--ink)"
                fontFamily={isHebrew ? "'Heebo', sans-serif" : "'JetBrains Mono', monospace"}
                letterSpacing={isHebrew ? '0' : '0.05em'}
                textAnchor={isRtl ? 'end' : 'start'}
              >
                {pillText}
              </text>
            )}

            {/* Mobile: reveal a single legible pill above the armed marker. */}
            {isMobile && isSelected && (
              <g className="subhot-pill">
                <rect
                  x={pillDX - pillW / 2}
                  y={pillCY - pillH / 2}
                  width={pillW}
                  height={pillH}
                  rx={pillH / 2}
                  fill="var(--ink)"
                />
                <text
                  x={pillDX}
                  y={pillCY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={pillFont}
                  fill="var(--bg)"
                  fontFamily={isHebrew ? "'Heebo', sans-serif" : "'JetBrains Mono', monospace"}
                  letterSpacing={isHebrew ? '0' : '0.04em'}
                >
                  {pillLabel}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </>
  );
}
