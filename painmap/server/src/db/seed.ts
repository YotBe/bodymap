import type { Database } from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { SeedData } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, '..', 'data', 'exercises.json');

export function seedDatabase(db: Database): void {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  const data: SeedData = JSON.parse(raw);

  const insertZone = db.prepare(
    'INSERT INTO zones (id, name, view, display_order) VALUES (?, ?, ?, ?)'
  );
  const insertSubArea = db.prepare(
    'INSERT INTO sub_areas (id, zone_id, name, description, svg_path_id, display_order) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const insertExercise = db.prepare(`
    INSERT INTO exercises (
      id, sub_area_id, name, is_primary,
      target_muscles, mechanism, instructions,
      sets, reps, tempo,
      band_tension, band_tension_note, frequency,
      common_mistakes, contraindications, beginner_modification,
      evidence_short, evidence_full, evidence_summary, video_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const seedAll = db.transaction(() => {
    for (const zone of data.zones) {
      insertZone.run(zone.id, zone.name, zone.view, zone.displayOrder);
      for (const subArea of zone.subAreas) {
        insertSubArea.run(
          subArea.id,
          zone.id,
          subArea.name,
          subArea.description,
          subArea.svgPathId,
          subArea.displayOrder
        );
        for (const ex of subArea.exercises) {
          insertExercise.run(
            ex.id,
            subArea.id,
            ex.name,
            ex.isPrimary ? 1 : 0,
            ex.targetMuscles,
            ex.mechanism,
            JSON.stringify(ex.instructions),
            ex.sets,
            ex.reps,
            ex.tempo,
            ex.bandTension,
            ex.bandTensionNote,
            ex.frequency,
            JSON.stringify(ex.commonMistakes),
            JSON.stringify(ex.contraindications),
            ex.beginnerModification,
            ex.evidenceShort,
            ex.evidenceFull,
            ex.evidenceSummary,
            ex.videoUrl
          );
        }
      }
    }
  });

  seedAll();
}
