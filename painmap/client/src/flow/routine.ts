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

  // The string fields below hold i18n keys (resolved with t() in RoutineStep),
  // not literal copy — so they re-localize when the user switches language.
  const dosageOverride = `flow.routine.dosage.${classification.intensity}`;

  const warmupNote =
    classification.primaryTrack === 'mobility-reset'
      ? 'flow.routine.warmup.mobility'
      : 'flow.routine.warmup.default';

  const cooldownNote =
    classification.primaryTrack === 'clinician-referral'
      ? 'flow.routine.cooldown.referral'
      : 'flow.routine.cooldown.default';

  const progressionRule = 'flow.routine.progressionRule';

  return {
    exerciseIds: chosen,
    dosageOverride,
    warmupNote,
    cooldownNote,
    progressionRule,
  };
}

export function buildSetupProfile(assessment: AssessmentAnswers): SetupProfile {
  // As with buildRoutinePlan, these are i18n keys resolved in SetupStep.
  const equipmentRecommendation = `flow.setup.equipment.${assessment.equipmentAccess}`;

  const deskRecommendation =
    assessment.deskHours === 'gt8' ? 'flow.setup.desk.gt8' : 'flow.setup.desk.default';

  const breakProtocol =
    assessment.movementBreaks === 'rarely'
      ? 'flow.setup.break.rarely'
      : assessment.movementBreaks === '1to2'
        ? 'flow.setup.break.1to2'
        : 'flow.setup.break.default';

  return {
    equipmentRecommendation,
    deskRecommendation,
    breakProtocol,
  };
}
