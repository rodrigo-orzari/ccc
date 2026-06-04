# Graph Report - _ccc  (2026-06-04)

## Corpus Check
- 60 files · ~73,937 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 469 nodes · 642 edges · 31 communities (21 shown, 10 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7d376401`
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
- [[_COMMUNITY_Serverless Implementation|Serverless Implementation]]
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
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]

## God Nodes (most connected - your core abstractions)
1. `BaseAdapter` - 46 edges
2. `PricingRecord` - 37 edges
3. `compilerOptions` - 15 edges
4. `PricingPipeline` - 13 edges
5. `Compare Cloud Costs` - 12 edges
6. `Compare Cloud Costs (CCC) — Claude Context` - 12 edges
7. `ServerlessPricingPipeline` - 12 edges
8. `Serverless Language Filter` - 9 edges
9. `scripts` - 8 edges
10. `ContainersPricingPipeline` - 8 edges

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

## Communities (31 total, 10 thin omitted)

### Community 0 - "Serverless Provider Configs"
Cohesion: 0.05
Nodes (25): AWS_LAMBDA_LANGUAGES, AWS_SERVERLESS, baseAwsEntries, AZURE_FUNCTIONS_LANGUAGES, AZURE_SERVERLESS, baseAzureEntries, baseDigitaloceanEntries, DIGITALOCEAN_FUNCTIONS_LANGUAGES (+17 more)

### Community 1 - "Container Provider Configs"
Cohesion: 0.06
Nodes (25): AWS_CONTAINERS, baseAwsContainerEntries, AZURE_CONTAINERS, baseAzureContainerEntries, baseDigitaloceanContainerEntries, DIGITALOCEAN_CONTAINERS, baseGcpContainerEntries, GCP_CONTAINERS (+17 more)

### Community 2 - "Database Instance Configs"
Cohesion: 0.08
Nodes (21): CloudSqlInstanceConfig, DIGITALOCEAN_DB_INSTANCES, DigitalOceanDbInstanceConfig, GCP_CLOUD_SQL_INSTANCES, ORACLE_AUTONOMOUS_INSTANCES, ORACLE_MYSQL_HEATWAVE_INSTANCES, ORACLE_POSTGRESQL_INSTANCES, OracleAutonomousConfig (+13 more)

### Community 3 - "Pricing Pipeline Architecture"
Cohesion: 0.07
Nodes (32): AWSAdapter, AzureAdapter, Batch Insert, Cron Job (Sunday Midnight), Data Staleness Warning System, DigitalOceanAdapter, DigitalOcean App Platform, Email Alerts (+24 more)

### Community 4 - "Package Dependencies"
Cohesion: 0.09
Nodes (23): dependencies, @aws-sdk/client-pricing, axios, cors, dotenv, express, express-rate-limit, @google/genai (+15 more)

### Community 5 - "Cloud Instance Configs"
Cohesion: 0.13
Nodes (6): AWSAdapter, AzureAdapter, BaseAdapter, DigitalOceanAdapter, GCPAdapter, OracleAdapter

### Community 6 - "Dashboard UI & Filters"
Cohesion: 0.06
Nodes (30): ANALYTICS_DEPLOYMENT_TYPES, ANALYTICS_ENGINES, ANALYTICS_TIERS, CATEGORIES, CONTAINERS_ARCHITECTURES, CONTAINERS_BILLING_GRANULARITY, CONTAINERS_COMPUTE_TYPES, CONTAINERS_ORCHESTRATORS (+22 more)

### Community 7 - "Container Live Adapters"
Cohesion: 0.07
Nodes (26): Compare Cloud Costs Platform, 1. What Problem Does This Application Solve?, 2. Architectural Design, 3. File Directory & Code Organization, 4. Documentation Guide, 5. Security & Deployment, 6. Quick Start, 7. In-Depth Subsystem Walks (+18 more)

### Community 9 - "TypeScript Configuration"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 10 - "Platform Overview"
Cohesion: 0.17
Nodes (13): index.html Entry Point, React Root Mount Point (#root), Compare Cloud Costs Application, Express.js 4.21.2 Backend, FinOps Cloud Price Comparison Challenge, mailer.ts Email Service, node-cron 4.2.1 Scheduler, nodemailer 8.0.7 Email Service (+5 more)

### Community 11 - "Serverless Implementation"
Cohesion: 0.10
Nodes (21): buildPricingFilters, AWSLambdaLiveAdapter, aws_serverless.ts config, azure_serverless.ts config, Dashboard.tsx, digitalocean_serverless.ts config, gcp_serverless.ts config, pricing_pipeline.ts (+13 more)

### Community 13 - "Dev Dependencies"
Cohesion: 0.09
Nodes (22): devDependencies, autoprefixer, @playwright/test, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+14 more)

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

### Community 30 - "Community 30"
Cohesion: 0.09
Nodes (19): DIGITALOCEAN_INSTANCES, DigitalOceanInstanceConfig, GCP_INSTANCES, GcpInstanceConfig, ORACLE_INSTANCES, OracleInstanceConfig, pool, startServer() (+11 more)

### Community 31 - "Community 31"
Cohesion: 0.14
Nodes (8): DATABRICKS_INSTANCES, DatabricksConfig, SNOWFLAKE_INSTANCES, SnowflakeConfig, DataAnalyticsPricingPipeline, DatabricksAzureAdapter, DatabricksStaticAdapter, SnowflakeStaticAdapter

## Knowledge Gaps
- **188 isolated node(s):** `pool`, `DatabricksConfig`, `SnowflakeConfig`, `STATIC_NETWORKING_PRICING`, `Live Deployment` (+183 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `BaseAdapter` connect `Cloud Instance Configs` to `Serverless Provider Configs`, `Container Provider Configs`, `Database Instance Configs`, `Community 30`, `Community 31`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `PricingRecord` connect `Container Provider Configs` to `Serverless Provider Configs`, `Database Instance Configs`, `Community 30`, `Community 31`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `Price Drift Check` connect `Pricing Pipeline Architecture` to `Platform Overview`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `pool`, `DatabricksConfig`, `SnowflakeConfig` to the rest of the system?**
  _189 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Serverless Provider Configs` be split into smaller, more focused modules?**
  _Cohesion score 0.05314009661835749 - nodes in this community are weakly interconnected._
- **Should `Container Provider Configs` be split into smaller, more focused modules?**
  _Cohesion score 0.05593220338983051 - nodes in this community are weakly interconnected._
- **Should `Database Instance Configs` be split into smaller, more focused modules?**
  _Cohesion score 0.08172043010752689 - nodes in this community are weakly interconnected._