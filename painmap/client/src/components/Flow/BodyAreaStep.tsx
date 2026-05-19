import { motion } from 'framer-motion';

export function BodyAreaStep() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-rule bg-surface p-6 shadow-card"
    >
      <p className="font-mono text-[11px] tracking-[0.14em] text-ink-muted">STEP 1 OF 3</p>
      <h2 className="mt-2 font-display text-3xl leading-tight text-ink">Select where you feel pain.</h2>
      <p className="mt-3 max-w-xl text-sm text-ink-muted">
        Choose a body region, then a specific spot. You will answer 4 quick questions next to tailor your routine.
      </p>
      <p className="mt-2 rounded-lg border border-rule bg-bg px-3 py-2 text-sm text-ink-muted">
        What happens next: focused intake (~2 minutes) → tailored plan with safety notes.
      </p>
    </motion.section>
  );
}
