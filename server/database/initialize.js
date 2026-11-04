import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { pool } from '../config/db.js';

const schemaPath = fileURLToPath(new URL('../sql/schema.sql', import.meta.url));

export async function initializeDatabase() {
  const schema = await readFile(schemaPath, 'utf8');
  await pool.query(schema);
  console.log('Aurelia database schema and demo catalogue are ready.');
}
