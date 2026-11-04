import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

const isProduction = process.env.NODE_ENV === 'production';
const envFile = isProduction ? '../.env.production' : '../.env';
dotenv.config({ path: fileURLToPath(new URL(envFile, import.meta.url)) });
const defaultClientUrl = 'http://localhost:5173';

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function parseClientOrigins(value) {
  const origins = value.split(',').map((entry) => {
    let url;
    try {
      url = new URL(entry.trim());
    } catch {
      throw new Error('CLIENT_URL contains an invalid origin.');
    }

    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
      url.pathname !== '/' || url.search || url.hash || url.origin === 'null') {
      throw new Error('CLIENT_URL entries must be HTTP(S) origins without credentials, paths, queries, or fragments.');
    }
    if (isProduction && url.protocol !== 'https:') {
      throw new Error('Production CLIENT_URL origins must use HTTPS.');
    }
    return url.origin;
  });

  return [...new Set(origins)];
}

const clientUrl = isProduction
  ? required('CLIENT_URL')
  : process.env.CLIENT_URL || defaultClientUrl;
const clientOrigins = parseClientOrigins(clientUrl);

let databaseUrl = process.env.DATABASE_URL;
if (isProduction) {
  databaseUrl = required('DATABASE_URL');
  let parsedDatabaseUrl;
  try {
    parsedDatabaseUrl = new URL(databaseUrl);
  } catch {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection URL.');
  }
  if (!['postgres:', 'postgresql:'].includes(parsedDatabaseUrl.protocol) || !parsedDatabaseUrl.hostname) {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection URL.');
  }
  for (const sslParameter of ['sslmode', 'ssl', 'sslcert', 'sslkey', 'sslrootcert']) {
    parsedDatabaseUrl.searchParams.delete(sslParameter);
  }
  databaseUrl = parsedDatabaseUrl.toString();
}

let jwtSecret = process.env.JWT_SECRET;
if (isProduction) {
  jwtSecret = required('JWT_SECRET');
  if (jwtSecret.length < 32) {
    throw new Error('Production JWT_SECRET must be at least 32 characters long.');
  }
}

const port = Number(process.env.PORT || 4000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535.');
}

const databaseSslSetting = process.env.DATABASE_SSL?.toLowerCase();
if (databaseSslSetting && !['true', 'false'].includes(databaseSslSetting)) {
  throw new Error('DATABASE_SSL must be set to true or false.');
}
if (isProduction && databaseSslSetting === 'false') {
  throw new Error('DATABASE_SSL cannot be disabled in production.');
}

const databaseSslRejectUnauthorizedSetting = process.env.DATABASE_SSL_REJECT_UNAUTHORIZED?.toLowerCase();
if (databaseSslRejectUnauthorizedSetting && !['true', 'false'].includes(databaseSslRejectUnauthorizedSetting)) {
  throw new Error('DATABASE_SSL_REJECT_UNAUTHORIZED must be set to true or false.');
}

export const config = Object.freeze({
  isProduction,
  port,
  clientOrigins,
  databaseUrl,
  databaseSsl: isProduction || databaseSslSetting === 'true',
  databaseSslRejectUnauthorized: databaseSslRejectUnauthorizedSetting !== 'false',
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
});
