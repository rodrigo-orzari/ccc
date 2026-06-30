# Graph Report - _ccc  (2026-06-30)

## Corpus Check
- 173 files · ~159,737 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 759 nodes · 1080 edges · 80 communities (43 shown, 37 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dbf30537`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Serverless Provider Configs|Serverless Provider Configs]]
- [[_COMMUNITY_Container Provider Configs|Container Provider Configs]]
- [[_COMMUNITY_Database Instance Configs|Database Instance Configs]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 93|Community 93]]

## God Nodes (most connected - your core abstractions)
1. `BaseAdapter` - 39 edges
2. `PricingRecord` - 25 edges
3. `PricingPipeline` - 15 edges
4. `Compare Cloud Costs` - 15 edges
5. `Serverless Language Filter Implementation Summary` - 13 edges
6. `ServerlessPricingPipeline` - 11 edges
7. `CCC Operations Runbook` - 11 edges
8. `buildPricingFilters()` - 10 edges
9. `ProductType` - 9 edges
10. `DatabasePricingPipeline` - 8 edges

## Surprising Connections (you probably didn't know these)
- `run()` --calls--> `buildPricingFilters()`  [EXTRACTED]
  test_api.mjs → src/lib/api-utils.ts
- `run()` --calls--> `buildPricingFilters()`  [EXTRACTED]
  test_filters.mjs → src/lib/api-utils.ts
- `runDataQualityChecks()` --calls--> `sql`  [INFERRED]
  src/services/data_quality.ts → src/workers/scheduler.ts
- `DatabricksStaticAdapter` --inherits--> `BaseAdapter`  [EXTRACTED]
  src/services/data_analytics_pipeline.ts → src/services/pricing_pipeline.ts
- `SnowflakeStaticAdapter` --inherits--> `BaseAdapter`  [EXTRACTED]
  src/services/data_analytics_pipeline.ts → src/services/pricing_pipeline.ts

## Import Cycles
- None detected.

## Communities (80 total, 37 thin omitted)

### Community 6 - "Community 6"
Cohesion: 0.10
Nodes (13): ALIBABA_STORAGE, AWS_STORAGE, AZURE_STORAGE, DIGITALOCEAN_STORAGE, GCP_STORAGE, ORACLE_STORAGE, AwsStorageScraper, AzureStorageScraper (+5 more)

### Community 7 - "Community 7"
Cohesion: 0.06
Nodes (67): Dashboard(), ENGINE_CATEGORIES, FilterSectionProps, FilterSidebar(), FilterSidebarProps, GroupedFilterSectionProps, groupEngines(), AI_CONTEXT_WINDOWS (+59 more)

### Community 8 - "Community 8"
Cohesion: 0.09
Nodes (16): AI_MODELS, AIModelConfig, DB_FAMILY_MAPPINGS, POST(), buildPricingFilters(), initDb(), parseFilterList(), requireAdminAuth() (+8 more)

### Community 9 - "Community 9"
Cohesion: 0.10
Nodes (18): VECTOR_DATABASES, ALIBABA_REDIS_INSTANCES, AWS_DOCUMENTDB_INSTANCES, AWS_DYNAMODB_INSTANCES, AWS_ELASTICACHE_INSTANCES, AWSDynamoDBAdapter, AWSRDSAdapter, AZURE_DB_SERVICES (+10 more)

### Community 10 - "Community 10"
Cohesion: 0.06
Nodes (35): 1. Frontend State Management ✅, 1. In-Table Micro-Visualizations ✅, 2. Analytical Charts View ✅, 2. Query Parameter Building ✅, 3. Backend Query Processing ✅, 3. Networking Filters Data Integration Fix ("Super Debug") ✅, 4. Data Persistence ✅, Configuration & Adapters (+27 more)

### Community 11 - "Community 11"
Cohesion: 0.20
Nodes (6): ChartsViewProps, PricingTableProps, PRODUCT_TYPES, ProductTypeSelectorProps, PricingRecord, ProductType

### Community 12 - "Community 12"
Cohesion: 0.10
Nodes (21): 1. Clone & install, 2. Configure environment, 3. Initialize the database, 4. Populate pricing data, 5. Open the app, Adding a New Cloud Provider, Admin API Endpoints, Compare Cloud Costs (+13 more)

### Community 13 - "Community 13"
Cohesion: 0.05
Nodes (14): metadata, DigitalOceanReferralModal(), DonationModal(), DonationModalProps, MarkdownPageProps, DBStatusProvider, ProviderCardProps, ProviderCardsProps (+6 more)

### Community 15 - "Community 15"
Cohesion: 0.06
Nodes (34): ALL_DEFS, COL_ARCH, COL_EXEC, COL_GEO, COL_GPU, COL_GRAN, COL_INV, COL_LANG (+26 more)

### Community 16 - "Community 16"
Cohesion: 0.24
Nodes (3): DigitalOceanAdapter, fetchWithRetry(), GCPAdapter

### Community 25 - "Community 25"
Cohesion: 0.50
Nodes (4): config, getRateLimitStatus(), middleware(), rateLimitStore

### Community 26 - "Community 26"
Cohesion: 0.32
Nodes (3): AlibabaServerlessAdapter, AWSServerlessLiveAdapter, ServerlessPricingPipeline

### Community 28 - "Community 28"
Cohesion: 0.33
Nodes (3): ALIBABA_FC_LANGUAGES, ALIBABA_SERVERLESS, baseAlibabaEntries

### Community 38 - "Community 38"
Cohesion: 0.09
Nodes (24): ALIBABA_APP_HOSTING_REGIONS, ALIBABA_BASE, ALIBABA_REGIONS, AppHostingRegion, AWS_APP_HOSTING_REGIONS, AWS_BASE, AWS_REGIONS, AZURE_APP_HOSTING_REGIONS (+16 more)

### Community 47 - "Community 47"
Cohesion: 0.19
Nodes (10): ALIBABA_INTEGRATION, AWS_INTEGRATION, AZURE_INTEGRATION, CATEGORY_TO_SERVICE_TYPE, DIGITALOCEAN_INTEGRATION, GCP_INTEGRATION, ORACLE_INTEGRATION, RawIntegrationEntry (+2 more)

### Community 49 - "Community 49"
Cohesion: 0.40
Nodes (3): AWS_LAMBDA_LANGUAGES, AWS_SERVERLESS, baseAwsEntries

### Community 50 - "Community 50"
Cohesion: 0.40
Nodes (3): AZURE_FUNCTIONS_LANGUAGES, AZURE_SERVERLESS, baseAzureEntries

### Community 51 - "Community 51"
Cohesion: 0.40
Nodes (3): baseDigitaloceanEntries, DIGITALOCEAN_FUNCTIONS_LANGUAGES, DIGITALOCEAN_SERVERLESS

### Community 52 - "Community 52"
Cohesion: 0.40
Nodes (3): baseGcpEntries, GCP_CLOUD_RUN_LANGUAGES, GCP_SERVERLESS

### Community 53 - "Community 53"
Cohesion: 0.40
Nodes (3): baseOracleEntries, ORACLE_LAMBDA_LANGUAGES, ORACLE_SERVERLESS

### Community 55 - "Community 55"
Cohesion: 0.10
Nodes (10): AlibabaDBAdapter, AWSElastiCacheAdapter, DigitalOceanDBAdapter, GCPCloudSQLAdapter, GCPMemorystoreAdapter, OracleAutonomousAdapter, OracleMySQLHeatWaveAdapter, OraclePostgreSQLAdapter (+2 more)

### Community 56 - "Community 56"
Cohesion: 0.23
Nodes (3): AWSAdapter, AzureAdapter, BaseAdapter

### Community 58 - "Community 58"
Cohesion: 0.19
Nodes (8): PROVIDER_IDS, providerColor(), providerName(), ProviderTh(), REGION_OPTIONS, WorkloadComponent, WorkloadDefinition, WorkloadParameter

### Community 62 - "Community 62"
Cohesion: 0.06
Nodes (29): GET(), pipeline, sql, AppHostingPricingPipeline, DataAnalyticsPricingPipeline, dbCat(), DQIssue, DQReport (+21 more)

### Community 63 - "Community 63"
Cohesion: 0.25
Nodes (4): CATEGORY_EMOJIS, CATEGORY_TO_PRODUCT, PROVIDER_COLORS, PROVIDERS

### Community 65 - "Community 65"
Cohesion: 0.32
Nodes (3): WORKLOADS, PRODUCT_TYPE_LABELS, PRODUCT_TYPE_ORDER

### Community 66 - "Community 66"
Cohesion: 0.06
Nodes (32): Admin API Reference, Admin endpoints return 401, All prices show ● grey arrows after ingest, Before going to production, CCC Operations Runbook, Common Issues, Database connection hangs, Database Schema Migrations (+24 more)

### Community 67 - "Community 67"
Cohesion: 0.09
Nodes (16): DatacenterRegion, GEOGRAPHIES, Geography, PROVIDER_INFRA, ProviderInfrastructure, RegionStatus, GEO_COLORS, GLOSSARY (+8 more)

### Community 69 - "Community 69"
Cohesion: 0.10
Nodes (14): ALIBABA_ANALYTICS_INSTANCES, AlibabaAnalyticsConfig, DIGITALOCEAN_ANALYTICS_INSTANCES, DigitalOceanAnalyticsConfig, NATIVE_ANALYTICS_INSTANCES, NativeAnalyticsConfig, ORACLE_ANALYTICS_INSTANCES, OracleAnalyticsConfig (+6 more)

### Community 93 - "Community 93"
Cohesion: 0.25
Nodes (6): heroTrendData, radarData, scatterDataAWS, scatterDataAzure, scatterDataGCP, serverlessData

## Knowledge Gaps
- **240 isolated node(s):** `GEO_BY_CODE`, `DOT_COLORS`, `CONTINENTS`, `REGION_COORDS`, `Tooltip` (+235 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `PROVIDERS` connect `Community 7` to `Community 58`, `Community 11`, `Community 62`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `BaseAdapter` connect `Community 56` to `Community 69`, `Community 9`, `Community 75`, `Community 76`, `Community 47`, `Community 48`, `Community 16`, `Community 23`, `Community 55`, `Community 62`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `PricingRecord` connect `Community 55` to `Community 69`, `Community 38`, `Community 9`, `Community 75`, `Community 76`, `Community 47`, `Community 48`, `Community 23`, `Community 62`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **What connects `GEO_BY_CODE`, `DOT_COLORS`, `CONTINENTS` to the rest of the system?**
  _240 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 6` be split into smaller, more focused modules?**
  _Cohesion score 0.0960591133004926 - nodes in this community are weakly interconnected._
- **Should `Community 7` be split into smaller, more focused modules?**
  _Cohesion score 0.06018018018018018 - nodes in this community are weakly interconnected._
- **Should `Community 8` be split into smaller, more focused modules?**
  _Cohesion score 0.0907258064516129 - nodes in this community are weakly interconnected._