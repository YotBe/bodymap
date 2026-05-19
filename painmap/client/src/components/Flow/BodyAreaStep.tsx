import { motion } from 'framer-motion';

export function BodyAreaStep() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-rule bg-surface p-6 shadow-card"
    >
      <p className="font-mono text-[11px] tracking-[0.14em] text-ink-muted">STEP 1</p>
      <h2 className="mt-2 font-display text-3xl leading-tight text-ink">Select where you feel pain.</h2>
      <p className="mt-3 max-w-xl text-sm text-ink-muted">
        Use the interactive body map on the left: pick a broad area, then a specific sub-area.
        Once selected, we will tailor your assessment and recovery routine.
      </p>
    </motion.section>
  );
}
