export interface AssessmentAnswers {
  painIntensity: number; // 1 to 10
  painDuration: 'lt1w' | '1to6w' | 'gt6w';
  symptomBehavior: 'betterWithMovement' | 'worseWithMovement' | 'mixed';
  aggravatingMovement: 'sittingLong' | 'overheadReach' | 'typingMouse' | 'liftingCarry' | 'bendingTwisting' | 'stairsWalk';
  deskHours: 'lt4' | '4to6' | '6to8' | 'gt8';
  movementBreaks: 'rarely' | '1to2' | '3plus';
  equipmentAccess: 'bandOnly' | 'bandAndChair' | 'fullSet';
  redFlags: {
    recentTrauma: boolean;
    radiatingSymptoms: boolean;
    systemicSymptoms: boolean;
    nightPain: boolean;
  };
}

export interface AssessmentResult {
  riskTier: 'low' | 'moderate' | 'high';
  primaryTrack: 'strength-foundation' | 'clinician-referral' | 'stability-posture' | 'mobility-reset';
  intensity: 'low' | 'medium' | 'high';
  sessionMinutes: number;
  rationale: string[];
}
