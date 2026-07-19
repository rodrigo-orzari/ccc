# Product Category Completeness Audit
**Date:** July 19, 2026  
**Goal:** Identify missing services within each product category

---

## 1. COMPUTE ✅ (Likely Complete)
**Current:** VMs, GPUs, App Hosting

**What we might be missing:**
- Bare metal/dedicated hosts (AWS Dedicated Hosts, Azure Dedicated Hosts) — provisioned compute
- Capacity Reservations (AWS, Azure, GCP) — reserved capacity for on-demand instances
- **Risk Level:** MEDIUM — these are specialized but available

---

## 2. CONTAINERS ⚠️ (Recently Fixed)
**Current:** Orchestration (Kubernetes, Serverless), Registry

**What we might be missing:**
- Container Image Scanning/Vulnerability Scanning (Trivy integration, Snyk, etc.)
- Container Build services (AWS CodeBuild, Azure Container Registry Build, Google Cloud Build)
- **Risk Level:** LOW-MEDIUM — specialized, not core pricing

---

## 3. SERVERLESS ⚠️ (Potential Gaps)
**Current:** Functions, API Gateways, Message Queues, Event Buses, Workflows

**What we might be missing:**
- Serverless Databases (DynamoDB, Cosmos DB, Firestore, etc.) — **SHOULD THIS BE IN DATABASE?**
- Serverless SQL Query (AWS Athena is in Analytics, but Athena is queryable) — correct placement
- Serverless Search (Opensearch Serverless, Elasticsearch Serverless) — **MISSING?**
- Serverless Redis/Cache (ElastiCache Serverless)
- **Risk Level:** MEDIUM-HIGH — serverless databases are huge

---

## 4. DATABASE ⚠️ (Potential Gaps)
**Current:** Relational, NoSQL (MongoDB, DynamoDB, Cosmos), In-Memory (Redis, Memcached)

**What we might be missing:**
- Time-Series Databases (InfluxDB, TimescaleDB, Prometheus, etc.)
  - AWS: Timestream
  - Azure: Data Explorer
  - GCP: Cloud Bigtable (time-series use case)
  - **MISSING — these are rapidly growing**
- Graph Databases (Neptune, CosmosDB Gremlin API)
  - **MISSING**
- Search Engines (Elasticsearch, Opensearch, Solr)
  - AWS: Opensearch Service
  - Azure: Cognitive Search
  - GCP: Cloud Search
  - **MISSING**
- Vector Databases (pinecone, weaviate, milvus — cloud hosted versions)
  - Already have Vector Databases as a category but need to verify pricing is there
  - **PARTIAL — we have the category but verify pipeline coverage**
- Cassandra/columnar stores
  - **LIKELY IN NOSQL BUT VERIFY**
- **Risk Level:** HIGH — time-series and search are huge market segments

---

## 5. STORAGE ⚠️ (Potential Gaps)
**Current:** Object (S3, Blob, etc.), Block (EBS, Disks), File (EFS, Azure Files), Archive (Glacier, etc.)

**What we might be missing:**
- Data Transfer (egress costs) — **WHERE IS THIS?** (should be here, not Networking)
- CDN — currently in Networking, should it be split?
- Backup & Disaster Recovery services as first-class
  - AWS Backup
  - Azure Backup
  - Google Cloud Backup & DR
  - **MISSING**
- Data Lake services (S3, ADLS, etc. — might be under Storage or Analytics)
- **Risk Level:** MEDIUM — transfer costs are critical, backups are growing

---

## 6. DATA & ANALYTICS ⚠️ (Potential Gaps)
**Current:** Data Warehouse (Redshift, BigQuery, Synapse), Streaming (Kinesis, Event Hubs, Pub/Sub), ETL

**What we might be missing:**
- Data Catalog / Metadata Management
  - AWS Glue Data Catalog
  - Azure Purview
  - Google Cloud Data Catalog
  - **MISSING**
- Data Governance / Compliance tools
- BI & Visualization (Looker, Power BI, Tableau integrations)
  - **MISSING — but might be out of scope (3rd party)**
- Data Quality / Validation tools
- Notebooks / Collaborative Analytics
  - Databricks notebooks (we have Databricks but for compute, not notebooks)
  - **MISSING AS STANDALONE**
- **Risk Level:** MEDIUM — catalog/governance increasingly important

---

## 7. NETWORKING ⚠️ (Potential Gaps)
**Current:** LB, NAT Gateway, VPN, CDN, Data Transfer, Direct Connect

**What we might be missing:**
- Firewall Appliances (dedicated, not WAF)
  - AWS WAF is in Security, but Cloud Firewall (network layer) is different
  - Palo Alto, Fortinet, Cisco integrations
  - **MIGHT BE MISSING CLOUD FIREWALL (not WAF)**
- DNS / Route Management
  - Route 53, Azure DNS, Google Cloud DNS
  - **MISSING — critical for cost**
- DDoS Protection — currently in Security
  - **VERIFY: Should DDoS be split between Networking and Security?**
- Private Link / Peering services
  - **MISSING**
- **Risk Level:** MEDIUM — DNS especially is a gap

---

## 8. SECURITY ⚠️ (Recently Fixed + Gaps)
**Current:** WAF, IAM, KMS, Secrets Management (just added), DDoS, Threat Detection, Zero Trust (Cloudflare), SSL/TLS, Bot Management

**What we might be missing:**
- Certificate Management (AWS Certificate Manager, Azure Key Vault Certificates, Google Certificate Authority)
  - **MISSING — different from KMS**
- Compliance & Audit Services
  - AWS Config, Azure Policy, Google Cloud Audit
  - **MISSING**
- Vulnerability Scanning / Assessment
  - **MISSING**
- Security Hub / SIEM aggregation
  - AWS Security Hub
  - Azure Sentinel
  - **MISSING**
- Data Loss Prevention (DLP)
  - **MISSING**
- **Risk Level:** MEDIUM-HIGH — compliance is increasingly mandated

---

## 9. INTEGRATION ⚠️ (Potential Gaps)
**Current:** Message Queues, Pub-Sub, API Gateway, Workflows

**What we might be missing:**
- ESB (Enterprise Service Bus) / Legacy Integration
  - AWS MQ, Azure Service Bus (different from Event Hubs)
  - **MIGHT ALREADY BE COVERED UNDER MESSAGE QUEUES**
- Data Pipeline/ETL services (separate from Analytics)
  - Glue, Data Factory, Dataflow
  - **THESE ARE IN ANALYTICS — VERIFY CORRECT PLACEMENT**
- Webhook / Event delivery services
  - **PROBABLY IN API GATEWAY / WORKFLOWS**
- Notification Services (SNS, SendGrid integration)
  - **MIGHT BE IN PUB-SUB OR MISSING**
- **Risk Level:** LOW-MEDIUM

---

## 10. APP HOSTING ✅ (Likely Complete)
**Current:** PaaS (App Service, App Engine, Cloud Run on App Hosting)

**Note:** Containers/Serverless container platforms already covered separately

**What we might be missing:**
- Low-code/no-code platforms (Mendix, OutSystems, Power Apps)
  - **PROBABLY OUT OF SCOPE (3rd party)**
- **Risk Level:** LOW

---

## 11. AI/ML ⚠️ (Potential Gaps)
**Current:** LLM APIs (Claude, GPT-4, Gemini, Llama), Model Training

**What we might be missing:**
- Inference Endpoints (managed model serving, separate from training)
  - SageMaker Endpoints
  - Azure ML Endpoints
  - Vertex AI Endpoints
  - **MISSING**
- AutoML / Automated Machine Learning
  - AutoML Tables, Vertex AutoML
  - **MISSING**
- Feature Stores (managed feature repositories)
  - **MISSING**
- ML Data Labeling / Annotation services
  - SageMaker Ground Truth
  - **MISSING**
- Model Monitoring / Drift Detection
  - **MISSING**
- Embeddings / Vector APIs (separate from LLM inference)
  - **MIGHT BE DUPLICATE WITH VECTOR DATABASES**
- **Risk Level:** MEDIUM-HIGH — inference endpoints especially are a growing market

---

## 12. GPU ✅ (Recently Added & Complete)
**Current:** GPU accelerator instances with pricing

**Status:** COMPLETE

---

## Summary of High-Risk Gaps

| Severity | Category | Missing Service |
|----------|----------|------------------|
| **CRITICAL** | Database | Time-Series Databases (InfluxDB, Timestream, Data Explorer) |
| **CRITICAL** | Database | Graph Databases (Neptune, Gremlin) |
| **CRITICAL** | Database | Search Engines (Opensearch, Cognitive Search) |
| **CRITICAL** | Security | Certificate Management (ACM, Azure Key Vault Certs) |
| **HIGH** | AI/ML | Inference Endpoints (SageMaker, Vertex, Azure ML) |
| **HIGH** | Storage | Backup & Disaster Recovery services |
| **HIGH** | Networking | DNS / Route Management |
| **MEDIUM** | Security | Compliance & Audit (Config, Policy, Audit Logs) |
| **MEDIUM** | Serverless | Serverless Search (Opensearch Serverless) |
| **MEDIUM** | Data & Analytics | Data Catalog / Metadata |
| **MEDIUM** | Compute | Bare Metal / Dedicated Hosts |

---

## Implementation Status

✅ **COMPLETED (July 19, 2026):**
1. **Time-Series Databases** — 16 pricing entries across 6 providers
2. **Graph Databases** — 18 pricing entries across 6 providers
3. **Search Engines** — 19 pricing entries across 6 providers
4. **Certificate Management** — 17 pricing entries across 6 providers
5. **Inference Endpoints** — 16 pricing entries across 6 providers

**Total records added:** 86 pricing configurations

**Files created:**
- `src/services/time_series_pipeline.ts`
- `src/services/graph_database_pipeline.ts`
- `src/services/search_engine_pipeline.ts`
- `src/services/certificate_management_pipeline.ts`
- `src/services/inference_endpoints_pipeline.ts`

**Integration completed:**
- Added imports to `src/services/ingest.ts`
- Wired all 5 pipelines into main ingest flow
- Added documentation entries to `/docs/page.tsx` (13-17 in Data Dictionary)
- Updated CHANGELOG with all additions

## Remaining Action Plan

1. **High Priority:** Add Backup & Disaster Recovery, DNS / Route Management
2. **Medium Priority:** Compliance & Audit tools, Data Catalog services, Serverless Search
3. **Verify Coverage:** Vector Databases (pricing coverage), Bare Metal offerings
4. **Recommend Future Work:** Consider category reorganization (Network Security vs Data Security), Serverless consistency audit

---

## Notes for Next Audit Round

- Consider whether to split Security into sub-categories (Network Security vs. Data Security vs. Compliance)
- Consider whether to add a dedicated "Backup & Disaster Recovery" category
- Verify all "serverless" offerings across categories (serverless DB, serverless search, serverless analytics)
