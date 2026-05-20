# Compare Cloud Costs

This is a full-stack cloud pricing comparison app. Stack: React + TypeScript (Vite) frontend, Node/Express backend (server.ts), PostgreSQL DB, hosted on DigitalOcean App Platform.

## 1. What Problem Does This Application Solve?
In modern cloud engineering and FinOps, **apples-to-apples price comparison** across multiple cloud providers is a major pain point. 
* Cloud providers (AWS, Azure, GCP, Oracle, DigitalOcean) structure their pricing cards differently, publish rate details in disjoint formats, and use proprietary terminology (e.g., Droplets vs. EC2 vs. Virtual Machines).
* Finding the most cost-effective region, instance type, architecture (e.g., x86 vs. ARM), or memory-to-vCPU ratio for a specific workload requires engineers to either browse individual price calculators or build custom spreadsheets.
* Existing FinOps tools generally focus on **reactive analysis** (analyzing bills *after* deployment) rather than **proactive planning** (matching workloads to optimal providers *before* deployment).

**Compare Cloud Costs (CCC)** solves this by:
1. **Aggregating** raw catalog data from live pricing APIs and offline fallback configs.
2. **Normalizing** compute categories (Compute Optimized, Memory Optimized, etc.), geographies (e.g., N. America, W. Europe), hardware attributes (vCPUs, RAM size, GPU availability), and database properties (HA modes, Engines, Tiers).
3. **Comparing** configurations in a single side-by-side dashboard, allowing users to instantly identify the cheapest option for their specified constraint ranges.

---

## 2. Architectural Design

```mermaid
graph TD
    subgraph Frontend [React SPA (Vite + TypeScript)]
        UI[Dashboard / Informational Pages]
        Filter[Sidebar Filter States]
        UI -->|GET /api/pricing| Filter
    end

    subgraph Backend [Express API (Node.js + tsx)]
        Srv[server.ts]
        Router[API Router]
        Cron[Weekly node-cron Worker]
        Pipe[Pricing & Database Pipelines]
        Mailer[Nodemailer Services]
        
        Srv --> Router
        Srv --> Cron
        Cron --> Pipe
        Pipe --> Mailer
    end

    subgraph Storage [PostgreSQL Database]
        Schema[schema.sql]
        Data[(Providers, Regions, Services, Pricing Records)]
        Router -->|Query Pricing| Data
        Pipe -->|Batch Insert / Delete| Data
    end
```

The application is structured as a monorepo deploying a **Single Page Application (SPA) backend-integration**:
* **Frontend**: React + TypeScript client built using Vite, styled with Tailwind CSS, and powered by Motion for micro-animations.
* **Backend**: Express.js server written in TypeScript (executed using `tsx` utility). In development, it acts as a Vite dev-server middleware. In production, it serves precompiled assets and functions as a standard REST API.
* **Database**: PostgreSQL storing providers, service lines, geographical regions, and detailed pricing entries.

---

## 3. File Directory & Code Organization

The repository's structure is organized as follows:

* [package.json](./package.json): Lists runtime dependencies (`pg`, `express`, `nodemailer`, `axios`, `react`, `react-router-dom`, `motion`) and developer/build scripts.
* [server.ts](./server.ts): The application entrypoint. Configures Express, initializes database connections, handles admin pipeline operations, sets up cron schedules, and routes client traffic.
* [vite.config.ts](./vite.config.ts) & [tsconfig.json](./tsconfig.json): Configuration files for build processes and TypeScript compilation.
* [src/db/schema.sql](./src/db/schema.sql): Defines the database schema, setting up standard tables with relational constraints:
  * `providers`: Maps top-level cloud companies (`aws`, `azure`, `gcp`, `oracle`, `digitalocean`).
  * `regions`: Maps cloud locations (e.g., `us-east-1` under `aws`).
  * `services`: Maps service lines (e.g., `EC2` under `aws`, `Cloud SQL` under `gcp`).
  * `pricing_records`: Holds hardware specification mappings (vCPUs, memory, architecture, operating system, GPU count, unit pricing, pricing data source, and custom JSONB metadata).
* **`src/services/`**: Implements pricing aggregation pipelines and auxiliary utilities:
  * [pricing_pipeline.ts](./src/services/pricing_pipeline.ts): Standardizes the ingestion architecture for VM instances. Defines the base class `BaseAdapter` and provider subclasses:
    * `AWSAdapter` and `AzureAdapter`: Stream live pricing over public catalog APIs (AWS index JSON and Azure Retail Prices API).
    * `GCPAdapter` and `OracleAdapter`: Fetch configurations from offline configs.
    * `DigitalOceanAdapter`: Requests droplets from live `/v2/sizes` API when `DIGITALOCEAN_API_TOKEN` is present; falls back to static files otherwise.
  * [database_pipeline.ts](./src/services/database_pipeline.ts): Extends the VM pricing model to handle database nodes (`AWSRDSAdapter`, `AzureDBAdapter`, `GCPCloudSQLAdapter`, etc.). Incorporates relational database attributes (e.g., databases engines like MySQL/PostgreSQL, High-Availability options, and instance tiers).
  * [mailer.ts](./src/services/mailer.ts): Configures SMTP notifications for operations teams.
  * [ingest.ts](./src/services/ingest.ts): A CLI utility script to trigger standalone pricing pipeline runs.
* **`src/config/`**: Holds hardcoded pricing catalog configs for offline ingestion:
  * `digitalocean_instances.ts`, `gcp_instances.ts`, `oracle_instances.ts`, and `database_instances.ts` mapping fallback pricing profiles.
* **`src/pages/`**: The core application pages:
  * [src/pages/Dashboard.tsx](./src/pages/Dashboard.tsx): Main comparative layout interface featuring filters, a dense grid, interactive range sliders, and multi-column sorting.
  * `About.tsx`, `Methodology.tsx`, `PrivacyPolicy.tsx`, `Support.tsx`, `TermsOfUse.tsx`: Textual, markdown-rendered static informational content pages.
* [src/components/MarkdownPage.tsx](./src/components/MarkdownPage.tsx): Helper component to format and render markdown texts safely inside the app's dark-mode/light-mode layouts.

---

## 4. In-Depth Subsystem Walks

### A. Database Initialization and Schema Management
Inside [server.ts](./server.ts), `initDb` parses and runs [schema.sql](./src/db/schema.sql). It performs schema migrations (e.g. adding `cpu_vendor`, `gpu_count`, `category` dynamically) and automatically standardizes classifications to ensure consistency (for example, renaming architecture fields like `x86_64` to `x86 64` and mapping generic instance configurations to Intel, AMD, or ARM vendors).

### B. Ingestion Pipelines & In-Flight Validations
In [pricing_pipeline.ts](./src/services/pricing_pipeline.ts), `PricingPipeline` executes adapters sequentially:
1. Adapters request raw payloads from live JSON payloads or API endpoints, parsing instances, operating systems, pricing points, and metadata.
2. In-flight categorization functions standardize the records. For example, CPU vendors are extracted from SKU substrings (e.g., detecting `graviton` -> `AWS`), and instance groups are mapped using vCPU-to-Memory ratios (e.g. ratios below 2.1 mapping to `Compute optimized`).
3. Before writing updates, a **price drift check** is performed by comparing new prices with existing records in the database. If prices vary by **more than 20%**, a warning is logged and `sendPriceDriftEmail` is triggered to alert developers of potential anomalies.
4. Old pricing is deleted, and the new listings are written using batch inserts to maximize execution performance.

`DatabasePricingPipeline` extends this behavior to database products. It maps relational components into custom JSONB `attributes` structures containing engine versions, storage types, HA modes, and deployment options.

### C. Backend API Routes
[server.ts](./server.ts) exposes endpoints used by the dashboard:
* `/api/pricing`: Retrieves list of pricing records. It uses `buildPricingFilters` to parse complex query-parameter arrays and return filtered records. If `aggregate=true` is requested, it averages prices across all region options to present aggregated instance types.
* `/api/pricing/counts`: Drives UI status indicators by showing real-time record tallies matching selected criteria.
* `/api/admin/fetch-pricing` / `/api/admin/init-db`: Admin triggers to force pipeline executions.
* **Cron Jobs**: The server runs a background cron schedule (every Sunday at midnight) executing `PricingPipeline` and `DatabasePricingPipeline` to fetch fresh pricing data. It runs staleness checks, alerting via `sendStalenessEmail` if offline configurations haven't been reviewed in more than 7 days.

### D. The Comparative Frontend Dashboard
[src/pages/Dashboard.tsx](./src/pages/Dashboard.tsx) binds this dataset to the UI:
* **Product Views**: Users can toggle between `Virtual Machines` and `Databases` which dynamically adjusts filters (e.g. OS and CPU vendor filters for VMs vs. Engine, Deployment Type, and HA Mode filters for DBs).
* **Sidebar Controls**: Features multi-select pills (Providers, Geographies, Engines, categories) and responsive range sliders (`RangeSlider`) to narrow down configurations by minimum/maximum values.
* **Sortable Dense Grid**: Renders comparison rows in an interactive table supporting multi-column sorting (e.g., sorting by price, vCPUs, or memory) and drag-to-resize column boundaries. Column sizes are persistent, stored in local storage for subsequent visits.

---

# License & Contributions

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).

* Usage: You may use, modify, and deploy this source code at no cost.
* Requirements: If you modify this code and host it on a server for network access, you must make your modified source code available under this same license.
* Contributions: Submit Pull Requests to this repository to share improvements with the community.


# Project Note

This repository contains the open-source core of Compare Cloud Costs. While this version will remain open and available, future premium features or enterprise modules may be maintained in separate, private repositories.

# Questions or feedback?

Email hello@comparecloudcosts.com for questions or feedback.

