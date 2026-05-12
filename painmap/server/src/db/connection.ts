import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { seedDatabase } from './seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(process.cwd(), 'painmap.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(fs.readFileSync(SCHEMA_PATH, 'utf-8'));

const zoneCount = db.prepare('SELECT COUNT(*) as c FROM zones').get() as { c: number };
if (zoneCount.c === 0) {
  seedDatabase(db);
  console.log(`[db] Seeded database at ${DB_PATH}`);
} else {
  console.log(`[db] Using existing database at ${DB_PATH} (${zoneCount.c} zones)`);
}
