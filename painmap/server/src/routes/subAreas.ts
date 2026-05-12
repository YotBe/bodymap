import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db/connection.js';
import { bandInfo } from '../lib/bandLookup.js';
import { youtubeId } from '../lib/youtubeId.js';
import type { ApiExercise, BandColor } from '../types.js';

const router = Router();

interface ExerciseRow {
  id: string;
  sub_area_id: string;
  name: string;
  is_primary: number;
  target_muscles: string;
  mechanism: string;
  instructions: string;
  sets: number;
  reps: string;
  tempo: string | null;
  band_tension: BandColor;
  band_tension_note: string | null;
  frequency: string;
  common_mistakes: string;
  contraindications: string;
  beginner_modification: string | null;
  evidence_short: string;
  evidence_full: string;
  evidence_summary: string;
  video_url: string;
  sub_area_name: string;
  sub_area_description: string | null;
  zone_id: string;
  zone_name: string;
}

export function rowToApiExercise(r: ExerciseRow): ApiExercise {
  return {
    id: r.id,
    name: r.name,
    isPrimary: r.is_primary === 1,
    subArea: {
      id: r.sub_area_id,
      name: r.sub_area_name,
      description: r.sub_area_description,
      zoneId: r.zone_id,
      zoneName: r.zone_name,
    },
    targetMuscles: r.target_muscles,
    mechanism: r.mechanism,
    instructions: JSON.parse(r.instructions) as string[],
    sets: r.sets,
    reps: r.reps,
    tempo: r.tempo,
    band: bandInfo(r.band_tension, r.band_tension_note),
    frequency: r.frequency,
    commonMistakes: JSON.parse(r.common_mistakes) as string[],
    contraindications: JSON.parse(r.contraindications) as string[],
    beginnerModification: r.beginner_modification,
    evidence: {
      short: r.evidence_short,
      full: r.evidence_full,
      summary: r.evidence_summary,
    },
    videoId: youtubeId(r.video_url),
    videoUrl: r.video_url,
  };
}

const subAreaIdSchema = z.string().min(1).max(64);

router.get('/:subAreaId/exercises', (req, res) => {
  const parsed = subAreaIdSchema.safeParse(req.params.subAreaId);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid sub-area id' });
  }

  const subAreaExists = db
    .prepare('SELECT 1 FROM sub_areas WHERE id = ?')
    .get(parsed.data);
  if (!subAreaExists) {
    return res.status(404).json({ error: 'Sub-area not found' });
  }

  const rows = db
    .prepare(
      `SELECT e.*, sa.name AS sub_area_name, sa.description AS sub_area_description,
              z.id AS zone_id, z.name AS zone_name
       FROM exercises e
       JOIN sub_areas sa ON sa.id = e.sub_area_id
       JOIN zones z ON z.id = sa.zone_id
       WHERE e.sub_area_id = ?
       ORDER BY e.is_primary DESC, e.name ASC`
    )
    .all(parsed.data) as ExerciseRow[];

  res.json(rows.map(rowToApiExercise));
});

export default router;
