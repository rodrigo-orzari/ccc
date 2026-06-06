# Graph Report - _ccc  (2026-06-06)

## Corpus Check
- 107 files · ~85,390 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 741 nodes · 1041 edges · 65 communities (45 shown, 20 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6f365d38`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Serverless Provider Configs|Serverless Provider Configs]]
- [[_COMMUNITY_Container Provider Configs|Container Provider Configs]]
- [[_COMMUNITY_Database Instance Configs|Database Instance Configs]]
- [[_COMMUNITY_Pricing Pipeline Architecture|Pricing Pipeline Architecture]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Cloud Instance Configs|Cloud Instance Configs]]
- [[_COMMUNITY_Dashboard UI & Filters|Dashboard UI & Filters]]
- [[_COMMUNITY_Container Live Adapters|Container Live Adapters]]
- [[_COMMUNITY_Static Content Pages|Static Content Pages]]
- [[_COMMUNITY_TypeScript Configuration|TypeScript Configuration]]
- [[_COMMUNITY_Platform Overview|Platform Overview]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Dev Dependencies|Dev Dependencies]]
- [[_COMMUNITY_App Metadata|App Metadata]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Dashboard State|Dashboard State]]
- [[_COMMUNITY_Claude Dev Config|Claude Dev Config]]
- [[_COMMUNITY_Claude Permissions|Claude Permissions]]
- [[_COMMUNITY_Test Results|Test Results]]
- [[_COMMUNITY_TLS Override Fix|TLS Override Fix]]
- [[_COMMUNITY_TLS Validation Fix|TLS Validation Fix]]
- [[_COMMUNITY_Tailwind CSS|Tailwind CSS]]
- [[_COMMUNITY_Error Disclosure Audit|Error Disclosure Audit]]
- [[_COMMUNITY_Missing CORS Audit|Missing CORS Audit]]
- [[_COMMUNITY_No Request Logging Audit|No Request Logging Audit]]
- [[_COMMUNITY_Vite Config|Vite Config]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]

## God Nodes (most connected - your core abstractions)
1. `BaseAdapter` - 55 edges
2. `PricingRecord` - 45 edges
3. `compilerOptions` - 20 edges
4. `Compare Cloud Costs: Project Analysis & Architecture Deep Dive` - 19 edges
5. `PricingPipeline` - 15 edges
6. `Compare Cloud Costs: Architecture Diagrams & Visual Guides` - 14 edges
7. `Compare Cloud Costs (CCC) — Claude Context` - 12 edges
8. `ServerlessPricingPipeline` - 11 edges
9. `BaseScraper` - 11 edges
10. `Welcome!` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Fix: requireAdminAuth Middleware` --references--> `POST /api/admin/init-db`  [INFERRED]
  SECURITY_FIXES.md → DATA_POPULATION_GUIDE.md
- `Fix: requireAdminAuth Middleware` --references--> `POST /api/admin/fetch-pricing`  [INFERRED]
  SECURITY_FIXES.md → DATA_POPULATION_GUIDE.md
- `GCPCloudRunLiveAdapter (Phase 2)` --references--> `gcp_serverless.ts config`  [INFERRED]
  SERVERLESS_IMPLEMENTATION_PLAN.md → IMPLEMENTATION_SUMMARY.md
- `AzureFunctionsLiveAdapter (Phase 3)` --references--> `azure_serverless.ts config`  [INFERRED]
  SERVERLESS_IMPLEMENTATION_PLAN.md → IMPLEMENTATION_SUMMARY.md
- `AWSLambdaLiveAdapter (Phase 1)` --references--> `AWSLambdaLiveAdapter`  [INFERRED]
  SERVERLESS_IMPLEMENTATION_PLAN.md → IMPLEMENTATION_SUMMARY.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Pricing Pipeline: Adapters feed into Normalization, Drift Check, and Batch Insert** — architecture_diagrams_pricing_pipeline, architecture_diagrams_normalization_layer, architecture_diagrams_price_drift_check, architecture_diagrams_batch_insert, architecture_diagrams_email_alerts [EXTRACTED 1.00]
- **Security Audit findings map to Security Fixes and Operations Runbook controls** — security_audit_tls_cert_validation_disabled, security_audit_exposed_admin_endpoints, security_audit_sql_injection_risk, security_fixes_enable_strict_tls, security_fixes_require_admin_auth, security_fixes_input_validation, operations_runbook_admin_api_auth, operations_runbook_filter_input_validation [EXTRACTED 1.00]
- **End-to-end serverless language filter: config files, pipeline, API, frontend** — implementation_summary_aws_serverless_config, implementation_summary_gcp_serverless_config, implementation_summary_azure_serverless_config, implementation_summary_digitalocean_serverless_config, implementation_summary_serverless_pipeline_ts, implementation_summary_server_ts, implementation_summary_dashboard_tsx, implementation_summary_supported_languages_jsonb [EXTRACTED 1.00]

## Communities (65 total, 20 thin omitted)

### Community 1 - "Container Provider Configs"
Cohesion: 0.50
Nodes (3): netContent, pricingContent, subclasses

### Community 2 - "Database Instance Configs"
Cohesion: 0.07
Nodes (23): ALIBABA_DB_INSTANCES, CloudSqlInstanceConfig, DIGITALOCEAN_DB_INSTANCES, DigitalOceanDbInstanceConfig, GCP_CLOUD_SQL_INSTANCES, ORACLE_AUTONOMOUS_INSTANCES, ORACLE_MYSQL_HEATWAVE_INSTANCES, ORACLE_POSTGRESQL_INSTANCES (+15 more)

### Community 3 - "Pricing Pipeline Architecture"
Cohesion: 0.12
Nodes (15): 10. Data Staleness Warning System, 11. Browser Local Storage Persistence, 12. Component Lifecycle & Re-render Triggers, 13. Deployment CI/CD Pipeline, 1. System Architecture Overview, 2. Data Ingestion Pipeline Flow, 3. Database Schema Relationships, 4. Frontend State Flow Diagram (+7 more)

### Community 4 - "Package Dependencies"
Cohesion: 0.24
Nodes (7): GET(), GET(), buildPricingFilters(), parseFilterList(), VALID_PRODUCT_TYPES, sql, GET()

### Community 5 - "Cloud Instance Configs"
Cohesion: 0.05
Nodes (36): CONTAINERS_ARCHITECTURES, CONTAINERS_BILLING_GRANULARITY, CONTAINERS_COMPUTE_TYPES, CONTAINERS_ORCHESTRATORS, useContainersFilters(), ANALYTICS_DEPLOYMENT_TYPES, ANALYTICS_ENGINES, ANALYTICS_TIERS (+28 more)

### Community 6 - "Dashboard UI & Filters"
Cohesion: 0.05
Nodes (36): ANALYTICS_DEPLOYMENT_TYPES, ANALYTICS_ENGINES, ANALYTICS_TIERS, CATEGORIES, CONTAINERS_ARCHITECTURES, CONTAINERS_BILLING_GRANULARITY, CONTAINERS_COMPUTE_TYPES, CONTAINERS_ORCHESTRATORS (+28 more)

### Community 7 - "Container Live Adapters"
Cohesion: 0.08
Nodes (25): 1. What Problem Does This Application Solve?, 2. Architectural Design, 3. File Directory & Code Organization, 4. Documentation Guide, 5. Security & Deployment, 6. Quick Start, 7. In-Depth Subsystem Walks, 8. Resources for Contributors (+17 more)

### Community 9 - "TypeScript Configuration"
Cohesion: 0.08
Nodes (23): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, experimentalDecorators, incremental, isolatedModules, jsx (+15 more)

### Community 10 - "Platform Overview"
Cohesion: 0.12
Nodes (17): AWSLambdaLiveAdapter, aws_serverless.ts config, azure_serverless.ts config, Dashboard.tsx, digitalocean_serverless.ts config, gcp_serverless.ts config, pricing_pipeline.ts, server.ts (+9 more)

### Community 12 - "Community 12"
Cohesion: 0.05
Nodes (38): dependencies, @aws-sdk/client-pricing, axios, dotenv, @google/genai, lucide-react, motion, next (+30 more)

### Community 13 - "Dev Dependencies"
Cohesion: 0.18
Nodes (5): AWSContainersLiveAdapter, AzureContainersLiveAdapter, DigitalOceanContainersLiveAdapter, GCPContainersLiveAdapter, OracleContainersLiveAdapter

### Community 14 - "App Metadata"
Cohesion: 0.40
Nodes (4): description, majorCapabilities, name, requestFramePermissions

### Community 16 - "Dashboard State"
Cohesion: 0.22
Nodes (8): 7.1 Background Worker Schedule, 7. Scheduled Jobs & Automation, 8.1 Mailer Service, 8. Email Notifications, Appendix: Glossary & Terminology, Compare Cloud Costs: Project Analysis & Architecture Deep Dive, Conclusion, Executive Summary

### Community 23 - "Tailwind CSS"
Cohesion: 0.40
Nodes (5): 1. Technology Stack, Backend, Database, Development & Tooling, Frontend

### Community 29 - "Community 29"
Cohesion: 0.15
Nodes (12): Adding a New Cloud Provider, API Routes, Architecture, Compare Cloud Costs (CCC) — Claude Context, Conventions, Database Schema, Documentation Map, Key Files — Start Here (+4 more)

### Community 31 - "Community 31"
Cohesion: 0.07
Nodes (18): ALIBABA_ANALYTICS_INSTANCES, AlibabaAnalyticsConfig, DATABRICKS_INSTANCES, DatabricksConfig, NATIVE_ANALYTICS_INSTANCES, NativeAnalyticsConfig, ORACLE_ANALYTICS_INSTANCES, OracleAnalyticsConfig (+10 more)

### Community 32 - "Community 32"
Cohesion: 0.05
Nodes (28): ALIBABA_INSTANCES, DIGITALOCEAN_INSTANCES, DigitalOceanInstanceConfig, GCP_INSTANCES, GcpInstanceConfig, ORACLE_INSTANCES, OracleInstanceConfig, POST() (+20 more)

### Community 33 - "Community 33"
Cohesion: 0.33
Nodes (5): autoInitStart, content, cronEnd, cronStart, lines

### Community 39 - "Community 39"
Cohesion: 0.05
Nodes (30): ALIBABA_SERVERLESS, AWS_LAMBDA_LANGUAGES, AWS_SERVERLESS, baseAwsEntries, AZURE_FUNCTIONS_LANGUAGES, AZURE_SERVERLESS, baseAzureEntries, baseDigitaloceanEntries (+22 more)

### Community 41 - "Community 41"
Cohesion: 0.19
Nodes (6): BaseScraper, DigitalOceanDropletsScraper, DigitalOceanInstanceConfig, GcpInstanceConfig, GcpInstancesScraper, scraper

### Community 42 - "Community 42"
Cohesion: 0.40
Nodes (5): 4.1 Pricing Pipeline Architecture, 4.2 Adapter Pattern (BaseAdapter), 4.3 Specific Adapter Implementations, 4.4 DatabasePricingPipeline & ServerlessPricingPipeline, 4. Data Ingestion Pipeline

### Community 43 - "Community 43"
Cohesion: 0.50
Nodes (4): 13. Deployment Checklist, Deployment Steps, Post-Deployment Verification, Pre-Deployment

### Community 44 - "Community 44"
Cohesion: 0.06
Nodes (46): ChartsViewProps, FilterSectionProps, FilterSidebarProps, PricingTableProps, PROVIDERS, PRODUCT_TYPES, ProductTypeSelectorProps, RangeSlider() (+38 more)

### Community 45 - "Community 45"
Cohesion: 0.50
Nodes (4): 15. Team Collaboration & Code Ownership, Code Organization by Domain, Code Review Standards, Documentation

### Community 47 - "Community 47"
Cohesion: 0.18
Nodes (11): Database Initialization Guide, POST /api/admin/fetch-pricing, ingest.ts CLI, POST /api/admin/init-db, Admin API Authentication, Constant-Time Token Comparison, Deployment Checklist, Database TLS/SSL Connection Setup (+3 more)

### Community 48 - "Community 48"
Cohesion: 0.13
Nodes (7): ALIBABA_CONTAINERS, AWS_CONTAINERS, baseAwsContainerEntries, AwsFargateScraper, AzureContainerInstancesScraper, AWSContainersStaticAdapter, DigitalOceanContainersStaticAdapter

### Community 49 - "Community 49"
Cohesion: 0.20
Nodes (4): AzureContainersStaticAdapter, AWSAdapter, AzureAdapter, BaseAdapter

### Community 50 - "Community 50"
Cohesion: 0.67
Nodes (3): Filter Input Validation, SQL Injection Risk via Filter Parameters, Fix: Input Validation for Filter Parameters (parseFilterList)

### Community 51 - "Community 51"
Cohesion: 0.40
Nodes (3): DBStatusProvider, ProviderCardProps, ProviderCardsProps

### Community 60 - "Community 60"
Cohesion: 0.50
Nodes (4): 5.1 Public Routes, 5.2 Admin Routes (Behind the Scenes), 5.3 Next.js API Routes (Dev vs. Prod), 5. Backend API Routes

### Community 61 - "Community 61"
Cohesion: 0.50
Nodes (4): 9.1 Database Security, 9.2 API Security, 9.3 Data Privacy, 9. Security & Data Privacy

### Community 62 - "Community 62"
Cohesion: 0.67
Nodes (3): 10.1 Local Development, 10.2 Build Pipeline, 10. Development & Build Workflow

### Community 63 - "Community 63"
Cohesion: 0.67
Nodes (3): 11.1 Environment Variables, 11.2 Feature Flags (Implicit), 11. Configuration Management

### Community 64 - "Community 64"
Cohesion: 0.67
Nodes (3): 12. Known Limitations & Future Enhancements, Current Limitations, Recommended Enhancements

### Community 65 - "Community 65"
Cohesion: 0.67
Nodes (3): 14. Performance Metrics & Optimization Opportunities, Current Performance Characteristics, Optimization Opportunities

### Community 66 - "Community 66"
Cohesion: 0.67
Nodes (3): 2.1 Monorepo Structure, 2.2 Deployment Architecture, 2. Project Architecture

### Community 67 - "Community 67"
Cohesion: 0.67
Nodes (3): 3.1 Core Tables, 3.2 Key Schema Features, 3. Data Model & Database Schema

### Community 68 - "Community 68"
Cohesion: 0.67
Nodes (3): 6.1 Component Hierarchy, 6.2 Dashboard Deep Dive, 6. Frontend Architecture

## Knowledge Gaps
- **297 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+292 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `BaseAdapter` connect `Community 49` to `Community 32`, `Database Instance Configs`, `Community 39`, `Dev Dependencies`, `Community 15`, `Community 48`, `Vite Config`, `Community 31`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `PricingRecord` connect `Community 39` to `Community 32`, `Database Instance Configs`, `Dev Dependencies`, `Community 15`, `Community 48`, `Community 49`, `Vite Config`, `Community 31`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `PricingPipeline` connect `Community 32` to `Community 48`, `Database Instance Configs`, `Community 39`, `Community 31`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _297 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Database Instance Configs` be split into smaller, more focused modules?**
  _Cohesion score 0.07394957983193277 - nodes in this community are weakly interconnected._
- **Should `Pricing Pipeline Architecture` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `Cloud Instance Configs` be split into smaller, more focused modules?**
  _Cohesion score 0.052854122621564484 - nodes in this community are weakly interconnected._