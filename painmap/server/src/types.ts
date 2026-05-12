export type BandColor = 'yellow' | 'red' | 'green' | 'blue' | 'black';

export interface SeedExercise {
  id: string;
  name: string;
  isPrimary: boolean;
  targetMuscles: string;
  mechanism: string;
  instructions: string[];
  sets: number;
  reps: string;
  tempo: string | null;
  bandTension: BandColor;
  bandTensionNote: string | null;
  frequency: string;
  commonMistakes: string[];
  contraindications: string[];
  beginnerModification: string | null;
  evidenceShort: string;
  evidenceFull: string;
  evidenceSummary: string;
  videoUrl: string;
}

export interface SeedSubArea {
  id: string;
  name: string;
  description: string | null;
  svgPathId: string | null;
  displayOrder: number;
  exercises: SeedExercise[];
}

export interface SeedZone {
  id: string;
  name: string;
  view: 'anterior' | 'posterior' | 'both';
  displayOrder: number;
  subAreas: SeedSubArea[];
}

export interface SeedData {
  zones: SeedZone[];
}

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

export interface ApiSubAreaSummary {
  id: string;
  name: string;
  description: string | null;
  displayOrder: number;
  primaryExerciseId: string | null;
}

export interface ApiZone {
  id: string;
  name: string;
  view: 'anterior' | 'posterior' | 'both';
  displayOrder: number;
  subAreas: ApiSubAreaSummary[];
}

export interface ApiExerciseSubAreaRef {
  id: string;
  name: string;
  description: string | null;
  zoneId: string;
  zoneName: string;
}

export interface ApiExercise {
  id: string;
  name: string;
  isPrimary: boolean;
  subArea: ApiExerciseSubAreaRef;
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
