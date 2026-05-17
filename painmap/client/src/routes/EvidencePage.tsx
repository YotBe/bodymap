import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEvidenceList } from '../api/exercises';
import { PaneEyebrow } from '../components/PaneEyebrow';
import { ZONE_LABELS, type ZoneId } from '../components/BodyMap/zones';

export function EvidencePage() {
  const { t } = useTranslation();
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
      <PaneEyebrow num="·" label={t('pane.evidenceLabel')} />
      <h1 className="page-title">
        <span className="pt-serif">{t('evidence.titlePrefix')}</span>
        <span className="pt-serif pt-italic">{t('evidence.titleSuffix')}</span>
      </h1>
      <p className="page-sub">{t('evidence.sub')}</p>

      {isLoading && <div className="lf-p">{t('evidence.loading')}</div>}

      {grouped.map(([zoneId, { zoneName, entries }]) => (
        <section key={zoneId} className="lf-section">
          <h2 className="lf-h2">
            {t(`zones.${zoneId}`, { defaultValue: ZONE_LABELS[zoneId as ZoneId] ?? zoneName })}
          </h2>
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
