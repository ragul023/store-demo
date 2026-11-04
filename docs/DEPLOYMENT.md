# Production configuration

The application can be deployed to any host that supports a static frontend build, a Node.js API, and PostgreSQL. GitHub Actions runs production-mode configuration checks and builds; it does not deploy.

## Configure the API

Set these variables in the API host's runtime environment. For local development, copy `server/.env.example` to `server/.env`. For a local production-mode run, copy `server/.env.production.example` to `server/.env.production` and set `NODE_ENV=production` before starting the API. Host-provided environment variables take precedence over either file.

| Variable | Purpose |
|---|---|
| `NODE_ENV` | Set to `production`. |
| `PORT` | Port provided by the API host (defaults to `4000`). |
| `CLIENT_URL` | Exact HTTPS origin(s) allowed to call the API, comma-separated for multiple sites. Do not include a path or trailing slash. |
| `DATABASE_URL` | PostgreSQL connection URL. |
| `DATABASE_SSL` | `true` for TLS. Production requires TLS and verifies the database certificate. |
| `JWT_SECRET` | Private random secret of at least 32 characters. |
| `JWT_EXPIRES_IN` | JWT lifetime, such as `7d`. |

Generate a secret rather than using the example value:

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

For example, if the storefront is `https://shop.example.com` and the API is `https://api.example.com`, set `CLIENT_URL=https://shop.example.com` on the API. For multiple frontends, list exact origins such as `https://shop.example.com,https://admin.example.com`. Do not use `*`.

The API validates required production settings before listening. `PORT` is read from the hosting environment. PostgreSQL TLS certificate verification is enabled in production; install the provider's trusted CA in the runtime if it is not in the host's default trust store rather than disabling verification.

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
2. Configure the API environment, including `CLIENT_URL` and a private `JWT_SECRET`.
3. Build the client with the correct `VITE_API_URL`.
4. Deploy the API and static client. The API initializes the schema and demo catalogue before it starts listening; startup fails if database initialization fails.
5. Check `https://<api-host>/api/health` and smoke-test CORS and key shopping/API flows against the deployed HTTPS origins.

Database initialization runs on every API startup. The schema and demo seed statements are idempotent, but initialization is not a versioned migration system and includes demo catalogue data; use reviewed migrations and remove demo seeds before production commerce.

## GitHub Actions

`.github/workflows/ci.yml` installs locked dependencies, builds the frontend with a non-routable placeholder API origin, and validates the API's production environment rules using placeholder values. It never receives production secrets and does not deploy. Add a deployment job only after selecting the hosting provider; place its credentials in GitHub Environments/Secrets and keep deploy steps separate from pull-request checks.
