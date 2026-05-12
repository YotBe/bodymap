import { useZones } from '../api/exercises';
import type { ZoneId } from './BodyMap/zones';

interface Props {
  zoneId: ZoneId;
  onPickSubArea: (subAreaId: string, primaryExerciseId: string | null) => void;
}

export function ZonePrompt({ zoneId, onPickSubArea }: Props) {
  const { data: zones, isLoading } = useZones();
  const zone = zones?.find((z) => z.id === zoneId);

  if (isLoading) {
    return (
      <div className="zone-prompt">
        <div className="zp-eyebrow">UPPER BODY</div>
        <h2 className="zp-headline">Loading…</h2>
      </div>
    );
  }

  if (!zone) {
    return (
      <div className="zone-prompt">
        <div className="zp-eyebrow">UPPER BODY</div>
        <h2 className="zp-headline">Zone not found.</h2>
        <p className="zp-sub">That body region isn&apos;t in the catalog yet.</p>
      </div>
    );
  }

  return (
    <div className="zone-prompt">
      <div className="zp-eyebrow">UPPER BODY / {zone.name.toUpperCase()}</div>
      <h2 className="zp-headline">Select a specific sub-area.</h2>
      <p className="zp-sub">
        The body map has zoomed in on the {zone.name.toLowerCase()}. Click a numbered
        hotspot on the diagram, or pick from the list below.
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
