<p align="center">
  <img src="public/logo.png" alt="Compare Cloud Costs Logo" width="400">
</p>

# Welcome!

This is a full-stack cloud pricing comparison app. Stack: Next.js (React + TypeScript) full-stack application, PostgreSQL DB.

## Live Deployment

The application is deployed live and fully functional at [comparecloudcosts.com](http://comparecloudcosts.com).

This project is hosted on the **DigitalOcean App Platform**. To help keep this service running live without requiring users to host their own instances, please consider using our DigitalOcean referral link when creating a new account to grant the project free hosting credits:

<a href="https://www.digitalocean.com/?refcode=23d2b384f3b1&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge"><img src="https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%203.svg" alt="DigitalOcean Referral Badge" /></a>

**[❤️ Support this project](https://connect.intuit.com/pay/comparecloudcosts/scs-v1-d4824657f6fd4f78a6856dc5e82dd2429767f2a940be417e91832e441461fa61acbb2640b33e45d295200d2aafb687ca)**

If you find Compare Cloud Costs useful and it helped you save money, please consider supporting the project. Donations cover cloud infrastructure costs, as well as tokens for AI coding tools, allowing us to continuously improve this project's capabilities and keep the website running.

You can also support us by scanning the QR code below:

<img src="./support-qr.png" width="200" alt="Scan to support this project">


## 1. What Problem Does This Application Solve?
In modern cloud engineering and FinOps, **apples-to-apples price comparison** across multiple cloud providers is a major pain point. 
* Cloud providers (AWS, Azure, GCP, Oracle, DigitalOcean, Alibaba) structure their pricing cards differently, publish rate details in disjoint formats, and use proprietary terminology (e.g., Droplets vs. EC2 vs. Virtual Machines).
* Finding the most cost-effective region, instance type, architecture (e.g., x86 vs. ARM), or memory-to-vCPU ratio for a specific workload requires engineers to either browse individual price calculators or build custom spreadsheets.
* Existing FinOps tools generally focus on **reactive analysis** (analyzing bills *after* deployment) rather than **proactive planning** (matching workloads to optimal providers *before* deployment).

**Compare Cloud Costs (CCC)** solves this by:
1. **Aggregating** raw catalog data from live pricing APIs and offline fallback configs across 7 primary domains: VMs, Databases, Serverless, Containers, Networking, Data Analytics, and AI.
2. **Normalizing** proprietary data such as compute categories, geographies, hardware attributes, networking port capacities, AI context windows, and analytics compute units.
3. **Comparing** configurations in a single side-by-side dashboard, allowing users to instantly identify the cheapest option for their specified constraint ranges.
4. **Simulating** full architectures via the Workloads Catalog, providing directional cost estimators for entire deployment scenarios like 3-tier web apps or ML pipelines across clouds.

---

## 2. Architectural Design

The application is structured as a monorepo deploying a **Single Page Application (SPA) backend-integration**:
* **Frontend**: React + TypeScript client built using Next.js App Router, styled with Tailwind CSS, and powered by Motion for micro-animations. State management and data fetching use `@tanstack/react-query`.
* **Backend**: Next.js API Routes handle client requests, while data ingestion and scheduled tasks are managed by a dedicated background worker (`src/workers/scheduler.ts`).
* **Database**: PostgreSQL storing providers, service lines, geographical regions, and detailed pricing entries.

---

## 3. File Directory & Code Organization

### Directory Tree

```
_ccc/
├── 📄 Configuration & Entry Points
│   ├── next.config.js                 # Next.js configuration
│   ├── tsconfig.json                  # TypeScript compiler options
│   ├── package.json                   # Dependencies & npm scripts
│   ├── .env.example                   # Environment variables template
│   ├── populate_containers.ts         # Script to populate containers
│   └── populate_serverless.ts         # Script to populate serverless
│
├── 📖 Documentation (START HERE)
│   ├── README.md                      # This file — project overview
│   ├── PROJECT_ANALYSIS.md            # In-depth technical analysis (15 sections)
│   ├── ARCHITECTURE_DIAGRAMS.md       # Visual ASCII diagrams (13 diagrams)
│   ├── OPERATIONS_RUNBOOK.md          # Deployment, security, troubleshooting guide
│   ├── SECURITY_AUDIT.md              # Security audit findings & recommendations
│   ├── SECURITY_FIXES.md              # Implementation details of security fixes
│   ├── SERVERLESS_IMPLEMENTATION_PLAN.md # Serverless implementation plan
│   ├── DATA_POPULATION_GUIDE.md       # Data population guide
│   └── IMPLEMENTATION_SUMMARY.md      # Summary of latest implementations
│
├── src/
│   ├── app/                           # Next.js App Router (pages and API routes)
│   │   ├── page.tsx                   # Main Dashboard UI
│   │   ├── api/                       # Backend API routes
│   │   ├── status/                    # Application Status page
│   │   └── ...                        # Static documentation pages (about, terms, etc.)
│   │
│   ├── workers/                       # Background worker processes (e.g., cron jobs)
│   ├── index.css                      # Global Tailwind + custom styles
│   │
│   ├── db/
│   │   └── schema.sql                 # PostgreSQL schema definitions
│   │
│   ├── lib/
│   │   ├── api-utils.ts               # Centralized data fetching and filtering hooks
│   │   └── db.ts                      # Database connection utilities
│   │
│   ├── services/
│   │   ├── pricing_pipeline.ts        # VM instance pricing aggregation
│   │   ├── database_pipeline.ts       # Database product pricing
│   │   ├── serverless_pipeline.ts     # Serverless compute pricing
│   │   ├── containers_pipeline.ts     # Containers compute pricing
│   │   ├── networking_pipeline.ts     # Networking products pricing
│   │   ├── data_analytics_pipeline.ts # Data Analytics pricing
│   │   ├── ai_pipeline.ts             # AI foundational models pricing
│   │   ├── serverless_adapters_live.ts# Live adapters for Serverless
│   │   ├── containers_adapters_live.ts# Live adapters for Containers
│   │   ├── populate_containers.ts     # Container DB population script
│   │   ├── mailer.ts                  # Email notifications (SMTP)
│   │   └── ingest.ts                  # CLI tool for manual pricing fetch
│   │
│   ├── config/
│   │   ├── *_{serverless,containers,instances}.ts # Provider-specific fallback configs (AWS, Azure, GCP, Oracle, DO, Alibaba)
│   │   ├── ai_models.ts               # AI Foundation Models config
│   │   └── *_data_analytics.ts        # Data Analytics & Data Warehouse configs
│   │
│   └── components/
│       ├── FilterSidebar.tsx          # Dynamic filter sidebar UI
│       ├── PricingTable.tsx           # Interactive data table
│       └── ChartsToggle.tsx           # Data visualizations component
│
├── .next/                             # Production build output (generated)
├── node_modules/                      # Dependencies (generated)
│
├── 📜 Project Files
│   ├── LICENSE                        # AGPL-3.0 license
│   ├── .gitignore                     # Git exclusions
│   └── metadata.json                  # Project metadata
```

### File Descriptions

**Configuration & Entry Points:**
* [package.json](./package.json): Lists runtime dependencies (`next`, `postgres`, `@tanstack/react-query`, `nodemailer`, `axios`, `react`, `motion`, `recharts`) and npm scripts for development/build.
* [next.config.js](./next.config.js) & [tsconfig.json](./tsconfig.json): Build and TypeScript configuration files.

**Documentation Files (New):**
* [PROJECT_ANALYSIS.md](./PROJECT_ANALYSIS.md): **Comprehensive technical deep-dive** covering technology stack, architecture, data model, pipelines, API routes, frontend design, performance, and enhancement recommendations. Read this for a complete understanding of how everything works. (~8,000 words)
* [ARCHITECTURE_DIAGRAMS.md](./ARCHITECTURE_DIAGRAMS.md): **Visual ASCII diagrams** showing system architecture, data flows, state machines, deployment pipeline, and more. Useful for understanding interactions at a glance. (13 diagrams)
* [OPERATIONS_RUNBOOK.md](./OPERATIONS_RUNBOOK.md): **Operational & Security guide** for deploying, securing, monitoring, troubleshooting, and maintaining the application. Includes TLS setup, admin authentication, filter validation, and deployment checklist. Read this before deploying to production.
* [SECURITY_AUDIT.md](./SECURITY_AUDIT.md): **Comprehensive security audit** identifying vulnerabilities in TLS/SSL, authentication, input validation, and secrets management. Documents all findings with risk ratings and recommended fixes.
* [SECURITY_FIXES.md](./SECURITY_FIXES.md): **Implementation details** of all security fixes applied to the codebase. Covers TLS certificate validation, database connection pooling, admin endpoint authentication, and SQL injection prevention through input validation.

**Database:**
* [src/db/schema.sql](./src/db/schema.sql): PostgreSQL schema definitions:
  * `providers`: Cloud companies (aws, azure, gcp, oracle, digitalocean, alibaba)
  * `regions`: Cloud regions per provider
  * `services`: Service lines per provider (EC2, RDS, Virtual Machines, etc.)
  * `pricing_records`: Instance/database pricing with specs (vCPUs, memory, price, etc.)

**Data Pipelines (`src/services/`):**
* [pricing_pipeline.ts](./src/services/pricing_pipeline.ts): VM pricing aggregation from AWS, Azure, GCP, Oracle, DigitalOcean, Alibaba. Handles normalization, CPU vendor detection, geography mapping, and price drift alerts.
* [database_pipeline.ts](./src/services/database_pipeline.ts): Database product pricing (RDS, Cloud SQL, Azure SQL, etc.) with attributes for engines, HA modes, tiers.
* [serverless_pipeline.ts](./src/services/serverless_pipeline.ts): Serverless compute pricing (Lambda, Cloud Functions, Azure Functions).
* [mailer.ts](./src/services/mailer.ts): Email notifications for price drift and data staleness alerts.
* [ingest.ts](./src/services/ingest.ts): CLI utility to manually trigger pricing pipelines.

**Configuration Fallbacks (`src/config/`):**
* Hardcoded pricing configs for each cloud provider, used when live APIs are unavailable or rate-limited.

**Frontend (`src/app/` & `src/components/`):**
* [src/app/page.tsx](./src/app/page.tsx): Main Dashboard entry point mapping state to the main UI.
* [src/components/FilterSidebar.tsx](./src/components/FilterSidebar.tsx): Dynamic sidebar that adapts filters based on the selected product category.
* Static pages (`about/`, `methodology/`, `privacy/`, `support/`, `terms/`, `status/`) rendered via App Router.
* Data fetching and filter hook logic is centralized within [src/lib/api-utils.ts](./src/lib/api-utils.ts).

---

## 4. Documentation Guide

**Confused about where to start?** This table helps you find the right documentation:

| You want to... | Read this | File |
|---|---|---|
| Understand how everything works | Complete technical breakdown with all subsystems | [PROJECT_ANALYSIS.md](./PROJECT_ANALYSIS.md) |
| Visualize the architecture | System diagrams, data flows, state machines | [ARCHITECTURE_DIAGRAMS.md](./ARCHITECTURE_DIAGRAMS.md) |
| Deploy to production securely | TLS setup, admin auth, input validation, security checklist | [OPERATIONS_RUNBOOK.md](./OPERATIONS_RUNBOOK.md) |
| Understand security vulnerabilities | Findings, risk ratings, and remediation recommendations | [SECURITY_AUDIT.md](./SECURITY_AUDIT.md) |
| Learn about security fixes | Details on TLS validation, auth middleware, input filtering | [SECURITY_FIXES.md](./SECURITY_FIXES.md) |
| Develop locally | See "Quick Start" section below | — |
| Understand a specific subsystem | Jump to Section 5 (below) for database, pipelines, API, frontend details | This README |

---

## 5. Security & Deployment

### ⚠️ Important: Production Security Requirements

**Before deploying to production**, you MUST:**

1. **Enable TLS/SSL certificate validation** — The application validates PostgreSQL certificate chains. Provide your CA certificate via `DATABASE_CA_CERT` environment variable (base64-encoded).
2. **Set a secure ADMIN_API_KEY** — Generate using `openssl rand -hex 32`. All `/api/admin/*` endpoints require this token in the `X-Admin-Token` header.
3. **Configure environment variables** — Use `.env.example` as a template. Never commit `.env` files to version control.
4. **Review the OPERATIONS_RUNBOOK.md** — Contains TLS troubleshooting, admin authentication setup, filter validation constraints, and a production deployment checklist.

**See [OPERATIONS_RUNBOOK.md](./OPERATIONS_RUNBOOK.md) for security setup and deployment instructions.**

For a detailed audit of all security findings and remediation steps, see [SECURITY_AUDIT.md](./SECURITY_AUDIT.md).

---

## 6. Quick Start

### Local Development (5 minutes)

```bash
# 1. Clone & install
git clone https://github.com/[org]/comparecloudcosts.git
cd comparecloudcosts
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env and set: DATABASE_URL=postgres://...
#                    ADMIN_API_KEY=<generate-with-openssl-rand-hex-32>

# 3. Start dev server
npm run dev
# Opens http://localhost:3000 with hot reloading

# 4. Type-check
npm run lint
```

### Build for Production

```bash
npm run build        # Creates optimized Next.js build
npm run start        # Serves production build on port 3000
```

For detailed operational instructions, see [OPERATIONS_RUNBOOK.md](./OPERATIONS_RUNBOOK.md).

---

## 7. In-Depth Subsystem Walks

### A. Database Initialization and Schema Management
Inside [server.ts](./server.ts), `initDb` parses and runs [schema.sql](./src/db/schema.sql). It performs schema migrations (e.g. adding `cpu_vendor`, `gpu_count`, `category` dynamically) and automatically standardizes classifications to ensure consistency (for example, renaming architecture fields like `x86_64` to `x86 64` and mapping generic instance configurations to Intel, AMD, or ARM vendors).

**For more details**, see [PROJECT_ANALYSIS.md — Section 3 (Data Model)](./PROJECT_ANALYSIS.md) and [ARCHITECTURE_DIAGRAMS.md — Database Schema Diagram](./ARCHITECTURE_DIAGRAMS.md).

### B. Ingestion Pipelines & In-Flight Validations
In [pricing_pipeline.ts](./src/services/pricing_pipeline.ts), `PricingPipeline` executes adapters sequentially:
1. Adapters request raw payloads from live JSON payloads or API endpoints, parsing instances, operating systems, pricing points, and metadata.
2. In-flight categorization functions standardize the records. For example, CPU vendors are extracted from SKU substrings (e.g., detecting `graviton` -> `AWS`), and instance groups are mapped using vCPU-to-Memory ratios (e.g. ratios below 2.1 mapping to `Compute optimized`).
3. Before writing updates, a **price drift check** is performed by comparing new prices with existing records in the database. If prices vary by **more than 20%**, a warning is logged and `sendPriceDriftEmail` is triggered to alert developers of potential anomalies.
4. Old pricing is deleted, and the new listings are written using batch inserts to maximize execution performance.

`DatabasePricingPipeline` extends this behavior to database products. It maps relational components into custom JSONB `attributes` structures containing engine versions, storage types, HA modes, and deployment options.

Similarly, `ServerlessPipeline`, `ContainersPipeline`, and `NetworkingPipeline` operate on their respective domain data, aggregating metadata like supported languages for Serverless, or orchestrator types for Containers, into the shared JSONB `attributes`.

**For detailed pipeline diagrams and flow**, see [ARCHITECTURE_DIAGRAMS.md — Data Ingestion Pipeline](./ARCHITECTURE_DIAGRAMS.md) and [PROJECT_ANALYSIS.md — Section 4](./PROJECT_ANALYSIS.md).

### C. Backend API Routes
The backend endpoints used by the dashboard are structured as Next.js API Routes (`src/app/api/...`):
* `/api/pricing`: Retrieves list of pricing records. It parses complex query-parameter arrays and returns filtered records. If `aggregate=true` is requested, it averages prices across all region options to present aggregated instance types.
* `/api/pricing/counts`: Drives UI status indicators by showing real-time record tallies matching selected criteria.

**Background Jobs:** A separate worker process (`src/workers/scheduler.ts`) runs a background cron schedule (every Sunday at midnight) executing `PricingPipeline` and `DatabasePricingPipeline` to fetch fresh pricing data. It runs staleness checks, alerting via `sendStalenessEmail` if offline configurations haven't been reviewed in more than 7 days.

**For API documentation and examples**, see [PROJECT_ANALYSIS.md — Section 5](./PROJECT_ANALYSIS.md) and [ARCHITECTURE_DIAGRAMS.md — API Request/Response Cycles](./ARCHITECTURE_DIAGRAMS.md).

### D. The Comparative Frontend Dashboard
[src/app/page.tsx](./src/app/page.tsx) binds this dataset to the UI:
* **Product Views**: Users can toggle between `Virtual Machines`, `Databases`, `Serverless`, `Containers`, `Networking`, and `Data & Analytics`, which dynamically adjusts available filters depending on the selected product (e.g. OS and CPU vendor filters for VMs vs. Execution Model and Cold Start filters for Serverless).
* **Sidebar Controls**: Features multi-select pills (Providers, Geographies, Engines, categories) and responsive range sliders (`RangeSlider`) to narrow down configurations by minimum/maximum values. The UI utilizes `@tanstack/react-query` to manage data fetching and intelligently cache responses while interacting with sliders and filters.
* **View Toggles (Table vs. Charts)**: Users can seamlessly switch between a tabular dense grid and analytical charts to understand data visually.
* **Sortable Dense Grid**: Renders comparison rows in an interactive table supporting multi-column sorting and drag-to-resize column boundaries. It includes **In-Table Micro-Visualizations**, rendering relative price-bar indicators inside the price cells so users can instantly gauge a row's cost relative to the most expensive filtered item.
* **Analytical Charts**: Powered by `recharts`, provides visual representations of the filtered data such as a Provider Price Bar Chart and a Resource Efficiency Scatter Plot (e.g., Price vs. RAM).

**For frontend architecture and state management**, see [PROJECT_ANALYSIS.md — Section 6](./PROJECT_ANALYSIS.md) and [ARCHITECTURE_DIAGRAMS.md — Frontend State Flow](./ARCHITECTURE_DIAGRAMS.md).

---

## 8. Resources for Contributors

### Getting Started

1. **Read this README** — Understand what the project does and its architecture overview
2. **Run locally** — Follow the Quick Start section above
3. **Explore the codebase** — Start with [src/pages/Dashboard.tsx](./src/pages/Dashboard.tsx) (frontend) or [server.ts](./server.ts) (backend)
4. **Deep dive** — Read [PROJECT_ANALYSIS.md](./PROJECT_ANALYSIS.md) for comprehensive technical details

### For Specific Tasks

**Want to...** | **Start here**
---|---
Understand the data model | [PROJECT_ANALYSIS.md § 3](./PROJECT_ANALYSIS.md) + [src/db/schema.sql](./src/db/schema.sql)
Work on pricing pipelines | [PROJECT_ANALYSIS.md § 4](./PROJECT_ANALYSIS.md) + [src/services/pricing_pipeline.ts](./src/services/pricing_pipeline.ts)
Build frontend features | [PROJECT_ANALYSIS.md § 6](./PROJECT_ANALYSIS.md) + [src/app/page.tsx](./src/app/page.tsx)
Secure the application | [SECURITY_AUDIT.md](./SECURITY_AUDIT.md) + [SECURITY_FIXES.md](./SECURITY_FIXES.md)
Deploy to production | [OPERATIONS_RUNBOOK.md § 4](./OPERATIONS_RUNBOOK.md) + [Section 5 above](#5-security--deployment)
Add a new cloud provider | [PROJECT_ANALYSIS.md § 4.3](./PROJECT_ANALYSIS.md)
Troubleshoot issues | [OPERATIONS_RUNBOOK.md § 9](./OPERATIONS_RUNBOOK.md)

### Key Architecture Files

| Purpose | File |
|---------|------|
| Server entry point | [server.ts](./server.ts) |
| Database schema | [src/db/schema.sql](./src/db/schema.sql) |
| Pricing pipelines | [src/services/pricing_pipeline.ts](./src/services/pricing_pipeline.ts), [database_pipeline.ts](./src/services/database_pipeline.ts) |
| Frontend UI | [src/app/page.tsx](./src/app/page.tsx) |
| Email alerts | [src/services/mailer.ts](./src/services/mailer.ts) |
| Security audit | [SECURITY_AUDIT.md](./SECURITY_AUDIT.md) |
| Security fixes | [SECURITY_FIXES.md](./SECURITY_FIXES.md) |
| Environment template | [.env.example](./.env.example) |

---

# License & Contributions

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).

* Usage: You may use, modify, and deploy this source code at no cost.
* Requirements: If you modify this code and host it on a server for network access, you must make your modified source code available under this same license.
* Contributions: Submit Pull Requests to this repository to share improvements with the community.


# Project Note

This repository contains the open-source core of Compare Cloud Costs. While this version will remain open and available, future premium features or enterprise modules may be maintained in separate, private repositories.

# Support & Feedback

**Found a bug?** Open a [GitHub Issue](../../issues)

**Have a feature idea?** Open a [GitHub Discussion](../../discussions)

**General questions?** Email hello@comparecloudcosts.com

**Can't find what you're looking for?**
- Check [PROJECT_ANALYSIS.md](./PROJECT_ANALYSIS.md) for technical details
- Check [OPERATIONS_RUNBOOK.md](./OPERATIONS_RUNBOOK.md) for operational and security questions
- Check [ARCHITECTURE_DIAGRAMS.md](./ARCHITECTURE_DIAGRAMS.md) for system diagrams
- Check [SECURITY_AUDIT.md](./SECURITY_AUDIT.md) for security findings and recommendations
- Check [SECURITY_FIXES.md](./SECURITY_FIXES.md) for implementation details of applied fixes

---

<p align="center"><strong><a href="https://connect.intuit.com/pay/comparecloudcosts/scs-v1-d4824657f6fd4f78a6856dc5e82dd2429767f2a940be417e91832e441461fa61acbb2640b33e45d295200d2aafb687ca">❤️ Support this project</a></strong></p>

<p align="center">© 2026 <a href="https://www.linkedin.com/in/rodrigoorzari/">Rodrigo Orzari</a>. All rights reserved.</p>
