# Compare Cloud Costs (CCC) — Claude Context

## What This Project Does
Full-stack cloud pricing comparison app. Aggregates, normalizes, and compares
pricing across AWS, Azure, GCP, Oracle, DigitalOcean, and Alibaba Cloud in a
single side-by-side dashboard. Covers compute, database, serverless, containers,
networking, storage, data analytics, AI, and app hosting. Live at
comparecloudcosts.com.

## Stack
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4, Motion (animations)
- **Data fetching**: TanStack Query (client), Recharts (charts)
- **Backend**: Next.js API route handlers (`src/app/api/*/route.ts`) — no Express/`server.ts`
- **Database**: PostgreSQL via `postgres` (postgres.js), see `src/lib/db.ts`
- **Hosting**: DigitalOcean App Platform

## Run Commands
```bash
npm run dev        # Next.js dev server at http://localhost:3000 (hot reload)
npm run build      # Production build (.next/)
npm run start      # Serve the production build
npm run lint       # next lint
npm run ingest     # One-off Playwright-based scrape (tsx src/services/ingest.ts)
npm run worker     # Background cron worker (tsx src/workers/scheduler.ts)
```

## Key Files — Start Here
| File | Purpose |
|---|---|
| src/app/page.tsx | Main comparison dashboard UI (filters, table, sorting) |
| src/app/api/pricing/route.ts | `GET /api/pricing` — filtered/aggregated pricing records |
| src/app/api/pricing/counts/route.ts | `GET /api/pricing/counts` — per-provider result counts |
| src/app/api/admin/fetch-pricing/route.ts | `POST` — runs all pricing pipelines (admin only) |
| src/lib/api-utils.ts | `buildPricingFilters` (query→SQL), `requireAdminAuth`, `initDb` |
| src/lib/db.ts | PostgreSQL connection (postgres.js) |
| src/lib/cache.ts | In-process TTL cache for /api/pricing[/counts] responses |
| src/middleware.ts | Per-IP rate limiting for public API routes |
| src/db/schema.sql | PostgreSQL schema + performance indexes |
| src/services/*_pipeline.ts | Per-product pricing aggregation across providers |
| src/services/mailer.ts | Email alerts for price drift, staleness, data quality |
| src/workers/scheduler.ts | node-cron worker; weekly refresh + alert checks |
| src/config/ | Hardcoded fallback pricing configs per provider |

## Architecture
- Next.js App Router app: React Server/Client components + API route handlers in
  one codebase. The dashboard (`src/app/page.tsx`) is a client component that
  calls the internal `/api/*` routes.
- Pricing reads (`/api/pricing`, `/api/pricing/counts`) are cached in-process via
  `src/lib/cache.ts` (10-min TTL); the cache is cleared after an admin fetch.
- Ingestion runs out-of-band: the `worker` (`src/workers/scheduler.ts`, node-cron)
  refreshes all pipelines every Sunday at midnight, or an admin can trigger
  `POST /api/admin/fetch-pricing` manually.
- Price drift alert fires if any price changes more than 20% between runs.

## Database Schema
- `providers` — AWS, Azure, GCP, Oracle, DigitalOcean, Alibaba Cloud
- `regions` — Cloud regions per provider
- `services` — Service lines per provider (EC2, RDS, Virtual Machines, etc.)
- `pricing_records` — Instance specs + pricing (vCPUs, RAM, price, GPU, category)

## API Routes
- `GET /api/pricing` — Filtered pricing records (supports aggregate=true)
- `GET /api/pricing/counts` — Record counts matching active filters
- `POST /api/admin/fetch-pricing` — Trigger pipeline manually (requires X-Admin-Token)
- `POST /api/admin/init-db` — Reinitialize DB schema (requires X-Admin-Token)

## Security Rules — Never Violate
- Never commit `.env` files
- All `/api/admin/*` routes require `X-Admin-Token` header
- DATABASE_CA_CERT must be base64-encoded in production
- ADMIN_API_KEY must be generated with `openssl rand -hex 32`
- See SECURITY_AUDIT.md and SECURITY_FIXES.md before touching auth or DB logic

## Documentation Map
| Question | File |
|---|---|
| How does everything work? | PROJECT_ANALYSIS.md |
| System diagrams | ARCHITECTURE_DIAGRAMS.md |
| Deploy to production | OPERATIONS_RUNBOOK.md |
| Security vulnerabilities | SECURITY_AUDIT.md |
| Security fixes applied | SECURITY_FIXES.md |

## Adding a New Cloud Provider
See PROJECT_ANALYSIS.md § 4.3 for the step-by-step guide.

## Conventions
- Pricing normalization lives in src/services/ — never hardcode prices in routes
- Fallback configs in src/config/ are used only when live APIs fail
- Frontend filters are driven by `src/app/page.tsx` state — sidebar controls map
  to query params sent to /api/pricing (query→SQL translation in
  `src/lib/api-utils.ts` `buildPricingFilters`)
- Column sizes persist in localStorage across sessions
