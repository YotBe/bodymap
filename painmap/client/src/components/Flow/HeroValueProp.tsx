import { motion } from 'framer-motion';

interface Props {
  onStartScan: () => void;
  onOpenAssessment: () => void;
}

export function HeroValueProp({ onStartScan, onOpenAssessment }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-3xl border border-rule bg-gradient-to-br from-surface via-surface to-accent-soft/25 p-6 md:p-8 shadow-card"
    >
      <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-evidence/10 blur-2xl" />

      <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-rule bg-bg/80 px-3 py-1 font-mono text-[11px] tracking-[0.14em] text-ink-muted">
        OFFICE PAIN RELIEF, PERSONALIZED
      </p>

      <h1 className="max-w-xl font-display text-3xl leading-tight text-ink md:text-4xl">
        Office pain relief, personalized.
      </h1>

      <p className="mt-3 max-w-xl text-sm text-ink-muted md:text-base">
        Pick where it hurts, answer a few focused questions, and get one evidence-based resistance-band routine with clear safety guidance.
      </p>

      <div className="mt-5 rounded-xl border border-rule bg-bg px-3 py-2 text-xs text-ink-muted">
        No signup required. About 2 minutes.
      </div>

      <div className="mt-5 flex flex-col items-start gap-2">
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStartScan}
          className="group inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-medium text-bg transition-colors hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Start body scan
          <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
        </motion.button>

        <button
          onClick={onOpenAssessment}
          className="text-sm text-ink-muted underline decoration-rule underline-offset-2 transition hover:text-ink"
        >
          Skip to quick assessment
        </button>
      </div>
    </motion.section>
  );
}
