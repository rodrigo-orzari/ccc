import { WorkloadDefinition } from '@/types';

export const WORKLOADS: WorkloadDefinition[] = [
  {
    id: 'rag-ai-app',
    name: 'RAG AI Application',
    description: 'A generative AI application using a Foundational Model connected to a Vector Database to search proprietary documents and return grounded answers.',
    icon: '🧠',
    parameters: [
      {
        id: 'monthlyQueries',
        label: 'Monthly User Queries',
        type: 'slider',
        min: 10000,
        max: 1000000,
        step: 10000,
        defaultValue: 100000,
        unit: 'queries'
      },
      {
        id: 'tokensPerQuery',
        label: 'Tokens per Query',
        type: 'slider',
        min: 500,
        max: 10000,
        step: 500,
        defaultValue: 2000,
        unit: 'tokens'
      },
      {
        id: 'dbMemoryGb',
        label: 'Vector DB Memory',
        type: 'slider',
        min: 4,
        max: 128,
        step: 4,
        defaultValue: 16,
        unit: 'GB'
      },
      {
        id: 'corpusSizeGB',
        label: 'Document Corpus Size',
        type: 'slider',
        min: 1,
        max: 500,
        step: 1,
        defaultValue: 25,
        unit: 'GB'
      }
    ],
    components: [
      {
        id: 'document-storage',
        name: 'Document Storage',
        description: 'Source documents the corpus is built and embedded from',
        icon: '🪣',
        getRequirements: (params) => {
          return {
            productType: 'storage',
            category: 'Object',
            quantity: params.corpusSizeGB
          };
        }
      },
      {
        id: 'api-gateway',
        name: 'API & Orchestration',
        description: 'Serverless compute to route queries and orchestrate LLM logic',
        icon: '⚙️',
        getRequirements: () => {
          return {
            productType: 'serverless',
            category: 'Compute',
            quantity: 1
          };
        }
      },
      {
        id: 'embeddings',
        name: 'Embeddings Model',
        description: 'Converts the incoming query into vector embeddings',
        icon: '🔢',
        getRequirements: (params) => {
          const embeddingTokens = (params.monthlyQueries * (params.tokensPerQuery * 0.2)) / 1000000;
          return {
            productType: 'ai',
            category: 'Embeddings',
            quantity: embeddingTokens / 730
          };
        }
      },
      {
        id: 'vector-db',
        name: 'Vector Database (pgvector)',
        description: 'Stores and searches document embeddings (Managed PostgreSQL)',
        icon: '🗄️',
        getRequirements: (params) => {
          return {
            productType: 'database',
            category: 'Relational',
            minMemoryGb: params.dbMemoryGb,
            quantity: 1
          };
        }
      },
      {
        id: 'llm',
        name: 'Foundational Model',
        description: 'Generates the final response based on query and retrieved context',
        icon: '💬',
        getRequirements: (params) => {
          const llmTokens = (params.monthlyQueries * (params.tokensPerQuery * 0.8)) / 1000000;
          return {
            productType: 'ai',
            category: 'Foundational Models',
            quantity: llmTokens / 730
          };
        }
      }
    ]
  },
  {
    id: 'serverless-web-app',
    name: 'Serverless Web Application',
    description: 'A scalable, low-maintenance backend without provisioning servers. Perfect for event-driven web and mobile backends.',
    icon: '⚡',
    parameters: [
      {
        id: 'monthlyRequests',
        label: 'Monthly API Requests',
        type: 'slider',
        min: 100000,
        max: 10000000,
        step: 100000,
        defaultValue: 1000000,
        unit: 'reqs'
      },
      {
        id: 'dbSizeGB',
        label: 'Database Storage',
        type: 'slider',
        min: 10,
        max: 500,
        step: 10,
        defaultValue: 50,
        unit: 'GB'
      }
    ],
    components: [
      {
        id: 'api-gateway',
        name: 'API Gateway / Routing',
        description: 'Entry point for requests',
        icon: '🚪',
        getRequirements: (params) => {
          return {
            productType: 'integration',
            category: 'API Gateway',
            quantity: 1
          };
        }
      },
      {
        id: 'compute',
        name: 'Serverless Compute',
        description: 'Event-driven code execution',
        icon: '⚙️',
        getRequirements: (params) => {
          return {
            productType: 'serverless',
            category: 'Compute',
            quantity: 1
          };
        }
      },
      {
        id: 'message-queue',
        name: 'Message Queue',
        description: 'Decouples the API from compute — buffers requests for async processing',
        icon: '📨',
        getRequirements: () => ({
          productType: 'integration',
          category: 'Messaging',
          quantity: 1
        })
      },
      {
        id: 'database',
        name: 'Managed NoSQL',
        description: 'High-throughput document store',
        icon: '🗄️',
        getRequirements: (params) => {
          return {
            productType: 'database',
            category: 'NoSQL',
            minMemoryGb: 4, // Approximating tier based on memory
            quantity: 1
          };
        }
      },
      {
        id: 'asset-storage',
        name: 'Object Storage',
        description: 'User uploads, static assets, and files served by the backend',
        icon: '🪣',
        getRequirements: (params) => {
          // Asset/upload footprint scales roughly with the app's data size;
          // reuse dbSizeGB as the proxy rather than adding another slider.
          return {
            productType: 'storage',
            category: 'Object',
            quantity: params.dbSizeGB
          };
        }
      }
    ]
  },
  {
    id: '3-tier-web',
    name: 'Classic 3-Tier Web Architecture',
    description: 'The foundational blueprint for monolithic or traditionally scaled web applications using VMs and relational databases.',
    icon: '🏢',
    parameters: [
      {
        id: 'concurrentUsers',
        label: 'Peak Concurrent Users',
        type: 'slider',
        min: 100,
        max: 10000,
        step: 100,
        defaultValue: 1000,
        unit: 'users'
      },
      {
        id: 'dbSizeGB',
        label: 'Database Storage',
        type: 'slider',
        min: 50,
        max: 2000,
        step: 50,
        defaultValue: 250,
        unit: 'GB'
      }
    ],
    components: [
      {
        id: 'load-balancer',
        name: 'Load Balancer',
        description: 'Distributes incoming traffic',
        icon: '⚖️',
        getRequirements: (params) => {
          return {
            productType: 'networking',
            category: 'Load Balancer',
            quantity: 1
          };
        }
      },
      {
        id: 'web-tier',
        name: 'Web / App Tier',
        description: 'Auto-scaling Virtual Machines',
        icon: '🖥️',
        getRequirements: (params) => {
          const loadFactor = Math.max(2, Math.ceil(params.concurrentUsers / 500));
          return {
            productType: 'vm',
            category: 'General purpose',
            minVcpus: 2,
            minMemoryGb: 8,
            quantity: loadFactor
          };
        }
      },
      {
        id: 'database',
        name: 'Relational Database',
        description: 'Primary transactional datastore',
        icon: '🗃️',
        getRequirements: (params) => {
          const mem = Math.max(8, Math.ceil(params.concurrentUsers / 250) * 4);
          return {
            productType: 'database',
            category: 'Relational',
            minMemoryGb: mem,
            quantity: 1
          };
        }
      }
    ]
  },
  {
    id: 'streaming-analytics',
    name: 'Real-time Streaming Analytics',
    description: 'A highly demanded architecture for processing IoT telemetry, clickstreams, or financial data in real time.',
    icon: '🌊',
    parameters: [
      {
        id: 'throughputMB',
        label: 'Ingestion Throughput',
        type: 'slider',
        min: 1,
        max: 100,
        step: 1,
        defaultValue: 10,
        unit: 'MB/s'
      },
      {
        id: 'storageTB',
        label: 'Data Lake Size',
        type: 'slider',
        min: 1,
        max: 100,
        step: 1,
        defaultValue: 10,
        unit: 'TB'
      }
    ],
    components: [
      {
        id: 'streaming',
        name: 'Event Streaming',
        description: 'Message broker / streaming platform',
        icon: '📨',
        getRequirements: (params) => {
          return {
            productType: 'data-analytics',
            category: 'Streaming',
            quantity: 1
          };
        }
      },
      {
        id: 'compute',
        name: 'Stream Processing',
        description: 'Real-time compute nodes',
        icon: '🧠',
        getRequirements: (params) => {
          const vcpus = Math.max(4, Math.ceil(params.throughputMB / 5) * 2);
          return {
            productType: 'vm',
            category: 'Compute optimized',
            minVcpus: vcpus,
            minMemoryGb: vcpus * 2,
            quantity: 3 // Typically a cluster
          };
        }
      },
      {
        id: 'storage',
        name: 'Object Storage',
        description: 'Long-term data lake',
        icon: '🪣',
        getRequirements: (params) => {
          return {
            productType: 'storage',
            category: 'Object',
            quantity: params.storageTB * 1024 // Assuming price is per GB
          };
        }
      }
    ]
  },
  {
    id: 'ecommerce-microservices',
    name: 'E-Commerce Microservices Stack',
    description: 'A resilient, decoupled architecture designed for high availability, fast product lookups, and fault tolerance.',
    icon: '🛒',
    parameters: [
      {
        id: 'dailyTraffic',
        label: 'Daily Unique Visitors',
        type: 'slider',
        min: 5000,
        max: 500000,
        step: 5000,
        defaultValue: 50000,
        unit: 'visitors'
      },
      {
        id: 'catalogSize',
        label: 'Product Catalog Size',
        type: 'slider',
        min: 1000,
        max: 1000000,
        step: 10000,
        defaultValue: 50000,
        unit: 'items'
      }
    ],
    components: [
      {
        id: 'kubernetes',
        name: 'Managed Kubernetes',
        description: 'Container orchestration cluster',
        icon: '☸️',
        getRequirements: (params) => {
          const nodes = Math.max(3, Math.ceil(params.dailyTraffic / 20000));
          return {
            productType: 'containers',
            minVcpus: 4,
            minMemoryGb: 16,
            quantity: nodes
          };
        }
      },
      {
        id: 'cache',
        name: 'Distributed Cache',
        description: 'In-memory datastore for sessions',
        icon: '⚡',
        getRequirements: (params) => {
          return {
            productType: 'database',
            category: 'In-memory',
            minMemoryGb: 4,
            quantity: 1
          };
        }
      },
      {
        id: 'database',
        name: 'Transactional DB',
        description: 'Primary persistent store',
        icon: '🗃️',
        getRequirements: (params) => {
          const mem = params.catalogSize > 100000 ? 16 : 8;
          return {
            productType: 'database',
            category: 'Relational',
            minMemoryGb: mem,
            quantity: 1
          };
        }
      },
      {
        id: 'product-media',
        name: 'Product Image Storage',
        description: 'Object storage for product images and media across the catalog',
        icon: '🪣',
        getRequirements: (params) => {
          // ~2 MB of images per catalog item (multiple photos + thumbnails),
          // converted to GB. Derives directly from the catalog-size param.
          return {
            productType: 'storage',
            category: 'Object',
            quantity: Math.max(1, Math.ceil((params.catalogSize * 2) / 1024))
          };
        }
      },
      {
        id: 'message-queue',
        name: 'Message Queue',
        description: 'Async order & payment processing between services',
        icon: '📨',
        getRequirements: () => ({
          productType: 'integration',
          category: 'Messaging',
          quantity: 1
        })
      },
      {
        id: 'event-bus',
        name: 'Event Bus',
        description: 'Fans "order-placed" events out to inventory, shipping, and analytics',
        icon: '📡',
        getRequirements: () => ({
          productType: 'integration',
          category: 'Eventing',
          quantity: 1
        })
      }
    ]
  },
  {
    id: 'ml-training-hosting',
    name: 'ML Model Training & Hosting',
    description: 'A heavy-compute pipeline designed for MLOps, training custom models, and serving them via APIs.',
    icon: '🤖',
    parameters: [
      {
        id: 'trainingHours',
        label: 'Training Hours per Month',
        type: 'slider',
        min: 10,
        max: 730,
        step: 10,
        defaultValue: 100,
        unit: 'hours'
      },
      {
        id: 'datasetSizeGB',
        label: 'Training Dataset Size',
        type: 'slider',
        min: 50,
        max: 5000,
        step: 50,
        defaultValue: 500,
        unit: 'GB'
      }
    ],
    components: [
      {
        id: 'pipeline-orchestration',
        name: 'Pipeline Orchestration',
        description: 'Coordinates the multi-stage train → evaluate → deploy pipeline (Step Functions / Logic Apps)',
        icon: '🔀',
        getRequirements: () => ({
          productType: 'integration',
          category: 'Workflow',
          quantity: 1
        })
      },
      {
        id: 'training',
        name: 'Training Environment',
        description: 'GPU-accelerated VMs',
        icon: '🔥',
        getRequirements: (params) => {
          // Calculate average utilization across the month
          const fractionalMonth = params.trainingHours / 730;
          return {
            productType: 'vm',
            category: 'GPU instance',
            minVcpus: 8,
            minMemoryGb: 32,
            quantity: fractionalMonth > 0 ? fractionalMonth : 1
          };
        }
      },
      {
        id: 'storage',
        name: 'High-Performance Storage',
        description: 'Fast file storage for datasets',
        icon: '📁',
        getRequirements: (params) => {
          return {
            productType: 'storage',
            category: 'File',
            quantity: params.datasetSizeGB // GB
          };
        }
      },
      {
        id: 'inference',
        name: 'Inference Endpoint',
        description: 'Model hosting API',
        icon: '🧠',
        getRequirements: (params) => {
          return {
            productType: 'ai',
            category: 'Inference',
            quantity: 1
          };
        }
      }
    ]
  },
  {
    id: 'k8s-app-platform',
    name: 'Kubernetes-Native App Platform',
    description: 'Cloud-native platform using managed Kubernetes for containerized microservices, persistent block storage for stateful workloads, a managed relational database, and a load balancer for traffic ingress.',
    icon: '☸️',
    parameters: [
      {
        id: 'workerNodes',
        label: 'Worker Nodes',
        type: 'slider',
        min: 3,
        max: 30,
        step: 1,
        defaultValue: 6,
        unit: 'nodes'
      },
      {
        id: 'dbMemoryGb',
        label: 'Database Memory',
        type: 'slider',
        min: 8,
        max: 128,
        step: 8,
        defaultValue: 16,
        unit: 'GB'
      }
    ],
    components: [
      {
        id: 'kubernetes',
        name: 'Managed Kubernetes',
        description: 'Container orchestration worker nodes',
        icon: '☸️',
        getRequirements: (params) => ({
          productType: 'containers',
          minVcpus: 4,
          minMemoryGb: 16,
          quantity: params.workerNodes
        })
      },
      {
        id: 'block-storage',
        name: 'Persistent Block Storage',
        description: 'Stateful volume per worker node (50 GB each)',
        icon: '💾',
        getRequirements: (params) => ({
          productType: 'storage',
          category: 'Block',
          quantity: params.workerNodes * 50
        })
      },
      {
        id: 'database',
        name: 'Managed Relational DB',
        description: 'Primary transactional datastore',
        icon: '🗃️',
        getRequirements: (params) => ({
          productType: 'database',
          category: 'Relational',
          minMemoryGb: params.dbMemoryGb,
          quantity: 1
        })
      },
      {
        id: 'load-balancer',
        name: 'Load Balancer',
        description: 'Traffic ingress for the cluster',
        icon: '⚖️',
        getRequirements: () => ({
          productType: 'networking',
          category: 'Load Balancer',
          quantity: 1
        })
      }
    ]
  },
  {
    id: 'hpc-scientific',
    name: 'HPC / Scientific Computing',
    description: 'High-performance computing cluster for scientific simulations, genomics, financial modeling, or any massively parallel workload requiring dedicated HPC instances and fast shared file storage.',
    icon: '🔬',
    parameters: [
      {
        id: 'computeNodes',
        label: 'Compute Nodes',
        type: 'slider',
        min: 4,
        max: 64,
        step: 4,
        defaultValue: 16,
        unit: 'nodes'
      },
      {
        id: 'storageTB',
        label: 'Shared Storage',
        type: 'slider',
        min: 1,
        max: 50,
        step: 1,
        defaultValue: 5,
        unit: 'TB'
      }
    ],
    components: [
      {
        id: 'hpc-nodes',
        name: 'HPC Compute Nodes',
        description: 'High-performance compute instances',
        icon: '⚡',
        getRequirements: (params) => ({
          productType: 'vm',
          category: 'HPC',
          minVcpus: 8,
          quantity: params.computeNodes
        })
      },
      {
        id: 'head-node',
        name: 'Head / Master Node',
        description: 'Job scheduler and cluster controller',
        icon: '🖥️',
        getRequirements: () => ({
          productType: 'vm',
          category: 'Compute optimized',
          minVcpus: 8,
          minMemoryGb: 32,
          quantity: 1
        })
      },
      {
        id: 'shared-fs',
        name: 'Shared File System',
        description: 'High-throughput shared storage for datasets',
        icon: '📁',
        getRequirements: (params) => ({
          productType: 'storage',
          category: 'File',
          quantity: params.storageTB * 1024
        })
      },
      {
        id: 'results-storage',
        name: 'Results Object Storage',
        description: 'Long-term output and archive',
        icon: '🪣',
        getRequirements: (params) => ({
          productType: 'storage',
          category: 'Object',
          quantity: params.storageTB * 512
        })
      }
    ]
  },
  {
    id: 'saas-paas-app',
    name: 'SaaS / PaaS Application',
    description: 'Fully managed application platform that eliminates infrastructure overhead. Combines PaaS app hosting with a managed relational database and object storage — ideal for SaaS products and internal tools.',
    icon: '🚀',
    parameters: [
      {
        id: 'appInstances',
        label: 'App Instances',
        type: 'slider',
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 2,
        unit: 'instances'
      },
      {
        id: 'storageSizeGB',
        label: 'Asset Storage',
        type: 'slider',
        min: 10,
        max: 500,
        step: 10,
        defaultValue: 50,
        unit: 'GB'
      }
    ],
    components: [
      {
        id: 'app-hosting',
        name: 'App Hosting Platform',
        description: 'Managed PaaS runtime (App Engine, App Service, App Runner…)',
        icon: '🌐',
        getRequirements: (params) => ({
          productType: 'app-hosting',
          quantity: params.appInstances
        })
      },
      {
        id: 'database',
        name: 'Managed Relational DB',
        description: 'Primary application datastore',
        icon: '🗃️',
        getRequirements: () => ({
          productType: 'database',
          category: 'Relational',
          minMemoryGb: 4,
          quantity: 1
        })
      },
      {
        id: 'object-storage',
        name: 'Object Storage',
        description: 'User uploads, media assets, and backups',
        icon: '🪣',
        getRequirements: (params) => ({
          productType: 'storage',
          category: 'Object',
          quantity: params.storageSizeGB
        })
      }
    ]
  },
  {
    id: 'data-warehouse-bi',
    name: 'Data Warehouse & BI Analytics',
    description: 'A centralized data repository coupled with an analytics engine and BI compute nodes for large-scale reporting and insights.',
    icon: '📊',
    parameters: [
      {
        id: 'datasetSizeGB',
        label: 'Data Lake Storage',
        type: 'slider',
        min: 100,
        max: 50000,
        step: 100,
        defaultValue: 1000,
        unit: 'GB'
      },
      {
        id: 'biComputeCores',
        label: 'BI Compute Cores',
        type: 'slider',
        min: 2,
        max: 32,
        step: 2,
        defaultValue: 4,
        unit: 'vCPU'
      }
    ],
    components: [
      {
        id: 'data-warehouse',
        name: 'Data Warehouse',
        description: 'Columnar analytics engine',
        icon: '🗄️',
        getRequirements: (params) => {
          return {
            productType: 'data-analytics',
            category: 'Warehouse',
            quantity: 1
          };
        }
      },
      {
        id: 'data-lake',
        name: 'Object Storage',
        description: 'Raw data staging',
        icon: '🪣',
        getRequirements: (params) => {
          return {
            productType: 'storage',
            category: 'Object',
            quantity: 1
          };
        }
      },
      {
        id: 'bi-compute',
        name: 'BI Visualization Node',
        description: 'Compute instance for dashboards',
        icon: '📈',
        getRequirements: (params) => {
          return {
            productType: 'vm',
            minVcpus: params.biComputeCores,
            minMemoryGb: params.biComputeCores * 2,
            quantity: 1
          };
        }
      }
    ]
  },
  {
    id: 'disaster-recovery',
    name: 'DR, Warm Standby',
    description: 'A scaled-down replica of your production environment kept running in a secondary region, ready to scale up and take over during a primary-region outage. Includes standby compute, a replicated database, cross-region backups, and failover routing.',
    icon: '🛟',
    parameters: [
      {
        id: 'standbyNodes',
        label: 'Warm Standby Nodes',
        type: 'slider',
        min: 1,
        max: 16,
        step: 1,
        defaultValue: 3,
        unit: 'nodes'
      },
      {
        id: 'replicatedDbGB',
        label: 'Replicated Database Size',
        type: 'slider',
        min: 50,
        max: 5000,
        step: 50,
        defaultValue: 500,
        unit: 'GB'
      }
    ],
    components: [
      {
        id: 'standby-compute',
        name: 'Warm Standby Compute',
        description: 'Scaled-down replica instances on standby',
        icon: '🖥️',
        getRequirements: (params) => ({
          productType: 'vm',
          category: 'General purpose',
          minVcpus: 2,
          minMemoryGb: 8,
          quantity: params.standbyNodes
        })
      },
      {
        id: 'db-replica',
        name: 'Database Replica',
        description: 'Cross-region replicated managed database',
        icon: '🗃️',
        getRequirements: () => ({
          productType: 'database',
          category: 'Relational',
          minMemoryGb: 8,
          quantity: 1
        })
      },
      {
        id: 'backup-storage',
        name: 'Backup Object Storage',
        description: 'Cross-region snapshots and backups',
        icon: '🪣',
        getRequirements: (params) => ({
          productType: 'storage',
          category: 'Object',
          quantity: params.replicatedDbGB * 2
        })
      },
      {
        id: 'failover-routing',
        name: 'Failover Routing',
        description: 'Cross-region load balancer for failover',
        icon: '⚖️',
        getRequirements: () => ({
          productType: 'networking',
          category: 'Load Balancer',
          quantity: 1
        })
      }
    ]
  },
  {
    id: 'content-media-platform',
    name: 'Content & Media Platform',
    description: 'A platform for storing, transcoding, and delivering video and image content at scale. Combines a transcoding compute fleet, an object-storage media library, a metadata database for catalog lookups, and a delivery endpoint for distribution.',
    icon: '🎬',
    parameters: [
      {
        id: 'mediaStorageTB',
        label: 'Media Library Size',
        type: 'slider',
        min: 1,
        max: 500,
        step: 1,
        defaultValue: 20,
        unit: 'TB'
      },
      {
        id: 'monthlyStreams',
        label: 'Monthly Streams / Views',
        type: 'slider',
        min: 100000,
        max: 50000000,
        step: 100000,
        defaultValue: 2000000,
        unit: 'views'
      }
    ],
    components: [
      {
        id: 'transcode-queue',
        name: 'Transcode Queue',
        description: 'Buffers uploads — the transcoding fleet scales on queue depth',
        icon: '📨',
        getRequirements: () => ({
          productType: 'integration',
          category: 'Messaging',
          quantity: 1
        })
      },
      {
        id: 'transcoding',
        name: 'Transcoding Compute',
        description: 'Encodes media into multiple formats and bitrates',
        icon: '🎞️',
        getRequirements: (params) => {
          const nodes = Math.max(2, Math.ceil(params.monthlyStreams / 5000000));
          return {
            productType: 'vm',
            category: 'Compute optimized',
            minVcpus: 8,
            minMemoryGb: 16,
            quantity: nodes
          };
        }
      },
      {
        id: 'media-storage',
        name: 'Media Object Storage',
        description: 'Source and transcoded asset library',
        icon: '🪣',
        getRequirements: (params) => ({
          productType: 'storage',
          category: 'Object',
          quantity: params.mediaStorageTB * 1024
        })
      },
      {
        id: 'metadata-db',
        name: 'Metadata Database',
        description: 'Catalog, search, and playback metadata',
        icon: '🗄️',
        getRequirements: () => ({
          productType: 'database',
          category: 'NoSQL',
          minMemoryGb: 4,
          quantity: 1
        })
      },
      {
        id: 'delivery-endpoint',
        name: 'Content Delivery Endpoint',
        description: 'Distribution and routing for viewers',
        icon: '🌐',
        getRequirements: () => ({
          productType: 'networking',
          category: 'Load Balancer',
          quantity: 1
        })
      }
    ]
  },
  {
    id: 'compliance-ready-web-app',
    name: 'Compliance-Ready Web Application',
    description: 'A standard 3-tier web app hardened with managed security services — WAF, key management, and threat monitoring — for teams in regulated industries handling sensitive data.',
    icon: '🛡️',
    parameters: [
      {
        id: 'concurrentUsers',
        label: 'Peak Concurrent Users',
        type: 'slider',
        min: 100,
        max: 10000,
        step: 100,
        defaultValue: 1000,
        unit: 'users'
      },
      {
        id: 'dbSizeGB',
        label: 'Database Storage',
        type: 'slider',
        min: 50,
        max: 2000,
        step: 50,
        defaultValue: 250,
        unit: 'GB'
      }
    ],
    components: [
      {
        id: 'load-balancer',
        name: 'Load Balancer',
        description: 'Distributes incoming traffic',
        icon: '⚖️',
        getRequirements: () => ({
          productType: 'networking',
          category: 'Load Balancer',
          quantity: 1
        })
      },
      {
        id: 'web-tier',
        name: 'Web / App Tier',
        description: 'Auto-scaling Virtual Machines',
        icon: '🖥️',
        getRequirements: (params) => {
          const loadFactor = Math.max(2, Math.ceil(params.concurrentUsers / 500));
          return {
            productType: 'vm',
            category: 'General purpose',
            minVcpus: 2,
            minMemoryGb: 8,
            quantity: loadFactor
          };
        }
      },
      {
        id: 'database',
        name: 'Relational Database',
        description: 'Primary transactional datastore',
        icon: '🗃️',
        getRequirements: (params) => {
          const mem = Math.max(8, Math.ceil(params.concurrentUsers / 250) * 4);
          return {
            productType: 'database',
            category: 'Relational',
            minMemoryGb: mem,
            quantity: 1
          };
        }
      },
      {
        id: 'waf',
        name: 'Web Application Firewall',
        description: 'Filters malicious traffic at the edge',
        icon: '🧱',
        getRequirements: () => ({
          productType: 'security',
          category: 'Network Security',
          quantity: 1
        })
      },
      {
        id: 'kms',
        name: 'Key Management & Encryption',
        description: 'Manages encryption keys for data at rest',
        icon: '🔐',
        getRequirements: () => ({
          productType: 'security',
          category: 'Identity & Encryption',
          quantity: 1
        })
      },
      {
        id: 'threat-detection',
        name: 'Threat Detection & Monitoring',
        description: 'Continuous monitoring for compliance and anomalies',
        icon: '🚨',
        getRequirements: () => ({
          productType: 'security',
          category: 'Threat & Compliance',
          quantity: 1
        })
      },
      {
        id: 'audit-archive',
        name: 'Audit Log Archive',
        description: 'Immutable (WORM) object storage for retained audit and compliance logs',
        icon: '🪣',
        getRequirements: (params) => {
          // Archived audit-log volume scales with the governed data footprint;
          // derive from dbSizeGB rather than adding a retention slider.
          return {
            productType: 'storage',
            category: 'Object',
            quantity: params.dbSizeGB
          };
        }
      }
    ]
  },
  {
    id: 'rag-ai-knowledge-base',
    name: 'RAG AI Knowledge Base',
    description: 'A retrieval-augmented generation pipeline for AI chat and search products — document storage, a metadata store, serverless orchestration, and a managed inference endpoint.',
    icon: '🧠',
    parameters: [
      {
        id: 'corpusSizeGB',
        label: 'Document Corpus Size',
        type: 'slider',
        min: 1,
        max: 500,
        step: 1,
        defaultValue: 25,
        unit: 'GB'
      },
      {
        id: 'monthlyQueries',
        label: 'Monthly Queries',
        type: 'slider',
        min: 10000,
        max: 5000000,
        step: 10000,
        defaultValue: 250000,
        unit: 'queries'
      }
    ],
    components: [
      {
        id: 'document-storage',
        name: 'Document Storage',
        description: 'Source documents and embeddings archive',
        icon: '🪣',
        getRequirements: (params) => ({
          productType: 'storage',
          category: 'Object',
          quantity: params.corpusSizeGB
        })
      },
      {
        id: 'metadata-store',
        name: 'Embedding / Metadata Store',
        description: 'Indexes embeddings and document metadata',
        icon: '🗄️',
        getRequirements: () => ({
          productType: 'database',
          category: 'NoSQL',
          minMemoryGb: 4,
          quantity: 1
        })
      },
      {
        id: 'orchestration',
        name: 'Workflow Orchestration',
        description: 'Coordinates retrieval and prompt assembly across steps',
        icon: '🔀',
        getRequirements: () => ({
          productType: 'integration',
          category: 'Workflow',
          quantity: 1
        })
      },
      {
        id: 'inference',
        name: 'Inference Endpoint',
        description: 'Generates responses from retrieved context',
        icon: '✨',
        getRequirements: () => ({
          productType: 'ai',
          category: 'Inference',
          quantity: 1
        })
      }
    ]
  },
  {
    id: 'smart-manufacturing',
    name: 'Smart Manufacturing',
    description: 'An Industrial IoT platform for real-time sensor analytics and factory-floor monitoring — edge data collection, continuous stream ingestion, live metrics storage, historical analytics, and predictive maintenance using ML.',
    icon: '🏭',
    parameters: [
      {
        id: 'sensorCount',
        label: 'Number of IoT Sensors',
        type: 'slider',
        min: 10,
        max: 1000,
        step: 10,
        defaultValue: 100,
        unit: 'sensors'
      },
      {
        id: 'monthlyDataGB',
        label: 'Monthly Data Volume',
        type: 'slider',
        min: 10,
        max: 10000,
        step: 100,
        defaultValue: 500,
        unit: 'GB'
      },
      {
        id: 'retentionDays',
        label: 'Hot Storage Retention',
        type: 'slider',
        min: 7,
        max: 365,
        step: 7,
        defaultValue: 30,
        unit: 'days'
      }
    ],
    components: [
      {
        id: 'edge-compute',
        name: 'Edge Gateway / Local Compute',
        description: 'Processes sensor data at factory floor before cloud transmission',
        icon: '🖥️',
        getRequirements: (params) => {
          const gateways = Math.max(1, Math.ceil(params.sensorCount / 100));
          return {
            productType: 'vm',
            minVcpus: 2,
            minMemoryGb: 4,
            quantity: gateways
          };
        }
      },
      {
        id: 'stream-ingestion',
        name: 'Stream Processing / Message Queue',
        description: 'Real-time ingestion and normalization of sensor streams',
        icon: '⚡',
        getRequirements: () => ({
          productType: 'serverless',
          category: 'Compute',
          quantity: 1
        })
      },
      {
        id: 'metrics-store',
        name: 'Hot Metrics Store',
        description: 'Recent sensor readings for dashboards and alerts',
        icon: '📊',
        getRequirements: (params) => {
          const hotStorageGB = Math.max(10, Math.ceil((params.monthlyDataGB / 30) * params.retentionDays));
          return {
            productType: 'database',
            category: 'NoSQL',
            minMemoryGb: Math.ceil(hotStorageGB / 50) * 4, // Rough estimation: 50GB per 4GB instance
            quantity: 1
          };
        }
      },
      {
        id: 'alert-event-bus',
        name: 'Alert Event Bus',
        description: 'Fans threshold-breach events out to alerting and maintenance workflows',
        icon: '📡',
        getRequirements: () => ({
          productType: 'integration',
          category: 'Eventing',
          quantity: 1
        })
      },
      {
        id: 'data-warehouse',
        name: 'Analytics Data Warehouse',
        description: 'Historical data for trends, patterns, and compliance reporting',
        icon: '🏢',
        getRequirements: (params) => ({
          productType: 'data-analytics',
          category: 'Warehouse',
          quantity: 1
        })
      },
      {
        id: 'cold-archive',
        name: 'Cold Storage Archive',
        description: 'Long-term compliance and historical data',
        icon: '🪣',
        getRequirements: (params) => ({
          productType: 'storage',
          category: 'Object',
          quantity: params.monthlyDataGB * 12 // Approximate annual cold storage
        })
      },
      {
        id: 'predictive-maintenance',
        name: 'Predictive Maintenance AI',
        description: 'ML model for equipment anomaly detection and failure prediction',
        icon: '🤖',
        getRequirements: () => ({
          productType: 'ai',
          category: 'Inference',
          quantity: 1
        })
      }
    ]
  }
];
