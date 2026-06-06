# Graph Report - _ccc  (2026-06-06)

## Corpus Check
- 112 files · ~86,154 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 15 nodes · 12 edges · 6 communities (2 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `260ed567`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Serverless Provider Configs|Serverless Provider Configs]]
- [[_COMMUNITY_Container Provider Configs|Container Provider Configs]]
- [[_COMMUNITY_Database Instance Configs|Database Instance Configs]]
- [[_COMMUNITY_Community 4|Community 4]]

## God Nodes (most connected - your core abstractions)
1. `sql` - 2 edges
2. `test()` - 2 edges
3. `sql` - 2 edges
4. `test()` - 2 edges
5. `sql` - 2 edges
6. `test()` - 2 edges
7. `PIPELINE_DISPLAY` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (6 total, 4 thin omitted)

## Knowledge Gaps
- **1 isolated node(s):** `PIPELINE_DISPLAY`
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `PIPELINE_DISPLAY` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._