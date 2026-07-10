# Graph Report - _ccc  (2026-07-09)

## Corpus Check
- 151 files · ~178,886 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 869 nodes · 1380 edges · 82 communities (51 shown, 31 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e41fb5a9`
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
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
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
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 93|Community 93]]

## God Nodes (most connected - your core abstractions)
1. `BaseAdapter` - 60 edges
2. `PricingRecord` - 57 edges
3. `PricingPipeline` - 19 edges
4. `Compare Cloud Costs` - 17 edges
5. `ServerlessPricingPipeline` - 13 edges
6. `sleep()` - 13 edges
7. `Serverless Language Filter Implementation Summary` - 13 edges
8. `Compare Cloud Costs (CCC) — Claude Context` - 12 edges
9. `fetchWithRetry()` - 12 edges
10. `CCC Operations Runbook` - 11 edges

## Surprising Connections (you probably didn't know these)
- `runDataQualityChecks()` --calls--> `sql`  [INFERRED]
  src/services/data_quality.ts → src/workers/scheduler.ts
- `Dashboard()` --calls--> `useDynamicFilters()`  [EXTRACTED]
  src/app/page.tsx → src/hooks/useDynamicFilters.ts
- `FilterSidebarProps` --references--> `ProductType`  [EXTRACTED]
  src/components/FilterSidebar.tsx → src/types/index.ts
- `ProductTypeSelectorProps` --references--> `ProductType`  [EXTRACTED]
  src/components/ProductTypeSelector.tsx → src/types/index.ts
- `AWSServerlessAdapter` --inherits--> `BaseAdapter`  [EXTRACTED]
  src/services/serverless_pipeline.ts → src/services/pricing_pipeline.ts

## Import Cycles
- None detected.

## Communities (82 total, 31 thin omitted)

### Community 0 - "Serverless Provider Configs"
Cohesion: 0.05
Nodes (38): dependencies, @aws-sdk/client-pricing, axios, dotenv, @google/genai, lucide-react, motion, next (+30 more)

### Community 1 - "Container Provider Configs"
Cohesion: 0.15
Nodes (12): Adding a New Cloud Provider, API Routes, Architecture, Compare Cloud Costs (CCC) — Claude Context, Conventions, Database Schema, Documentation Map, Key Files — Start Here (+4 more)

### Community 2 - "Database Instance Configs"
Cohesion: 0.25
Nodes (7): GCPContainersLiveAdapter, AzureFunctionsLiveAdapter, fetchAllSkus(), fetchGcpCloudRunRates(), findCloudRunServiceName(), findRatePerUnit(), GCPCloudRunLiveAdapter

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (11): ALIBABA_STORAGE, AWS_STORAGE, AZURE_STORAGE, DIGITALOCEAN_STORAGE, GCP_STORAGE, ORACLE_STORAGE, AwsStorageScraper, AzureStorageScraper (+3 more)

### Community 7 - "Community 7"
Cohesion: 0.07
Nodes (25): ANALYTICS_DEPLOYMENT_TYPES, APP_HOSTING_COMPUTE_TYPES, APP_HOSTING_TIERS, DEFAULT_CONTAINERS_MEMORY_RANGE, DEFAULT_CONTAINERS_VCPU_RANGE, DEFAULT_SERVERLESS_MEMORY_RANGE, DEFAULT_SERVERLESS_VCPU_RANGE, INTEGRATION_PROTOCOLS (+17 more)

### Community 8 - "Community 8"
Cohesion: 0.08
Nodes (19): ENGINE_CATEGORIES, FilterSectionProps, GroupedFilterSectionProps, PRODUCT_TYPE_DESCRIPTIONS, AI_MULTIMODAL_OPTIONS, ANALYTICS_TIERS, DB_FAMILIES, DEFAULT_MEMORY_RANGE (+11 more)

### Community 9 - "Community 9"
Cohesion: 0.07
Nodes (19): VECTOR_DATABASES, ALIBABA_REDIS_INSTANCES, AlibabaDBAdapter, AWS_DOCUMENTDB_INSTANCES, AWS_DYNAMODB_INSTANCES, AWS_ELASTICACHE_INSTANCES, AWSDynamoDBAdapter, AZURE_DB_SERVICES (+11 more)

### Community 10 - "Community 10"
Cohesion: 0.06
Nodes (35): 1. Frontend State Management ✅, 1. In-Table Micro-Visualizations ✅, 2. Analytical Charts View ✅, 2. Query Parameter Building ✅, 3. Backend Query Processing ✅, 3. Networking Filters Data Integration Fix ("Super Debug") ✅, 4. Data Persistence ✅, Configuration & Adapters (+27 more)

### Community 11 - "Community 11"
Cohesion: 0.25
Nodes (7): ChartsViewProps, FilterSidebarProps, PricingTableProps, ProductTypeSelectorProps, PROVIDERS, PricingRecord, ProductType

### Community 12 - "Community 12"
Cohesion: 0.07
Nodes (30): 1. Clone & install, 2. Configure environment, 3. Initialize the database, 4. Populate pricing data, 5. Open the app, 💬 About Page & User-Facing Messaging, ➕ Adding a New Cloud Provider, 🔐 Admin API Endpoints (+22 more)

### Community 13 - "Community 13"
Cohesion: 0.17
Nodes (6): PIPELINE_ORDER, PipelineStatus, PROVIDER_COLORS, PROVIDER_URLS, ProviderStatus, StatusData

### Community 14 - "Community 14"
Cohesion: 0.17
Nodes (13): CATEGORY_COLOR, CATEGORY_ORDER, PROVIDERS_FOR_CERT, CERT_BY_ID, CertCategory, Certification, CERTIFICATIONS, CertScope (+5 more)

### Community 15 - "Community 15"
Cohesion: 0.06
Nodes (37): ALL_DEFS, COL_ARCH, COL_EXEC, COL_GEO, COL_GPU, COL_GRAN, COL_INV, COL_LANG (+29 more)

### Community 18 - "Community 18"
Cohesion: 0.18
Nodes (17): DB_FAMILY_MAPPINGS, GET(), PIPELINE_REGISTRY, PipelineCtor, POST(), buildPricingFilters(), initDb(), parseFilterList() (+9 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): AI_CONTEXT_WINDOWS, AI_MODEL_TIERS, AI_SERVICE_TYPES, ANALYTICS_ENGINES, CATEGORIES, CONTAINERS_ARCHITECTURES, CONTAINERS_BILLING_GRANULARITY, CONTAINERS_COMPUTE_TYPES (+13 more)

### Community 23 - "Community 23"
Cohesion: 0.24
Nodes (4): AI_MODELS, AIModelConfig, AIPricingPipeline, AIStaticAdapter

### Community 24 - "Community 24"
Cohesion: 0.14
Nodes (16): GET(), dbCat(), DQIssue, DQReport, PROVIDERS, runDataQualityChecks(), createTransport(), DataQualityAlert (+8 more)

### Community 25 - "Community 25"
Cohesion: 0.50
Nodes (4): config, getRateLimitStatus(), middleware(), rateLimitStore

### Community 28 - "Community 28"
Cohesion: 0.11
Nodes (9): AzureContainersLiveAdapter, DigitalOceanContainersLiveAdapter, AWSElastiCacheAdapter, GCPCloudSQLAdapter, VectorDatabasesAdapter, AWSAdapter, BaseAdapter, AlibabaServerlessAdapter (+1 more)

### Community 30 - "Community 30"
Cohesion: 0.25
Nodes (7): Certifications & Regulations — Data Refresh Runbook, Deploy, How to review the changelog, Notes / known data confidence, The refresh prompt (copy-paste this into Claude Code), What Claude will do (so you know what to expect), When to refresh

### Community 32 - "Community 32"
Cohesion: 0.21
Nodes (11): OracleContainersLiveAdapter, fetchOracleCatalog(), findPrice(), nameIncludes(), OracleProduct, findOracleFlexRates(), findOracleGpuRate(), ORACLE_FLEX_FAMILIES (+3 more)

### Community 33 - "Community 33"
Cohesion: 0.18
Nodes (6): AppHostingPricingPipeline, DataAnalyticsPricingPipeline, DatabasePricingPipeline, PricingPipeline, mapStaticRows(), StoragePricingPipeline

### Community 35 - "Community 35"
Cohesion: 0.36
Nodes (6): AWSRDSAdapter, AzureDBAdapter, buildAzureDbFilter(), deriveAzureDbMemoryGb(), deriveRedisMemoryGb(), deriveTier()

### Community 36 - "Community 36"
Cohesion: 0.35
Nodes (3): AWSContainersLiveAdapter, PricingRecord, ServerlessPricingPipeline

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (5): STATIC_NETWORKING_PRICING, ensureProviderId(), PriceDriftResult, SecurityPricingPipeline, STATIC_SECURITY_PRICING

### Community 38 - "Community 38"
Cohesion: 0.09
Nodes (24): ALIBABA_APP_HOSTING_REGIONS, ALIBABA_BASE, ALIBABA_REGIONS, AppHostingRegion, AWS_APP_HOSTING_REGIONS, AWS_BASE, AWS_REGIONS, AZURE_APP_HOSTING_REGIONS (+16 more)

### Community 39 - "Community 39"
Cohesion: 0.32
Nodes (6): AlibabaCredentials, buildSignedUrl(), percentEncode(), randomNonce(), AlibabaAdapter, fetchAlibabaEcsLiveRecords()

### Community 41 - "Community 41"
Cohesion: 0.33
Nodes (5): Dashboard(), FilterSidebar(), groupAnalyticsTiers(), groupEngines(), useDynamicFilters()

### Community 42 - "Community 42"
Cohesion: 0.47
Nodes (3): DigitalOceanReferralModal(), DonationModal(), DonationModalProps

### Community 43 - "Community 43"
Cohesion: 0.33
Nodes (3): ALIBABA_FC_LANGUAGES, ALIBABA_SERVERLESS, baseAlibabaEntries

### Community 46 - "Community 46"
Cohesion: 0.40
Nodes (3): DBStatusProvider, ProviderCardProps, ProviderCardsProps

### Community 47 - "Community 47"
Cohesion: 0.29
Nodes (9): ALIBABA_INTEGRATION, AWS_INTEGRATION, AZURE_INTEGRATION, CATEGORY_TO_SERVICE_TYPE, DIGITALOCEAN_INTEGRATION, GCP_INTEGRATION, ORACLE_INTEGRATION, RawIntegrationEntry (+1 more)

### Community 48 - "Community 48"
Cohesion: 0.40
Nodes (3): AWS_LAMBDA_LANGUAGES, AWS_SERVERLESS, baseAwsEntries

### Community 49 - "Community 49"
Cohesion: 0.46
Nodes (4): DatabricksAzureAdapter, SynapseAzureAdapter, fetchWithRetry(), sleep()

### Community 50 - "Community 50"
Cohesion: 0.40
Nodes (3): AZURE_FUNCTIONS_LANGUAGES, AZURE_SERVERLESS, baseAzureEntries

### Community 51 - "Community 51"
Cohesion: 0.40
Nodes (3): baseDigitaloceanEntries, DIGITALOCEAN_FUNCTIONS_LANGUAGES, DIGITALOCEAN_SERVERLESS

### Community 54 - "Community 54"
Cohesion: 0.40
Nodes (3): baseGcpEntries, GCP_CLOUD_RUN_LANGUAGES, GCP_SERVERLESS

### Community 55 - "Community 55"
Cohesion: 0.40
Nodes (3): baseOracleEntries, ORACLE_LAMBDA_LANGUAGES, ORACLE_SERVERLESS

### Community 65 - "Community 65"
Cohesion: 0.09
Nodes (12): WORKLOADS, PROVIDER_IDS, providerColor(), providerName(), ProviderTh(), REGION_OPTIONS, SponsorSlot, WorkloadComponent (+4 more)

### Community 66 - "Community 66"
Cohesion: 0.06
Nodes (32): Admin API Reference, Admin endpoints return 401, All prices show ● grey arrows after ingest, Before going to production, CCC Operations Runbook, Common Issues, Database connection hangs, Database Schema Migrations (+24 more)

### Community 67 - "Community 67"
Cohesion: 0.09
Nodes (16): DatacenterRegion, GEOGRAPHIES, Geography, PROVIDER_INFRA, ProviderInfrastructure, RegionStatus, GEO_COLORS, GLOSSARY (+8 more)

### Community 69 - "Community 69"
Cohesion: 0.07
Nodes (18): ALIBABA_ANALYTICS_INSTANCES, AlibabaAnalyticsConfig, ANALYTICS_REGIONS, AnalyticsRegion, DIGITALOCEAN_ANALYTICS_INSTANCES, DigitalOceanAnalyticsConfig, NATIVE_ANALYTICS_INSTANCES, NativeAnalyticsConfig (+10 more)

### Community 93 - "Community 93"
Cohesion: 0.25
Nodes (6): heroTrendData, radarData, scatterDataAWS, scatterDataAzure, scatterDataGCP, serverlessData

## Knowledge Gaps
- **301 isolated node(s):** `ENGINE_CATEGORIES`, `FilterSectionProps`, `GroupedFilterSectionProps`, `PRODUCT_TYPE_DESCRIPTIONS`, `PRICING_MODELS` (+296 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `PricingRecord` connect `Community 36` to `Community 32`, `Database Instance Configs`, `Community 35`, `Community 68`, `Community 69`, `Community 38`, `Community 71`, `Community 72`, `Community 9`, `Community 73`, `Community 74`, `Community 75`, `Community 6`, `Community 47`, `Community 49`, `Community 23`, `Community 56`, `Community 28`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `BaseAdapter` connect `Community 28` to `Database Instance Configs`, `Community 9`, `Community 23`, `Community 32`, `Community 35`, `Community 36`, `Community 39`, `Community 40`, `Community 47`, `Community 49`, `Community 52`, `Community 56`, `Community 57`, `Community 68`, `Community 69`, `Community 71`, `Community 72`, `Community 73`, `Community 74`, `Community 75`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `PROVIDERS` connect `Community 11` to `Community 32`, `Community 65`, `Community 7`, `Community 8`, `Community 19`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `ENGINE_CATEGORIES`, `FilterSectionProps`, `GroupedFilterSectionProps` to the rest of the system?**
  _301 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Serverless Provider Configs` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `Community 6` be split into smaller, more focused modules?**
  _Cohesion score 0.11594202898550725 - nodes in this community are weakly interconnected._
- **Should `Community 7` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._