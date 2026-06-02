import { useTranslation } from 'react-i18next';

export function TrustBoundaries() {
  const { t } = useTranslation();
  const does = t('flow.trust.does', { returnObjects: true }) as string[];
  const not = t('flow.trust.not', { returnObjects: true }) as string[];
  return (
    <section className="rounded-2xl border border-rule bg-surface p-5 shadow-card">
      <h3 className="font-display text-2xl text-ink">{t('flow.trust.title')}</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-rule bg-bg p-4">
          <p className="font-mono text-[11px] tracking-[0.12em] text-evidence">{t('flow.trust.doesLabel')}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink">
            {does.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-rule bg-bg p-4">
          <p className="font-mono text-[11px] tracking-[0.12em] text-accent">{t('flow.trust.notLabel')}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink">
            {not.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-3 text-sm text-ink-muted">
        {t('flow.trust.footnote')}
      </p>
    </section>
  );
}
