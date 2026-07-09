# Graph Report - _ccc  (2026-07-09)

## Corpus Check
- 149 files · ~167,850 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 848 nodes · 1348 edges · 50 communities (31 shown, 19 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `14e314dc`
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
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 93|Community 93]]

## God Nodes (most connected - your core abstractions)
1. `BaseAdapter` - 60 edges
2. `PricingRecord` - 56 edges
3. `PricingPipeline` - 18 edges
4. `Compare Cloud Costs` - 17 edges
5. `sleep()` - 13 edges
6. `ServerlessPricingPipeline` - 13 edges
7. `Serverless Language Filter Implementation Summary` - 13 edges
8. `fetchWithRetry()` - 12 edges
9. `Compare Cloud Costs (CCC) — Claude Context` - 12 edges
10. `CCC Operations Runbook` - 11 edges

## Surprising Connections (you probably didn't know these)
- `runDataQualityChecks()` --calls--> `sql`  [INFERRED]
  src/services/data_quality.ts → src/workers/scheduler.ts
- `ProductTypeSelectorProps` --references--> `ProductType`  [EXTRACTED]
  src/components/ProductTypeSelector.tsx → src/types/index.ts
- `DatabricksStaticAdapter` --inherits--> `BaseAdapter`  [EXTRACTED]
  src/services/data_analytics_pipeline.ts → src/services/pricing_pipeline.ts
- `SnowflakeStaticAdapter` --inherits--> `BaseAdapter`  [EXTRACTED]
  src/services/data_analytics_pipeline.ts → src/services/pricing_pipeline.ts
- `DatabricksAzureAdapter` --inherits--> `BaseAdapter`  [EXTRACTED]
  src/services/data_analytics_pipeline.ts → src/services/pricing_pipeline.ts

## Import Cycles
- None detected.

## Communities (50 total, 19 thin omitted)

### Community 0 - "Serverless Provider Configs"
Cohesion: 0.05
Nodes (38): dependencies, @aws-sdk/client-pricing, axios, dotenv, @google/genai, lucide-react, motion, next (+30 more)

### Community 1 - "Container Provider Configs"
Cohesion: 0.15
Nodes (12): Adding a New Cloud Provider, API Routes, Architecture, Compare Cloud Costs (CCC) — Claude Context, Conventions, Database Schema, Documentation Map, Key Files — Start Here (+4 more)

### Community 2 - "Database Instance Configs"
Cohesion: 0.10
Nodes (12): AwsFargateScraper, AzureContainerInstancesScraper, AWSContainersLiveAdapter, AzureContainersLiveAdapter, GCPContainersLiveAdapter, OracleContainersLiveAdapter, AzureFunctionsLiveAdapter, fetchAllSkus() (+4 more)

### Community 6 - "Community 6"
Cohesion: 0.10
Nodes (14): ALIBABA_STORAGE, AWS_STORAGE, AZURE_STORAGE, DIGITALOCEAN_STORAGE, GCP_STORAGE, ORACLE_STORAGE, AwsStorageScraper, AzureStorageScraper (+6 more)

### Community 7 - "Community 7"
Cohesion: 0.06
Nodes (67): Dashboard(), ChartsViewProps, ENGINE_CATEGORIES, FilterSectionProps, FilterSidebar(), groupAnalyticsTiers(), GroupedFilterSectionProps, groupEngines() (+59 more)

### Community 8 - "Community 8"
Cohesion: 0.18
Nodes (17): DB_FAMILY_MAPPINGS, GET(), PIPELINE_REGISTRY, PipelineCtor, POST(), buildPricingFilters(), initDb(), parseFilterList() (+9 more)

### Community 9 - "Community 9"
Cohesion: 0.06
Nodes (32): VECTOR_DATABASES, ALIBABA_REDIS_INSTANCES, AlibabaDBAdapter, AlibabaRedisAdapter, AWS_DOCUMENTDB_INSTANCES, AWS_DYNAMODB_INSTANCES, AWS_ELASTICACHE_INSTANCES, AWSDocumentDBAdapter (+24 more)

### Community 10 - "Community 10"
Cohesion: 0.06
Nodes (35): 1. Frontend State Management ✅, 1. In-Table Micro-Visualizations ✅, 2. Analytical Charts View ✅, 2. Query Parameter Building ✅, 3. Backend Query Processing ✅, 3. Networking Filters Data Integration Fix ("Super Debug") ✅, 4. Data Persistence ✅, Configuration & Adapters (+27 more)

### Community 11 - "Community 11"
Cohesion: 0.16
Nodes (10): FilterSidebarProps, PricingTableProps, PRODUCT_TYPES, ProductTypeSelectorProps, PricingRecord, ProductType, SponsorSlot, WorkloadComponent (+2 more)

### Community 12 - "Community 12"
Cohesion: 0.07
Nodes (29): 1. Clone & install, 2. Configure environment, 3. Initialize the database, 4. Populate pricing data, 5. Open the app, About Page & User-Facing Messaging, Adding a New Cloud Provider, Admin API Endpoints (+21 more)

### Community 13 - "Community 13"
Cohesion: 0.04
Nodes (14): metadata, DigitalOceanReferralModal(), DonationModal(), DonationModalProps, MarkdownPageProps, DBStatusProvider, ProviderCardProps, ProviderCardsProps (+6 more)

### Community 14 - "Community 14"
Cohesion: 0.18
Nodes (11): CATEGORY_ORDER, CERT_BY_ID, CertCategory, Certification, CERTIFICATIONS, CertScope, COMPLIANCE_PROVIDERS, ComplianceSource (+3 more)

### Community 15 - "Community 15"
Cohesion: 0.06
Nodes (35): ALL_DEFS, COL_ARCH, COL_EXEC, COL_GEO, COL_GPU, COL_GRAN, COL_INV, COL_LANG (+27 more)

### Community 18 - "Community 18"
Cohesion: 0.07
Nodes (25): AI_MODELS, AIModelConfig, GET(), AIPricingPipeline, AIStaticAdapter, dbCat(), DQIssue, DQReport (+17 more)

### Community 19 - "Community 19"
Cohesion: 0.29
Nodes (5): DatabricksAzureAdapter, SynapseAzureAdapter, AzureAdapter, fetchWithRetry(), sleep()

### Community 25 - "Community 25"
Cohesion: 0.50
Nodes (4): config, getRateLimitStatus(), middleware(), rateLimitStore

### Community 36 - "Community 36"
Cohesion: 0.15
Nodes (6): OracleAutonomousAdapter, AWSAdapter, BaseAdapter, AzureServerlessAdapter, DigitalOceanServerlessAdapter, GCPServerlessAdapter

### Community 38 - "Community 38"
Cohesion: 0.08
Nodes (26): ALIBABA_APP_HOSTING_REGIONS, ALIBABA_BASE, ALIBABA_REGIONS, AppHostingRegion, AWS_APP_HOSTING_REGIONS, AWS_BASE, AWS_REGIONS, AZURE_APP_HOSTING_REGIONS (+18 more)

### Community 44 - "Community 44"
Cohesion: 0.17
Nodes (15): AlibabaCredentials, buildSignedUrl(), percentEncode(), randomNonce(), fetchOracleCatalog(), findPrice(), nameIncludes(), OracleProduct (+7 more)

### Community 47 - "Community 47"
Cohesion: 0.05
Nodes (30): ALIBABA_FC_LANGUAGES, ALIBABA_SERVERLESS, baseAlibabaEntries, AWS_LAMBDA_LANGUAGES, AWS_SERVERLESS, baseAwsEntries, AZURE_FUNCTIONS_LANGUAGES, AZURE_SERVERLESS (+22 more)

### Community 58 - "Community 58"
Cohesion: 0.19
Nodes (7): TableRow(), PROVIDER_IDS, providerColor(), providerName(), ProviderTh(), REGION_OPTIONS, formatInstanceName()

### Community 65 - "Community 65"
Cohesion: 0.16
Nodes (3): WORKLOADS, PRODUCT_TYPE_LABELS, PRODUCT_TYPE_ORDER

### Community 66 - "Community 66"
Cohesion: 0.06
Nodes (32): Admin API Reference, Admin endpoints return 401, All prices show ● grey arrows after ingest, Before going to production, CCC Operations Runbook, Common Issues, Database connection hangs, Database Schema Migrations (+24 more)

### Community 67 - "Community 67"
Cohesion: 0.09
Nodes (16): DatacenterRegion, GEOGRAPHIES, Geography, PROVIDER_INFRA, ProviderInfrastructure, RegionStatus, GEO_COLORS, GLOSSARY (+8 more)

### Community 69 - "Community 69"
Cohesion: 0.07
Nodes (19): ALIBABA_ANALYTICS_INSTANCES, AlibabaAnalyticsConfig, ANALYTICS_REGIONS, AnalyticsRegion, DIGITALOCEAN_ANALYTICS_INSTANCES, DigitalOceanAnalyticsConfig, NATIVE_ANALYTICS_INSTANCES, NativeAnalyticsConfig (+11 more)

### Community 93 - "Community 93"
Cohesion: 0.25
Nodes (6): heroTrendData, radarData, scatterDataAWS, scatterDataAzure, scatterDataGCP, serverlessData

## Knowledge Gaps
- **286 isolated node(s):** `metadata`, `CATEGORY_ORDER`, `PRODUCT_TYPES`, `CertScope`, `Certification` (+281 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `PricingRecord` connect `Community 9` to `Community 32`, `Database Instance Configs`, `Community 36`, `Community 69`, `Community 38`, `Community 6`, `Community 44`, `Community 47`, `Community 18`, `Community 19`, `Community 30`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `BaseAdapter` connect `Community 36` to `Community 32`, `Database Instance Configs`, `Community 69`, `Community 9`, `Community 44`, `Community 47`, `Community 18`, `Community 19`, `Community 24`, `Community 28`, `Community 30`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `PROVIDERS` connect `Community 7` to `Community 58`, `Community 44`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `metadata`, `CATEGORY_ORDER`, `PRODUCT_TYPES` to the rest of the system?**
  _286 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Serverless Provider Configs` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `Database Instance Configs` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 6` be split into smaller, more focused modules?**
  _Cohesion score 0.10052910052910052 - nodes in this community are weakly interconnected._