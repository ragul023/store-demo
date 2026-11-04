# Project Guidelines

- Read [README.md](./README.md) for the application overview and [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) before changing runtime or deployment configuration.
- Keep secrets out of source, examples, build artifacts, logs, and GitHub workflow files. Use environment variables or the deployment platform's secret manager.
- The client is built with Vite; `VITE_*` values are public and are embedded at build time. The API reads runtime configuration from `server/config/env.js`.
- Keep API CORS origins exact and HTTPS-only in production. Add configuration changes to the env examples and deployment guide.
- Render's backend and PostgreSQL Blueprint is `render.yaml`; update it alongside runtime configuration changes and document provider-specific deployment behavior in `docs/DEPLOYMENT.md`.
- Run `npm run build --prefix client`, `npm run check:production-config --prefix server`, and relevant focused checks after config changes.
