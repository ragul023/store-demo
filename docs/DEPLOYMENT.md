# Production configuration

The application can be deployed to any host that supports a static frontend build, a Node.js API, and PostgreSQL. The repository includes a Render Blueprint in [`render.yaml`](../render.yaml) for deploying the API and its PostgreSQL database. GitHub Actions runs production-mode configuration checks and builds; it does not deploy.

## Deploy the backend to Render

1. Push this repository to GitHub.
2. In the Render Dashboard, choose **New → Blueprint**, connect the repository, and select the branch containing `render.yaml`.
3. When prompted for `CLIENT_URL`, enter the exact HTTPS origin of the frontend, such as `https://your-store.example.com` (no path or trailing slash). If the frontend is not deployed yet, you can use the generated static-site URL later and update this service variable.
4. Review the Blueprint and apply it. Render creates the API service and PostgreSQL database, generates `JWT_SECRET`, runs `npm ci`, initializes the schema/catalogue before deployment, and starts the API with `npm start`.
5. After deploy, check `https://<render-service-name>.onrender.com/api/health`.
6. Set the frontend's build-time `VITE_API_URL` to that API URL and redeploy the frontend.

The Blueprint uses Render's Singapore region for both the API and database so they can use the internal database connection. Render's internal Postgres TLS certificate is self-signed, so this service explicitly sets `DATABASE_SSL_REJECT_UNAUTHORIZED=false` while keeping TLS enabled. This setting is only in the Render Blueprint; other production environments verify certificates by default. Keep the database private to Render services and do not replace the internal database URL with an untrusted external host.

The Blueprint provisions paid Render resources at Render's current default service/database plans; check the cost shown in Render before applying. `preDeployCommand` runs the existing idempotent `db:init` script, which creates tables and seeds the demo catalogue. This is suitable for the included demo store; it is not a general production migration system. The Blueprint does not deploy the frontend.

## Configure the API

Set these variables in the API host's runtime environment. For local development, copy `server/.env.example` to `server/.env`. For a local production-mode run, copy `server/.env.production.example` to `server/.env.production` and set `NODE_ENV=production` before starting the API. Host-provided environment variables take precedence over either file.

| Variable | Purpose |
|---|---|
| `NODE_ENV` | Set to `production`. |
| `PORT` | Port provided by the API host (defaults to `4000`). |
| `CLIENT_URL` | Exact HTTPS origin(s) allowed to call the API, comma-separated for multiple sites. Do not include a path or trailing slash. |
| `DATABASE_URL` | PostgreSQL connection URL. |
| `DATABASE_SSL` | `true` for TLS. Production requires TLS and verifies the database certificate. |
| `DATABASE_SSL_REJECT_UNAUTHORIZED` | Defaults to `true`; set to `false` only for a trusted private database connection that uses a self-signed certificate. |
| `JWT_SECRET` | Private random secret of at least 32 characters. |
| `JWT_EXPIRES_IN` | JWT lifetime, such as `7d`. |

Generate a secret rather than using the example value:

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

For example, if the storefront is `https://shop.example.com` and the API is `https://api.example.com`, set `CLIENT_URL=https://shop.example.com` on the API. For multiple frontends, list exact origins such as `https://shop.example.com,https://admin.example.com`. Do not use `*`.

The API validates required production settings before listening. `PORT` is read from the hosting environment. PostgreSQL TLS certificate verification is enabled by default; `DATABASE_SSL` controls TLS and any SSL flags embedded in `DATABASE_URL` are ignored so a URL cannot silently disable certificate verification. Install the provider's trusted CA in the runtime if it is not in the host's default trust store rather than disabling verification.

## Configure and build the frontend

Set `VITE_API_URL` to the API's HTTPS origin in the frontend build environment. For local work, copy `client/.env.example` to `client/.env`. For a production build, use `client/.env.production.example` as the template for `client/.env.production`.

```env
VITE_API_URL=https://api.example.com
```

Then build and deploy the generated `client/dist/` directory:

```bash
npm ci --prefix client
npm run build --prefix client
```

Vite embeds `VITE_API_URL` into the static bundle at build time. Changing the API endpoint means rebuilding and redeploying the frontend. The production build rejects missing, non-HTTPS, or non-origin values.

The API's `CLIENT_URL` and frontend's `VITE_API_URL` are separate settings: the first is the browser storefront origin allowed by CORS, while the second is the API origin the browser calls. Configure both to match the actual deployed hostnames.

## Database and release steps

1. Provision PostgreSQL and set `DATABASE_URL` and `DATABASE_SSL` on the API host.
2. Apply the database schema using a reviewed production migration process.
3. Configure the API environment, including `CLIENT_URL` and a private `JWT_SECRET`.
4. Build the client with the correct `VITE_API_URL`.
5. Deploy the API and static client, then check `https://<api-host>/api/health`.
6. Smoke-test CORS and key shopping/API flows against the deployed HTTPS origins.

`npm run db:init --prefix server` initializes the schema **and inserts demo catalogue data**. It is intended for local/demo databases, not as a production migration command. The project does not yet include a production migration runner or payment processing.

## GitHub Actions

`.github/workflows/ci.yml` installs locked dependencies, builds the frontend with a non-routable placeholder API origin, and validates the API's production environment rules using placeholder values. It never receives production secrets and does not deploy. Add a deployment job only after selecting the hosting provider; place its credentials in GitHub Environments/Secrets and keep deploy steps separate from pull-request checks.
