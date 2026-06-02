import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { ProgressSnapshot } from '../../flow/types';

interface Props {
  snapshot: ProgressSnapshot;
  onUpdatePain: (painScore: number) => void;
  onNext: () => void;
  onViewSetup?: () => void;
}

export function ProgressStep({ snapshot, onUpdatePain, onNext, onViewSetup }: Props) {
  const [painScore, setPainScore] = useState<number>(snapshot.lastPainScore ?? 4);

  const trendLabel = useMemo(() => {
    if (snapshot.lastPainScore === null) return 'No trend yet';
    if (snapshot.lastPainScore <= 3) return 'Better';
    if (snapshot.lastPainScore <= 6) return 'Same';
    return 'Worse';
  }, [snapshot.lastPainScore]);

  const weeklyDone = Math.min(snapshot.completedSessions, 7);

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-rule bg-surface p-6 shadow-card"
    >
      <p className="font-mono text-[11px] tracking-[0.14em] text-ink-muted">PROGRESS</p>
      <h2 className="mt-1 font-display text-2xl leading-tight text-ink">Your weekly check-in</h2>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
        <div className="rounded-xl border border-rule bg-bg p-3">
          <p className="text-ink-muted">Days done this week</p>
          <p className="font-display text-2xl text-ink">{weeklyDone}/7</p>
        </div>
        <div className="rounded-xl border border-rule bg-bg p-3">
          <p className="text-ink-muted">Streak</p>
          <p className="font-display text-2xl text-ink">{snapshot.streakDays}d</p>
        </div>
        <div className="rounded-xl border border-rule bg-bg p-3">
          <p className="text-ink-muted">Trend</p>
          <p className="font-display text-2xl text-ink">{trendLabel}</p>
        </div>
        <div className="rounded-xl border border-rule bg-bg p-3">
          <p className="text-ink-muted">Confidence</p>
          <p className="font-display text-2xl text-ink">{snapshot.confidenceLevel}</p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-rule p-4">
        <label className="grid gap-2 text-sm text-ink">
          Log your pain score today (0-10)
          <input
            type="range"
            min={0}
            max={10}
            value={painScore}
            onChange={(e) => setPainScore(Number(e.target.value))}
          />
          <span className="text-xs text-ink-muted">Current: {painScore}/10</span>
        </label>
        <button
          type="button"
          className="mt-3 rounded-xl bg-ink px-4 py-2 text-sm font-medium text-bg transition hover:bg-accent"
          onClick={() => onUpdatePain(painScore)}
        >
          Save check-in
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onNext}
          className="rounded-xl border border-rule bg-surface px-4 py-2 text-sm text-ink transition hover:border-ink hover:bg-bg"
        >
          Back to today's plan
        </button>
        {onViewSetup && (
          <button
            type="button"
            onClick={onViewSetup}
            className="rounded-xl border border-rule bg-surface px-4 py-2 text-sm text-ink transition hover:border-ink hover:bg-bg"
          >
            Desk &amp; equipment setup
          </button>
        )}
      </div>
    </motion.section>
  );
}
