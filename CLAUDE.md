# Compare Cloud Costs (CCC) — Claude Context

## What This Project Does
Full-stack cloud pricing comparison app. Aggregates, normalizes, and compares
compute pricing across AWS, Azure, GCP, Oracle, and DigitalOcean in a single
side-by-side dashboard. Live at comparecloudcosts.com.

## Stack
- **Frontend**: React + TypeScript, Vite, Tailwind CSS, Motion
- **Backend**: Express.js + TypeScript (server.ts), executed via tsx
- **Database**: PostgreSQL
- **Hosting**: DigitalOcean App Platform

## Run Commands
```bash
npm run dev        # Dev server at http://localhost:3000 (hot reload)
npm run build      # Compile to dist/
npm run start      # Serve production build on port 3000
npm run lint       # TypeScript type-check
```

## Key Files — Start Here
| File | Purpose |
|---|---|
| server.ts | Express entry point, API routes, cron jobs, DB init |
| src/pages/Dashboard.tsx | Main comparison UI (filters, table, sorting) |
| src/db/schema.sql | PostgreSQL schema (providers, regions, services, pricing_records) |
| src/services/pricing_pipeline.ts | VM pricing aggregation across all providers |
| src/services/database_pipeline.ts | Database product pricing |
| src/services/serverless_pipeline.ts | Serverless pricing (Lambda, Cloud Functions, Azure Functions) |
| src/services/mailer.ts | Email alerts for price drift and staleness |
| src/config/ | Hardcoded fallback pricing configs per provider |

## Architecture
- Monorepo SPA + backend integration
- Dev mode: Express acts as Vite middleware
- Prod mode: Express serves precompiled dist/ as REST API
- Cron job runs every Sunday midnight — refreshes all pricing pipelines
- Price drift alert fires if any price changes more than 20% between runs

## Database Schema
- `providers` — AWS, Azure, GCP, Oracle, DigitalOcean
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
- Frontend filters are driven by Dashboard.tsx state — sidebar controls map to
  query params sent to /api/pricing
- Column sizes persist in localStorage across sessions
