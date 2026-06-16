# Graph Report - _ccc  (2026-06-15)

## Corpus Check
- 156 files · ~111,129 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 537 nodes · 725 edges · 61 communities (33 shown, 28 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6cbfacc1`
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
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 21|Community 21]]
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
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]

## God Nodes (most connected - your core abstractions)
1. `BaseAdapter` - 17 edges
2. `Serverless Language Filter Implementation Summary` - 13 edges
3. `Welcome!` - 10 edges
4. `buildPricingFilters()` - 9 edges
5. `ServerlessPricingPipeline` - 9 edges
6. `ProductType` - 8 edges
7. `DigitalOceanAdapter` - 7 edges
8. `NetworkingPricingPipeline` - 7 edges
9. `GCPAdapter` - 6 edges
10. `PricingPipeline` - 6 edges

## Surprising Connections (you probably didn't know these)
- `run()` --calls--> `buildPricingFilters()`  [EXTRACTED]
  test_api.mjs → src/lib/api-utils.ts
- `run()` --calls--> `buildPricingFilters()`  [EXTRACTED]
  test_filters.mjs → src/lib/api-utils.ts
- `ProductTypeSelectorProps` --references--> `ProductType`  [EXTRACTED]
  src/components/ProductTypeSelector.tsx → src/types/index.ts
- `Dashboard()` --calls--> `useDynamicFilters()`  [EXTRACTED]
  src/app/page.tsx → src/hooks/useDynamicFilters.ts
- `FilterSidebar()` --calls--> `useDynamicFilters()`  [EXTRACTED]
  src/components/FilterSidebar.tsx → src/hooks/useDynamicFilters.ts

## Import Cycles
- None detected.

## Communities (61 total, 28 thin omitted)

### Community 6 - "Community 6"
Cohesion: 0.10
Nodes (13): ALIBABA_STORAGE, AWS_STORAGE, AZURE_STORAGE, DIGITALOCEAN_STORAGE, GCP_STORAGE, ORACLE_STORAGE, AwsStorageScraper, AzureStorageScraper (+5 more)

### Community 7 - "Community 7"
Cohesion: 0.07
Nodes (58): Dashboard(), FilterSectionProps, FilterSidebar(), FilterSidebarProps, GroupedFilterSectionProps, AI_CONTEXT_WINDOWS, AI_MODEL_TIERS, AI_MULTIMODAL_OPTIONS (+50 more)

### Community 8 - "Community 8"
Cohesion: 0.17
Nodes (6): PIPELINE_ORDER, PipelineStatus, PROVIDER_COLORS, PROVIDER_URLS, ProviderStatus, StatusData

### Community 9 - "Community 9"
Cohesion: 0.15
Nodes (10): POST(), buildPricingFilters(), initDb(), parseFilterList(), requireAdminAuth(), VALID_PRODUCT_TYPES, run(), sql (+2 more)

### Community 10 - "Community 10"
Cohesion: 0.06
Nodes (35): 1. Frontend State Management ✅, 1. In-Table Micro-Visualizations ✅, 2. Analytical Charts View ✅, 2. Query Parameter Building ✅, 3. Backend Query Processing ✅, 3. Networking Filters Data Integration Fix ("Super Debug") ✅, 4. Data Persistence ✅, Configuration & Adapters (+27 more)

### Community 12 - "Community 12"
Cohesion: 0.08
Nodes (25): 1. What Problem Does This Application Solve?, 2. Architectural Design, 3. File Directory & Code Organization, 4. Documentation Guide, 5. Security & Deployment, 6. Quick Start, 7. In-Depth Subsystem Walks, 8. Resources for Contributors (+17 more)

### Community 15 - "Community 15"
Cohesion: 0.06
Nodes (31): ALL_DEFS, COL_ARCH, COL_EXEC, COL_GEO, COL_GPU, COL_GRAN, COL_INV, COL_LANG (+23 more)

### Community 16 - "Community 16"
Cohesion: 0.07
Nodes (17): ALIBABA_ANALYTICS_INSTANCES, AlibabaAnalyticsConfig, DIGITALOCEAN_ANALYTICS_INSTANCES, DigitalOceanAnalyticsConfig, NATIVE_ANALYTICS_INSTANCES, NativeAnalyticsConfig, ORACLE_ANALYTICS_INSTANCES, OracleAnalyticsConfig (+9 more)

### Community 25 - "Community 25"
Cohesion: 0.50
Nodes (4): config, getRateLimitStatus(), middleware(), rateLimitStore

### Community 26 - "Community 26"
Cohesion: 0.32
Nodes (3): AlibabaServerlessAdapter, AWSServerlessLiveAdapter, ServerlessPricingPipeline

### Community 27 - "Community 27"
Cohesion: 0.24
Nodes (4): AI_MODELS, AIModelConfig, AIPricingPipeline, AIStaticAdapter

### Community 28 - "Community 28"
Cohesion: 0.33
Nodes (3): ALIBABA_FC_LANGUAGES, ALIBABA_SERVERLESS, baseAlibabaEntries

### Community 38 - "Community 38"
Cohesion: 0.11
Nodes (15): ALIBABA_APP_HOSTING, AWS_APP_HOSTING, AZURE_APP_HOSTING, DO_APP_HOSTING, GCP_APP_HOSTING, ORACLE_APP_HOSTING, Row, pipeline (+7 more)

### Community 47 - "Community 47"
Cohesion: 0.29
Nodes (8): ALIBABA_INTEGRATION, AWS_INTEGRATION, AZURE_INTEGRATION, CATEGORY_TO_SERVICE_TYPE, DIGITALOCEAN_INTEGRATION, GCP_INTEGRATION, ORACLE_INTEGRATION, RawIntegrationEntry

### Community 48 - "Community 48"
Cohesion: 0.06
Nodes (20): metadata, ChartsViewProps, DonationModal(), PricingTableProps, PRODUCT_TYPES, ProductTypeSelectorProps, DBStatusProvider, ProviderCardProps (+12 more)

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

### Community 62 - "Community 62"
Cohesion: 0.09
Nodes (10): AlibabaAdapter, AWSAdapter, AzureAdapter, BaseAdapter, DigitalOceanAdapter, GCPAdapter, OracleAdapter, PriceDriftResult (+2 more)

## Knowledge Gaps
- **148 isolated node(s):** `PipelineStatus`, `ProviderStatus`, `StatusData`, `PROVIDER_COLORS`, `PROVIDER_URLS` (+143 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `DataAnalyticsPricingPipeline` connect `Community 16` to `Community 38`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `BaseAdapter` connect `Community 62` to `Community 16`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `NetworkingPricingPipeline` connect `Community 38` to `Community 9`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `PipelineStatus`, `ProviderStatus`, `StatusData` to the rest of the system?**
  _148 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 6` be split into smaller, more focused modules?**
  _Cohesion score 0.0960591133004926 - nodes in this community are weakly interconnected._
- **Should `Community 7` be split into smaller, more focused modules?**
  _Cohesion score 0.075 - nodes in this community are weakly interconnected._
- **Should `Community 9` be split into smaller, more focused modules?**
  _Cohesion score 0.14736842105263157 - nodes in this community are weakly interconnected._