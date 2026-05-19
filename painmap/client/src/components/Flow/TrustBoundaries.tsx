export function TrustBoundaries() {
  return (
    <section className="rounded-2xl border border-rule bg-surface p-5 shadow-card">
      <h3 className="font-display text-2xl text-ink">What PainMap does and does not do</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-rule bg-bg p-4">
          <p className="font-mono text-[11px] tracking-[0.12em] text-evidence">WHAT PAINMAP DOES</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink">
            <li>Suggests evidence-based resistance-band exercises by pain location.</li>
            <li>Builds a simple, safety-first routine for common desk-related pain.</li>
            <li>Lets you track weekly adherence and symptom trend.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-rule bg-bg p-4">
          <p className="font-mono text-[11px] tracking-[0.12em] text-accent">WHAT PAINMAP DOES NOT DO</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink">
            <li>It does not diagnose medical conditions.</li>
            <li>It does not replace a clinician evaluation.</li>
            <li>It should not be used for trauma or red-flag symptoms.</li>
          </ul>
        </div>
      </div>
      <p className="mt-3 text-sm text-ink-muted">
        Need source details? Review the clinical references in the Evidence page.
      </p>
    </section>
  );
}
