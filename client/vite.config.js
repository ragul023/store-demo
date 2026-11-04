import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  if (command === 'build' && mode === 'production') {
    let apiUrl;
    try {
      apiUrl = new URL(env.VITE_API_URL || '');
    } catch {
      throw new Error('Set VITE_API_URL to the HTTPS origin of the API before building for production.');
    }

    if (apiUrl.protocol !== 'https:' || apiUrl.username || apiUrl.password ||
      apiUrl.pathname !== '/' || apiUrl.search || apiUrl.hash) {
      throw new Error('VITE_API_URL must be an HTTPS API origin without a path, query, or credentials.');
    }
  }

  return { plugins: [react()], server: { port: 5173 } };
});
