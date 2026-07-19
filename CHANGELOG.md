# Changelog

All notable changes to Compare Cloud Costs are documented here. This changelog started on July 19, 2026.

---

## [Unreleased]

### UI
- **Removed "Global" as a selectable Geography option:** `buildPricingFilters()` in `src/lib/api-utils.ts` already force-includes `global` rows alongside any region filter (many services — data transfer, WAF, etc. — aren't tied to a region), so the checkbox never actually excluded Global rows when unchecked — it only let you *isolate* them via double-click. Excluded `'Global'` from all three geography aggregations in `/api/filters/route.ts` (general, security, analytics) and fixed the Security category's loading-state fallback (`FilterSidebar.tsx`) which still hardcoded `['Global', 'N. America']`. Query results are unchanged — Global rows still show exactly as before; there's just one fewer non-functional chip per category.

### Features
- **GPU Vendor filter:** GPU chip vendor (NVIDIA, AMD, Google, AWS, Intel) is now a filterable facet on the GPU product category, alongside the existing GPU Model filter
  - `src/config/gpu_models.ts` already had a `vendor` field on every entry in `GPU_MODEL_SPECS`, but it was never written to the database — `withGpuAttrs()` in `src/services/pricing_pipeline.ts` now stamps `attributes.gpu_vendor` at ingestion time alongside the existing `gpu_model`/`gpu_vram_gb`
  - Added a one-time backfill in `initDb()` (`src/lib/api-utils.ts`) so existing GPU rows get `gpu_vendor` without needing a full re-ingestion
  - Wired the new `gpuVendor` filter end-to-end: `/api/filters` aggregation, `buildPricingFilters()`, `useDynamicFilters`, `FilterSidebar`, and `page.tsx` — cross-checked occurrence counts against the existing `gpuModel` filter at every layer to confirm nothing was missed

### Fixed
- **Containers "Service Type" and "Registry Pricing Component" filters were no-ops:** clicking "Container Registry" (or any Service Type option) under the Containers category changed local UI state but was never included in the query sent to `/api/pricing`, and `Registry Pricing Component` had no wired state at all
  - Added the missing `subset()` calls, `canFetch`/`searchParams` `useMemo` dependencies, and backend handling in `buildPricingFilters()` (maps the UI's "Orchestration"/"Container Registry" labels to the DB's `category` column)
- **App Hosting's Tiers and Compute Type filters were no-ops** for the same reason — present in `subset()` but missing from the `searchParams` `useMemo` dependency array, so React never recomputed the query URL when they changed
- **AI category's Service Type/Model Tier/Context Window/Multimodal filters** referenced in `canFetch`'s body but missing from its dependency array — the "all deselected" fetch-blocking edge case went stale for those four filters
- Systematically cross-checked all 58 filter groups across every category (query-param builder, both `useMemo` dependency arrays, `FilterSidebar` prop wiring, and backend param handling) after finding the above — no further gaps found at the time
- **Stale raw region slugs in the Geography filter (e.g. `eastus`/`westus`, `us-east-1`, `cn-hangzhou`):** audited every current `geography` write path (all literal assignments in `src/services/*.ts` and `src/config/*.ts`, plus every `getGeography()` call site) and confirmed the ingestion code is fully normalized — the leftover raw values users still saw in the Geography filter were historical rows from before those adapters were fixed, persisting because a pipeline's DELETE+INSERT only touches the category it's currently re-ingesting
  - Added a bulk normalization pass to `initDb()` in `src/lib/api-utils.ts` that rewrites any `pricing_records.geography` value not already one of the canonical buckets (or `Global`), using the same substring rules as `BaseAdapter.getGeography()`
  - Runs automatically on every `POST /api/admin/init-db` and after every `POST /api/admin/fetch-pricing` (which calls `initDb()` post-pipeline) — no full re-ingestion needed, just a schema-init call
- **Workload Well-Architected pillar composition:** audited all 19 workload definitions (`src/config/workloads.ts`) and found that 3 of the 4 shared pillar-modifier helpers (`perfWantsCache`, `reliabilityWantsLoadBalancer`, `reliabilityWantsBackup`) were imported but never called — meaning Performance/Reliability sliders had documented-but-nonexistent effects on caching, load balancers, and backups
  - Added shared `cacheComponent()` and `backupStorageComponent()` factories; wired `perfWantsCache` into 5 workloads (Serverless Web App, 3-Tier Web, Kubernetes App Platform, SaaS on Managed Platform, Compliance-Ready Web App) and `reliabilityWantsBackup` into 13 workloads
  - Wired `reliabilityWantsLoadBalancer` into 5 workloads' existing load-balancer components (3-Tier Web, E-Commerce Microservices, Kubernetes App Platform, Content & Media Platform, Compliance-Ready Web App) — previously static/always-on regardless of the Reliability slider
  - Extended the Security-slider-conditional pattern (previously only on Compliance-Ready Web App) to E-Commerce Microservices' WAF and SaaS-on-Managed-Platform's DDoS Protection
  - Fixed HPC/Scientific Computing, the only workload where the Reliability slider had zero effect on any component — compute node count now scales with `reliabilityReplicas`
  - Added a new Secrets Management component to Compliance-Ready Web App (Security ≥ medium), using the `security_pipeline.ts` category added for API keys/credential rotation that no workload previously referenced
  - Verified via a standalone script calling `getRequirements()` directly (bypassing the DB) across priority combinations — confirmed correct add/remove behavior in every tested case
  - Zero-Trust Enterprise Edge and Hybrid Cloud Network Backbone intentionally kept their security components static — security *is* those workloads' purpose, so gating it off at low Security would defeat them

### UI
- **Frozen first column on workload comparison tables:** the Service/component-name column now stays pinned (`sticky left-0`) while provider price columns scroll horizontally, so long workloads no longer lose context when scrolled — `src/app/workloads/[id]/page.tsx`

### Removed
- **Price Drift Email Alerts:** Removed the >20% price-change email notification feature entirely
  - Deleted `PriceDriftResult` interface, `sendPriceDriftEmail()`, and the drift-detection/threshold logic in `src/services/pricing_pipeline.ts` `saveRecords()`
  - Removed `driftAlerts` accumulation and propagation from all pricing pipelines (compute, database, serverless, containers, networking, storage, data-analytics, AI, app-hosting, security, integration) and from `/api/admin/fetch-pricing` and `src/workers/scheduler.ts`
  - Kept the underlying old-price lookup that feeds the `previous_price_per_unit` column (still powers the price-trend indicator in the pricing table UI) — only the >20% alert/email logic was removed
  - Staleness alerts (`sendStalenessEmail`) and data-quality alerts (`sendDataQualityEmail`) in `src/services/mailer.ts` are unaffected

### Features
- **5 Specialized Product Categories Added:** Filled critical market gaps with clean subcategory structure
  - **Time-Series Databases:** Category `Time-Series` with `database_type: 'Time-Series'` attribute
    - AWS Timestream, Azure Data Explorer, GCP Bigtable, Oracle, DigitalOcean, Alibaba (16 entries)
  - **Graph Databases:** Category `Graph` with `database_type: 'Graph'` attribute
    - AWS Neptune, Azure Cosmos DB (Gremlin), GCP Memgraph, Oracle, DigitalOcean, Alibaba (18 entries)
  - **Search Engines:** Category `Search` with `search_type` attribute
    - AWS OpenSearch, Azure Cognitive Search, GCP Cloud Search, Oracle, Alibaba (19 entries)
  - **Certificate Management:** Category `Certificates` with `security_type: 'Certificate Management'` attribute
    - AWS ACM, Azure Key Vault Certs, GCP CA Service, Oracle, Alibaba (17 entries)
  - **Inference Endpoints:** Category `Inference` with `model_type: 'Inference'` attribute
    - AWS SageMaker, Azure ML, GCP Vertex AI, Oracle PAI, Alibaba (16 entries)
  - Refactored all pipelines to use category-level organization
  - Total new records: 86 pricing configurations across all 6 providers

- **Secrets Management Services:** Added missing security capability across all providers
  - AWS Secrets Manager: Per-secret ($0.40/month) + API calls ($0.05 per 10K)
  - Azure Key Vault Secrets: Per-secret + operations ($0.03 per 10K operations)
  - GCP Secret Manager: Per-active-version ($0.06/month) + access operations ($0.06 per 10K)
  - Oracle Vault: Per-secret (free/month)
  - Alibaba Secrets Manager: Per-secret (free/month)
  - Distinct from KMS: Secrets Manager stores & rotates application secrets, API keys, database credentials
  - Updated Security & Identity documentation to distinguish KMS vs. Secrets Management

- **Tier Normalization:** Consolidated provider-specific tier names into canonical categories
  - Created `src/utils/tier_normalization.ts` with comprehensive tier mapping across all providers
  - Maps Azure (Business Critical, Enterprise Edition, Enterprise Plus) → canonical "Enterprise"
  - Maps AWS instance families (db.r*, db.x*, db.m*, db.t*) to tier categories
  - Maps GCP, Oracle, DigitalOcean, and Alibaba provider-specific tiers to standards
  - Updated `/api/filters` endpoint to return normalized tier categories
  - Updated `/api/pricing` endpoint to normalize tier in attributes for consistent filtering
  - Reduces filter dropdown from 5–7 tier options to 4–5 canonical categories across all products
  - Provides pattern matching fallback for unmapped provider tiers
  - Table display now shows normalized tier for cleaner cross-provider comparisons

- **Container Registry Services:** Added major new subsection to Containers product category
  - New pricing pipeline for container image repositories across all 6 providers (AWS ECR, Azure ACR, Google Artifact Registry, Oracle Container Registry, DigitalOcean Container Registry, Alibaba Container Registry)
  - New Service Type filter distinguishing between Orchestration and Container Registry services
  - New Registry Pricing Component filter for Storage, Data Transfer, and API Operations
  - Created `src/services/containers_registry_pipeline.ts` with complete pricing data for all providers
  - Updated `src/services/ingest.ts` to run registry pricing pipeline with proper logging
  - Updated filter sidebar with registry-specific filters and categorization
  - Updated `/docs` page with registry documentation and data dictionary entries
  - Includes pricing components: Storage ($0.003–$0.10/GB/month), Data Transfer ($0.02–$0.50/GB), API Operations (provider-specific)

### Security
- **CRITICAL FIX:** Enabled TLS certificate validation across all database connections
  - Fixed `src/services/ingest.ts` — Added proper CA certificate validation with `DATABASE_CA_CERT` env var support
  - Fixed `src/services/populate_ai.ts` — Replaced `rejectUnauthorized: false` with proper validation
  - Fixed `src/services/populate_containers.ts` — Replaced `rejectUnauthorized: false` with proper validation
  - Fixed `src/workers/scheduler.ts` — Changed production fallback from insecure to enforced validation
  - All connections now use `rejectUnauthorized: true` in production (or with provided CA cert)
  - Prevents MITM attacks on database credentials and pricing data
  - See `SECURITY_STATUS_2026_07_19.md` for full audit details

### Fixed
- **Documentation:** Added missing GPU product category to `/docs` page
  - Added GPU to sidebar navigation
  - Added GPU to Product Categories section with detailed description
  - Added GPU to Data Dictionary (#7) with filter definitions (GPU Model, GPU Count, vCPU, Memory, OS)
  - Renumbered subsequent Data Dictionary entries (Storage→8, AI→9, App Hosting→10, Security→11, Integration→12)
  
- **Filters:** Corrected filter configurations based on live API testing
  - Removed dead HA_MODES options: Zone Redundant, Multi Region, Geo Redundant (kept Single AZ, Multi AZ)
  - Restored SERVERLESS_SERVICE_TYPES to include Container option (Azure Container Apps)
  - Added missing Security filter backend handling in `buildPricingFilters()`
  - Added missing Storage Media filter processing in `buildPricingFilters()`
  
- **Data & Analytics Engines:** Expanded with previously missing options
  - Added: BigQuery, Redshift, Synapse, Microsoft Fabric, ApsaraMQ for Kafka, Event Hubs, Kinesis Data Streams, OCI Streaming, Pub/Sub
  - Added Microsoft Fabric Capacity tiers: F2–F64
  - Removed dead "Native" option

- **Database Documentation:** Updated HA Mode definitions to reflect actual working filters
  - Changed from 4-option list to 2-option list (Single AZ, Multi AZ) in `/docs` page

### Audited
- **Filter Audit Completed:** All 12 product category pages tested against live API endpoints
  - Identified dead filters, missing backend support, and missing documentation
  - Verified working filters across: Compute, Database, Serverless, Containers, Data Analytics, Networking, Storage, AI, App Hosting, Security, Integration
  - Created `FILTER_CATALOG.md` documenting all working/removed/added filters with debugging guidance

- **Security Audit Completed:** Full codebase scan for critical vulnerabilities
  - Confirmed admin authentication uses `crypto.timingSafeEqual()` (constant-time comparison) ✅
  - Confirmed SQL injection protections via parameterized queries ✅
  - Confirmed input validation in filter processing ✅
  - Identified and fixed TLS validation vulnerabilities ✅
  - Documented remaining gaps (rate limiting, error message disclosure)
  - See `SECURITY_STATUS_2026_07_19.md` for full report

### Deployment
- **DigitalOcean Setup:** Confirmed DATABASE_URL and DATABASE_CA_CERT configured
  - DATABASE_URL set with `sslmode=verify-full` for client-side verification
  - DATABASE_CA_CERT environment variable already set in App Platform
  - Ready for redeployment with TLS fixes

---

## Previous Work (June 2026 – July 18, 2026)

### Features
- Renamed "GPU Compute" category to "GPU" for clarity
- Built collapsible left sidebar component for filter organization
- Built per-category provider price summary tables
- Added GPU product category support across all infrastructure

### Fixes & Improvements
- Removed Component Distribution section from workloads main page
- Updated README and public documentation to reflect actual working filters
- Verified all builds pass TypeScript compilation and syntax checks

### Documentation
- Created comprehensive FILTER_CATALOG.md documenting all category-specific filters
- Created SECURITY_STATUS_2026_07_19.md with detailed audit findings and action items
- Updated /docs page to reflect corrected HA Mode options

---

## Notes for Deployment

### Before Going Live
1. Ensure `DATABASE_CA_CERT` is set in DigitalOcean App Platform (already configured ✅)
2. Ensure `DATABASE_URL` includes `sslmode=verify-full` (already configured ✅)
3. Run full ingest pipeline to verify TLS fixes work end-to-end
4. Check Runtime Logs after deploy for any certificate validation errors
5. Verify no TLS-related error messages appear in logs

### Monitoring Post-Deploy
- Watch for "certificate verify failed" errors in logs
- Confirm all ingest operations complete without SSL/TLS errors
- Test each product category page loads data correctly
- Verify filters are working and displaying correct results

### Future Work
- Add rate limiting to admin endpoints (`express-rate-limit`)
- Audit error messages for information disclosure
- Implement security headers (CSP, X-Frame-Options, HSTS, etc.)
- Add request logging for all `/api/admin/*` endpoints
- Set up security monitoring and alerts for failed admin auth attempts

