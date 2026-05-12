import { useQuery } from '@tanstack/react-query';
import type {
  BandColor,
  BandInfo,
  Exercise,
  SubAreaSummary,
  Zone,
} from '../types';
import rawData from '../data/exercises.json';

interface RawExercise {
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

interface RawSubArea {
  id: string;
  name: string;
  description: string | null;
  svgPathId: string;
  displayOrder: number;
  exercises: RawExercise[];
}

interface RawZone {
  id: string;
  name: string;
  view: 'anterior' | 'posterior' | 'both';
  displayOrder: number;
  subAreas: RawSubArea[];
}

interface RawData {
  zones: RawZone[];
}

const DATA = rawData as RawData;

const BAND_SPECS: Record<BandColor, { hex: string; force: string }> = {
  yellow: { hex: '#FBE26B', force: '~3 lb @ 100%' },
  red: { hex: '#E27272', force: '~4 lb @ 100%' },
  green: { hex: '#7BBF8E', force: '~5 lb @ 100%' },
  blue: { hex: '#7BA4D9', force: '~6 lb @ 100%' },
  black: { hex: '#3D3D3D', force: '~9 lb @ 100%' },
};

function bandInfo(color: BandColor, note: string | null): BandInfo {
  const spec = BAND_SPECS[color];
  return { color, hex: spec.hex, force: spec.force, note };
}

function youtubeId(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : '';
}

function pickPrimaryExerciseId(sa: RawSubArea): string | null {
  const primary = sa.exercises.find((e) => e.isPrimary);
  return primary?.id ?? sa.exercises[0]?.id ?? null;
}

function buildZones(): Zone[] {
  return DATA.zones
    .slice()
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((z) => ({
      id: z.id,
      name: z.name,
      view: z.view,
      displayOrder: z.displayOrder,
      subAreas: z.subAreas
        .slice()
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map<SubAreaSummary>((sa) => ({
          id: sa.id,
          name: sa.name,
          description: sa.description,
          displayOrder: sa.displayOrder,
          primaryExerciseId: pickPrimaryExerciseId(sa),
        })),
    }));
}

function buildExerciseIndex(): Map<string, Exercise> {
  const map = new Map<string, Exercise>();
  for (const z of DATA.zones) {
    for (const sa of z.subAreas) {
      for (const e of sa.exercises) {
        map.set(e.id, {
          id: e.id,
          name: e.name,
          isPrimary: e.isPrimary,
          subArea: {
            id: sa.id,
            name: sa.name,
            description: sa.description,
            zoneId: z.id,
            zoneName: z.name,
          },
          targetMuscles: e.targetMuscles,
          mechanism: e.mechanism,
          instructions: e.instructions,
          sets: e.sets,
          reps: e.reps,
          tempo: e.tempo,
          band: bandInfo(e.bandTension, e.bandTensionNote),
          frequency: e.frequency,
          commonMistakes: e.commonMistakes,
          contraindications: e.contraindications,
          beginnerModification: e.beginnerModification,
          evidence: {
            short: e.evidenceShort,
            full: e.evidenceFull,
            summary: e.evidenceSummary,
          },
          videoId: youtubeId(e.videoUrl),
          videoUrl: e.videoUrl,
        });
      }
    }
  }
  return map;
}

const ZONES = buildZones();
const EXERCISE_INDEX = buildExerciseIndex();

export function useZones() {
  return useQuery({
    queryKey: ['zones'],
    queryFn: async () => ZONES,
    staleTime: Infinity,
  });
}

export function useExercise(id: string | undefined) {
  return useQuery({
    queryKey: ['exercise', id],
    queryFn: async () => {
      const ex = id ? EXERCISE_INDEX.get(id) : undefined;
      if (!ex) throw new Error(`Exercise not found: ${id}`);
      return ex;
    },
    enabled: !!id,
    staleTime: Infinity,
  });
}
