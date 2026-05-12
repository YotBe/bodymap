export type BandColor = 'yellow' | 'red' | 'green' | 'blue' | 'black';

export interface BandInfo {
  color: BandColor;
  hex: string;
  force: string;
  note: string | null;
}

export interface Evidence {
  short: string;
  full: string;
  summary: string;
}

export interface SubAreaSummary {
  id: string;
  name: string;
  description: string | null;
  displayOrder: number;
  primaryExerciseId: string | null;
}

export interface Zone {
  id: string;
  name: string;
  view: 'anterior' | 'posterior' | 'both';
  displayOrder: number;
  subAreas: SubAreaSummary[];
}

export interface ExerciseSubAreaRef {
  id: string;
  name: string;
  description: string | null;
  zoneId: string;
  zoneName: string;
}

export interface Exercise {
  id: string;
  name: string;
  isPrimary: boolean;
  subArea: ExerciseSubAreaRef;
  targetMuscles: string;
  mechanism: string;
  instructions: string[];
  sets: number;
  reps: string;
  tempo: string | null;
  band: BandInfo;
  frequency: string;
  commonMistakes: string[];
  contraindications: string[];
  beginnerModification: string | null;
  evidence: Evidence;
  videoId: string;
  videoUrl: string;
}
