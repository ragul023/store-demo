import { config } from './config/env.js';
import app from './app.js';
import { pool } from './config/db.js';

const server = app.listen(config.port, () => {
  console.log(`Aurelia API listening on port ${config.port}`);
});
async function shutdown(){console.log('Shutting down Aurelia API...');server.close(async()=>{await pool.end();process.exit(0);});}
process.on('SIGINT',shutdown);process.on('SIGTERM',shutdown);
