CREATE TABLE IF NOT EXISTS zones (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  view TEXT NOT NULL,
  display_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sub_areas (
  id TEXT PRIMARY KEY,
  zone_id TEXT NOT NULL REFERENCES zones(id),
  name TEXT NOT NULL,
  description TEXT,
  svg_path_id TEXT,
  display_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS exercises (
  id TEXT PRIMARY KEY,
  sub_area_id TEXT NOT NULL REFERENCES sub_areas(id),
  name TEXT NOT NULL,
  is_primary INTEGER NOT NULL DEFAULT 1,
  target_muscles TEXT NOT NULL,
  mechanism TEXT NOT NULL,
  instructions TEXT NOT NULL,
  sets INTEGER NOT NULL,
  reps TEXT NOT NULL,
  tempo TEXT,
  band_tension TEXT NOT NULL,
  band_tension_note TEXT,
  frequency TEXT NOT NULL,
  common_mistakes TEXT NOT NULL,
  contraindications TEXT NOT NULL,
  beginner_modification TEXT,
  evidence_short TEXT NOT NULL,
  evidence_full TEXT NOT NULL,
  evidence_summary TEXT NOT NULL,
  video_url TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sub_areas_zone ON sub_areas(zone_id);
CREATE INDEX IF NOT EXISTS idx_exercises_sub_area ON exercises(sub_area_id);
