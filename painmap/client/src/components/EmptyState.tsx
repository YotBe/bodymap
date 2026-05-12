import { useZones } from '../api/exercises';
import type { ZoneId } from './BodyMap/zones';

interface Props {
  onPickZone: (zoneId: ZoneId) => void;
}

export function EmptyState({ onPickZone }: Props) {
  const { data: zones, isLoading, isError } = useZones();

  return (
    <div className="empty-state">
      <h2 className="es-headline">Click where it hurts.</h2>
      <p className="es-sub">
        Select a region on the body map to receive a single evidence-backed resistance-band exercise.
      </p>

      <div className="es-list">
        <div className="es-list-label">Or pick a zone</div>
        {isLoading && <div className="es-zone-subs">Loading zones…</div>}
        {isError && <div className="es-zone-subs">Could not load zones. Is the server running?</div>}
        {zones?.map((z) => (
          <button
            key={z.id}
            type="button"
            className="es-zone"
            onClick={() => onPickZone(z.id as ZoneId)}
          >
            <div className="es-zone-row">
              <div className="es-zone-name">{z.name}</div>
              <div className="es-zone-chev">→</div>
            </div>
            <div className="es-zone-subs">
              {z.subAreas.map((s) => s.name).join(' · ')}
            </div>
          </button>
        ))}
      </div>

      <div className="es-footer">
        <span className="es-footer-mono">V1 SCOPE — UPPER BODY ONLY</span>
      </div>
    </div>
  );
}
