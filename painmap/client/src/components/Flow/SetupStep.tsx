import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { SetupProfile } from '../../flow/types';

interface Props {
  setup: SetupProfile;
  onRestart: () => void;
}

export function SetupStep({ setup, onRestart }: Props) {
  const { t } = useTranslation();
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-rule bg-surface p-6 shadow-card"
    >
      <p className="font-mono text-[11px] tracking-[0.14em] text-ink-muted">{t('flow.setup.eyebrow')}</p>
      <h2 className="mt-1 font-display text-2xl leading-tight text-ink">{t('flow.setup.heading')}</h2>

      <div className="mt-4 grid gap-3">
        <div className="rounded-xl border border-rule bg-bg p-4">
          <p className="font-mono text-[11px] tracking-[0.1em] text-ink-muted">{t('flow.setup.equipmentLabel')}</p>
          <p className="mt-1 text-sm text-ink">{t(setup.equipmentRecommendation)}</p>
        </div>
        <div className="rounded-xl border border-rule bg-bg p-4">
          <p className="font-mono text-[11px] tracking-[0.1em] text-ink-muted">{t('flow.setup.deskLabel')}</p>
          <p className="mt-1 text-sm text-ink">{t(setup.deskRecommendation)}</p>
        </div>
        <div className="rounded-xl border border-rule bg-bg p-4">
          <p className="font-mono text-[11px] tracking-[0.1em] text-ink-muted">{t('flow.setup.breakLabel')}</p>
          <p className="mt-1 text-sm text-ink">{t(setup.breakProtocol)}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onRestart}
        className="mt-6 rounded-xl bg-ink px-4 py-2 text-sm font-medium text-bg transition hover:bg-accent"
      >
        {t('flow.setup.restart')}
      </button>
    </motion.section>
  );
}
