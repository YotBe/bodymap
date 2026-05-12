import { useParams } from 'react-router-dom';
import { useExercise } from '../api/exercises';
import { ExerciseCard } from '../components/ExerciseCard';
import { PaneEyebrow } from '../components/PaneEyebrow';

export function ExercisePage() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const { data, isLoading, isError, error } = useExercise(exerciseId);

  return (
    <>
      <PaneEyebrow num="02" label="EXERCISE" />
      {isLoading && (
        <div className="zone-prompt">
          <h2 className="zp-headline">Loading exercise…</h2>
        </div>
      )}
      {isError && (
        <div className="zone-prompt">
          <h2 className="zp-headline">Could not load exercise.</h2>
          <p className="zp-sub">{(error as Error)?.message ?? 'Unknown error'}</p>
        </div>
      )}
      {data && <ExerciseCard exercise={data} />}
    </>
  );
}
