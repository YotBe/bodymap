import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db/connection.js';
import { rowToApiExercise } from './subAreas.js';

const router = Router();

const exerciseIdSchema = z.string().min(1).max(64);

router.get('/:exerciseId', (req, res) => {
  const parsed = exerciseIdSchema.safeParse(req.params.exerciseId);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid exercise id' });
  }

  const row = db
    .prepare(
      `SELECT e.*, sa.name AS sub_area_name, sa.description AS sub_area_description,
              z.id AS zone_id, z.name AS zone_name
       FROM exercises e
       JOIN sub_areas sa ON sa.id = e.sub_area_id
       JOIN zones z ON z.id = sa.zone_id
       WHERE e.id = ?`
    )
    .get(parsed.data) as Parameters<typeof rowToApiExercise>[0] | undefined;

  if (!row) {
    return res.status(404).json({ error: 'Exercise not found' });
  }

  res.json(rowToApiExercise(row));
});

export default router;
