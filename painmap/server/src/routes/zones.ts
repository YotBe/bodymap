import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db/connection.js';
import type { ApiZone, ApiSubAreaSummary } from '../types.js';

const router = Router();

interface ZoneRow {
  id: string;
  name: string;
  view: 'anterior' | 'posterior' | 'both';
  display_order: number;
}

interface SubAreaWithPrimaryRow {
  id: string;
  zone_id: string;
  name: string;
  description: string | null;
  display_order: number;
  primary_exercise_id: string | null;
}

function loadZonesWithSubAreas(zoneIdFilter?: string): ApiZone[] {
  const zoneQuery = zoneIdFilter
    ? 'SELECT id, name, view, display_order FROM zones WHERE id = ? ORDER BY display_order'
    : 'SELECT id, name, view, display_order FROM zones ORDER BY display_order';
  const zones = (
    zoneIdFilter
      ? (db.prepare(zoneQuery).all(zoneIdFilter) as ZoneRow[])
      : (db.prepare(zoneQuery).all() as ZoneRow[])
  );

  if (zones.length === 0) return [];

  const subAreas = db
    .prepare(
      `SELECT sa.id, sa.zone_id, sa.name, sa.description, sa.display_order,
              (SELECT e.id FROM exercises e
                 WHERE e.sub_area_id = sa.id AND e.is_primary = 1
                 ORDER BY e.name LIMIT 1) AS primary_exercise_id
       FROM sub_areas sa
       WHERE sa.zone_id IN (${zones.map(() => '?').join(',')})
       ORDER BY sa.zone_id, sa.display_order`
    )
    .all(...zones.map((z) => z.id)) as SubAreaWithPrimaryRow[];

  const subsByZone = new Map<string, ApiSubAreaSummary[]>();
  for (const sa of subAreas) {
    const list = subsByZone.get(sa.zone_id) ?? [];
    list.push({
      id: sa.id,
      name: sa.name,
      description: sa.description,
      displayOrder: sa.display_order,
      primaryExerciseId: sa.primary_exercise_id,
    });
    subsByZone.set(sa.zone_id, list);
  }

  return zones.map((z) => ({
    id: z.id,
    name: z.name,
    view: z.view,
    displayOrder: z.display_order,
    subAreas: subsByZone.get(z.id) ?? [],
  }));
}

router.get('/', (_req, res) => {
  res.json(loadZonesWithSubAreas());
});

const zoneIdSchema = z.string().min(1).max(64);

router.get('/:zoneId', (req, res) => {
  const parsed = zoneIdSchema.safeParse(req.params.zoneId);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid zone id' });
  }
  const zones = loadZonesWithSubAreas(parsed.data);
  if (zones.length === 0) {
    return res.status(404).json({ error: 'Zone not found' });
  }
  res.json(zones[0]);
});

export default router;
