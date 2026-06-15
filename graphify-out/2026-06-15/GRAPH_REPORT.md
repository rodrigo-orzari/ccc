# Graph Report - _ccc  (2026-06-15)

## Corpus Check
- 134 files · ~101,519 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 369 nodes · 475 edges · 38 communities (21 shown, 17 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a8c86535`
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
- [[_COMMUNITY_Community 20|Community 20]]
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

## God Nodes (most connected - your core abstractions)
1. `Serverless Language Filter Implementation Summary` - 13 edges
2. `Welcome!` - 10 edges
3. `ProductType` - 8 edges
4. `NetworkingPricingPipeline` - 7 edges
5. `Status: ✅ COMPLETE` - 6 edges
6. `StoragePricingPipeline` - 5 edges
7. `useDynamicFilters()` - 5 edges
8. `PricingRecord` - 5 edges
9. `buildPricingFilters()` - 5 edges
10. `7. In-Depth Subsystem Walks` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Dashboard()` --calls--> `useDynamicFilters()`  [EXTRACTED]
  src/app/page.tsx → src/hooks/useDynamicFilters.ts
- `ProductTypeSelectorProps` --references--> `ProductType`  [EXTRACTED]
  src/components/ProductTypeSelector.tsx → src/types/index.ts
- `FilterSidebar()` --calls--> `useDynamicFilters()`  [EXTRACTED]
  src/components/FilterSidebar.tsx → src/hooks/useDynamicFilters.ts
- `PricingTableProps` --references--> `PricingRecord`  [EXTRACTED]
  src/components/PricingTable.tsx → src/types/index.ts
- `PricingTableProps` --references--> `ProductType`  [EXTRACTED]
  src/components/PricingTable.tsx → src/types/index.ts

## Import Cycles
- None detected.

## Communities (38 total, 17 thin omitted)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (14): ALIBABA_STORAGE, AWS_STORAGE, AZURE_STORAGE, DIGITALOCEAN_STORAGE, GCP_STORAGE, ORACLE_STORAGE, AwsStorageScraper, AzureStorageScraper (+6 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (54): Dashboard(), FilterSectionProps, FilterSidebar(), FilterSidebarProps, GroupedFilterSectionProps, AI_CONTEXT_WINDOWS, AI_MODEL_TIERS, AI_MULTIMODAL_OPTIONS (+46 more)

### Community 8 - "Community 8"
Cohesion: 0.18
Nodes (6): PIPELINE_ORDER, PipelineStatus, PROVIDER_COLORS, PROVIDER_URLS, ProviderStatus, StatusData

### Community 9 - "Community 9"
Cohesion: 0.11
Nodes (10): POST(), buildPricingFilters(), initDb(), parseFilterList(), requireAdminAuth(), VALID_PRODUCT_TYPES, pipeline, sql (+2 more)

### Community 10 - "Community 10"
Cohesion: 0.06
Nodes (35): 1. Frontend State Management ✅, 1. In-Table Micro-Visualizations ✅, 2. Analytical Charts View ✅, 2. Query Parameter Building ✅, 3. Backend Query Processing ✅, 3. Networking Filters Data Integration Fix ("Super Debug") ✅, 4. Data Persistence ✅, Configuration & Adapters (+27 more)

### Community 12 - "Community 12"
Cohesion: 0.08
Nodes (25): 1. What Problem Does This Application Solve?, 2. Architectural Design, 3. File Directory & Code Organization, 4. Documentation Guide, 5. Security & Deployment, 6. Quick Start, 7. In-Depth Subsystem Walks, 8. Resources for Contributors (+17 more)

### Community 15 - "Community 15"
Cohesion: 0.05
Nodes (36): ChartsViewProps, ALL_DEFS, COL_ARCH, COL_EXEC, COL_GEO, COL_GPU, COL_GRAN, COL_INV (+28 more)

### Community 16 - "Community 16"
Cohesion: 0.07
Nodes (15): ALIBABA_ANALYTICS_INSTANCES, AlibabaAnalyticsConfig, DIGITALOCEAN_ANALYTICS_INSTANCES, DigitalOceanAnalyticsConfig, ORACLE_ANALYTICS_INSTANCES, OracleAnalyticsConfig, AlibabaAnalyticsAdapter, DataAnalyticsPricingPipeline (+7 more)

### Community 20 - "Community 20"
Cohesion: 0.40
Nodes (3): DBStatusProvider, ProviderCardProps, ProviderCardsProps

### Community 25 - "Community 25"
Cohesion: 0.50
Nodes (4): config, getRateLimitStatus(), middleware(), rateLimitStore

### Community 27 - "Community 27"
Cohesion: 0.24
Nodes (4): AI_MODELS, AIModelConfig, AIPricingPipeline, AIStaticAdapter

### Community 28 - "Community 28"
Cohesion: 0.33
Nodes (3): ALIBABA_FC_LANGUAGES, ALIBABA_SERVERLESS, baseAlibabaEntries

## Knowledge Gaps
- **116 isolated node(s):** `STORAGE_CATEGORIES`, `STORAGE_REDUNDANCIES`, `STORAGE_MEDIA`, `STORAGE_TIERS`, `StorageConfigEntry` (+111 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `DataAnalyticsPricingPipeline` connect `Community 16` to `Community 6`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `ProductType` connect `Community 15` to `Community 7`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `NetworkingPricingPipeline` connect `Community 9` to `Community 6`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `STORAGE_CATEGORIES`, `STORAGE_REDUNDANCIES`, `STORAGE_MEDIA` to the rest of the system?**
  _116 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 6` be split into smaller, more focused modules?**
  _Cohesion score 0.08870967741935484 - nodes in this community are weakly interconnected._
- **Should `Community 7` be split into smaller, more focused modules?**
  _Cohesion score 0.08196721311475409 - nodes in this community are weakly interconnected._
- **Should `Community 9` be split into smaller, more focused modules?**
  _Cohesion score 0.11067193675889328 - nodes in this community are weakly interconnected._