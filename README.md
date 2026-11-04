# Aurelia — Fashion Store Demo

A premium, light-theme fashion storefront for Men, Women and Kids. Built with React + Vite, Express, PostgreSQL and native CSS (one stylesheet per component/page). The storefront includes a polished demo shopping journey and an API/database foundation for the next integration step.

## What's included

- Editorial homepage with hero campaign, category discovery, new arrivals, curated collections, seasonal offers and brand values.
- Separate Men, Women and Kids catalogue pages with category tabs, sale-only filter and sorting.
- Product detail pages with image gallery, size selection, quantity controls, wishlist and add-to-bag.
- Persistent browser cart and wishlist (localStorage).
- Demo checkout with address validation and simulated UPI/card/COD selection. It does **not** charge money or collect card credentials.
- Order confirmation and local order history.
- Store preview/admin area for demo product management.
- Express API for products, categories, collections, auth, addresses and orders.
- PostgreSQL schema and demo catalogue seed data.

## Tech stack

**Frontend:** React 18, Vite, React Router, native CSS, Context API, CSS animations.

**Backend:** Node.js, Express, PostgreSQL, `pg`, JWT, bcryptjs, Helmet, CORS and rate limiting.

No Tailwind, Bootstrap, Material UI, Chakra UI or styled-components are used.

## Requirements

- Node.js 20+
- npm 10+
- PostgreSQL 14+

## 1. Install dependencies

Run these commands from the project root (`aurelia-store/`):

```bash
npm install
npm install --prefix client
npm install --prefix server
```

## 2. Configure PostgreSQL

Create a database named `aurelia_store` using pgAdmin or a terminal:

```sql
CREATE DATABASE aurelia_store;
```

Copy `server/.env.example` to `server/.env` and update `DATABASE_URL` and `JWT_SECRET`:

```env
PORT=4000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/aurelia_store
JWT_SECRET=use-a-long-random-secret-at-least-32-characters
JWT_EXPIRES_IN=7d
```

Initialize the database and demo product catalogue. Run from the project root:

```bash
npm run db:init --prefix server
```

The script reads `server/sql/schema.sql`, creates the relational tables, then seeds categories, demo products, sizes and collections. It is safe to rerun for the seeded rows.

## 3. Configure the frontend

Copy `client/.env.example` to `client/.env`:

```env
VITE_API_URL=http://localhost:4000
```

For production configuration, see [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md). Production API URLs and allowed storefront origins are validated; `VITE_API_URL` is embedded into the frontend at build time.

The frontend starts with its built-in demo catalogue. When the API and database are available, it automatically attempts to load products from the backend. If the API is unavailable, the demo catalogue remains usable.

## 4. Start the application

From the project root (`aurelia-store/`):

```bash
npm run dev
```

Open:

- Storefront: http://localhost:5173
- API health: http://localhost:4000/api/health

You can also run each part separately:

```bash
npm run dev:client
npm run dev:server
```

## Main API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API health check |
| GET | `/api/products` | List products; supports `category`, `search`, `sale=true` |
| GET | `/api/products/:id` | Product details |
| POST | `/api/products` | Create product (admin token required) |
| DELETE | `/api/products/:id` | Archive product (admin token required) |
| GET | `/api/categories` | Active categories |
| GET | `/api/collections` | Active collections |
| POST | `/api/auth/register` | Register customer |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Current user (JWT required) |
| GET/POST | `/api/addresses` | List/create saved addresses (JWT required) |
| POST | `/api/orders` | Create order (JWT required; requires saved address) |
| GET | `/api/orders/mine` | Current user's orders (JWT required) |
| GET | `/api/orders` | All orders (admin JWT required) |

### Promote a user to admin

Register through `POST /api/auth/register`, then update that account in PostgreSQL using its email:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

Log in again to receive a JWT containing the updated role.

## Important demo notes

- Cart, wishlist and demo orders currently persist in the browser using localStorage. They are not shared across browsers or devices.
- The checkout UI is simulated. It never submits real payment information.
- The Express order API is a separate authenticated endpoint. It verifies product prices from PostgreSQL and records demo payment states, but the current browser checkout is intentionally local/demo-first.
- Customer login UI, live inventory reservation, shipping-provider integration, coupons, image upload storage and Razorpay are not wired into the storefront yet.
- Before production, add server-side validation, CSRF strategy if using cookies, refresh-token/session design, payment gateway verification webhooks, inventory locking/decrement, order status audit trail, tests, logging and deployment secrets.
- Production environment variables, endpoint/origin setup, GitHub Actions checks and deployment limitations are documented in [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md).

## Project structure

```text
aurelia-store/
├── client/
│   └── src/
│       ├── components/     # Component JSX + matching CSS files
│       ├── context/        # Cart, wishlist, order and product state
│       ├── data/           # Built-in demo catalogue
│       ├── pages/          # Route pages + matching CSS files
│       ├── styles/         # Global tokens and motion utilities
│       └── services.js     # API helper
└── server/
    ├── config/             # PostgreSQL pool
    ├── controllers/        # API handlers
    ├── middleware/         # Auth and error handling
    ├── routes/             # Express routes
    └── sql/schema.sql      # PostgreSQL schema + demo seed data
```
