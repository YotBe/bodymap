import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { ClassificationResult, RoutinePlan } from '../../flow/types';
import { useExercisesByIds } from '../../api/exercises';
import { YouTubeFacade } from '../YouTubeFacade';

interface Props {
  plan: RoutinePlan;
  classification: ClassificationResult;
  recap: {
    areaLabel: string;
    durationLabel: string;
    aggravatingLabel: string;
  };
  onCompleteSession: () => void;
  onContinue: () => void;
}

export function RoutineStep({
  plan,
  classification,
  recap,
  onCompleteSession,
  onContinue,
}: Props) {
  const { t } = useTranslation();
  const { data: exercises } = useExercisesByIds(plan.exerciseIds);
  const primary = exercises?.[0] ?? null;
  const variation = {
    easier: t(`flow.routine.variation.${classification.intensity}.easier`),
    harder: t(`flow.routine.variation.${classification.intensity}.harder`),
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-rule bg-surface p-6 shadow-card"
    >
      <p className="font-mono text-[11px] tracking-[0.14em] text-ink-muted">{t('flow.routine.step')}</p>
      <h2 className="mt-1 font-display text-2xl leading-tight text-ink">{t('flow.routine.heading')}</h2>

      <div className="mt-4 grid gap-2 rounded-xl border border-rule bg-bg p-4 text-sm text-ink">
        <p><strong>{t('flow.routine.selected')}</strong> {recap.areaLabel}</p>
        <p><strong>{t('flow.routine.duration')}</strong> {recap.durationLabel}</p>
        <p><strong>{t('flow.routine.aggravator')}</strong> {recap.aggravatingLabel}</p>
      </div>

      {primary && (
        <div className="mt-5 rounded-xl border border-rule p-4">
          <p className="text-xs uppercase tracking-wide text-ink-muted">{t('flow.routine.primaryExercise')}</p>
          <h3 className="font-display text-2xl text-ink">{primary.name}</h3>
          <p className="text-sm text-ink-muted">{primary.targetMuscles}</p>

          {primary.videoUrl && (
            <div className="mt-3">
              <YouTubeFacade videoUrl={primary.videoUrl} title={primary.name} />
            </div>
          )}

          <div className="mt-3 rounded-lg border border-rule bg-bg p-3 text-sm text-ink">
            <p><strong>{t('flow.routine.prescription')}</strong> {t(plan.dosageOverride)}</p>
            <p className="mt-1"><strong>{t('flow.routine.feelLabel')}</strong> {t('flow.routine.feelText')}</p>
          </div>

          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-ink">
            {primary.instructions.slice(0, 4).map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-rule bg-bg p-3 text-sm">
              <p className="font-medium text-ink">{t('flow.routine.easier')}</p>
              <p className="text-ink-muted">{variation.easier}</p>
            </div>
            <div className="rounded-lg border border-rule bg-bg p-3 text-sm">
              <p className="font-medium text-ink">{t('flow.routine.harder')}</p>
              <p className="text-ink-muted">{variation.harder}</p>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-accent bg-accent-soft p-3 text-sm text-ink">
            <p><strong>{t('flow.routine.safetyLabel')}</strong> {t('flow.routine.safetyText')}</p>
            <p className="mt-1">{t('flow.routine.safetyText2')}</p>
          </div>

          <div className="mt-4 rounded-lg border border-rule bg-bg p-3 text-sm text-ink">
            <p><strong>{t('flow.routine.evidenceLabel')}</strong> {primary.evidence.summary}</p>
            <Link to="/evidence" className="mt-2 inline-block text-accent underline">
              {t('flow.routine.viewEvidence')}
            </Link>
          </div>

          <div className="mt-4 text-sm">
            <Link to={`/exercise/${primary.id}`} className="text-accent underline decoration-rule underline-offset-2">
              {t('flow.routine.openCard')}
            </Link>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onCompleteSession}
          className="rounded-xl bg-ink px-4 py-2 text-sm font-medium text-bg transition hover:bg-accent"
        >
          {t('flow.routine.startSession')}
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="rounded-xl border border-rule bg-surface px-4 py-2 text-sm text-ink transition hover:border-ink hover:bg-bg"
        >
          {t('flow.routine.viewProgress')}
        </button>
      </div>
    </motion.section>
  );
}
