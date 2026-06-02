#!/usr/bin/env node
/* Verifies the exercise dataset is internally consistent and that every
   exercise will actually render. Catches the kind of silent data-entry
   regressions that the type system can't: a videoUrl that no longer parses
   as a YouTube id (degrading the demo to a bare link), an empty required
   field the UI assumes is present, or a Hebrew override pointing at an id
   that no longer exists. Fails the build if anything is off. */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');

const dataPath = join(repoRoot, 'src/data/exercises.json');
const hePath = join(repoRoot, 'src/data/exercises.he.json');
const facadePath = join(repoRoot, 'src/components/YouTubeFacade.tsx');

const data = JSON.parse(readFileSync(dataPath, 'utf8'));
const he = JSON.parse(readFileSync(hePath, 'utf8'));
const facadeSrc = readFileSync(facadePath, 'utf8');

/* Pull the exact YT_ID regex out of YouTubeFacade so this check can never
   drift from what the component does at runtime. */
const reMatch = facadeSrc.match(/const YT_ID =\s*(\/.+\/);/);
if (!reMatch) {
  console.error('FAIL — could not locate the YT_ID regex in YouTubeFacade.tsx.');
  process.exit(1);
}
const YT_ID = eval(reMatch[1]); // eslint-disable-line no-eval -- trusted local source

const BAND_COLORS = new Set(['yellow', 'red', 'green', 'blue', 'black']);
const REQUIRED_STRINGS = [
  'name',
  'targetMuscles',
  'mechanism',
  'reps',
  'frequency',
  'evidenceShort',
  'evidenceFull',
  'evidenceSummary',
  'videoUrl',
];

const problems = [];
const exerciseIds = new Set();
const subAreaIds = new Set();
const ytIds = new Map(); // youtube id -> first exercise that used it
let exerciseCount = 0;
let subAreaCount = 0;

for (const z of data.zones) {
  for (const sa of z.subAreas) {
    subAreaCount += 1;
    subAreaIds.add(sa.id);

    if (!sa.exercises || sa.exercises.length === 0) {
      problems.push(`subArea "${sa.id}" has no exercises`);
      continue;
    }
    const primaries = sa.exercises.filter((e) => e.isPrimary);
    if (primaries.length === 0) {
      problems.push(`subArea "${sa.id}" has no isPrimary exercise`);
    } else if (primaries.length > 1) {
      problems.push(`subArea "${sa.id}" has ${primaries.length} isPrimary exercises (expected 1)`);
    }

    for (const e of sa.exercises) {
      exerciseCount += 1;
      if (exerciseIds.has(e.id)) problems.push(`duplicate exercise id "${e.id}"`);
      exerciseIds.add(e.id);

      for (const k of REQUIRED_STRINGS) {
        if (!e[k] || String(e[k]).trim() === '') problems.push(`"${e.id}": missing/empty "${k}"`);
      }
      if (!Array.isArray(e.instructions) || e.instructions.length === 0) {
        problems.push(`"${e.id}": instructions are empty (the routine + card render them)`);
      }
      if (!Array.isArray(e.contraindications) || e.contraindications.length === 0) {
        problems.push(`"${e.id}": contraindications are empty (the card joins them)`);
      }
      if (!Array.isArray(e.commonMistakes) || e.commonMistakes.length === 0) {
        problems.push(`"${e.id}": commonMistakes are empty`);
      }
      if (typeof e.sets !== 'number') problems.push(`"${e.id}": sets is not a number`);
      if (!BAND_COLORS.has(e.bandTension)) {
        problems.push(`"${e.id}": bandTension "${e.bandTension}" is not a known band color`);
      }

      const m = typeof e.videoUrl === 'string' ? e.videoUrl.match(YT_ID) : null;
      if (!m) {
        problems.push(`"${e.id}": videoUrl ${JSON.stringify(e.videoUrl)} does not parse as a YouTube id (demo would degrade to a bare link)`);
      } else {
        const prev = ytIds.get(m[1]);
        if (prev) problems.push(`"${e.id}" reuses the same YouTube video as "${prev}" (${m[1]})`);
        else ytIds.set(m[1], e.id);
      }
    }
  }
}

for (const id of Object.keys(he.exercises ?? {})) {
  if (!exerciseIds.has(id)) problems.push(`exercises.he.json references unknown exercise id "${id}"`);
}
for (const id of Object.keys(he.subAreas ?? {})) {
  if (!subAreaIds.has(id)) problems.push(`exercises.he.json references unknown subArea id "${id}"`);
}

// Every exercise must have a full Hebrew body (the funnel + cards render in Hebrew).
for (const id of exerciseIds) {
  if (!(he.exercises ?? {})[id]) problems.push(`"${id}": missing Hebrew translation in exercises.he.json`);
}

// EN/HE UI string parity: the two locale files must define the same key set.
const enLocale = JSON.parse(readFileSync(join(repoRoot, 'src/locales/en/common.json'), 'utf8'));
const heLocale = JSON.parse(readFileSync(join(repoRoot, 'src/locales/he/common.json'), 'utf8'));
function flatKeys(obj, prefix = '', acc = new Set()) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatKeys(v, key, acc);
    else acc.add(key);
  }
  return acc;
}
const enKeys = flatKeys(enLocale);
const heKeys = flatKeys(heLocale);
for (const k of enKeys) if (!heKeys.has(k)) problems.push(`locale key missing in HE: "${k}"`);
for (const k of heKeys) if (!enKeys.has(k)) problems.push(`locale key missing in EN: "${k}"`);

if (problems.length) {
  console.error(`\nFAIL — ${problems.length} data problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

console.log(
  `OK — ${data.zones.length} zones, ${subAreaCount} sub-areas, ${exerciseCount} exercises; ` +
    `all required fields present, all ${ytIds.size} video URLs parse as distinct YouTube ids, ` +
    `full Hebrew coverage, and EN/HE locale keys in parity (${enKeys.size} keys).`,
);
