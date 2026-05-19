export type FlowStep =
  | 'hero'
  | 'map'
  | 'assessment'
  | 'classification'
  | 'routine'
  | 'progress'
  | 'setup';

export type PainDuration = 'lt1w' | '1to6w' | 'gt6w';
export type SymptomBehavior = 'betterWithMovement' | 'mixed' | 'worseWithMovement';
export type AggravatingMovement =
  | 'overheadReach'
  | 'sittingLong'
  | 'typingMouse'
  | 'liftingCarry'
  | 'stairsWalk'
  | 'bendingTwisting';
export type DeskHours = 'lt4' | '4to6' | '6to8' | 'gt8';
export type MovementBreaks = 'rarely' | '1to2' | '3plus';
export type EquipmentAccess = 'bandOnly' | 'bandAndChair' | 'fullSet';

export interface RedFlagAnswers {
  recentTrauma: boolean;
  radiatingSymptoms: boolean;
  systemicSymptoms: boolean;
  nightPain: boolean;
}

export interface AssessmentAnswers {
  painIntensity: number;
  painDuration: PainDuration;
  symptomBehavior: SymptomBehavior;
  aggravatingMovement: AggravatingMovement;
  deskHours: DeskHours;
  movementBreaks: MovementBreaks;
  equipmentAccess: EquipmentAccess;
  redFlags: RedFlagAnswers;
}

export type RiskTier = 'low' | 'moderate' | 'high';
export type PrimaryTrack =
  | 'mobility-reset'
  | 'strength-foundation'
  | 'stability-posture'
  | 'clinician-referral';
export type IntensityLevel = 'low' | 'medium' | 'high';

export interface ClassificationResult {
  riskTier: RiskTier;
  primaryTrack: PrimaryTrack;
  intensity: IntensityLevel;
  sessionMinutes: number;
  rationale: string[];
}

export interface RoutinePlan {
  exerciseIds: string[];
  dosageOverride: string;
  warmupNote: string;
  cooldownNote: string;
  progressionRule: string;
}

export interface ProgressSnapshot {
  completedSessions: number;
  streakDays: number;
  lastPainScore: number | null;
  adherencePercent: number;
  confidenceLevel: 'low' | 'medium' | 'high';
  lastCompletedAt: string | null;
}

export interface SetupProfile {
  equipmentRecommendation: string;
  deskRecommendation: string;
  breakProtocol: string;
}

export interface FlowSessionState {
  step: FlowStep;
  selectedZoneId: string | null;
  selectedSubAreaId: string | null;
  selectedExerciseId: string | null;
  assessment: AssessmentAnswers | null;
  classification: ClassificationResult | null;
  routine: RoutinePlan | null;
  setup: SetupProfile | null;
  progress: ProgressSnapshot;
  updatedAt: string;
}

export const DEFAULT_PROGRESS: ProgressSnapshot = {
  completedSessions: 0,
  streakDays: 0,
  lastPainScore: null,
  adherencePercent: 0,
  confidenceLevel: 'medium',
  lastCompletedAt: null,
};

export const DEFAULT_ASSESSMENT: AssessmentAnswers = {
  painIntensity: 5,
  painDuration: '1to6w',
  symptomBehavior: 'mixed',
  aggravatingMovement: 'sittingLong',
  deskHours: '6to8',
  movementBreaks: '1to2',
  equipmentAccess: 'bandOnly',
  redFlags: {
    recentTrauma: false,
    radiatingSymptoms: false,
    systemicSymptoms: false,
    nightPain: false,
  },
};
