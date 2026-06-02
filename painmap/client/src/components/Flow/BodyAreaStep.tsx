import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function BodyAreaStep() {
  const { t } = useTranslation();
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-rule bg-surface p-6 shadow-card"
    >
      <p className="font-mono text-[11px] tracking-[0.14em] text-ink-muted">{t('flow.bodyArea.step')}</p>
      <h2 className="mt-2 font-display text-3xl leading-tight text-ink">{t('flow.bodyArea.heading')}</h2>
      <p className="mt-3 max-w-xl text-sm text-ink-muted">
        {t('flow.bodyArea.sub')}
      </p>
      <p className="mt-2 rounded-lg border border-rule bg-bg px-3 py-2 text-sm text-ink-muted">
        {t('flow.bodyArea.next')}
      </p>
    </motion.section>
  );
}
