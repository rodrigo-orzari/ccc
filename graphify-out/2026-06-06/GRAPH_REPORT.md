# Graph Report - _ccc  (2026-06-06)

## Corpus Check
- 113 files · ~87,886 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 38 nodes · 33 edges · 12 communities (8 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `057d4b14`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Serverless Provider Configs|Serverless Provider Configs]]
- [[_COMMUNITY_Container Provider Configs|Container Provider Configs]]
- [[_COMMUNITY_Database Instance Configs|Database Instance Configs]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]

## God Nodes (most connected - your core abstractions)
1. `StatusPage()` - 3 edges
2. `timeAgo()` - 2 edges
3. `freshnessStatus()` - 2 edges
4. `parseFilterList()` - 2 edges
5. `buildPricingFilters()` - 2 edges
6. `sql` - 2 edges
7. `test()` - 2 edges
8. `sql` - 2 edges
9. `test()` - 2 edges
10. `sql` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (12 total, 4 thin omitted)

### Community 8 - "Community 8"
Cohesion: 0.25
Nodes (5): PIPELINE_ORDER, PipelineStatus, PROVIDER_COLORS, ProviderStatus, StatusData

### Community 9 - "Community 9"
Cohesion: 0.40
Nodes (3): buildPricingFilters(), parseFilterList(), VALID_PRODUCT_TYPES

### Community 10 - "Community 10"
Cohesion: 0.67
Nodes (3): freshnessStatus(), StatusPage(), timeAgo()

## Knowledge Gaps
- **7 isolated node(s):** `PipelineStatus`, `ProviderStatus`, `StatusData`, `PROVIDER_COLORS`, `PIPELINE_ORDER` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `StatusPage()` connect `Community 10` to `Community 8`?**
  _High betweenness centrality (0.001) - this node is a cross-community bridge._
- **What connects `PipelineStatus`, `ProviderStatus`, `StatusData` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._