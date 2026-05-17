import { Link } from 'react-router-dom';
import { useEvidenceList } from '../api/exercises';
import { PaneEyebrow } from '../components/PaneEyebrow';

export function EvidencePage() {
  const { data, isLoading } = useEvidenceList();

  const grouped = (() => {
    if (!data) return [];
    const map = new Map<string, { zoneName: string; entries: typeof data }>();
    for (const e of data) {
      const bucket = map.get(e.zoneId);
      if (bucket) bucket.entries.push(e);
      else map.set(e.zoneId, { zoneName: e.zoneName, entries: [e] });
    }
    return Array.from(map.entries());
  })();

  return (
    <article className="long-form">
      <PaneEyebrow num="·" label="EVIDENCE" />
      <h1 className="page-title">
        <span className="pt-serif">Every exercise,</span>
        <span className="pt-serif pt-italic"> every source.</span>
      </h1>
      <p className="page-sub">
        Each primary exercise on PainMap is backed by peer-reviewed literature — RCTs,
        systematic reviews, or clinical guidelines. Below is the complete bibliography,
        grouped by body zone. Click an exercise name to open its full card.
      </p>

      {isLoading && <div className="lf-p">Loading bibliography…</div>}

      {grouped.map(([zoneId, { zoneName, entries }]) => (
        <section key={zoneId} className="lf-section">
          <h2 className="lf-h2">{zoneName}</h2>
          <ul className="evidence-list">
            {entries.map((e) => (
              <li key={e.exerciseId} className="evidence-item">
                <div className="evidence-head">
                  <Link to={`/exercise/${e.exerciseId}`} className="evidence-link">
                    {e.exerciseName}
                  </Link>
                  <span className="evidence-subarea">{e.subAreaName}</span>
                </div>
                <p className="evidence-citation">{e.evidenceFull}</p>
                <p className="evidence-summary">{e.evidenceSummary}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </article>
  );
}
