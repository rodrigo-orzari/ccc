<p align="center">
  <img src="public/logo.png" alt="Compare Cloud Costs Logo" width="400">
</p>

# Compare Cloud Costs

A full-stack cloud pricing comparison app that aggregates, normalizes, and compares pricing across six hyperscale cloud platforms — **AWS, Azure, Google Cloud, Oracle, DigitalOcean, and Alibaba Cloud** — in a single side-by-side dashboard. View infrastructure coverage for **Vultr** and **Hetzner** on the [Datacenters](https://comparecloudcosts.com/datacenters) page (no pricing data). Explore specialized providers alongside the hyperscalers: AI model vendors (OpenAI, Anthropic), vector databases (Pinecone, Milvus, Qdrant, Weaviate, Chroma), and edge/security (Cloudflare). **Live at [comparecloudcosts.com](https://comparecloudcosts.com)**

---

## 🎯 What It Does

Cloud providers structure, name, and publish pricing data in completely different formats. Finding the cheapest region, instance type, or architecture for a specific workload requires browsing multiple price calculators or maintaining custom spreadsheets.

CCC solves this by:

1. **Aggregating** pricing from live APIs and static fallback configs across 10 product categories
2. **Normalizing** proprietary terminology into a common schema (CPU vendor, geography, HA mode, etc.)
3. **Comparing** configurations side-by-side with filters, sorting, and in-table visualizations
4. **Simulating** full workload costs — e.g. "what does a 3-tier web app cost on each cloud for 1,000 concurrent users?" — via the Workloads catalog
5. **Tracking** price changes between ingestion runs with per-row trend indicators (▲ / ▼ / ●)
6. **Comparing** compliance posture — which certifications (ISO 27001, SOC 2, PCI DSS, HIPAA, FedRAMP, GDPR, IRAP, C5, …) each provider holds — via the Certifications & Regulations page

---

## 🗂️ Product Categories

| Category | Description | Live API | Static Fallback | Regional Coverage |
|---|---|---|---|---|
| 🖥️ Virtual Machines | General compute instances | AWS, Azure, GCP, Oracle, DO | All 9 providers | By provider (native regions) |
| 🎮 GPU Compute | GPU-accelerated instances, by chip model (H100, A100, L4, MI300X, …) | AWS, Azure, GCP, Oracle, DO, Alibaba | All 6 hyperscalers | By provider (native regions) |
| 🗄️ Databases | Managed relational, NoSQL, in-memory, caching | AWS, Azure | All 9 providers | By provider (native regions) |
| ⚡ Serverless | Functions, API Gateways, event brokers | AWS Lambda | All 9 providers | By provider (native regions) |
| 📦 Containers | Managed Kubernetes, container instances | — | All 9 providers | By provider (native regions) |
| 🌐 Networking | Load balancers, VPN, CDN, data transfer | — | All 9 providers | By provider (native regions) |
| 📊 Data & Analytics | Data warehouses, streaming, Spark/Databricks | — | All 9 providers | Regional multipliers (1.00–1.32) |
| 🧠 AI | Foundation models, inference endpoints | — | All 9 providers | By provider (native regions) |
| 💾 Storage | Object, block, file, archive | — | All 9 providers | By provider (native regions) |
| 🚀 App Hosting | PaaS platforms (App Engine, App Runner, etc.) | — | All 9 providers | By provider (native regions) |
| 📦 Workloads | Pre-built templates for multi-service architectures | — | Derived | Multi-cloud cost simulation |
| 📜 Certifications | Provider compliance & regulation matrix (not priced) | — | Curated | By standard jurisdiction |
| 🏢 Datacenters | Global region & infrastructure footprint (not priced) | — | Curated | Worldwide |

### 🗺️ Provider Coverage by Category

Providers are classified by `providerType` in `src/config/index.ts`: **hyperscaler** (AWS, Azure, Google Cloud, Oracle, DigitalOcean, Alibaba — general-purpose platforms, available across all pricing categories) vs. **specialized** (OpenAI, Anthropic, Pinecone, Milvus, Qdrant, Weaviate, Chroma, Cloudflare — single-purpose providers scoped to specific categories via `PROVIDER_CATEGORY_SCOPE`). The UI renders these as two visually distinct groups (Cloud Platforms vs. Specialized Providers) in the provider filter and summary cards, so specialized providers never read as peers of the hyperscalers.

| Category | Providers | Notes |
|---|---|---|
| Virtual Machines | AWS, Azure, GCP, Oracle, DigitalOcean, Alibaba | All 6 hyperscalers. Excludes any instance with `gpu_count > 0` — those live under GPU Compute instead, so a GPU box is never priced/shown twice. |
| GPU Compute | AWS, Azure, GCP, Oracle, DigitalOcean, Alibaba | Not a separate ingested category — same underlying VM/Droplet/etc. rows as above, filtered to `gpu_count > 0`. GPU model (H100, A100 80GB, L4, …) is derived from each provider's instance-type naming convention (`src/config/gpu_models.ts`), since no pricing API returns the chip name directly. |
| Databases | AWS, Azure, GCP, Oracle, DigitalOcean, Alibaba **+** Pinecone, Milvus, Qdrant, Weaviate, Chroma | Hyperscalers + vector databases |
| Serverless | AWS, Azure, GCP, Oracle, DigitalOcean, Alibaba | All 6 hyperscalers |
| Containers | AWS, Azure, GCP, Oracle, DigitalOcean, Alibaba | All 6 hyperscalers |
| Networking | AWS, Azure, GCP, Oracle, DigitalOcean, Alibaba **+** Cloudflare | Hyperscalers + Cloudflare |
| Data & Analytics | AWS, Azure, GCP, Oracle, DigitalOcean, Alibaba | All 6 hyperscalers |
| AI | AWS, Azure, GCP, Oracle, DigitalOcean, Alibaba **+** OpenAI, Anthropic | Hyperscalers sell foundation model access (Bedrock, Azure AI Foundry, Vertex AI, OCI GenAI, etc.) alongside the model vendors themselves |
| Storage | AWS, Azure, GCP, Oracle, DigitalOcean, Alibaba | All 6 hyperscalers |
| App Hosting | AWS, Azure, GCP, Oracle, DigitalOcean, Alibaba **+** Cloudflare | Hyperscalers + Cloudflare |
| Workloads | AWS, Azure, GCP, Oracle, DigitalOcean, Alibaba **+** AI providers | Multi-component templates |
| Certifications | All providers | Compliance matrix (no pricing) |
| Datacenters | AWS, Azure, GCP, Oracle, DigitalOcean, Alibaba, Cloudflare | Infrastructure reference only |

**GPU model coverage caveat (added 2026-07-17):** GPU chip identity (H100 vs. A100 vs. L4, etc.) is not a field any provider's pricing API exposes — it's inferred from instance-type naming via `src/config/gpu_models.ts`. AWS and Azure are comprehensive (their live pricing APIs return every GPU SKU they sell). GCP, Oracle, Alibaba, and DigitalOcean rely on hand-maintained static shape lists, same reliability tier as Networking/Security below — audited 2026-07-17: added GCP's a3 family (H100, previously missing entirely). Two known gaps found but NOT filled, to avoid publishing unverified specs: Alibaba's gn7e (A100 80GB) family, and DigitalOcean's newer GPU Droplet tiers (L40S, MI300X, H200, RTX 6000 Ada) — pricing was found but vCPU/memory bundle specs couldn't be confirmed with enough confidence.

**AI model coverage caveat:** `src/config/ai_models.ts` is a hand-maintained static list, not a live scraper pipeline (unlike every other category — see `src/services/ai_pipeline.ts`, which just reads the static file). It will drift as providers add/retire models. As of 2026-07, it covers OpenAI and Anthropic's own catalogs plus a representative subset of third-party models available via Bedrock (Amazon Nova, DeepSeek-R1, Mistral Large 2, Llama) and Azure AI Foundry (DeepSeek-R1, Llama) — not an exhaustive catalog. Building real per-provider ingestion (Bedrock model catalog + pricing API, Azure AI Foundry catalog, etc.) is an open follow-up, not yet scheduled.

### 📦 Workload Templates

Pre-built cost estimation templates that model complete multi-service architectures across all providers. Each template lets you adjust key parameters (concurrency, data volume, retention, etc.) and see total cost impact across compute, storage, networking, and data services.

Available templates (16 total):
- **High-Traffic Web App** — API servers, databases, load balancing, CDN
- **RAG / AI Knowledge Base** — Embedding generation, vector storage, inference, retrieval pipelines
- **Compliance-Ready Database** — Managed relational DB with HA, automated backups, compliance tiers
- **Smart Manufacturing / Industrial IoT** — Edge gateways, stream processing, hot metrics storage, analytics warehouse, cold archive, predictive maintenance AI
- **Event-Driven Image Processing** — Serverless KYC / ID verification pipelines with Vision AI
- *And 11 more covering HPC, streaming analytics, disaster recovery, etc.*

### 📊 Regional Pricing for Data & Analytics

The **Data & Analytics** category includes regional price multipliers to reflect geographic cost variations across providers. A single SKU (e.g., Redshift RA3 in US) is replicated across regions with scaling factors:

- **N. America** (mult 1.00) — baseline reference region
- **W. Europe** (mult 1.05–1.08)
- **Asia Pacific** (mult 1.06–1.10)
- **S. America** (mult 1.15–1.32)
- **Australia** (mult 1.12–1.18)

Multipliers are approximate public regional pricing deltas. Oracle and DigitalOcean publish uniform global pricing (mult 1.00 everywhere). See `src/config/analytics_regions.ts` for per-provider region mappings.

### 🎛️ Filter Architecture

Filters dynamically adapt per product category to reduce clutter and highlight relevant options:

- **Virtual Machines & Databases:** CPU, vCPU range, memory, storage, architecture, OS, HA mode, region
- **Serverless:** Memory size (horizontal scroll), granularity (millisecond/second/hour), language, region, PAYG/yearly toggle
- **Data & Analytics:** Tier grouping (organizes 17+ tiers into Editions, Capacity Units, Compute Nodes, Billing Model, Other), geography with regional multipliers, region
- **Containers, Networking, Storage:** Standard category-specific filters

**Specs & Price section:** Consolidates Memory Size (horizontal scroll buttons for serverless) and PAYG/Yearly toggle inline for serverless, containers, and database categories — reducing vertical scroll and surface area.

---

## 🧱 Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) · React · TypeScript |
| Styling | Tailwind CSS · Motion (animations) |
| Charts | Recharts |
| Database | PostgreSQL |
| Data fetching | `@tanstack/react-query` |
| Pipelines | `tsx` (TypeScript runner) · `playwright` (web scrapers) |
| Scheduling | `node-cron` (background worker process) |
| Email | `nodemailer` (price drift + staleness alerts) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (local or managed)

### 1. Clone & install

```bash
git clone https://github.com/rodrigo-orzari/ccc.git
cd ccc
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set at minimum:

```bash
DATABASE_URL="postgres://user:password@host:5432/dbname"
ADMIN_API_KEY="$(openssl rand -hex 32)"   # protects /api/admin/* endpoints
```

For managed PostgreSQL requiring SSL certificates, also set:
```bash
DATABASE_CA_CERT="$(cat /path/to/ca-certificate.crt | base64)"
```

### 3. Initialize the database

```bash
# Start the dev server first
npm run dev

# In a separate terminal, run the schema migration
curl -X POST http://localhost:3000/api/admin/init-db \
  -H "X-Admin-Token: $ADMIN_API_KEY"
```

### 4. Populate pricing data

```bash
# Trigger all pricing pipelines (VM, DB, Serverless, Containers, Networking,
# Data Analytics, AI, Storage, App Hosting)
curl -X POST "http://localhost:3000/api/admin/fetch-pricing?type=all" \
  -H "X-Admin-Token: $ADMIN_API_KEY"
```

This takes 3–10 minutes. You can also trigger individual pipelines with `?type=compute`, `?type=database`, `?type=serverless`, `?type=containers`, `?type=networking`, `?type=data-analytics`, `?type=ai`, `?type=storage`.

### 5. Open the app

Navigate to [http://localhost:3000](http://localhost:3000).

---

## ⚙️ npm Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server at `http://localhost:3000` with hot reload |
| `npm run build` | Compile to `.next/` for production |
| `npm run start` | Serve the production build on port 3000 |
| `npm run worker` | Background cron scheduler that runs the VM pipeline Sunday midnight UTC |
| `npm run ingest` | CLI tool to manually trigger all pricing pipelines (installs Playwright browser automation) |
| `npm run lint` | TypeScript type-check via `next lint` |

> **Note on cron vs manual:** `npm run worker` only covers the VM compute pipeline on a schedule. To refresh all product categories (compute, database, serverless, containers, networking, data-analytics, ai, storage) at once, use `npm run ingest` manually or the `/api/admin/fetch-pricing?type=all` admin endpoint. Each pipeline typically takes 1–10 minutes depending on provider API latency and scraper concurrency.

---

## 📁 Repository Structure

```
ccc/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Main catalog UI (filters + pricing table)
│   │   ├── layout.tsx                # Root layout (fonts, providers, metadata)
│   │   ├── globals.css               # Global styles + custom scrollbar/slider CSS
│   │   ├── providers.tsx             # React Query provider wrapper
│   │   ├── sitemap.ts                # SEO: sitemap.xml (all routes + 14 workload pages from WORKLOADS)
│   │   ├── robots.ts                 # SEO: robots.txt (allows all except /api/)
│   │   ├── dashboard/page.tsx        # New graphical landing page preview
│   │   ├── datacenters/page.tsx      # Datacenter/region world map
│   │   ├── certifications/page.tsx   # Certifications & Regulations (provider compliance matrix + filters)
│   │   ├── about/page.tsx            # About page (solution overview, key capabilities, use cases)
│   │   ├── docs/page.tsx             # Documentation hub (Datacenters, pricing methodology, FAQ)
│   │   ├── status/page.tsx           # Status page (pipeline health, data freshness, coverage)
│   │   ├── blog/
│   │   │   ├── page.tsx              # Blog index page
│   │   │   └── [slug]/page.tsx       # Individual blog post renderer
│   │   ├── workloads/
│   │   │   ├── page.tsx              # Workloads catalog (cards grid)
│   │   │   ├── layout.tsx            # SEO metadata for the catalog
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # Workload detail (comparison table + config panel)
│   │   │       └── layout.tsx        # Per-workload SEO metadata + BreadcrumbList JSON-LD
│   │   │   # Note: about/docs/status/methodology/privacy/terms/dashboard/datacenters
│   │   │   #       each have a sibling layout.tsx exporting per-page metadata + canonical
│   │   ├── api/
│   │   │   ├── pricing/
│   │   │   │   ├── route.ts          # GET /api/pricing — filtered pricing records
│   │   │   │   └── counts/route.ts   # GET /api/pricing/counts — record count for active filters
│   │   │   ├── workloads/route.ts    # GET /api/workloads — workload cost estimator
│   │   │   ├── filters/route.ts      # GET /api/filters — dynamic filter option lists
│   │   │   ├── health/route.ts       # GET /api/health — data freshness check
│   │   │   ├── status/route.ts       # GET /api/status — pipeline run status
│   │   │   ├── ping/route.ts         # GET /api/ping — liveness probe
│   │   │   └── admin/
│   │   │       ├── fetch-pricing/route.ts  # POST /api/admin/fetch-pricing — trigger pipelines
│   │   │       └── init-db/route.ts        # POST /api/admin/init-db — schema migration
│   │   ├── about/page.tsx
│   │   ├── docs/page.tsx
│   │   ├── methodology/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── status/page.tsx
│   │   └── terms/page.tsx
│   │
│   ├── components/
│   │   ├── FilterSidebar.tsx         # Dynamic filter sidebar (adapts per product category)
│   │   ├── PricingTable.tsx          # Sortable, resizable pricing table with trend arrows
│   │   ├── TableToolbar.tsx          # Search bar, view toggle, legend, export button
│   │   ├── ChartsView.tsx            # Recharts bar + scatter visualizations
│   │   ├── ProductTypeSelector.tsx   # Top navigation tabs (VM / DB / Serverless / …)
│   │   ├── ProviderCards.tsx         # Provider count summary cards
│   │   ├── RangeSlider.tsx           # Dual-handle range slider (vCPU, memory, price filters)
│   │   ├── Footer.tsx                # Footer with social share buttons
│   │   ├── MarkdownPage.tsx          # Generic markdown renderer for static pages
│   │   ├── DigitalOceanReferralModal.tsx # DO affiliate promo
│   │   └── index.ts                  # Barrel export
│   │
│   ├── services/                     # Pricing ingestion pipelines
│   │   ├── pricing_pipeline.ts       # VM / compute pipeline (AWS, Azure, GCP, Oracle, DO, Alibaba)
│   │   ├── database_pipeline.ts      # Database pipeline (RDS, Cloud SQL, Azure SQL, etc.)
│   │   ├── serverless_pipeline.ts    # Serverless pipeline (Lambda, Cloud Functions, etc.)
│   │   ├── containers_pipeline.ts    # Containers pipeline (EKS, AKS, GKE, OKE, etc.)
│   │   ├── networking_pipeline.ts    # Networking pipeline (load balancers, VPN, CDN, etc.)
│   │   ├── data_analytics_pipeline.ts# Data Analytics pipeline (Redshift, BigQuery, Synapse, etc.)
│   │   ├── ai_pipeline.ts            # AI pipeline (foundation models + inference endpoints)
│   │   ├── storage_pipeline.ts       # Storage pipeline (S3, GCS, Azure Blob, etc.)
│   │   ├── app_hosting_pipeline.ts   # App Hosting pipeline (App Engine, App Runner, etc.)
│   │   ├── serverless_adapters_live.ts  # Live API adapters for serverless providers
│   │   ├── containers_adapters_live.ts  # Live API adapters for containers providers
│   │   ├── mailer.ts                 # Email alerts (price drift >20%, data staleness)
│   │   ├── ingest.ts                 # CLI entry point for manual pipeline runs
│   │   ├── populate_ai.ts            # One-time AI model seed script
│   │   └── populate_containers.ts    # One-time containers seed script
│   │
│   ├── scrapers/                     # Playwright-based web scrapers (fallback data)
│   │   ├── base_scraper.ts
│   │   ├── aws_fargate.ts
│   │   ├── aws_lambda.ts
│   │   ├── aws_storage.ts
│   │   ├── azure_container_instances.ts
│   │   ├── azure_functions.ts
│   │   ├── azure_storage.ts
│   │   ├── digitalocean_droplets.ts
│   │   ├── gcp_instances.ts
│   │   └── gcp_storage.ts
│   │
│   ├── config/                       # Static fallback pricing configs (used when APIs unavailable)
│   │   ├── workloads.ts              # Workload definitions (components, parameters, requirements)
│   │   ├── certifications.ts         # Compliance certifications matrix (static, curated) — see CERTIFICATIONS_REFRESH.md
│   │   ├── analytics_regions.ts      # Regional multipliers for Data & Analytics (1.00–1.32 scaling per geography)
│   │   ├── app_hosting.ts            # App Hosting static configs (all 9 providers)
│   │   ├── ai_models.ts              # AI model configs (all providers)
│   │   ├── native_analytics_instances.ts  # Data Analytics static configs
│   │   ├── databricks_instances.ts   # Databricks-specific configs
│   │   ├── snowflake_instances.ts    # Snowflake-specific configs
│   │   ├── database_instances.ts     # Database fallback configs
│   │   ├── integration.ts            # Integration/serverless service type definitions
│   │   ├── aws_*/                    # AWS static configs (serverless, containers, storage)
│   │   ├── azure_*/                  # Azure static configs
│   │   ├── gcp_*/                    # GCP static configs
│   │   ├── oracle_*/                 # Oracle static configs
│   │   ├── digitalocean_*/           # DigitalOcean static configs
│   │   ├── alibaba_*/                # Alibaba Cloud static configs
│   │   └── index.ts                  # Barrel export (PROVIDERS, GEOGRAPHIES, etc.)
│   │
│   ├── hooks/
│   │   └── useDynamicFilters.ts      # Hook that derives available filter options from the DB
│   │
│   ├── lib/
│   │   ├── api-utils.ts              # SQL query builder, filter parsing, initDb() migration runner
│   │   ├── db.ts                     # postgres.js connection singleton
│   │   ├── formatInstanceName.ts     # Display-name cleaner (Azure armSkuName → readable labels)
│   │   └── blog.ts                   # Markdown parser for blog content
│   │
│   ├── content/
│   │   └── blog/                     # Markdown files for blog posts (*.md)
│   │
│   ├── db/
│   │   └── schema.sql                # PostgreSQL schema (providers, regions, services, pricing_records)
│   │
│   ├── types/
│   │   └── index.ts                  # Shared TypeScript types (PricingRecord, ProductType, etc.)
│   │
│   ├── middleware.ts                 # Next.js middleware (request logging, CORS)
│   │
│   └── workers/
│       └── scheduler.ts              # node-cron background worker (VM pipeline, Sunday midnight)
│
├── public/                           # Static assets (logo, favicon, QR code, etc.)
├── .env.example                      # Environment variable template
├── .gitignore
├── next.config.js
├── package.json
├── playwright.config.ts
├── tsconfig.json
│
└── 📖 Documentation
    ├── README.md                     # ← You are here
    ├── OPERATIONS_RUNBOOK.md         # Deployment, security, admin operations
    ├── SECURITY_AUDIT.md             # Security findings and risk ratings
    ├── SECURITY_FIXES.md             # Applied security fixes
    ├── ARCHITECTURE_DIAGRAMS.md      # ASCII system diagrams
    ├── PROJECT_ANALYSIS.md           # In-depth technical analysis
    └── DATA_POPULATION_GUIDE.md      # Guide to populating pricing data
```

---

## 🗄️ Database Schema

```sql
providers       -- slug ('aws','azure','gcp','oracle','digitalocean','alibaba','cloudflare'), name
regions         -- provider_id, slug (e.g. 'us-east-1'), display_name
services        -- provider_id, name (e.g. 'EC2'), category (e.g. 'compute')
pricing_records -- instance specs + pricing:
                --   instance_type, vcpus, memory_gb, arch, os, cpu_vendor,
                --   gpu_count, geography, category, price_per_unit,
                --   previous_price_per_unit,   ← tracks price changes between ingests
                --   unit, attributes (JSONB),  ← engine, ha_mode, tier, tier_group, etc.
                --   data_source, updated_at
```

**Key Schema Details:**
- **attributes (JSONB):** Stores flexible per-row metadata: `engine` (PostgreSQL, MySQL), `ha_mode` (Multi-AZ, HA), `tier` (Standard, Premium), `tier_group` (Editions, Capacity Units, etc. for analytics), `multiplier` (1.08, for regional analytics records)
- **data_source:** `'live_api'` or `'static_config'` — tells you where the row originated
- **geography & region:** For most categories, geography is derived from the native region (us-east-1 → N. America). For Data & Analytics, geography comes from regional multiplier mappings (see `src/config/analytics_regions.ts`)
- **Regional record generation:** Data & Analytics pipeline loads a single US-region SKU, then replicates it across regions in the `analytics_regions.ts` map, scaling price by multiplier before INSERT

Schema migrations run automatically on every `POST /api/admin/init-db` call via `ALTER TABLE … ADD COLUMN IF NOT EXISTS` statements in `src/lib/api-utils.ts`. You never need to drop and recreate the DB.

---

## 🔐 Admin API Endpoints

All `/api/admin/*` endpoints require `X-Admin-Token: <ADMIN_API_KEY>` header.

| Endpoint | Method | Description |
|---|---|---|
| `/api/pricing` | GET | Filtered pricing records (supports `?aggregate=true` for min/max stats) |
| `/api/pricing/counts` | GET | Record count and category breakdown for active filters |
| `/api/filters` | GET | Dynamic filter options for active product category (geography, tier groups, etc.) |
| `/api/health` | GET | Data freshness check — shows last ingestion time per category |
| `/api/status` | GET | Pipeline health, coverage stats, and last-run timestamps |
| `/api/admin/init-db` | POST | Run schema migrations, create missing columns, re-apply category tags |
| `/api/admin/fetch-pricing?type=all` | POST | Trigger all pricing pipelines (compute, database, serverless, etc.) |
| `/api/admin/fetch-pricing?type=compute` | POST | VM / compute pipeline only |
| `/api/admin/fetch-pricing?type=database` | POST | Database pipeline only |
| `/api/admin/fetch-pricing?type=serverless` | POST | Serverless pipeline only |
| `/api/admin/fetch-pricing?type=containers` | POST | Containers pipeline only |
| `/api/admin/fetch-pricing?type=networking` | POST | Networking pipeline only |
| `/api/admin/fetch-pricing?type=data-analytics` | POST | Data Analytics pipeline only (generates regional multiplier records) |
| `/api/admin/fetch-pricing?type=ai` | POST | AI pipeline only |
| `/api/admin/fetch-pricing?type=storage` | POST | Storage pipeline only |

---

## 🧠 Key Design Decisions

**Why no ORM?** The pipelines use raw `postgres.js` queries for bulk inserts and `sql.unsafe()` for dynamic filter building. Query params are always passed separately (no interpolation) to prevent SQL injection.

**Why static fallback configs?** Most provider pricing APIs are either rate-limited, require authentication, or don't exist (Oracle, Alibaba). Each `src/config/<provider>_*.ts` file is the authoritative fallback when the live API is unavailable. The `data_source` column records whether each row came from `'live_api'` or `'static_config'`.

**Why `previous_price_per_unit`?** The pricing table shows a trend arrow (▲/▼/●) next to every price comparing it to the previous ingestion run. The column is populated on each pipeline run using the prices read from the DB before the DELETE+INSERT cycle.

**Why Playwright for scrapers?** Some providers (DigitalOcean, some GCP endpoints) don't expose structured pricing APIs, so `src/scrapers/` contains browser-based scrapers. `npm run ingest` installs the Chromium binary before running them.

**Why Next.js App Router for the backend?** The app is a monorepo — the same process serves the React frontend and all API routes. In dev mode, Next.js acts as a Vite-equivalent middleware; in production the build output is served statically with API routes handled by Node.js.

**Why do filters adapt per category?** Different product categories have different comparison dimensions. Virtual Machines care about vCPU range; Data & Analytics needs tier grouping; Serverless emphasizes memory and granularity. Consolidating unrelated filters in a single sidebar would create unusable clutter. The FilterSidebar component examines the active `productType` and conditionally renders only relevant options.

**Why horizontal scroll for Memory Size?** Dense option lists (memory from 128 MB to 1 GB in 64 MB increments = 12+ buttons) create vertical scrolling fatigue. Horizontal scroll containers let users explore options without losing context of the pricing table below. This pattern is reused across dense option sets.

**Why tier grouping for Data & Analytics?** The category has 17+ distinct tiers (Redshift tiers, BigQuery editions, Snowflake compute nodes, etc.). A flat filter would be overwhelming. Tiers are grouped by type (Editions, Capacity Units, Compute Nodes, Billing Model, Other) using regex-based categorization so users can drill into relevant tiers without seeing the entire cross-provider tier taxonomy.

**Why regional multipliers for Data & Analytics only?** Most analytics services publish region-specific pricing (Redshift, BigQuery, Synapse). Computing per-SKU regional variants creates combinatorial explosion. Instead, a single US-region SKU is replicated across regions with approximate public multipliers (e.g., mult 1.08 for W. Europe). This scales coverage without doubling pipeline complexity. Other categories have native region mappings in the database.

---

## 📈 Status & Monitoring

### 🩺 Status Page (`/status`)
Real-time visibility into pipeline health and data freshness. Shows:
- Last ingestion timestamp for each product category
- Record counts per provider and category
- Pipeline failure alerts and retry status
- Data staleness warnings (if last refresh exceeds expected interval)

Access at `/status` or via the main navigation footer.

### 💓 Health Check (`/api/health`)
Lightweight endpoint that returns JSON:
```json
{
  "timestamp": "2026-07-06T12:34:56Z",
  "lastIngests": {
    "compute": "2026-07-06T00:15:00Z",
    "database": "2026-07-05T23:45:00Z",
    ...
  },
  "staleness": { "compute": false, "database": false, ... }
}
```
Use this to monitor data freshness in external dashboards or alerting systems.

### 🏢 Datacenters Page (`/datacenters`)
Infrastructure intelligence independent of pricing. Shows:
- Cloud provider geographic footprint (regions, edges, data centers)
- Government cloud offerings and compliance posture
- Redundancy and availability zone coverage per provider
- References: AWS regions, Azure geographies, GCP zones, Oracle regions, DigitalOcean, Alibaba, Cloudflare, Vultr, Hetzner

No pricing on this page — pure infrastructure comparison. Use it to validate that your target geography is supported before running cost estimates.

### 📜 Certifications & Regulations Page (`/certifications`)
Compliance posture independent of pricing. Shows which security, privacy, industry, and government certifications each provider holds (ISO 27001/27017/27018/27701/22301/20000-1/42001, SOC 1/2/3, PCI DSS, HIPAA, FedRAMP High/Moderate, CSA STAR, FIPS 140-2, HITRUST, NIST 800-171, GDPR, IRAP, C5, ENS, MTCS, ISMAP). Provider-centric tiles with three filters — provider, region (same `GEOGRAPHIES` buckets as the pricing pages), and certification. Selecting a certification disables providers that lack it ("who qualifies for FedRAMP High?"). Certification names link to a definition of the standard; each provider's official compliance page is linked at the bottom as the source of truth.

Static curated data — **no live pipeline**. Compliance changes rarely and a wrong claim carries real risk, so the matrix lives in `src/config/certifications.ts` and is refreshed roughly every 6 months via a human-reviewed Claude Code prompt. See [CERTIFICATIONS_REFRESH.md](./CERTIFICATIONS_REFRESH.md) for the ready-to-paste refresh prompt and review process.

---

## 💬 About Page & User-Facing Messaging

The About page (`/about`) is the authoritative reference for users on what CCC does and who it's for. It emphasizes:

- **Comprehensive Product Coverage** — 10+ categories across 9+ cloud providers
- **Multi-Cloud Analysis at Scale** — normalized, side-by-side comparisons
- **Global Infrastructure Intelligence** — Datacenters page for geographic reach independent of pricing
- **Compliance & Certification Comparison** — Certifications & Regulations page showing which standards each provider holds, independent of pricing
- **Frequently Updated Pricing** — weekly refresh with timestamps (not real-time, but predictably fresh)
- **Granular Cost Breakdown** — drill into compute, storage, networking, licensing independently
- **Proactive Workload Planning** — workload templates for pre-deployment cost simulation

**Data Freshness Statement:** CCC data is refreshed weekly. The Status page (`/status`) shows exact timestamps for each product category's last ingestion. Each pricing record includes an `updated_at` timestamp so users can see how fresh the specific row is. This is accurate, honest messaging — we're not claiming real-time data (which would be operationally impossible), but users know when to expect the next refresh.

---

## ➕ Adding a New Cloud Provider

1. Create static config files in `src/config/<provider>_*.ts` (one per product category)
2. Add provider slug + name to `src/db/schema.sql` INSERT block
3. Create adapter classes in the relevant `src/services/*_pipeline.ts` files
4. Add the new provider's filter options to `src/config/index.ts`
5. Register the adapter in `src/app/api/admin/fetch-pricing/route.ts`

See [PROJECT_ANALYSIS.md](./PROJECT_ANALYSIS.md) § 4.3 for a step-by-step walkthrough.

---

## 🗺️ Documentation Map

| Goal | Location |
|---|---|
| User-facing overview | [/about](https://comparecloudcosts.com/about) page (in-app) |
| Pipeline health & data freshness | [/status](https://comparecloudcosts.com/status) page (in-app) |
| Infrastructure intelligence | [/docs](https://comparecloudcosts.com/docs) Datacenters section (in-app) |
| Compliance & certifications | [/certifications](https://comparecloudcosts.com/certifications) page (in-app) |
| Refresh certification data | [CERTIFICATIONS_REFRESH.md](./CERTIFICATIONS_REFRESH.md) |
| Deploy to production | [OPERATIONS_RUNBOOK.md](./OPERATIONS_RUNBOOK.md) |
| Understand the full architecture | [PROJECT_ANALYSIS.md](./PROJECT_ANALYSIS.md) |
| View system diagrams | [ARCHITECTURE_DIAGRAMS.md](./ARCHITECTURE_DIAGRAMS.md) |
| Review security posture | [SECURITY_AUDIT.md](./SECURITY_AUDIT.md) |
| Understand applied security fixes | [SECURITY_FIXES.md](./SECURITY_FIXES.md) |
| Populate pricing data | [DATA_POPULATION_GUIDE.md](./DATA_POPULATION_GUIDE.md) |

> **Note:** `PROJECT_ANALYSIS.md` and `ARCHITECTURE_DIAGRAMS.md` reflect an earlier version of the architecture (Express-based). The README above and in-app About/Status pages are the most current reference for the Next.js App Router version with regional analytics, filter consolidation, and workload templates.

---

## 📄 License & Contributions

Licensed under **AGPL-3.0**. If you modify this code and host it publicly, you must publish your changes under the same license. Pull Requests are welcome. Please open an Issue first for significant changes.

---

## 🙋 Support & Feedback

- **Bug or Feature Idea?** → [Submit an Issue](../../issues)
- **General questions?** → hello@comparecloudcosts.com

<p align="center">© 2026 <a href="https://www.linkedin.com/in/rodrigoorzari/">Rodrigo Orzari</a>. All rights reserved.</p>
