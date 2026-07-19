import { WorkloadDefinition, WorkloadPriorities } from '@/types';
import {
  capacityScale, capacityNodes, capacitySize,
  perfComputeCategory, perfWantsCache,
  reliabilityReplicas, reliabilityWantsLoadBalancer, reliabilityWantsBackup,
  securityIncludes,
  computeReqs, dbReqs, storageReqs,
} from './workload_priorities';

// ─── Workloads, configured by Well-Architected intent ──────────────────────────
//
// Every component's getRequirements(p) reads the four universal priority sliders
// (capacity/performance/reliability/security) and composes the shared modifiers
// in workload_priorities.ts into a concrete requirement. Returning `null` drops
// the component from the architecture at the current levels (e.g. security
// add-ons appear only when Security is medium+). Cost is the OUTPUT.

// Normalised AI token consumption (per 1M tokens / month) driven by capacity.
const aiTokensQty = (p: WorkloadPriorities, share: number): number =>
  (100000 * capacityScale(p.capacity) * 2000 * share) / 1_000_000 / 730;

// Monthly data-egress volume (GB) driven by capacity — quantity for per-GB
// networking components (see the engine's per-GB branch).
const egressGb = (p: WorkloadPriorities, baseGb: number): number =>
  Math.round(baseGb * capacityScale(p.capacity));

// Managed-Kubernetes / container node fleet sizing (mirrors computeReqs but
// productType 'containers').
const containerNodes = (p: WorkloadPriorities, baseVcpus: number) => ({
  productType: 'containers' as const,
  minVcpus: Math.max(2, Math.round(baseVcpus * capacitySize(p.capacity))),
  minMemoryGb: Math.max(4, Math.round(baseVcpus * capacitySize(p.capacity) * 4)),
  quantity: Math.max(2, Math.round(capacityNodes(p.capacity) * reliabilityReplicas(p.reliability))),
});

export const WORKLOADS: WorkloadDefinition[] = [
  {
    id: 'rag-ai-app',
    name: 'RAG AI Application',
    description: 'A generative AI application using a Foundational Model connected to a Vector Database to search proprietary documents and return grounded answers.',
    icon: '🧠',
    capacityLabel: 'Query & Corpus Volume',
    components: [
      {
        id: 'document-storage', name: 'Document Storage', icon: '🪣',
        description: 'Source documents the corpus is built and embedded from',
        getRequirements: (p) => storageReqs(p, 25, { category: 'Object' }),
      },
      {
        id: 'api-orchestration', name: 'API & Orchestration', icon: '⚙️',
        description: 'Serverless compute to route queries and orchestrate LLM logic',
        getRequirements: () => ({ productType: 'serverless', category: 'Compute', quantity: 1 }),
      },
      {
        id: 'embeddings', name: 'Embeddings Model', icon: '🔢',
        description: 'Converts the incoming query into vector embeddings',
        getRequirements: (p) => ({ productType: 'ai', category: 'Embeddings', quantity: aiTokensQty(p, 0.2) }),
      },
      {
        id: 'vector-db', name: 'Vector Database (pgvector)', icon: '🗄️',
        description: 'Stores and searches document embeddings (Managed PostgreSQL)',
        getRequirements: (p) => dbReqs(p, 16, 'Relational'),
      },
      {
        id: 'llm', name: 'Foundational Model', icon: '💬',
        description: 'Generates the final response from query and retrieved context',
        getRequirements: (p) => ({ productType: 'ai', category: 'Foundational Models', quantity: aiTokensQty(p, 0.8) }),
      },
    ],
  },
  {
    id: 'serverless-web-app',
    name: 'Serverless Web Application',
    description: 'A scalable, low-maintenance backend without provisioning servers. Perfect for event-driven web and mobile backends.',
    icon: '⚡',
    capacityLabel: 'Request Volume',
    components: [
      {
        id: 'api-gateway', name: 'API Gateway / Routing', icon: '🚪',
        description: 'Entry point for requests',
        getRequirements: () => ({ productType: 'integration', category: 'API Gateway', quantity: 1 }),
      },
      {
        id: 'compute', name: 'Serverless Compute', icon: '⚙️',
        description: 'Event-driven code execution',
        getRequirements: () => ({ productType: 'serverless', category: 'Compute', quantity: 1 }),
      },
      {
        id: 'message-queue', name: 'Message Queue', icon: '📨',
        description: 'Decouples the API from compute — buffers requests for async processing',
        getRequirements: () => ({ productType: 'integration', category: 'Messaging', quantity: 1 }),
      },
      {
        id: 'database', name: 'Managed NoSQL', icon: '🗄️',
        description: 'High-throughput document store',
        getRequirements: (p) => dbReqs(p, 4, 'NoSQL'),
      },
      {
        id: 'asset-storage', name: 'Object Storage', icon: '🪣',
        description: 'User uploads, static assets, and files served by the backend',
        getRequirements: (p) => storageReqs(p, 50, { category: 'Object' }),
      },
    ],
  },
  {
    id: '3-tier-web',
    name: 'Classic 3-Tier Web Architecture',
    description: 'The foundational blueprint for monolithic or traditionally scaled web applications using VMs and relational databases. The deliberate minimal baseline.',
    icon: '🏢',
    capacityLabel: 'Concurrent Users',
    components: [
      {
        id: 'load-balancer', name: 'Load Balancer', icon: '⚖️',
        description: 'Distributes incoming traffic',
        getRequirements: () => ({ productType: 'networking', category: 'Load Balancer', quantity: 1 }),
      },
      {
        id: 'web-tier', name: 'Web / App Tier', icon: '🖥️',
        description: 'Auto-scaling Virtual Machines',
        getRequirements: (p) => computeReqs(p, 2, { redundant: true }),
      },
      {
        id: 'database', name: 'Relational Database', icon: '🗃️',
        description: 'Primary transactional datastore',
        getRequirements: (p) => dbReqs(p, 8, 'Relational'),
      },
      {
        id: 'nat-gateway', name: 'NAT Gateway', icon: '🌐',
        description: 'Outbound internet access for private tier instances',
        getRequirements: () => ({ productType: 'networking', category: 'NAT Gateway', quantity: 1 }),
      },
    ],
  },
  {
    id: 'streaming-analytics',
    name: 'Real-time Streaming Analytics',
    description: 'A highly demanded architecture for processing IoT telemetry, clickstreams, or financial data in real time.',
    icon: '🌊',
    capacityLabel: 'Ingestion Throughput',
    components: [
      {
        id: 'streaming', name: 'Event Streaming', icon: '📨',
        description: 'Message broker / streaming platform',
        getRequirements: (p) => ({ productType: 'data-analytics', category: 'Streaming', quantity: Math.max(1, Math.round(capacityScale(p.capacity))) }),
      },
      {
        id: 'compute', name: 'Stream Processing', icon: '🧠',
        description: 'Real-time compute nodes',
        getRequirements: (p) => computeReqs(p, 4, { redundant: true, category: 'Compute optimized' }),
      },
      {
        id: 'serving-db', name: 'Serving Store', icon: '🗄️',
        description: 'Low-latency store where processed results land for querying',
        getRequirements: (p) => dbReqs(p, 4, 'NoSQL'),
      },
      {
        id: 'storage', name: 'Object Storage', icon: '🪣',
        description: 'Long-term data lake',
        getRequirements: (p) => storageReqs(p, 1024, { category: 'Object' }),
      },
    ],
  },
  {
    id: 'ecommerce-microservices',
    name: 'E-Commerce Microservices Stack',
    description: 'A resilient, decoupled architecture designed for high availability, fast product lookups, and fault tolerance.',
    icon: '🛒',
    capacityLabel: 'Daily Visitors',
    components: [
      {
        id: 'load-balancer', name: 'Ingress / Load Balancer', icon: '⚖️',
        description: 'Fronts the microservices with a single entry point and traffic distribution',
        getRequirements: () => ({ productType: 'networking', category: 'Load Balancer', quantity: 1 }),
      },
      {
        id: 'waf', name: 'WAF & Bot Management', icon: '🛡️',
        description: 'Protects the storefront from malicious traffic and scraping',
        getRequirements: () => ({ productType: 'security', category: 'Network Security', quantity: 1 }),
      },
      {
        id: 'cdn', name: 'Content Delivery (CDN)', icon: '🌍',
        description: 'Global asset distribution for fast page loads',
        getRequirements: (p) => ({ productType: 'networking', category: 'Content Delivery Network (CDN)', quantity: egressGb(p, 5120) }),
      },
      {
        id: 'kubernetes', name: 'Managed Kubernetes', icon: '☸️',
        description: 'Container orchestration cluster',
        getRequirements: (p) => containerNodes(p, 4),
      },
      {
        id: 'container-registry', name: 'Container Registry', icon: '📦',
        description: 'Stores microservice container images securely',
        getRequirements: (p) => storageReqs(p, 50, { category: 'Object' }),
      },
      {
        id: 'cache', name: 'Distributed Cache', icon: '⚡',
        description: 'In-memory datastore for sessions and hot product lookups',
        getRequirements: (p) => dbReqs(p, 4, 'In-memory'),
      },
      {
        id: 'database', name: 'Transactional DB', icon: '🗃️',
        description: 'Primary persistent store',
        getRequirements: (p) => dbReqs(p, 8, 'Relational'),
      },
      {
        id: 'product-media', name: 'Product Image Storage', icon: '🪣',
        description: 'Object storage for product images and media across the catalog',
        getRequirements: (p) => storageReqs(p, 98, { category: 'Object' }),
      },
      {
        id: 'message-queue', name: 'Message Queue', icon: '📨',
        description: 'Async order & payment processing between services',
        getRequirements: () => ({ productType: 'integration', category: 'Messaging', quantity: 1 }),
      },
      {
        id: 'event-bus', name: 'Event Bus', icon: '📡',
        description: 'Fans "order-placed" events out to inventory, shipping, and analytics',
        getRequirements: () => ({ productType: 'integration', category: 'Eventing', quantity: 1 }),
      },
    ],
  },
  {
    id: 'ml-training-hosting',
    name: 'ML Training & Hosting',
    description: 'A pipeline for training machine-learning models on GPU clusters and serving them through a managed inference endpoint.',
    icon: '🤖',
    capacityLabel: 'Training Scale',
    components: [
      {
        id: 'workflow', name: 'Pipeline Orchestration', icon: '🔀',
        description: 'Coordinates the multi-stage training pipeline',
        getRequirements: () => ({ productType: 'integration', category: 'Workflow', quantity: 1 }),
      },
      {
        id: 'gpu-training', name: 'GPU Training Cluster', icon: '🔥',
        description: 'Accelerated compute for model training',
        getRequirements: (p) => ({ productType: 'vm', category: 'GPU instance', quantity: Math.max(1, Math.round(capacityNodes(p.capacity))) }),
      },
      {
        id: 'storage', name: 'Dataset Storage', icon: '📁',
        description: 'High-throughput storage for training datasets and checkpoints',
        getRequirements: (p) => storageReqs(p, 500, { category: 'File' }),
      },
      {
        id: 'inference', name: 'Inference Endpoint', icon: '🧠',
        description: 'Serves the trained model',
        getRequirements: () => ({ productType: 'ai', category: 'Inference', quantity: 1 }),
      },
    ],
  },
  {
    id: 'k8s-app-platform',
    name: 'Kubernetes App Platform',
    description: 'A general-purpose container platform for running microservices and stateful applications on managed Kubernetes.',
    icon: '☸️',
    capacityLabel: 'Cluster Scale',
    components: [
      {
        id: 'kubernetes', name: 'Managed Kubernetes', icon: '☸️',
        description: 'Container orchestration node pool',
        getRequirements: (p) => containerNodes(p, 4),
      },
      {
        id: 'container-registry', name: 'Container Registry', icon: '📦',
        description: 'Private registry for application container images',
        getRequirements: (p) => storageReqs(p, 100, { category: 'Object' }),
      },
      {
        id: 'block-storage', name: 'Persistent Volumes', icon: '💾',
        description: 'Block storage for stateful workloads',
        getRequirements: (p) => storageReqs(p, 100, { category: 'Block' }),
      },
      {
        id: 'database', name: 'Relational Database', icon: '🗃️',
        description: 'Managed backing database',
        getRequirements: (p) => dbReqs(p, 8, 'Relational'),
      },
      {
        id: 'load-balancer', name: 'Load Balancer', icon: '⚖️',
        description: 'Ingress traffic distribution',
        getRequirements: () => ({ productType: 'networking', category: 'Load Balancer', quantity: 1 }),
      },
    ],
  },
  {
    id: 'hpc-scientific',
    name: 'HPC / Scientific Computing',
    description: 'A high-performance computing cluster for simulations, modeling, and batch scientific workloads.',
    icon: '🔬',
    capacityLabel: 'Cluster Size',
    components: [
      {
        id: 'head-node', name: 'Head / Scheduler Node', icon: '🖥️',
        description: 'Job scheduler and cluster controller',
        getRequirements: (p) => ({ ...computeReqs(p, 4), quantity: 1 }),
      },
      {
        id: 'compute-nodes', name: 'Compute Nodes', icon: '⚡',
        description: 'Parallel compute-optimized worker fleet',
        getRequirements: (p) => ({ productType: 'vm', category: 'Compute optimized', minVcpus: Math.max(8, Math.round(8 * capacitySize(p.capacity))), quantity: Math.max(2, Math.round(capacityScale(p.capacity) * 2)) }),
      },
      {
        id: 'scratch-storage', name: 'Scratch Storage', icon: '📁',
        description: 'High-throughput parallel file system for active jobs',
        getRequirements: (p) => storageReqs(p, 500, { category: 'File' }),
      },
      {
        id: 'archive-storage', name: 'Results Archive', icon: '🪣',
        description: 'Long-term object storage for results',
        getRequirements: (p) => storageReqs(p, 1024, { category: 'Object' }),
      },
      {
        id: 'dedicated-connection', name: 'Dedicated Connection', icon: '🔌',
        description: 'High-bandwidth private link for uploading large scientific datasets',
        getRequirements: () => ({ productType: 'networking', category: 'Dedicated Connection', quantity: 1 }),
      },
    ],
  },
  {
    id: 'saas-paas-app',
    name: 'SaaS on Managed Platform',
    description: 'A multi-tenant SaaS product running on a managed application platform (PaaS) with a relational backend.',
    icon: '🚀',
    capacityLabel: 'Tenant Scale',
    components: [
      {
        id: 'app-hosting', name: 'Managed App Hosting', icon: '🚀',
        description: 'Platform-as-a-Service application tier',
        getRequirements: (p) => ({ productType: 'app-hosting', quantity: Math.max(1, Math.round(capacityNodes(p.capacity) * reliabilityReplicas(p.reliability))) }),
      },
      {
        id: 'ddos-protection', name: 'DDoS Protection', icon: '🛡️',
        description: 'Shields the multi-tenant SaaS application from volumetric attacks',
        getRequirements: () => ({ productType: 'security', category: 'Network Security', quantity: 1 }),
      },
      {
        id: 'database', name: 'Relational Database', icon: '🗃️',
        description: 'Primary tenant datastore',
        getRequirements: (p) => dbReqs(p, 8, 'Relational'),
      },
      {
        id: 'storage', name: 'Object Storage', icon: '🪣',
        description: 'Tenant assets and uploads',
        getRequirements: (p) => storageReqs(p, 50, { category: 'Object' }),
      },
    ],
  },
  {
    id: 'data-warehouse-bi',
    name: 'Data Warehouse & BI',
    description: 'A cloud data warehouse feeding business-intelligence dashboards, fed by an ETL pipeline.',
    icon: '📊',
    capacityLabel: 'Data Volume',
    components: [
      {
        id: 'etl-orchestration', name: 'ETL Orchestration', icon: '🔀',
        description: 'Coordinates extract-transform-load jobs into the warehouse',
        getRequirements: () => ({ productType: 'integration', category: 'Workflow', quantity: 1 }),
      },
      {
        id: 'warehouse', name: 'Data Warehouse', icon: '🗄️',
        description: 'Columnar analytics warehouse',
        getRequirements: (p) => ({ productType: 'data-analytics', category: 'Warehouse', quantity: Math.max(1, Math.round(capacityScale(p.capacity))) }),
      },
      {
        id: 'storage', name: 'Staging Storage', icon: '🪣',
        description: 'Object storage staging area / data lake',
        getRequirements: (p) => storageReqs(p, 1024, { category: 'Object' }),
      },
      {
        id: 'bi-compute', name: 'BI / Query Tier', icon: '📈',
        description: 'Compute for BI dashboards and ad-hoc queries',
        getRequirements: (p) => computeReqs(p, 4),
      },
    ],
  },
  {
    id: 'disaster-recovery',
    name: 'Disaster Recovery (Warm Standby)',
    description: 'A cross-region warm-standby environment that can take over if the primary region fails.',
    icon: '🛟',
    capacityLabel: 'Protected Footprint',
    components: [
      {
        id: 'standby-compute', name: 'Standby Compute', icon: '🖥️',
        description: 'Scaled-down replica of the production compute tier',
        getRequirements: (p) => computeReqs(p, 2, { redundant: true }),
      },
      {
        id: 'database', name: 'Replicated Database', icon: '🗃️',
        description: 'Cross-region database replica',
        getRequirements: (p) => dbReqs(p, 8, 'Relational'),
      },
      {
        id: 'backup-storage', name: 'Backup Storage', icon: '🪣',
        description: 'Object storage for snapshots and backups',
        getRequirements: (p) => storageReqs(p, 500, { category: 'Object' }),
      },
      {
        id: 'dns-failover', name: 'DNS / Load Balancer Failover', icon: '⚖️',
        description: 'Traffic failover to the standby region',
        getRequirements: () => ({ productType: 'networking', category: 'Load Balancer', quantity: 1 }),
      },
    ],
  },
  {
    id: 'content-media-platform',
    name: 'Content & Media Platform',
    description: 'A video/media platform that transcodes uploads and delivers content globally through a CDN.',
    icon: '🎬',
    capacityLabel: 'Monthly Viewers',
    components: [
      {
        id: 'cdn', name: 'Content Delivery (CDN)', icon: '🌐',
        description: 'Global edge delivery of media — priced on monthly egress volume',
        getRequirements: (p) => ({ productType: 'networking', category: 'Internet Egress', quantity: egressGb(p, 10240) }),
      },
      {
        id: 'transcode', name: 'Transcoding Compute', icon: '🎞️',
        description: 'Compute-optimized fleet for media transcoding',
        getRequirements: (p) => computeReqs(p, 4, { redundant: true, category: 'Compute optimized' }),
      },
      {
        id: 'storage', name: 'Media Storage', icon: '🪣',
        description: 'Object storage for source and transcoded media',
        getRequirements: (p) => storageReqs(p, 1024, { category: 'Object' }),
      },
      {
        id: 'metadata-db', name: 'Metadata DB', icon: '🗄️',
        description: 'Catalog and playback metadata',
        getRequirements: (p) => dbReqs(p, 4, 'NoSQL'),
      },
      {
        id: 'load-balancer', name: 'Load Balancer', icon: '⚖️',
        description: 'Distributes API/control-plane traffic',
        getRequirements: () => ({ productType: 'networking', category: 'Load Balancer', quantity: 1 }),
      },
    ],
  },
  {
    id: 'compliance-ready-web-app',
    name: 'Compliance-Ready Web Application',
    description: 'A 3-tier web app hardened with managed security services for teams in regulated industries handling sensitive data. Security add-ons scale with the Security slider.',
    icon: '🛡️',
    capacityLabel: 'Concurrent Users',
    components: [
      {
        id: 'load-balancer', name: 'Load Balancer', icon: '⚖️',
        description: 'Distributes incoming traffic',
        getRequirements: () => ({ productType: 'networking', category: 'Load Balancer', quantity: 1 }),
      },
      {
        id: 'web-tier', name: 'Web / App Tier', icon: '🖥️',
        description: 'Auto-scaling Virtual Machines',
        getRequirements: (p) => computeReqs(p, 2, { redundant: true }),
      },
      {
        id: 'database', name: 'Relational Database', icon: '🗃️',
        description: 'Primary transactional datastore',
        getRequirements: (p) => dbReqs(p, 8, 'Relational'),
      },
      {
        id: 'waf', name: 'Web Application Firewall', icon: '🧱',
        description: 'Filters malicious traffic at the edge (Security ≥ medium)',
        getRequirements: (p) => securityIncludes(p.security, 'waf') ? ({ productType: 'security', category: 'Network Security', quantity: 1 }) : null,
      },
      {
        id: 'kms', name: 'Key Management & Encryption', icon: '🔐',
        description: 'Manages encryption keys for data at rest (Security ≥ medium)',
        getRequirements: (p) => securityIncludes(p.security, 'kms') ? ({ productType: 'security', category: 'Identity & Encryption', quantity: 1 }) : null,
      },
      {
        id: 'threat-detection', name: 'Threat Detection & Monitoring', icon: '🚨',
        description: 'Continuous monitoring for compliance and anomalies (Security = high)',
        getRequirements: (p) => securityIncludes(p.security, 'threat') ? ({ productType: 'security', category: 'Threat & Compliance', quantity: 1 }) : null,
      },
      {
        id: 'audit-archive', name: 'Audit Log Archive', icon: '🪣',
        description: 'Immutable (WORM) object storage for retained audit logs',
        getRequirements: (p) => storageReqs(p, 250, { category: 'Object' }),
      },
    ],
  },
  {
    id: 'rag-ai-knowledge-base',
    name: 'RAG AI Knowledge Base',
    description: 'A retrieval-augmented generation pipeline for AI chat and search — document storage, a metadata store, an API layer, embeddings, orchestration, and a managed inference endpoint.',
    icon: '🧠',
    capacityLabel: 'Corpus & Query Volume',
    components: [
      {
        id: 'document-storage', name: 'Document Storage', icon: '🪣',
        description: 'Source documents and embeddings archive',
        getRequirements: (p) => storageReqs(p, 25, { category: 'Object' }),
      },
      {
        id: 'api-compute', name: 'API & Orchestration Compute', icon: '⚙️',
        description: 'Serverless compute serving the retrieval/generation API',
        getRequirements: () => ({ productType: 'serverless', category: 'Compute', quantity: 1 }),
      },
      {
        id: 'embeddings', name: 'Embeddings Model', icon: '🔢',
        description: 'Embeds incoming queries and ingested documents',
        getRequirements: (p) => ({ productType: 'ai', category: 'Embeddings', quantity: aiTokensQty(p, 0.3) }),
      },
      {
        id: 'metadata-store', name: 'Embedding / Metadata Store', icon: '🗄️',
        description: 'Indexes embeddings and document metadata',
        getRequirements: (p) => dbReqs(p, 4, 'NoSQL'),
      },
      {
        id: 'orchestration', name: 'Workflow Orchestration', icon: '🔀',
        description: 'Coordinates retrieval and prompt assembly across steps',
        getRequirements: () => ({ productType: 'integration', category: 'Workflow', quantity: 1 }),
      },
      {
        id: 'inference', name: 'Inference Endpoint', icon: '✨',
        description: 'Generates responses from retrieved context',
        getRequirements: () => ({ productType: 'ai', category: 'Inference', quantity: 1 }),
      },
    ],
  },
  {
    id: 'smart-manufacturing',
    name: 'Smart Manufacturing (IIoT)',
    description: 'An Industrial IoT (IIoT) platform for real-time sensor analytics — edge collection, stream ingestion, live metrics storage, historical analytics, and predictive maintenance.',
    icon: '🏭',
    capacityLabel: 'Sensor Fleet',
    components: [
      {
        id: 'edge-compute', name: 'Edge Gateway / Local Compute', icon: '🖥️',
        description: 'On-prem/edge collection and buffering',
        getRequirements: (p) => computeReqs(p, 2),
      },
      {
        id: 'ingest-compute', name: 'Stream Ingestion', icon: '⚡',
        description: 'Serverless ingestion of sensor telemetry',
        getRequirements: () => ({ productType: 'serverless', category: 'Compute', quantity: 1 }),
      },
      {
        id: 'event-bus', name: 'Event Bus', icon: '📡',
        description: 'Fans telemetry to storage, analytics, and alerting',
        getRequirements: () => ({ productType: 'integration', category: 'Eventing', quantity: 1 }),
      },
      {
        id: 'timeseries-db', name: 'Time-Series Store', icon: '🗄️',
        description: 'Live metrics and sensor state',
        getRequirements: (p) => dbReqs(p, 4, 'NoSQL'),
      },
      {
        id: 'analytics', name: 'Historical Analytics', icon: '📊',
        description: 'Warehouse for historical sensor analytics',
        getRequirements: (p) => ({ productType: 'data-analytics', category: 'Warehouse', quantity: Math.max(1, Math.round(capacityScale(p.capacity))) }),
      },
      {
        id: 'storage', name: 'Raw Data Lake', icon: '🪣',
        description: 'Object storage for raw telemetry',
        getRequirements: (p) => storageReqs(p, 500, { category: 'Object' }),
      },
      {
        id: 'predictive-ai', name: 'Predictive Maintenance', icon: '✨',
        description: 'ML inference for anomaly / failure prediction',
        getRequirements: () => ({ productType: 'ai', category: 'Inference', quantity: 1 }),
      },
    ],
  },
  {
    id: 'event-driven-image-processing',
    name: 'Event-Driven Image Processing',
    description: 'An event-driven architecture that processes uploaded images (e.g., ID verification, insurance claims) by triggering serverless functions to run AI vision models and store the extracted metadata.',
    icon: '🖼️',
    capacityLabel: 'Processed Images / Documents',
    components: [
      {
        id: 'raw-storage', name: 'Raw Storage', icon: '🪣',
        description: 'Landing bucket for raw user uploads from mobile/web',
        getRequirements: (p) => storageReqs(p, 50, { category: 'Object' }),
      },
      {
        id: 'event-trigger', name: 'Event Trigger', icon: '📡',
        description: 'Captures the upload event and routes it asynchronously',
        getRequirements: () => ({ productType: 'integration', category: 'Eventing', quantity: 1 }),
      },
      {
        id: 'compute', name: 'Serverless Compute', icon: '⚙️',
        description: 'Executes the business logic and orchestrates the AI call',
        getRequirements: () => ({ productType: 'serverless', category: 'Compute', quantity: 1 }),
      },
      {
        id: 'vision-ai', name: 'Vision AI', icon: '👁️',
        description: 'Multimodal AI model that performs OCR, analyzes the image, and extracts required information',
        getRequirements: (p) => ({ productType: 'ai', category: 'Foundational Models', quantity: aiTokensQty(p, 0.5) }),
      },
      {
        id: 'metadata-db', name: 'Metadata DB', icon: '🗄️',
        description: 'Stores the extracted metadata and processing results',
        getRequirements: (p) => dbReqs(p, 4, 'NoSQL'),
      },
    ],
  },
  {
    id: 'hybrid-cloud-network',
    name: 'Hybrid Cloud Network Backbone',
    description: 'A robust networking architecture connecting on-premises data centers to cloud resources via dedicated connections and secure gateways.',
    icon: '🌐',
    capacityLabel: 'Network Throughput',
    components: [
      {
        id: 'vpc', name: 'Virtual Private Cloud (VPC)', icon: '☁️',
        description: 'Isolated private network for cloud resources',
        getRequirements: () => ({ productType: 'networking', category: 'Virtual Private Cloud (VPC)', quantity: 1 }),
      },
      {
        id: 'vpn-gateway', name: 'VPN Gateway', icon: '🔐',
        description: 'Secure site-to-site IPsec tunnels',
        getRequirements: () => ({ productType: 'networking', category: 'VPN Gateway', quantity: 1 }),
      },
      {
        id: 'dedicated-connection', name: 'Dedicated Connection', icon: '🔌',
        description: 'High-speed, dedicated on-premises link',
        getRequirements: () => ({ productType: 'networking', category: 'Dedicated Connection', quantity: 1 }),
      },
      {
        id: 'nat-gateway', name: 'NAT Gateway', icon: '🌍',
        description: 'Outbound internet access for private subnets',
        getRequirements: () => ({ productType: 'networking', category: 'NAT Gateway', quantity: 1 }),
      },
      {
        id: 'network-security', name: 'Network Security', icon: '🛡️',
        description: 'Perimeter firewall and threat protection',
        getRequirements: () => ({ productType: 'security', category: 'Network Security', quantity: 1 }),
      },
    ],
  },
  {
    id: 'zero-trust-edge',
    name: 'Zero-Trust Enterprise Edge',
    description: 'A secure, global entry point that strictly authenticates all users and devices, mitigating bots and edge threats before traffic hits the application.',
    icon: '🛂',
    capacityLabel: 'Monthly Edge Requests',
    components: [
      {
        id: 'cdn', name: 'Content Delivery (CDN)', icon: '🌍',
        description: 'Global edge delivery network',
        getRequirements: (p) => ({ productType: 'networking', category: 'Content Delivery Network (CDN)', quantity: egressGb(p, 10240) }),
      },
      {
        id: 'ztna', name: 'Zero Trust Network Access', icon: '🚪',
        description: 'Identity-aware application access',
        getRequirements: () => ({ productType: 'security', category: 'Network Security', quantity: 1 }),
      },
      {
        id: 'iam', name: 'Identity & Access (IAM)', icon: '🔑',
        description: 'User authentication and authorization directory',
        getRequirements: () => ({ productType: 'security', category: 'Identity & Encryption', quantity: 1 }),
      },
      {
        id: 'bot-management', name: 'Bot Management', icon: '🤖',
        description: 'Malicious bot mitigation at the edge',
        getRequirements: () => ({ productType: 'security', category: 'Network Security', quantity: 1 }),
      },
      {
        id: 'ssl-tls', name: 'SSL/TLS Encryption', icon: '🔒',
        description: 'Edge certificate management',
        getRequirements: () => ({ productType: 'security', category: 'Identity & Encryption', quantity: 1 }),
      },
    ],
  },
  {
    id: 'event-driven-api',
    name: 'Event-Driven API Backend',
    description: 'An agile, fully serverless microservices backend combining managed API gateways, message queues, and rapid cache lookups.',
    icon: '⚡',
    capacityLabel: 'API Request Volume',
    components: [
      {
        id: 'api-gateway', name: 'API Gateway', icon: '🚪',
        description: 'Managed REST/GraphQL endpoint router',
        getRequirements: () => ({ productType: 'integration', category: 'API Gateway', quantity: 1 }),
      },
      {
        id: 'serverless-compute', name: 'Serverless Compute', icon: '⚙️',
        description: 'Event-driven functions executing business logic',
        getRequirements: () => ({ productType: 'serverless', category: 'Compute', quantity: 1 }),
      },
      {
        id: 'messaging', name: 'Message Queue', icon: '📨',
        description: 'Asynchronous task queuing',
        getRequirements: () => ({ productType: 'integration', category: 'Messaging', quantity: 1 }),
      },
      {
        id: 'distributed-cache', name: 'Distributed Cache', icon: '💨',
        description: 'Low-latency in-memory data store for fast lookups',
        getRequirements: (p) => dbReqs(p, 2, 'In-memory'),
      },
      {
        id: 'nosql-db', name: 'NoSQL Database', icon: '🗄️',
        description: 'Flexible document storage for user data',
        getRequirements: (p) => dbReqs(p, 4, 'NoSQL'),
      },
    ],
  },
];
