# Filter Catalog & Coverage

**Last Updated**: 2026-07-19  
**Audit Method**: Live API testing against https://comparecloudcosts.com/api/pricing

This document lists all available filters per product category, verified against live production data. Filters with ✅ are confirmed working; filters marked ⚠️ had bugs that were recently fixed.

---

## Overview

Filters are dynamically available based on the selected product category. The frontend sends filter selections as URL query parameters to `/api/pricing?product=<category>&<filters>`, where `buildPricingFilters()` in `src/lib/api-utils.ts` translates them into SQL WHERE clauses.

**Key Updates (2026-07-19 Audit)**:
- ✅ **Security Service filter** — Was a complete no-op (no backend handling). **Fixed**: added missing SQL block in `buildPricingFilters()`.
- ✅ **Storage Media filter** — Param silently dropped. **Fixed**: added destructuring + SQL filter.
- ✅ **Serverless Service Type** — Restored to include both `Compute` and `Container` (Azure Container Apps now supported).
- 🗑️ **Dead options removed** — Filters that offered options never written by any pipeline (confirmed via live data audit).
- ➕ **Missing options added** — Real priced data with no filter option to find it (Security, Storage, Networking, App Hosting, Integration, Data Analytics, Containers).

---

## Virtual Machines

| Filter | Options | Status | Notes |
|---|---|---|---|
| **Providers** | AWS, Azure, GCP, Oracle, DigitalOcean, Alibaba | ✅ | All hyperscalers |
| **Geographies** | N. America, S. America, W. Europe, N. Europe, Asia Pacific, Australia | ✅ | Mapped per provider |
| **Categories** | General purpose, Compute optimized, Memory optimized, Storage optimized, Burstable, HPC | ✅ | Instance family classification |
| **CPU Vendors** | Intel, AMD, AWS Graviton, Oracle SPARC | ✅ | Processor architecture |
| **OS** | Linux, Windows | ✅ | Operating system |
| **vCPU Range** | Slider 0–320 | ✅ | Instance vCPU count |
| **Memory Range** | Slider 0–3200 GB | ✅ | Instance RAM |
| **Architecture** | x86, ARM | ✅ | CPU instruction set |
| **HA Mode** | Single AZ, Multi AZ | ✅ | Availability zone redundancy |
| **Pricing Model** | On-Demand, Spot/Preemptible | ✅ | Billing model |

---

## GPU Compute

| Filter | Options | Status | Notes |
|---|---|---|---|
| **Providers** | AWS, Azure, GCP, Oracle, DigitalOcean, Alibaba | ✅ | All hyperscalers |
| **Geographies** | N. America, S. America, W. Europe, N. Europe, Asia Pacific, Australia | ✅ | Mapped per provider |
| **GPU Models** | H100, A100 80GB, L4, H200, MI300X, RTX 6000 Ada, L40S, A10, V100, …(40+ models) | ✅ | GPU chip by model |
| **vCPU Range** | Slider 0–320 | ✅ | Instance vCPU count |
| **Memory Range** | Slider 0–3200 GB | ✅ | Instance RAM |
| **Architecture** | x86, ARM | ✅ | CPU instruction set |
| **OS** | Linux, Windows | ✅ | Operating system |
| **Pricing Model** | On-Demand, Spot/Preemptible | ✅ | Billing model |

---

## Databases

| Filter | Options | Status | Notes |
|---|---|---|---|
| **Providers** | AWS, Azure, GCP, Oracle, DigitalOcean, Alibaba, Pinecone, Milvus, Qdrant, Weaviate, Chroma | ✅ | Hyperscalers + vector DBs |
| **Geographies** | N. America, S. America, W. Europe, N. Europe, Asia Pacific, Australia | ✅ | Mapped per provider |
| **Database Engines** | PostgreSQL, MySQL, MariaDB, SQL Server, Oracle DB, Cosmos DB, MongoDB, Redis, Valkey, Db2, Pinecone, Milvus, Qdrant, Weaviate, Chroma, Bigtable, Firestore, DocumentDB, DynamoDB, Oracle NoSQL | ✅ | Database technology |
| **Deployment Type** | Provisioned, Serverless | ✅ | Resource allocation model |
| **HA Mode** | Single AZ, Multi AZ | ✅ | Availability zone redundancy (Multi Region / Geo Redundant removed — never written by pipelines) |
| **Architecture** | x86, ARM | ✅ | CPU instruction set |

---

## Serverless

| Filter | Options | Status | Notes |
|---|---|---|---|
| **Providers** | AWS, Azure, GCP, Oracle, DigitalOcean, Alibaba | ✅ | All hyperscalers |
| **Geographies** | N. America, S. America, W. Europe, N. Europe, Asia Pacific, Australia | ✅ | Mapped per provider |
| **Service Type** | Compute, Container | ✅ | Function compute (Lambda, Cloud Functions, Azure Functions) or container runtimes (Azure Container Apps). **Restored 2026-07-19**: AWS Lambda = Compute, Azure Container Apps = Container. |
| **Memory Size (Horizontal Scroll)** | 128 MB – 10 GB (varies by provider) | ✅ | Function memory tier |
| **Granularity** | Second, Hour, 100ms | ✅ | Billing granularity (100ms covers Cloudflare Workers, GCP Cloud Run sub-second) |
| **Language** | Python, Node, Go, Java, C#, Ruby, JavaScript, PHP, Rust, PowerShell, TypeScript, Any | ✅ | Supported runtime languages |
| **Architecture** | x86, ARM | ✅ | CPU instruction set (AWS Graviton support) |
| **Cold Start** | <100 ms, 100-200 ms, >200 ms | ✅ | Invocation latency |

---

## Containers

| Filter | Options | Status | Notes |
|---|---|---|---|
| **Providers** | AWS, Azure, GCP, Oracle, DigitalOcean, Alibaba | ✅ | All hyperscalers |
| **Geographies** | N. America, S. America, W. Europe, N. Europe, Asia Pacific, Australia | ✅ | Mapped per provider |
| **Orchestrator** | Kubernetes, Serverless | ✅ | Management model (Docker removed — never written by pipelines) |
| **Compute Type** | Serverless, Provisioned, Managed Kubernetes | ✅ | Deployment architecture |
| **Billing Granularity** | Second, Hour, 100ms | ✅ | Charging precision (100ms added for sub-second platforms like Cloud Run) |
| **Architecture** | x86, ARM | ✅ | CPU instruction set |

---

## Networking

| Filter | Options | Status | Notes |
|---|---|---|---|
| **Providers** | AWS, Azure, GCP, Oracle, DigitalOcean, Alibaba, Cloudflare | ✅ | Hyperscalers + Cloudflare |
| **Geographies** | N. America, S. America, W. Europe, N. Europe, Asia Pacific, Australia | ✅ | Mapped per provider |
| **Services** | Data Transfer, Content Delivery Network (CDN), Virtual Private Cloud (VPC), Load Balancing, Dedicated Connection, Public IPv4, NAT Gateway, VPN Gateway, API Gateway | ✅ | Networking service type |
| **Connection Type** | Multipoint, Point-to-Point, N/A | ✅ | Connection topology |
| **Routing Type** | Dynamic, Fixed, N/A | ✅ | Routing protocol |
| **HA Support** | Yes, No, N/A | ✅ | High availability option |
| **VPC Support** | Yes, No, N/A | ✅ | Virtual network support |
| **Transfer Direction** | Egress, Ingress, Intra-Cloud, N/A | ✅ | Data flow direction |
| **Port Capacity** | < 1 Gbps, 1 Gbps – 10 Gbps, N/A | ✅ | Link speed (> 10 Gbps removed — never written by pipelines) |
| **Transfer Scope** | Same Region, Cross-AZ, Cross-Region, Internet, On-Premises, N/A | ✅ | Geography of data transfer |
| **Billing Model** | Hourly Uptime, Data Processed (per GB), Per Endpoint/Tunnel, Included | ✅ | Charging model |
| **Usage Tier** | Flat Rate, First 10TB, 10TB – 50TB, Over 10TB, Over Allowance, Included, Unlimited, Unlimited (+$20/mo) | ✅ | Volume-based pricing (Unlimited tiers added for Cloudflare CDN) |

---

## Storage

| Filter | Options | Status | Notes |
|---|---|---|---|
| **Providers** | AWS, Azure, GCP, Oracle, DigitalOcean, Alibaba | ✅ | All hyperscalers |
| **Geographies** | N. America, S. America, W. Europe, N. Europe, Asia Pacific, Australia | ✅ | Mapped per provider |
| **Storage Type** | Object, Block, File, Archive | ✅ | Storage class |
| **Tier** | Standard, Infrequent, Cold, High Performance | ✅ | Access frequency tier (High Performance added for DigitalOcean Premium Block Storage) |
| **Redundancy** | Single-Zone, Zone-Redundant, Geo-Redundant | ✅ | Replication model |
| **Media** | SSD, HDD | ✅ | Physical storage type (**Fixed 2026-07-19**: filter was UI-side only, now wired to backend) |

---

## Data & Analytics

| Filter | Options | Status | Notes |
|---|---|---|---|
| **Providers** | AWS, Azure, GCP, Oracle, DigitalOcean, Alibaba | ✅ | All hyperscalers |
| **Geographies** | N. America, S. America, W. Europe, N. Europe, Asia Pacific, Australia | ✅ | With regional multipliers (1.00 – 1.32) |
| **Engines** | Databricks, Snowflake, BigQuery, Redshift, Synapse, Microsoft Fabric, Oracle Analytics Cloud, Oracle Autonomous Data Warehouse, OpenSearch, Kafka, ApsaraMQ for Kafka, Event Hubs, Kinesis Data Streams, OCI Streaming, Pub/Sub, MaxCompute, E-MapReduce, Hologres, AnalyticDB for MySQL | ✅ | Analytics/Warehouse engine. **Expanded 2026-07-19**: Added missing warehouse engines (BigQuery, Redshift, Synapse, Microsoft Fabric) and streaming engines; removed dead 'Native' option. |
| **Tier** | Standard, Standard Edition, Premium, Enterprise, Enterprise Edition, Enterprise Plus, Business Critical, DC2 Node, RA3 Node, On-Demand, Capacity F2, F4, F8, F16, F32, F64 | ✅ | Edition/SKU tier (Capacity F* tiers added for Microsoft Fabric) |
| **Deployment Type** | Serverless, Provisioned | ✅ | Resource allocation |

---

## AI

| Filter | Options | Status | Notes |
|---|---|---|---|
| **Providers** | AWS, Azure, GCP, Oracle, DigitalOcean, Alibaba, OpenAI, Anthropic | ✅ | Hyperscalers + model vendors |
| **Geographies** | N. America, S. America, W. Europe, N. Europe, Asia Pacific, Australia | ✅ | Mapped per provider |
| **Service Type** | Foundational Models, Embeddings | ✅ | Model category |
| **Model Tier** | Frontier, Standard, Efficient | ✅ | Model capability tier |
| **Multimodal** | Yes, No | ✅ | Vision/audio support |

---

## App Hosting

| Filter | Options | Status | Notes |
|---|---|---|---|
| **Providers** | AWS, Azure, GCP, Oracle, DigitalOcean, Alibaba, Cloudflare | ✅ | Hyperscalers + Cloudflare |
| **Geographies** | N. America, S. America, W. Europe, N. Europe, Asia Pacific, Australia | ✅ | Mapped per provider |
| **Tier** | Free, Basic, Standard, Premium, Professional | ✅ | Service tier |
| **Compute Type** | Shared, Dedicated, Serverless | ✅ | Resource allocation (Serverless added for Cloudflare Workers) |

---

## Integration

| Filter | Options | Status | Notes |
|---|---|---|---|
| **Providers** | AWS, Azure, GCP, Oracle, DigitalOcean, Alibaba | ✅ | All hyperscalers |
| **Geographies** | N. America, S. America, W. Europe, N. Europe, Asia Pacific, Australia | ✅ | Mapped per provider |
| **Service Type** | Messaging, Eventing, API Gateway, Workflow | ✅ | Integration service class |
| **Tier** | Standard, Premium, Consumption, FIFO, Basic | ✅ | Pricing tier (Basic added for DigitalOcean Managed Kafka) |
| **Billing Model** | usage, data, flat | ✅ | Charging model (usage-based per-op, data-based per-GB/TB, flat monthly) |

---

## Security

| Filter | Options | Status | Notes |
|---|---|---|---|
| **Providers** | AWS, Azure, GCP, Oracle, DigitalOcean, Alibaba, Cloudflare | ✅ | Hyperscalers + Cloudflare |
| **Geographies** | N. America, S. America, W. Europe, N. Europe, Asia Pacific, Australia | ✅ | Mapped per provider |
| **Service** | Web Application Firewall (WAF), Identity & Access Management (IAM), Key Management Service (KMS), DDoS Protection, Threat Detection, Bot Management, SSL/TLS Encryption, Zero Trust Network Access | ✅ | Security service type. **Fixed 2026-07-19**: Backend had zero handling for security product type; added SQL block. **Expanded**: Added Bot Management, SSL/TLS Encryption, Zero Trust Network Access (Cloudflare services that were priced but unfilterable). |

---

## Known Limitations

### Filters Removed (Never Written by Pipelines)
- **Database HA Modes**: `Zone Redundant`, `Multi Region`, `Geo Redundant` — only `Single AZ` and `Multi AZ` are ever written.
- **Containers Orchestrator**: `Docker` — only `Kubernetes` and `Serverless` actually exist in data.
- **Networking Port Capacity**: `> 10 Gbps` — instances max out at `1 Gbps – 10 Gbps` in live data.

### Filters Added (Real Data, Previously Unfilterable)
- **Storage Tier**: `High Performance` (DigitalOcean)
- **Networking Usage Tier**: `Unlimited`, `Unlimited (+$20/mo)` (Cloudflare CDN)
- **Containers Billing Granularity**: `100ms` (sub-second platforms like Cloud Run)
- **App Hosting Compute Type**: `Serverless` (Cloudflare Workers)
- **Integration Tier**: `Basic` (DigitalOcean Managed Kafka)
- **Data & Analytics Engines**: `BigQuery`, `Redshift`, `Synapse`, `Microsoft Fabric`, `ApsaraMQ for Kafka`, `Event Hubs`, `Kinesis Data Streams`, `OCI Streaming`, `Pub/Sub` (were written by pipelines but had no filter option)
- **Security Services**: `Bot Management`, `SSL/TLS Encryption`, `Zero Trust Network Access` (Cloudflare services)
- **Serverless Service Type**: `Container` (Azure Container Apps — was missing)

### Data Quality Notes
- **AI models catalog** (`src/config/ai_models.ts`) is hand-maintained; may lag as providers add/retire models.
- **GPU models** derived from instance-type naming, not provider pricing APIs. GCP, Alibaba, and DigitalOcean coverage is static config–backed (less comprehensive than AWS/Azure live APIs).
- **Integration services** under separate product category—not merged with Serverless despite historical naming overlap (see OPEN_DECISIONS.md).

---

## Debugging Filter Issues

### "No Data" When Filter Applied
1. Verify the filter option actually exists in live data:
   ```bash
   # Example: Check if "Frontier" AI models exist
   curl -s "https://comparecloudcosts.com/api/pricing?product=ai&pageSize=100" | grep -i "frontier"
   ```

2. Check if backend processes this filter:
   - Search `src/lib/api-utils.ts` for the product type in `buildPricingFilters()`
   - Verify the destructured parameter + SQL filter logic exists

3. Verify the constant matches what's in the database:
   - UI shows filter option from `src/config/index.ts` constants
   - SQL looks for that exact string in the database
   - Case sensitivity: most use `LOWER()` for insensitive matching

### Filter Option Not Appearing in UI
1. Check the constant is exported from `src/config/index.ts`
2. Verify FilterSidebar.tsx renders it for this product category
3. Rebuild: `npm run build` (Next.js may cache constants)

---

## References

- Filter state management: `src/app/page.tsx` (useState per filter)
- Filter UI component: `src/components/FilterSidebar.tsx` (renders options + toggles)
- Filter constant definitions: `src/config/index.ts` (all options per category)
- Backend filter logic: `src/lib/api-utils.ts` (SQL generation per product type)
- Live test endpoint: `https://comparecloudcosts.com/api/pricing?product=<category>`

---

**Audit Date**: 2026-07-19  
**Tested**: All 12 product categories via live `/api/pricing` endpoint  
**Verified Against**: 12,600+ live pricing records across 8 hyperscalers + 8 specialized providers
