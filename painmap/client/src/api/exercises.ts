import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type {
  BandColor,
  BandInfo,
  Exercise,
  SubAreaSummary,
  Zone,
} from '../types';
import rawData from '../data/exercises.json';
import heOverrides from '../data/exercises.he.json';

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
  demoVideoMp4?: string | null;
  demoLottie?: string | null;
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
          videoUrl: e.videoUrl,
          demoVideoMp4: e.demoVideoMp4 ?? null,
          demoLottie: e.demoLottie ?? null,
        });
      }
    }
  }
  return map;
}

const ZONES = buildZones();
const EXERCISE_INDEX = buildExerciseIndex();
const SUBAREA_INDEX = (() => {
  const map = new Map<
    string,
    {
      id: string;
      name: string;
      description: string | null;
      zoneId: string;
      zoneName: string;
      primaryExerciseId: string | null;
    }
  >();
  for (const z of ZONES) {
    for (const sa of z.subAreas) {
      map.set(sa.id, {
        id: sa.id,
        name: sa.name,
        description: sa.description,
        zoneId: z.id,
        zoneName: z.name,
        primaryExerciseId: sa.primaryExerciseId,
      });
    }
  }
  return map;
})();
const ZONE_PRIMARY_EXERCISES = (() => {
  const map = new Map<string, string[]>();
  for (const z of ZONES) {
    map.set(
      z.id,
      z.subAreas
        .map((sa) => sa.primaryExerciseId)
        .filter((id): id is string => !!id)
    );
  }
  return map;
})();

interface HeSubAreaOverride {
  name?: string;
  description?: string | null;
}
interface HeExerciseOverride {
  name?: string;
  targetMuscles?: string;
  mechanism?: string;
  instructions?: string[];
  tempo?: string | null;
  bandTensionNote?: string | null;
  frequency?: string;
  commonMistakes?: string[];
  contraindications?: string[];
  beginnerModification?: string | null;
  evidenceSummary?: string;
}
interface HeOverrides {
  subAreas: Record<string, HeSubAreaOverride>;
  exercises: Record<string, HeExerciseOverride>;
}
const HE = heOverrides as HeOverrides;

export function hasHebrewOverride(exerciseId: string): boolean {
  return Object.prototype.hasOwnProperty.call(HE.exercises, exerciseId);
}

function applyHeExercise(ex: Exercise): Exercise {
  const heEx = HE.exercises[ex.id];
  const heSa = HE.subAreas[ex.subArea.id];
  if (!heEx && !heSa) return ex;
  return {
    ...ex,
    name: heEx?.name ?? ex.name,
    targetMuscles: heEx?.targetMuscles ?? ex.targetMuscles,
    mechanism: heEx?.mechanism ?? ex.mechanism,
    instructions: heEx?.instructions ?? ex.instructions,
    tempo: heEx?.tempo !== undefined ? heEx.tempo : ex.tempo,
    band: heEx?.bandTensionNote !== undefined
      ? { ...ex.band, note: heEx.bandTensionNote }
      : ex.band,
    frequency: heEx?.frequency ?? ex.frequency,
    commonMistakes: heEx?.commonMistakes ?? ex.commonMistakes,
    contraindications: heEx?.contraindications ?? ex.contraindications,
    beginnerModification: heEx?.beginnerModification !== undefined
      ? heEx.beginnerModification
      : ex.beginnerModification,
    evidence: heEx?.evidenceSummary
      ? { ...ex.evidence, summary: heEx.evidenceSummary }
      : ex.evidence,
    subArea: heSa
      ? {
          ...ex.subArea,
          name: heSa.name ?? ex.subArea.name,
          description: heSa.description !== undefined ? heSa.description : ex.subArea.description,
        }
      : ex.subArea,
  };
}

function applyHeZones(zones: Zone[]): Zone[] {
  return zones.map((z) => ({
    ...z,
    subAreas: z.subAreas.map((sa) => {
      const heSa = HE.subAreas[sa.id];
      if (!heSa) return sa;
      return {
        ...sa,
        name: heSa.name ?? sa.name,
        description: heSa.description !== undefined ? heSa.description : sa.description,
      };
    }),
  }));
}

const ZONES_HE = applyHeZones(ZONES);

export function useZones() {
  const { i18n } = useTranslation();
  const isHebrew = (i18n.language || 'en').startsWith('he');
  return useQuery({
    queryKey: ['zones', isHebrew ? 'he' : 'en'],
    queryFn: async () => (isHebrew ? ZONES_HE : ZONES),
    staleTime: Infinity,
  });
}

export function useExercise(id: string | undefined) {
  const { i18n } = useTranslation();
  const isHebrew = (i18n.language || 'en').startsWith('he');
  return useQuery({
    queryKey: ['exercise', id, isHebrew ? 'he' : 'en'],
    queryFn: async () => {
      const ex = id ? EXERCISE_INDEX.get(id) : undefined;
      if (!ex) throw new Error(`Exercise not found: ${id}`);
      return isHebrew ? applyHeExercise(ex) : ex;
    },
    enabled: !!id,
    staleTime: Infinity,
  });
}

export function useExercisesByIds(ids: string[]) {
  const { i18n } = useTranslation();
  const isHebrew = (i18n.language || 'en').startsWith('he');
  const normalized = ids.filter(Boolean);
  return useQuery({
    queryKey: ['exercise-batch', normalized.join(','), isHebrew ? 'he' : 'en'],
    queryFn: async () => {
      return normalized
        .map((id) => EXERCISE_INDEX.get(id))
        .filter((ex): ex is Exercise => !!ex)
        .map((ex) => (isHebrew ? applyHeExercise(ex) : ex));
    },
    enabled: normalized.length > 0,
    staleTime: Infinity,
  });
}

export function getSubAreaById(subAreaId: string) {
  return SUBAREA_INDEX.get(subAreaId) ?? null;
}

export function getPrimaryExerciseIdsForZone(zoneId: string): string[] {
  return ZONE_PRIMARY_EXERCISES.get(zoneId)?.slice() ?? [];
}

export interface EvidenceEntry {
  zoneId: string;
  zoneName: string;
  subAreaId: string;
  subAreaName: string;
  exerciseId: string;
  exerciseName: string;
  evidenceShort: string;
  evidenceFull: string;
  evidenceSummary: string;
}

const EVIDENCE_LIST: EvidenceEntry[] = (() => {
  const out: EvidenceEntry[] = [];
  for (const z of [...DATA.zones].sort((a, b) => a.displayOrder - b.displayOrder)) {
    for (const sa of [...z.subAreas].sort((a, b) => a.displayOrder - b.displayOrder)) {
      for (const e of sa.exercises) {
        if (!e.isPrimary) continue;
        out.push({
          zoneId: z.id,
          zoneName: z.name,
          subAreaId: sa.id,
          subAreaName: sa.name,
          exerciseId: e.id,
          exerciseName: e.name,
          evidenceShort: e.evidenceShort,
          evidenceFull: e.evidenceFull,
          evidenceSummary: e.evidenceSummary,
        });
      }
    }
  }
  return out;
})();

export const TRACK_EXERCISES: Record<
  'strength-foundation' | 'stability-posture' | 'mobility-reset' | 'clinician-referral',
  string[]
> = {
  'strength-foundation': [
    'ex-band-shrug',
    'ex-seated-row',
    'ex-banded-glute-bridge',
    'ex-banded-tke',
  ],
  'stability-posture': [
    'ex-face-pull',
    'ex-ytw',
    'ex-chin-tuck-band',
    'ex-banded-clamshell',
  ],
  'mobility-reset': [
    'ex-levator-stretch',
    'ex-median-nerve-glide',
    'ex-plantar-fascia-stretch',
    'ex-good-morning',
  ],
  'clinician-referral': [],
};

export function getExercisesForTrack(track: keyof typeof TRACK_EXERCISES): Exercise[] {
  const ids = TRACK_EXERCISES[track] ?? [];
  return ids
    .map((id) => EXERCISE_INDEX.get(id))
    .filter((ex): ex is Exercise => !!ex);
}

export function useEvidenceList() {
  return useQuery({
    queryKey: ['evidence-list'],
    queryFn: async () => EVIDENCE_LIST,
    staleTime: Infinity,
  });
}
