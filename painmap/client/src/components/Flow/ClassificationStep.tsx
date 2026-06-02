import { motion } from 'framer-motion';
import type { ClassificationResult } from '../../flow/types';

interface Props {
  classification: ClassificationResult | null;
}

export function ClassificationStep({ classification }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-rule bg-surface p-6 shadow-card"
    >
      <p className="font-mono text-[11px] tracking-[0.14em] text-ink-muted">BUILDING YOUR PLAN</p>
      <h2 className="mt-1 font-display text-2xl leading-tight text-ink">Analyzing your recovery profile...</h2>

      <div className="mt-5 space-y-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0.4, opacity: 0.5 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: i * 0.12,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="h-2 origin-left rounded-full bg-accent-soft"
          />
        ))}
      </div>

      {classification && (
        <div className="mt-6 grid gap-2 rounded-xl border border-rule bg-bg p-4 text-sm">
          <p><strong>Risk tier:</strong> {classification.riskTier}</p>
          <p><strong>Track:</strong> {classification.primaryTrack}</p>
          <p><strong>Intensity:</strong> {classification.intensity}</p>
          <p><strong>Session length:</strong> {classification.sessionMinutes} min</p>
        </div>
      )}
    </motion.section>
  );
}
