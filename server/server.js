import { config } from './config/env.js';
import app from './app.js';
import { pool } from './config/db.js';
import { initializeDatabase } from './database/initialize.js';

async function start() {
  try {
    await initializeDatabase();
  } catch (error) {
    console.error('Database initialization failed; the API was not started:', error);
    try {
      await pool.end();
    } catch (shutdownError) {
      console.error('Failed to close the database pool after startup failure:', shutdownError);
    }
    process.exitCode = 1;
    return;
  }

  const server = app.listen(config.port, () => {
    console.log(`Aura API listening on port ${config.port}`);
  });

  async function shutdown() {
    console.log('Shutting down Aura API...');
    server.close(async (error) => {
      if (error) {
        console.error('Failed to close the API server cleanly:', error);
        process.exitCode = 1;
      }
      try {
        await pool.end();
      } catch (poolError) {
        console.error('Failed to close the database pool:', poolError);
        process.exitCode = 1;
      }
    });
  }

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

await start();
