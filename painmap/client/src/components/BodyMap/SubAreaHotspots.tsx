import { SUB_AREA_HOTSPOTS, type BodyView, type ZoneId } from './zones';

interface Props {
  view: BodyView;
  zoneId: ZoneId;
  selectedSubAreaId: string | null;
  prefersReducedMotion: boolean;
  onSelect: (subAreaId: string) => void;
}

export function SubAreaHotspots({
  view,
  zoneId,
  selectedSubAreaId,
  prefersReducedMotion,
  onSelect,
}: Props) {
  const spots = SUB_AREA_HOTSPOTS[view][zoneId];
  if (!spots) return null;

  return (
    <>
      {spots.map((s, i) => {
        const isSelected = selectedSubAreaId === s.subAreaId;
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
            aria-label={`Select ${s.label}`}
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
              r={9}
              fill="var(--bg)"
              stroke="var(--accent)"
              strokeWidth={1}
              opacity={isSelected ? 1 : 0.95}
            />
            <circle className="subhot-dot" r={3.5} fill="var(--accent)" opacity={isSelected ? 1 : 0.6} />
            {s.showLabel && (
              <text
                x={14}
                y={3}
                fontSize={9}
                fill="var(--ink)"
                fontFamily="'JetBrains Mono', monospace"
                letterSpacing="0.05em"
              >
                {s.label.toUpperCase()}
              </text>
            )}
          </g>
        );
      })}
    </>
  );
}
