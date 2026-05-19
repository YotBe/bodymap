import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { ClassificationResult, RoutinePlan } from '../../flow/types';
import { useExercisesByIds } from '../../api/exercises';

interface Props {
  plan: RoutinePlan;
  classification: ClassificationResult;
  onCompleteSession: () => void;
  onContinue: () => void;
}

export function RoutineStep({ plan, classification, onCompleteSession, onContinue }: Props) {
  const { data: exercises } = useExercisesByIds(plan.exerciseIds);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-rule bg-surface p-6 shadow-card"
    >
      <p className="font-mono text-[11px] tracking-[0.14em] text-ink-muted">STEP 4</p>
      <h2 className="mt-1 font-display text-2xl leading-tight text-ink">Your tailored band routine</h2>

      <div className="mt-4 grid gap-2 rounded-xl border border-rule bg-bg p-4 text-sm text-ink">
        <p><strong>Track:</strong> {classification.primaryTrack}</p>
        <p><strong>Intensity:</strong> {classification.intensity}</p>
        <p><strong>Duration:</strong> {classification.sessionMinutes} minutes</p>
        <p><strong>Dose:</strong> {plan.dosageOverride}</p>
      </div>

      <div className="mt-5 grid gap-3">
        {(exercises ?? []).map((exercise) => (
          <div key={exercise.id} className="rounded-xl border border-rule p-3">
            <p className="text-xs uppercase tracking-wide text-ink-muted">{exercise.subArea.name}</p>
            <h3 className="font-display text-xl text-ink">{exercise.name}</h3>
            <p className="text-sm text-ink-muted">{exercise.targetMuscles}</p>
            <div className="mt-2">
              <Link
                to={`/exercise/${exercise.id}`}
                className="text-sm text-accent underline decoration-rule underline-offset-2"
              >
                Open full exercise card
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-2 rounded-xl border border-rule bg-bg p-4 text-sm text-ink">
        <p><strong>Warm-up:</strong> {plan.warmupNote}</p>
        <p><strong>Cool-down:</strong> {plan.cooldownNote}</p>
        <p><strong>Progression:</strong> {plan.progressionRule}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onCompleteSession}
          className="rounded-xl bg-ink px-4 py-2 text-sm font-medium text-bg transition hover:bg-accent"
        >
          Mark session complete
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="rounded-xl border border-rule bg-surface px-4 py-2 text-sm text-ink transition hover:border-ink hover:bg-bg"
        >
          Continue to progress
        </button>
      </div>
    </motion.section>
  );
}
