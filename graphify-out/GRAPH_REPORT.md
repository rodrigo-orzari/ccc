# Graph Report - _ccc  (2026-07-11)

## Corpus Check
- 153 files · ~184,234 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 916 nodes · 1502 edges · 64 communities (42 shown, 22 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4f5c584c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Serverless Provider Configs|Serverless Provider Configs]]
- [[_COMMUNITY_Container Provider Configs|Container Provider Configs]]
- [[_COMMUNITY_Community 2|Community 2]]
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
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 69|Community 69]]
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
9. `ProductType` - 11 edges
10. `fetchWithRetry()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `runDataQualityChecks()` --calls--> `sql`  [INFERRED]
  src/services/data_quality.ts → src/workers/scheduler.ts
- `Dashboard()` --calls--> `useDynamicFilters()`  [EXTRACTED]
  src/app/page.tsx → src/hooks/useDynamicFilters.ts
- `FilterSidebarProps` --references--> `ProductType`  [EXTRACTED]
  src/components/FilterSidebar.tsx → src/types/index.ts
- `PricingTableProps` --references--> `ProductType`  [EXTRACTED]
  src/components/PricingTable.tsx → src/types/index.ts
- `aiTokensQty()` --calls--> `capacityScale()`  [EXTRACTED]
  src/config/workloads.ts → src/config/workload_priorities.ts

## Import Cycles
- 3-file cycle: `src/services/gcp_compute_rates.ts -> src/services/serverless_adapters_live.ts -> src/services/pricing_pipeline.ts -> src/services/gcp_compute_rates.ts`

## Communities (64 total, 22 thin omitted)

### Community 0 - "Serverless Provider Configs"
Cohesion: 0.05
Nodes (38): dependencies, @aws-sdk/client-pricing, axios, dotenv, @google/genai, lucide-react, motion, next (+30 more)

### Community 1 - "Container Provider Configs"
Cohesion: 0.15
Nodes (12): Adding a New Cloud Provider, API Routes, Architecture, Compare Cloud Costs (CCC) — Claude Context, Conventions, Database Schema, Documentation Map, Key Files — Start Here (+4 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (27): AI_SERVICE_TYPES, ANALYTICS_DEPLOYMENT_TYPES, APP_HOSTING_COMPUTE_TYPES, APP_HOSTING_TIERS, CONTAINERS_ORCHESTRATORS, DEFAULT_CONTAINERS_MEMORY_RANGE, DEFAULT_CONTAINERS_VCPU_RANGE, DEFAULT_PRICE_RANGE (+19 more)

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (14): ALIBABA_STORAGE, AWS_STORAGE, AZURE_STORAGE, DIGITALOCEAN_STORAGE, GCP_STORAGE, ORACLE_STORAGE, GcpStorageScraper, getAwsStorageRows() (+6 more)

### Community 7 - "Community 7"
Cohesion: 0.07
Nodes (40): ENGINE_CATEGORIES, FilterSectionProps, GroupedFilterSectionProps, PRODUCT_TYPE_DESCRIPTIONS, AI_CONTEXT_WINDOWS, AI_MODEL_TIERS, AI_MULTIMODAL_OPTIONS, ANALYTICS_ENGINES (+32 more)

### Community 8 - "Community 8"
Cohesion: 0.06
Nodes (43): FilterSidebarProps, PRODUCT_TYPES, ProductTypeSelectorProps, capacityNodes(), capacityScale(), capacitySize(), computeReqs(), dbReqs() (+35 more)

### Community 9 - "Community 9"
Cohesion: 0.08
Nodes (22): VECTOR_DATABASES, ALIBABA_REDIS_INSTANCES, AWS_DOCUMENTDB_INSTANCES, AWS_DYNAMODB_INSTANCES, AWS_ELASTICACHE_INSTANCES, AWSRDSAdapter, AZURE_DB_SERVICES, AZURE_REDIS_CACHE_GB (+14 more)

### Community 10 - "Community 10"
Cohesion: 0.06
Nodes (35): 1. Frontend State Management ✅, 1. In-Table Micro-Visualizations ✅, 2. Analytical Charts View ✅, 2. Query Parameter Building ✅, 3. Backend Query Processing ✅, 3. Networking Filters Data Integration Fix ("Super Debug") ✅, 4. Data Persistence ✅, Configuration & Adapters (+27 more)

### Community 11 - "Community 11"
Cohesion: 0.06
Nodes (39): DB_FAMILY_MAPPINGS, GET(), GET(), PIPELINE_REGISTRY, PipelineCtor, POST(), buildPricingFilters(), initDb() (+31 more)

### Community 12 - "Community 12"
Cohesion: 0.07
Nodes (30): 1. Clone & install, 2. Configure environment, 3. Initialize the database, 4. Populate pricing data, 5. Open the app, 💬 About Page & User-Facing Messaging, ➕ Adding a New Cloud Provider, 🔐 Admin API Endpoints (+22 more)

### Community 13 - "Community 13"
Cohesion: 0.17
Nodes (6): PIPELINE_ORDER, PipelineStatus, PROVIDER_COLORS, PROVIDER_URLS, ProviderStatus, StatusData

### Community 14 - "Community 14"
Cohesion: 0.18
Nodes (13): CATEGORY_COLOR, CATEGORY_ORDER, PROVIDERS_FOR_CERT, CERT_BY_ID, CertCategory, Certification, CERTIFICATIONS, CertScope (+5 more)

### Community 15 - "Community 15"
Cohesion: 0.05
Nodes (42): ALL_DEFS, COL_ARCH, COL_EXEC, COL_GEO, COL_GPU, COL_GRAN, COL_INV, COL_LANG (+34 more)

### Community 18 - "Community 18"
Cohesion: 0.24
Nodes (4): AI_MODELS, AIModelConfig, AIPricingPipeline, AIStaticAdapter

### Community 24 - "Community 24"
Cohesion: 0.29
Nodes (9): fetchOracleCatalog(), findPrice(), nameIncludes(), OracleProduct, findOracleFlexRates(), findOracleGpuRate(), ORACLE_FLEX_FAMILIES, ORACLE_GPU_MODELS (+1 more)

### Community 25 - "Community 25"
Cohesion: 0.50
Nodes (4): config, getRateLimitStatus(), middleware(), rateLimitStore

### Community 28 - "Community 28"
Cohesion: 0.08
Nodes (13): GCPContainersLiveAdapter, OracleContainersLiveAdapter, AWSDynamoDBAdapter, AWSElastiCacheAdapter, VectorDatabasesAdapter, AWSAdapter, BaseAdapter, AzureFunctionsLiveAdapter (+5 more)

### Community 30 - "Community 30"
Cohesion: 0.25
Nodes (7): Certifications & Regulations — Data Refresh Runbook, Deploy, How to review the changelog, Notes / known data confidence, The refresh prompt (copy-paste this into Claude Code), What Claude will do (so you know what to expect), When to refresh

### Community 32 - "Community 32"
Cohesion: 0.47
Nodes (3): DigitalOceanReferralModal(), DonationModal(), DonationModalProps

### Community 33 - "Community 33"
Cohesion: 0.19
Nodes (13): fetchAllSkus(), findGcpServiceName(), FAMILIES, fetchGcpComputeRates(), findFamilyRate(), findGpuRate(), GcpComputeRates, gcpFamilyOf() (+5 more)

### Community 35 - "Community 35"
Cohesion: 0.09
Nodes (11): AWS_CONTAINERS, baseAwsContainerEntries, AZURE_CONTAINERS, baseAzureContainerEntries, baseGcpContainerEntries, GCP_CONTAINERS, AWSContainersLiveAdapter, AzureContainersLiveAdapter (+3 more)

### Community 36 - "Community 36"
Cohesion: 0.20
Nodes (6): AlibabaDBAdapter, OracleMySQLHeatWaveAdapter, PricingRecord, AWSServerlessAdapter, AzureServerlessAdapter, ServerlessPricingPipeline

### Community 37 - "Community 37"
Cohesion: 0.27
Nodes (3): AppHostingPricingPipeline, DatabasePricingPipeline, PricingPipeline

### Community 38 - "Community 38"
Cohesion: 0.09
Nodes (24): ALIBABA_APP_HOSTING_REGIONS, ALIBABA_BASE, ALIBABA_REGIONS, AppHostingRegion, AWS_APP_HOSTING_REGIONS, AWS_BASE, AWS_REGIONS, AZURE_APP_HOSTING_REGIONS (+16 more)

### Community 39 - "Community 39"
Cohesion: 0.32
Nodes (6): AlibabaCredentials, buildSignedUrl(), percentEncode(), randomNonce(), AlibabaAdapter, fetchAlibabaEcsLiveRecords()

### Community 41 - "Community 41"
Cohesion: 0.40
Nodes (3): DBStatusProvider, ProviderCardProps, ProviderCardsProps

### Community 42 - "Community 42"
Cohesion: 0.33
Nodes (5): Dashboard(), FilterSidebar(), groupAnalyticsTiers(), groupEngines(), useDynamicFilters()

### Community 44 - "Community 44"
Cohesion: 0.27
Nodes (5): DatabricksAzureAdapter, SynapseAzureAdapter, AzureAdapter, fetchWithRetry(), sleep()

### Community 47 - "Community 47"
Cohesion: 0.06
Nodes (28): ALIBABA_FC_LANGUAGES, ALIBABA_SERVERLESS, baseAlibabaEntries, AWS_LAMBDA_LANGUAGES, AWS_SERVERLESS, baseAwsEntries, AZURE_FUNCTIONS_LANGUAGES, AZURE_SERVERLESS (+20 more)

### Community 66 - "Community 66"
Cohesion: 0.06
Nodes (32): Admin API Reference, Admin endpoints return 401, All prices show ● grey arrows after ingest, Before going to production, CCC Operations Runbook, Common Issues, Database connection hangs, Database Schema Migrations (+24 more)

### Community 67 - "Community 67"
Cohesion: 0.10
Nodes (15): DatacenterRegion, GEOGRAPHIES, Geography, PROVIDER_INFRA, ProviderInfrastructure, RegionStatus, GEO_COLORS, PROVIDER_COLORS (+7 more)

### Community 69 - "Community 69"
Cohesion: 0.07
Nodes (19): ALIBABA_ANALYTICS_INSTANCES, AlibabaAnalyticsConfig, ANALYTICS_REGIONS, AnalyticsRegion, DIGITALOCEAN_ANALYTICS_INSTANCES, DigitalOceanAnalyticsConfig, NATIVE_ANALYTICS_INSTANCES, NativeAnalyticsConfig (+11 more)

### Community 93 - "Community 93"
Cohesion: 0.25
Nodes (6): heroTrendData, radarData, scatterDataAWS, scatterDataAzure, scatterDataGCP, serverlessData

## Knowledge Gaps
- **306 isolated node(s):** `REGION_OPTIONS`, `PROVIDER_IDS`, `ENGINE_CATEGORIES`, `FilterSectionProps`, `GroupedFilterSectionProps` (+301 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `PricingRecord` connect `Community 36` to `Community 33`, `Community 35`, `Community 69`, `Community 38`, `Community 6`, `Community 9`, `Community 44`, `Community 47`, `Community 18`, `Community 51`, `Community 53`, `Community 56`, `Community 24`, `Community 28`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `BaseAdapter` connect `Community 28` to `Community 33`, `Community 35`, `Community 36`, `Community 69`, `Community 39`, `Community 9`, `Community 43`, `Community 44`, `Community 47`, `Community 18`, `Community 51`, `Community 52`, `Community 53`, `Community 56`, `Community 24`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `PROVIDERS` connect `Community 45` to `Community 8`, `Community 24`, `Community 2`, `Community 7`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `REGION_OPTIONS`, `PROVIDER_IDS`, `ENGINE_CATEGORIES` to the rest of the system?**
  _306 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Serverless Provider Configs` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `Community 6` be split into smaller, more focused modules?**
  _Cohesion score 0.12318840579710146 - nodes in this community are weakly interconnected._