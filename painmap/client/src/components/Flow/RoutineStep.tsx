import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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

function variationText(intensity: ClassificationResult['intensity']) {
  if (intensity === 'low') {
    return {
      easier: 'Reduce range of motion and use a lighter band.',
      harder: 'Add a pause at end range before returning slowly.',
    };
  }
  if (intensity === 'medium') {
    return {
      easier: 'Drop one set and keep tempo smooth with light tension.',
      harder: 'Add one set or progress one band color when pain stays <= 3/10.',
    };
  }
  return {
    easier: 'Use one lighter band and shorter set duration for the first week.',
    harder: 'Increase resistance one level and add eccentric control (3 sec lowering).',
  };
}

export function RoutineStep({
  plan,
  classification,
  recap,
  onCompleteSession,
  onContinue,
}: Props) {
  const { data: exercises } = useExercisesByIds(plan.exerciseIds);
  const primary = exercises?.[0] ?? null;
  const variation = variationText(classification.intensity);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-rule bg-surface p-6 shadow-card"
    >
      <p className="font-mono text-[11px] tracking-[0.14em] text-ink-muted">STEP 3 OF 3</p>
      <h2 className="mt-1 font-display text-2xl leading-tight text-ink">Your plan</h2>

      <div className="mt-4 grid gap-2 rounded-xl border border-rule bg-bg p-4 text-sm text-ink">
        <p><strong>You selected:</strong> {recap.areaLabel}</p>
        <p><strong>Duration:</strong> {recap.durationLabel}</p>
        <p><strong>Main aggravator:</strong> {recap.aggravatingLabel}</p>
      </div>

      {primary && (
        <div className="mt-5 rounded-xl border border-rule p-4">
          <p className="text-xs uppercase tracking-wide text-ink-muted">Primary exercise</p>
          <h3 className="font-display text-2xl text-ink">{primary.name}</h3>
          <p className="text-sm text-ink-muted">{primary.targetMuscles}</p>

          {primary.videoUrl && (
            <div className="mt-3">
              <YouTubeFacade videoUrl={primary.videoUrl} title={primary.name} />
            </div>
          )}

          <div className="mt-3 rounded-lg border border-rule bg-bg p-3 text-sm text-ink">
            <p><strong>Prescription:</strong> {plan.dosageOverride}</p>
            <p className="mt-1"><strong>What you should feel:</strong> Gentle muscular effort around the target area, not sharp or radiating pain.</p>
          </div>

          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-ink">
            {primary.instructions.slice(0, 4).map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-rule bg-bg p-3 text-sm">
              <p className="font-medium text-ink">Easier variation</p>
              <p className="text-ink-muted">{variation.easier}</p>
            </div>
            <div className="rounded-lg border border-rule bg-bg p-3 text-sm">
              <p className="font-medium text-ink">Harder variation</p>
              <p className="text-ink-muted">{variation.harder}</p>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-accent bg-accent-soft p-3 text-sm text-ink">
            <p><strong>Safety:</strong> Stop if you feel sharp, radiating, or worsening pain.</p>
            <p className="mt-1">If symptoms worsen after exercise, reduce load next time or pause and consult a clinician.</p>
          </div>

          <div className="mt-4 rounded-lg border border-rule bg-bg p-3 text-sm text-ink">
            <p><strong>Evidence snippet:</strong> {primary.evidence.summary}</p>
            <Link to="/evidence" className="mt-2 inline-block text-accent underline">
              View full evidence references
            </Link>
          </div>

          <div className="mt-4 text-sm">
            <Link to={`/exercise/${primary.id}`} className="text-accent underline decoration-rule underline-offset-2">
              Open full exercise card (detailed cues + citation)
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
          Start session / log session
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="rounded-xl border border-rule bg-surface px-4 py-2 text-sm text-ink transition hover:border-ink hover:bg-bg"
        >
          View progress
        </button>
      </div>
    </motion.section>
  );
}
