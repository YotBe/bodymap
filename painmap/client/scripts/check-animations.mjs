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
const musclesPath = join(repoRoot, 'src/components/ExerciseAnimation/muscles.ts');

const data = JSON.parse(readFileSync(dataPath, 'utf8'));
const configSrc = readFileSync(configPath, 'utf8');
const musclesSrc = readFileSync(musclesPath, 'utf8');

const exerciseIds = data.zones.flatMap((z) =>
  z.subAreas.flatMap((sa) => sa.exercises.map((e) => e.id)),
);

const configuredIds = [...configSrc.matchAll(/exerciseId:\s*'([^']+)'/g)].map((m) => m[1]);
const muscleIds = [...musclesSrc.matchAll(/'(ex-[a-z-]+)':\s*\{/g)].map((m) => m[1]);

const missingAnim = exerciseIds.filter((id) => !configuredIds.includes(id));
const extraAnim = configuredIds.filter((id) => !exerciseIds.includes(id));
const missingMuscle = exerciseIds.filter((id) => !muscleIds.includes(id));
const extraMuscle = muscleIds.filter((id) => !exerciseIds.includes(id));

let failed = false;
if (missingAnim.length) {
  console.error(`\nMissing animation config for ${missingAnim.length} exercise(s):`);
  for (const id of missingAnim) console.error(`  - ${id}`);
  failed = true;
}
if (extraAnim.length) {
  console.error(`\nAnimation config references ${extraAnim.length} unknown exercise id(s):`);
  for (const id of extraAnim) console.error(`  - ${id}`);
  failed = true;
}
if (missingMuscle.length) {
  console.error(`\nMissing muscle overlay for ${missingMuscle.length} exercise(s):`);
  for (const id of missingMuscle) console.error(`  - ${id}`);
  failed = true;
}
if (extraMuscle.length) {
  console.error(`\nMuscle overlay references ${extraMuscle.length} unknown exercise id(s):`);
  for (const id of extraMuscle) console.error(`  - ${id}`);
  failed = true;
}

if (failed) {
  console.error(`\nFAIL — ${exerciseIds.length} exercises, ${configuredIds.length} animations, ${muscleIds.length} muscle overlays.`);
  process.exit(1);
}
console.log(`OK — all ${exerciseIds.length} exercises have animations + muscle overlays.`);
