#!/usr/bin/env node
// Generates public/sitemap.xml from the exercise data bundle. Runs as the
// npm "prebuild" hook, so every production build ships a sitemap that is
// exactly in sync with the routes the app actually serves. The output file
// is gitignored — never edit it by hand.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const clientRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE_URL = 'https://bodymap1.vercel.app';

const data = JSON.parse(
  readFileSync(join(clientRoot, 'src/data/exercises.json'), 'utf8'),
);

if (!Array.isArray(data.zones) || data.zones.length === 0) {
  console.error('generate-sitemap: exercises.json has no zones — refusing to write an empty sitemap');
  process.exit(1);
}

const staticPaths = [
  '/flow/map',
  '/flow/assessment',
  '/routine',
  '/about',
  '/legal',
  '/clinician-finder',
];

const zonePaths = data.zones.map((z) => `/zone/${z.id}`);
const exercisePaths = data.zones.flatMap((z) =>
  z.subAreas.flatMap((sa) => sa.exercises.map((e) => `/exercise/${e.id}`)),
);

const paths = [...new Set([...staticPaths, ...zonePaths, ...exercisePaths])];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...paths.map((p) => `  <url><loc>${BASE_URL}${p}</loc></url>`),
  '</urlset>',
  '',
].join('\n');

const outPath = join(clientRoot, 'public/sitemap.xml');
writeFileSync(outPath, xml);
console.log(`generate-sitemap: wrote ${paths.length} URLs to public/sitemap.xml`);
