import { motion } from 'framer-motion';
import type { SetupProfile } from '../../flow/types';

interface Props {
  setup: SetupProfile;
  onRestart: () => void;
}

export function SetupStep({ setup, onRestart }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-rule bg-surface p-6 shadow-card"
    >
      <p className="font-mono text-[11px] tracking-[0.14em] text-ink-muted">STEP 6</p>
      <h2 className="mt-1 font-display text-2xl leading-tight text-ink">Equipment and desk setup</h2>

      <div className="mt-4 grid gap-3">
        <div className="rounded-xl border border-rule bg-bg p-4">
          <p className="font-mono text-[11px] tracking-[0.1em] text-ink-muted">EQUIPMENT</p>
          <p className="mt-1 text-sm text-ink">{setup.equipmentRecommendation}</p>
        </div>
        <div className="rounded-xl border border-rule bg-bg p-4">
          <p className="font-mono text-[11px] tracking-[0.1em] text-ink-muted">DESK SETUP</p>
          <p className="mt-1 text-sm text-ink">{setup.deskRecommendation}</p>
        </div>
        <div className="rounded-xl border border-rule bg-bg p-4">
          <p className="font-mono text-[11px] tracking-[0.1em] text-ink-muted">BREAK PROTOCOL</p>
          <p className="mt-1 text-sm text-ink">{setup.breakProtocol}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onRestart}
        className="mt-6 rounded-xl bg-ink px-4 py-2 text-sm font-medium text-bg transition hover:bg-accent"
      >
        Start a new assessment
      </button>
    </motion.section>
  );
}
