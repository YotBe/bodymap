import type {
  AssessmentAnswers,
  ClassificationResult,
  IntensityLevel,
  PrimaryTrack,
  RiskTier,
} from './types';

function hasAnyRedFlag(answers: AssessmentAnswers): boolean {
  const f = answers.redFlags;
  return f.recentTrauma || f.radiatingSymptoms || f.systemicSymptoms || f.nightPain;
}

function scoreRisk(answers: AssessmentAnswers): number {
  let score = 0;
  if (answers.painIntensity >= 8) score += 3;
  else if (answers.painIntensity >= 6) score += 2;
  else if (answers.painIntensity >= 4) score += 1;

  if (answers.painDuration === 'chronic') score += 2;
  else if (answers.painDuration === 'subacute') score += 1;

  if (answers.symptomBehavior === 'worseWithMovement') score += 2;
  else if (answers.symptomBehavior === 'mixed') score += 1;

  if (answers.deskHours === 'gt8') score += 2;
  else if (answers.deskHours === '6to8') score += 1;

  if (answers.movementBreaks === 'rarely') score += 2;
  else if (answers.movementBreaks === '1to2') score += 1;

  if (answers.equipmentAccess === 'none') score += 1;

  return score;
}

function deriveTrack(answers: AssessmentAnswers, riskTier: RiskTier): PrimaryTrack {
  if (riskTier === 'high') return 'clinician-referral';

  if (answers.symptomBehavior === 'betterWithMovement' && answers.painDuration !== 'acute') {
    return 'strength-foundation';
  }

  if (answers.symptomBehavior === 'worseWithMovement' || answers.painIntensity >= 7) {
    return 'mobility-reset';
  }

  return 'stability-posture';
}

function deriveIntensity(riskTier: RiskTier, riskScore: number): IntensityLevel {
  if (riskTier === 'high') return 'low';
  if (riskScore >= 7) return 'low';
  if (riskScore >= 4) return 'medium';
  return 'high';
}

function deriveSessionMinutes(riskTier: RiskTier, intensity: IntensityLevel): number {
  if (riskTier === 'high') return 8;
  if (intensity === 'low') return 10;
  if (intensity === 'medium') return 14;
  return 18;
}

export function classifyAssessment(answers: AssessmentAnswers): ClassificationResult {
  const redFlags = hasAnyRedFlag(answers);
  const riskScore = scoreRisk(answers);

  const riskTier: RiskTier = redFlags
    ? 'high'
    : riskScore >= 9
      ? 'high'
      : riskScore >= 5
        ? 'moderate'
        : 'low';

  const primaryTrack = deriveTrack(answers, riskTier);
  const intensity = deriveIntensity(riskTier, riskScore);
  const sessionMinutes = deriveSessionMinutes(riskTier, intensity);

  const rationale: string[] = [];

  if (redFlags) rationale.push('Red-flag symptoms detected; clinician-first path recommended.');
  if (answers.deskHours === 'gt8' || answers.movementBreaks === 'rarely') {
    rationale.push('High desk load and limited breaks increase postural strain risk.');
  }
  if (answers.symptomBehavior === 'betterWithMovement') {
    rationale.push('Symptoms improving with movement suggest loading tolerance can be built.');
  }
  if (answers.symptomBehavior === 'worseWithMovement') {
    rationale.push('Symptoms aggravated by movement indicate a lower-intensity reset phase.');
  }
  if (rationale.length === 0) {
    rationale.push('Balanced profile supports a progressive posture-stability plan.');
  }

  return {
    riskTier,
    primaryTrack,
    intensity,
    sessionMinutes,
    rationale,
  };
}
