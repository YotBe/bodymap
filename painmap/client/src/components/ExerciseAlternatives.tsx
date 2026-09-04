import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Exercise } from '../types';
import { getAlternateExerciseIds, useExercisesByIds } from '../api/exercises';

interface Props {
  exercise: Exercise;
}

/* Lists the other exercises in this exercise's sub-area, each with its
   alternateReason, so users who can't perform the current one (pain, no
   equipment) have a vetted swap instead of abandoning the sub-area. */
export function ExerciseAlternatives({ exercise }: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const altIds = getAlternateExerciseIds(exercise.subArea.id, exercise.id);
  const { data: alternates } = useExercisesByIds(altIds);

  if (!alternates || alternates.length === 0) return null;

  return (
    <section
      className="rounded-2xl border border-rule bg-surface p-6 shadow-card flex flex-col gap-3"
      aria-labelledby="ex-alternates-title"
    >
      <h3 id="ex-alternates-title" className="font-display text-xl text-ink">
        {t('exerciseCard.alternatesTitle')}
      </h3>
      <ul className="flex flex-col gap-2">
        {alternates.map((alt) => (
          <li
            key={alt.id}
            className="flex justify-between items-center gap-3 border border-rule rounded-xl p-3 bg-bg/50"
          >
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold text-ink truncate">{alt.name}</p>
              {alt.alternateReason && (
                <p className="text-xs text-ink-muted leading-relaxed mt-1">{alt.alternateReason}</p>
              )}
            </div>
            <button
              type="button"
              className="btn-primary shrink-0"
              onClick={() => navigate(`/exercise/${alt.id}`)}
            >
              {t('exerciseCard.viewAlternate')}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
