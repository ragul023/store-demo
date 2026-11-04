import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { pool } from '../config/db.js';
const here=dirname(fileURLToPath(import.meta.url));
try{const sql=await readFile(resolve(here,'../sql/schema.sql'),'utf8');await pool.query(sql);console.log('Aurelia database schema and demo catalogue are ready.');}
catch(error){console.error('Database initialization failed:',error.message);process.exitCode=1;}
finally{await pool.end();}
