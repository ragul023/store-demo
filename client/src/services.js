const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
if (!configuredApiUrl && import.meta.env.PROD) {
  throw new Error('VITE_API_URL must be configured for production builds.');
}

let apiUrl;
try {
  apiUrl = new URL(configuredApiUrl || 'http://localhost:4000');
} catch {
  throw new Error('VITE_API_URL must be a valid HTTP(S) API origin.');
}
if (!['http:', 'https:'].includes(apiUrl.protocol) || apiUrl.username || apiUrl.password ||
  apiUrl.pathname !== '/' || apiUrl.search || apiUrl.hash) {
  throw new Error('VITE_API_URL must be an HTTP(S) API origin without a path, query, or credentials.');
}
if (import.meta.env.PROD && apiUrl.protocol !== 'https:') {
  throw new Error('VITE_API_URL must use HTTPS in production builds.');
}

const API_URL = apiUrl.origin;
export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'The request could not be completed.');
  return payload;
}
