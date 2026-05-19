import type {
  AssessmentAnswers,
  ClassificationResult,
  RoutinePlan,
  SetupProfile,
} from './types';

export function buildRoutinePlan(
  classification: ClassificationResult,
  selectedExerciseId: string | null,
  fallbackExerciseIds: string[]
): RoutinePlan {
  const uniqueIds = Array.from(
    new Set([
      selectedExerciseId,
      ...fallbackExerciseIds,
    ].filter((v): v is string => !!v))
  );

  const exerciseCount = classification.intensity === 'low' ? 1 : classification.intensity === 'medium' ? 2 : 3;
  const chosen = uniqueIds.slice(0, Math.max(1, exerciseCount));

  const dosageOverride =
    classification.intensity === 'low'
      ? '2 sets, light band tension, smooth tempo.'
      : classification.intensity === 'medium'
        ? '2-3 sets, moderate tension, stop with 2 reps in reserve.'
        : '3 sets, progressive tension, full controlled range.';

  const warmupNote =
    classification.primaryTrack === 'mobility-reset'
      ? 'Start with 2 minutes of gentle joint mobility before loading.'
      : 'Start with 60-90 seconds of dynamic warm-up for the target area.';

  const cooldownNote =
    classification.primaryTrack === 'clinician-referral'
      ? 'Finish with low-load breathing and symptom check before stopping.'
      : 'Finish with 1-2 minutes of light stretching and breathing.';

  const progressionRule =
    'If pain stays <= 3/10 during and after sessions for 3 consecutive days, increase resistance one level or add 1 set.';

  return {
    exerciseIds: chosen,
    dosageOverride,
    warmupNote,
    cooldownNote,
    progressionRule,
  };
}

export function buildSetupProfile(assessment: AssessmentAnswers): SetupProfile {
  const equipmentRecommendation =
    assessment.equipmentAccess === 'bandOnly'
      ? 'Start with a light resistance band set (yellow + red) and a door anchor.'
      : assessment.equipmentAccess === 'bandAndChair'
        ? 'Add one medium resistance band (green) for progression.'
        : 'Keep your full band set sorted by color and log your working resistance.';

  const deskRecommendation =
    assessment.deskHours === 'gt8'
      ? 'Raise monitor to eye level, keep elbows near 90°, and add lumbar support.'
      : 'Keep monitor centered, feet grounded, and keyboard close to reduce shoulder load.';

  const breakProtocol =
    assessment.movementBreaks === 'rarely'
      ? 'Use a 30/2 protocol: every 30 minutes, take a 2-minute movement break.'
      : assessment.movementBreaks === '1to2'
        ? 'Upgrade to 3 movement breaks per work block with neck/shoulder resets.'
        : 'Maintain your current break habit and anchor one mobility drill per break.';

  return {
    equipmentRecommendation,
    deskRecommendation,
    breakProtocol,
  };
}
