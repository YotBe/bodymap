#!/usr/bin/env node
/* Verifies every exercise id in exercises.json has a matching animation
   configuration. Fails the build if any exercise lacks a demo. */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');

const dataPath = join(repoRoot, 'src/data/exercises.json');
const configPath = join(repoRoot, 'src/components/ExerciseAnimation/exerciseAnimations.ts');

const data = JSON.parse(readFileSync(dataPath, 'utf8'));
const configSrc = readFileSync(configPath, 'utf8');

const exerciseIds = data.zones.flatMap((z) =>
  z.subAreas.flatMap((sa) => sa.exercises.map((e) => e.id)),
);

const configuredIds = [...configSrc.matchAll(/exerciseId:\s*'([^']+)'/g)].map((m) => m[1]);

const missing = exerciseIds.filter((id) => !configuredIds.includes(id));
const extra = configuredIds.filter((id) => !exerciseIds.includes(id));

let failed = false;
if (missing.length) {
  console.error(`\nMissing animation config for ${missing.length} exercise(s):`);
  for (const id of missing) console.error(`  - ${id}`);
  failed = true;
}
if (extra.length) {
  console.error(`\nAnimation config references ${extra.length} unknown exercise id(s):`);
  for (const id of extra) console.error(`  - ${id}`);
  failed = true;
}

if (failed) {
  console.error(`\nFAIL — ${exerciseIds.length} exercises, ${configuredIds.length} configs.`);
  process.exit(1);
}
console.log(`OK — all ${exerciseIds.length} exercises have animations.`);
