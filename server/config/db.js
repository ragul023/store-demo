import pg from 'pg';
import { config } from './env.js';
const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: config.databaseSsl ? { rejectUnauthorized: true } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (error) => console.error('Unexpected PostgreSQL pool error:', error));

export async function query(text, params = []) {
  return pool.query(text, params);
}
