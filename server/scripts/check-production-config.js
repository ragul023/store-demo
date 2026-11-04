import { config } from '../config/env.js';

if (!config.isProduction) {
  throw new Error('Run this check with NODE_ENV=production.');
}

if (!config.databaseUrl || !config.jwtSecret || !config.clientOrigins.length || !config.databaseSsl) {
  throw new Error('Production configuration is incomplete.');
}

console.log('Production API configuration is valid.');
