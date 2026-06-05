# Graph Report - _ccc  (2026-06-04)

## Corpus Check
- 83 files · ~82,114 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 612 nodes · 828 edges · 49 communities (27 shown, 22 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `76aca011`
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
- [[_COMMUNITY_Database Schema|Database Schema]]
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
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 55|Community 55]]

## God Nodes (most connected - your core abstractions)
1. `BaseAdapter` - 55 edges
2. `PricingRecord` - 45 edges
3. `compilerOptions` - 20 edges
4. `PricingPipeline` - 15 edges
5. `Compare Cloud Costs` - 12 edges
6. `Compare Cloud Costs (CCC) — Claude Context` - 12 edges
7. `ServerlessPricingPipeline` - 11 edges
8. `BaseScraper` - 11 edges
9. `Serverless Language Filter` - 9 edges
10. `buildPricingFilters()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `sendPriceDriftEmail` --semantically_similar_to--> `Price Drift Check`  [INFERRED] [semantically similar]
  PROJECT_ANALYSIS.md → ARCHITECTURE_DIAGRAMS.md
- `Data Staleness Warning System` --semantically_similar_to--> `supportedLanguages JSONB attribute`  [INFERRED] [semantically similar]
  ARCHITECTURE_DIAGRAMS.md → IMPLEMENTATION_SUMMARY.md
- `Normalization Layer` --semantically_similar_to--> `Adapter Pattern for Cloud Providers`  [INFERRED] [semantically similar]
  ARCHITECTURE_DIAGRAMS.md → PROJECT_ANALYSIS.md
- `POST /api/admin/fetch-pricing` --references--> `Pricing Pipeline`  [INFERRED]
  DATA_POPULATION_GUIDE.md → ARCHITECTURE_DIAGRAMS.md
- `Database TLS/SSL Connection Setup` --references--> `PostgreSQL Database`  [INFERRED]
  OPERATIONS_RUNBOOK.md → ARCHITECTURE_DIAGRAMS.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Pricing Pipeline: Adapters feed into Normalization, Drift Check, and Batch Insert** — architecture_diagrams_pricing_pipeline, architecture_diagrams_normalization_layer, architecture_diagrams_price_drift_check, architecture_diagrams_batch_insert, architecture_diagrams_email_alerts [EXTRACTED 1.00]
- **Security Audit findings map to Security Fixes and Operations Runbook controls** — security_audit_tls_cert_validation_disabled, security_audit_exposed_admin_endpoints, security_audit_sql_injection_risk, security_fixes_enable_strict_tls, security_fixes_require_admin_auth, security_fixes_input_validation, operations_runbook_admin_api_auth, operations_runbook_filter_input_validation [EXTRACTED 1.00]
- **End-to-end serverless language filter: config files, pipeline, API, frontend** — implementation_summary_aws_serverless_config, implementation_summary_gcp_serverless_config, implementation_summary_azure_serverless_config, implementation_summary_digitalocean_serverless_config, implementation_summary_serverless_pipeline_ts, implementation_summary_server_ts, implementation_summary_dashboard_tsx, implementation_summary_supported_languages_jsonb [EXTRACTED 1.00]

## Communities (49 total, 22 thin omitted)

### Community 1 - "Container Provider Configs"
Cohesion: 0.50
Nodes (3): netContent, pricingContent, subclasses

### Community 2 - "Database Instance Configs"
Cohesion: 0.07
Nodes (23): ALIBABA_DB_INSTANCES, CloudSqlInstanceConfig, DIGITALOCEAN_DB_INSTANCES, DigitalOceanDbInstanceConfig, GCP_CLOUD_SQL_INSTANCES, ORACLE_AUTONOMOUS_INSTANCES, ORACLE_MYSQL_HEATWAVE_INSTANCES, ORACLE_POSTGRESQL_INSTANCES (+15 more)

### Community 3 - "Pricing Pipeline Architecture"
Cohesion: 0.06
Nodes (37): AWSAdapter, AzureAdapter, Batch Insert, buildPricingFilters, Cron Job (Sunday Midnight), Data Staleness Warning System, DigitalOceanAdapter, DigitalOcean App Platform (+29 more)

### Community 4 - "Package Dependencies"
Cohesion: 0.23
Nodes (7): GET(), GET(), buildPricingFilters(), parseFilterList(), VALID_PRODUCT_TYPES, sql, GET()

### Community 5 - "Cloud Instance Configs"
Cohesion: 0.22
Nodes (3): AWSAdapter, AzureAdapter, BaseAdapter

### Community 6 - "Dashboard UI & Filters"
Cohesion: 0.05
Nodes (36): ANALYTICS_DEPLOYMENT_TYPES, ANALYTICS_ENGINES, ANALYTICS_TIERS, CATEGORIES, CONTAINERS_ARCHITECTURES, CONTAINERS_BILLING_GRANULARITY, CONTAINERS_COMPUTE_TYPES, CONTAINERS_ORCHESTRATORS (+28 more)

### Community 7 - "Container Live Adapters"
Cohesion: 0.05
Nodes (37): Compare Cloud Costs Platform, Compare Cloud Costs Application, Express.js 4.21.2 Backend, FinOps Cloud Price Comparison Challenge, mailer.ts Email Service, node-cron 4.2.1 Scheduler, nodemailer 8.0.7 Email Service, PostgreSQL Database (+29 more)

### Community 9 - "TypeScript Configuration"
Cohesion: 0.08
Nodes (23): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, experimentalDecorators, incremental, isolatedModules, jsx (+15 more)

### Community 10 - "Platform Overview"
Cohesion: 0.13
Nodes (16): AWSLambdaLiveAdapter, aws_serverless.ts config, azure_serverless.ts config, Dashboard.tsx, digitalocean_serverless.ts config, gcp_serverless.ts config, pricing_pipeline.ts, serverless_adapters_live.ts (+8 more)

### Community 12 - "Community 12"
Cohesion: 0.05
Nodes (36): dependencies, @aws-sdk/client-pricing, axios, dotenv, @google/genai, lucide-react, motion, next (+28 more)

### Community 13 - "Dev Dependencies"
Cohesion: 0.33
Nodes (7): createTransport(), isMailerConfigured(), PriceDriftAlert, sendPriceDriftEmail(), sendStalenessEmail(), StaleDataAlert, sql

### Community 14 - "App Metadata"
Cohesion: 0.40
Nodes (4): description, majorCapabilities, name, requestFramePermissions

### Community 15 - "Database Schema"
Cohesion: 0.67
Nodes (4): pricing_records table, providers table, regions table, services table

### Community 16 - "Dashboard State"
Cohesion: 0.67
Nodes (3): Column Resizing State Machine, Dashboard Component State Machine, Browser LocalStorage Persistence

### Community 29 - "Community 29"
Cohesion: 0.15
Nodes (12): Adding a New Cloud Provider, API Routes, Architecture, Compare Cloud Costs (CCC) — Claude Context, Conventions, Database Schema, Documentation Map, Key Files — Start Here (+4 more)

### Community 31 - "Community 31"
Cohesion: 0.10
Nodes (12): DATABRICKS_INSTANCES, DatabricksConfig, NATIVE_ANALYTICS_INSTANCES, NativeAnalyticsConfig, SNOWFLAKE_INSTANCES, SnowflakeConfig, DataAnalyticsPricingPipeline, DatabricksAzureAdapter (+4 more)

### Community 32 - "Community 32"
Cohesion: 0.07
Nodes (21): ALIBABA_INSTANCES, DIGITALOCEAN_INSTANCES, DigitalOceanInstanceConfig, GCP_INSTANCES, GcpInstanceConfig, ORACLE_INSTANCES, OracleInstanceConfig, POST() (+13 more)

### Community 33 - "Community 33"
Cohesion: 0.33
Nodes (5): autoInitStart, content, cronEnd, cronStart, lines

### Community 37 - "Community 37"
Cohesion: 0.18
Nodes (5): AWSContainersLiveAdapter, AzureContainersLiveAdapter, DigitalOceanContainersLiveAdapter, GCPContainersLiveAdapter, OracleContainersLiveAdapter

### Community 41 - "Community 41"
Cohesion: 0.19
Nodes (6): BaseScraper, DigitalOceanDropletsScraper, DigitalOceanInstanceConfig, GcpInstanceConfig, GcpInstancesScraper, scraper

### Community 44 - "Community 44"
Cohesion: 0.05
Nodes (36): ANALYTICS_DEPLOYMENT_TYPES, ANALYTICS_ENGINES, ANALYTICS_TIERS, CATEGORIES, CONTAINERS_ARCHITECTURES, CONTAINERS_BILLING_GRANULARITY, CONTAINERS_COMPUTE_TYPES, CONTAINERS_ORCHESTRATORS (+28 more)

### Community 48 - "Community 48"
Cohesion: 0.13
Nodes (7): ALIBABA_CONTAINERS, AWS_CONTAINERS, baseAwsContainerEntries, AwsFargateScraper, AzureContainerInstancesScraper, AWSContainersStaticAdapter, AzureContainersStaticAdapter

### Community 49 - "Community 49"
Cohesion: 0.05
Nodes (30): ALIBABA_SERVERLESS, AWS_LAMBDA_LANGUAGES, AWS_SERVERLESS, baseAwsEntries, AZURE_FUNCTIONS_LANGUAGES, AZURE_SERVERLESS, baseAzureEntries, baseDigitaloceanEntries (+22 more)

## Knowledge Gaps
- **249 isolated node(s):** `PricingRecord`, `ProductType`, `PROVIDERS`, `GEOGRAPHIES`, `OS_TYPES` (+244 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `BaseAdapter` connect `Cloud Instance Configs` to `Community 32`, `Database Instance Configs`, `Community 35`, `Community 37`, `Community 39`, `Community 48`, `Community 49`, `Vite Config`, `Community 31`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `PricingRecord` connect `Community 49` to `Community 32`, `Database Instance Configs`, `Community 35`, `Community 37`, `Community 39`, `Community 48`, `Vite Config`, `Community 31`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `PricingPipeline` connect `Community 32` to `Database Instance Configs`, `Dev Dependencies`, `Community 48`, `Community 49`, `Community 31`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `PricingRecord`, `ProductType`, `PROVIDERS` to the rest of the system?**
  _250 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Database Instance Configs` be split into smaller, more focused modules?**
  _Cohesion score 0.07394957983193277 - nodes in this community are weakly interconnected._
- **Should `Pricing Pipeline Architecture` be split into smaller, more focused modules?**
  _Cohesion score 0.06306306306306306 - nodes in this community are weakly interconnected._
- **Should `Dashboard UI & Filters` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._