import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface Props {
  /** Return to the safety screen so the answers can be amended. */
  onBack: () => void;
  onFindClinician: () => void;
}

/**
 * Shown the moment a red flag is ticked, instead of letting the user answer
 * three more screens before the results tell them to see a clinician. The
 * classifier already forces a high-risk clinician referral on any red flag —
 * this just stops asking questions whose answers cannot change that.
 */
export function RedFlagInterrupt({ onBack, onFindClinician }: Props) {
  const { t } = useTranslation();

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-accent/30 bg-surface p-6 shadow-card flex flex-col gap-4"
    >
      <div className="rounded-lg border border-accent/30 bg-accent-soft p-4">
        <h2 className="font-display text-2xl text-accent leading-snug">
          ⚠️ {t('assessment.redFlagTitle')}
        </h2>
      </div>
      <p className="text-sm text-ink-muted leading-relaxed">{t('assessment.redFlagBody')}</p>
      <div className="flex flex-col gap-2 mt-1">
        <button type="button" className="btn-primary w-full text-center" onClick={onFindClinician}>
          {t('assessment.redFlagFindClinician')}
        </button>
        <button type="button" className="btn-secondary w-full text-center" onClick={onBack}>
          {t('assessment.redFlagBack')}
        </button>
      </div>
    </motion.section>
  );
}
