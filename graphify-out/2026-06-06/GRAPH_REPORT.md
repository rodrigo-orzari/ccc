# Graph Report - _ccc  (2026-06-06)

## Corpus Check
- 116 files · ~91,099 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 223 nodes · 290 edges · 22 communities (15 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5babb939`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Serverless Provider Configs|Serverless Provider Configs]]
- [[_COMMUNITY_Container Provider Configs|Container Provider Configs]]
- [[_COMMUNITY_Database Instance Configs|Database Instance Configs]]
- [[_COMMUNITY_Community 4|Community 4]]
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

## God Nodes (most connected - your core abstractions)
1. `Serverless Language Filter Implementation Summary` - 13 edges
2. `Welcome!` - 10 edges
3. `Status: ✅ COMPLETE` - 6 edges
4. `End-to-End Integration Verification` - 5 edges
5. `7. In-Depth Subsystem Walks` - 5 edges
6. `PROVIDERS` - 4 edges
7. `AIPricingPipeline` - 4 edges
8. `Task 2: Backend API Route Updates ✅` - 4 edges
9. `Files Modified` - 4 edges
10. `8. Resources for Contributors` - 4 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (22 total, 7 thin omitted)

### Community 7 - "Community 7"
Cohesion: 0.11
Nodes (39): FilterSectionProps, FilterSidebarProps, AI_CONTEXT_WINDOWS, AI_MODEL_TIERS, AI_MULTIMODAL_OPTIONS, AI_SERVICE_TYPES, ANALYTICS_DEPLOYMENT_TYPES, ANALYTICS_ENGINES (+31 more)

### Community 8 - "Community 8"
Cohesion: 0.18
Nodes (6): PIPELINE_ORDER, PipelineStatus, PROVIDER_COLORS, PROVIDER_URLS, ProviderStatus, StatusData

### Community 9 - "Community 9"
Cohesion: 0.40
Nodes (3): buildPricingFilters(), parseFilterList(), VALID_PRODUCT_TYPES

### Community 10 - "Community 10"
Cohesion: 0.07
Nodes (28): 1. Frontend State Management ✅, 2. Query Parameter Building ✅, 3. Backend Query Processing ✅, 4. Data Persistence ✅, Configuration & Adapters, Core Implementation, Data Flow, Deployment Ready (+20 more)

### Community 12 - "Community 12"
Cohesion: 0.08
Nodes (25): 1. What Problem Does This Application Solve?, 2. Architectural Design, 3. File Directory & Code Organization, 4. Documentation Guide, 5. Security & Deployment, 6. Quick Start, 7. In-Depth Subsystem Walks, 8. Resources for Contributors (+17 more)

### Community 14 - "Community 14"
Cohesion: 0.25
Nodes (7): 1. In-Table Micro-Visualizations ✅, 2. Analytical Charts View ✅, 3. Networking Filters Data Integration Fix ("Super Debug") ✅, Data Visualizations & Networking Fix Implementation Summary, Deployment Ready, Implementation Date, Status: ✅ COMPLETE

### Community 15 - "Community 15"
Cohesion: 0.06
Nodes (29): ALL_DEFS, COL_EXEC, COL_GEO, COL_GPU, COL_GRAN, COL_INV, COL_LANG, COL_MEM (+21 more)

### Community 16 - "Community 16"
Cohesion: 0.24
Nodes (4): AI_MODELS, AIModelConfig, AIPricingPipeline, AIStaticAdapter

### Community 18 - "Community 18"
Cohesion: 0.33
Nodes (4): ChartsViewProps, PROVIDERS, PricingRecord, ProductType

### Community 20 - "Community 20"
Cohesion: 0.40
Nodes (3): DBStatusProvider, ProviderCardProps, ProviderCardsProps

## Knowledge Gaps
- **88 isolated node(s):** `TableToolbarProps`, `PipelineStatus`, `ProviderStatus`, `StatusData`, `PROVIDER_COLORS` (+83 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Serverless Language Filter Implementation Summary` connect `Community 10` to `Community 14`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `TableToolbarProps`, `PipelineStatus`, `ProviderStatus` to the rest of the system?**
  _88 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 7` be split into smaller, more focused modules?**
  _Cohesion score 0.11207729468599034 - nodes in this community are weakly interconnected._
- **Should `Community 10` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `Community 12` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `Community 15` be split into smaller, more focused modules?**
  _Cohesion score 0.06417112299465241 - nodes in this community are weakly interconnected._