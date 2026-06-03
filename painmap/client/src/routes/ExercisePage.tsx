import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useExercise } from '../api/exercises';
import { ExerciseCard } from '../components/ExerciseCard';
import { PaneEyebrow } from '../components/PaneEyebrow';

export function ExercisePage() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const [searchParams] = useSearchParams();
  const autoStartVideo = searchParams.get('play') === '1';
  const { data, isLoading, isError, error } = useExercise(exerciseId);
  const { t } = useTranslation();

  return (
    <>
      <PaneEyebrow num="02" label={t('pane.exerciseLabel')} />
      {isLoading && (
        <div className="zone-prompt">
          <h2 className="zp-headline">{t('exercise.loadingHeadline')}</h2>
        </div>
      )}
      {isError && (
        <div className="zone-prompt">
          <h2 className="zp-headline">{t('exercise.errorHeadline')}</h2>
          <p className="zp-sub">{(error as Error)?.message ?? t('exercise.errorUnknown')}</p>
        </div>
      )}
      {data && <ExerciseCard exercise={data} autoStartVideo={autoStartVideo} />}
    </>
  );
}
