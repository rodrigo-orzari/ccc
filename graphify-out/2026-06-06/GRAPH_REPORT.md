# Graph Report - _ccc  (2026-06-06)

## Corpus Check
- 113 files · ~89,343 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 116 nodes · 107 edges · 20 communities (15 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `45bbb93f`
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
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]

## God Nodes (most connected - your core abstractions)
1. `Serverless Language Filter Implementation Summary` - 13 edges
2. `Welcome!` - 10 edges
3. `Status: ✅ COMPLETE` - 6 edges
4. `End-to-End Integration Verification` - 5 edges
5. `7. In-Depth Subsystem Walks` - 5 edges
6. `Task 2: Backend API Route Updates ✅` - 4 edges
7. `Files Modified` - 4 edges
8. `8. Resources for Contributors` - 4 edges
9. `Task 1: Language Filter UI Component ✅` - 3 edges
10. `Task 3: Data Pipeline & Integration ✅` - 3 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (20 total, 5 thin omitted)

### Community 8 - "Community 8"
Cohesion: 0.16
Nodes (9): freshnessStatus(), PIPELINE_ORDER, PipelineStatus, PROVIDER_COLORS, PROVIDER_URLS, ProviderStatus, StatusData, StatusPage() (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.40
Nodes (3): buildPricingFilters(), parseFilterList(), VALID_PRODUCT_TYPES

### Community 10 - "Community 10"
Cohesion: 0.11
Nodes (19): Configuration & Adapters, Core Implementation, Data Flow, Deployment Ready, Feature: DigitalOcean Functions Support ✅, Files Modified, Future Enhancements, Implementation (+11 more)

### Community 12 - "Community 12"
Cohesion: 0.12
Nodes (16): 1. What Problem Does This Application Solve?, 2. Architectural Design, 3. File Directory & Code Organization, 4. Documentation Guide, 5. Security & Deployment, 6. Quick Start, Build for Production, Directory Tree (+8 more)

### Community 14 - "Community 14"
Cohesion: 0.25
Nodes (7): 1. In-Table Micro-Visualizations ✅, 2. Analytical Charts View ✅, 3. Networking Filters Data Integration Fix ("Super Debug") ✅, Data Visualizations & Networking Fix Implementation Summary, Deployment Ready, Implementation Date, Status: ✅ COMPLETE

### Community 15 - "Community 15"
Cohesion: 0.40
Nodes (5): 1. Frontend State Management ✅, 2. Query Parameter Building ✅, 3. Backend Query Processing ✅, 4. Data Persistence ✅, End-to-End Integration Verification

### Community 16 - "Community 16"
Cohesion: 0.40
Nodes (5): 7. In-Depth Subsystem Walks, A. Database Initialization and Schema Management, B. Ingestion Pipelines & In-Flight Validations, C. Backend API Routes, D. The Comparative Frontend Dashboard

### Community 17 - "Community 17"
Cohesion: 0.50
Nodes (4): Implementation, Query Parameter Format, Task 2: Backend API Route Updates ✅, Technical Details

### Community 18 - "Community 18"
Cohesion: 0.50
Nodes (4): 8. Resources for Contributors, For Specific Tasks, Getting Started, Key Architecture Files

## Knowledge Gaps
- **54 isolated node(s):** `Status: ✅ COMPLETE`, `Implementation`, `UI Integration Pattern`, `Implementation`, `Technical Details` (+49 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Serverless Language Filter Implementation Summary` connect `Community 10` to `Community 17`, `Community 14`, `Community 15`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `Welcome!` connect `Community 12` to `Community 16`, `Community 18`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **What connects `Status: ✅ COMPLETE`, `Implementation`, `UI Integration Pattern` to the rest of the system?**
  _54 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 10` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Community 12` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._