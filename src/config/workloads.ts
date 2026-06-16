import { WorkloadDefinition } from '@/types';

export const WORKLOADS: WorkloadDefinition[] = [
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
            productType: 'networking',
            category: 'Gateway',
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
        id: 'database',
        name: 'Managed NoSQL',
        description: 'High-throughput document store',
        icon: '🗄️',
        getRequirements: (params) => {
          return {
            productType: 'database',
            minMemoryGb: 4, // Approximating tier based on memory
            quantity: 1
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
            minMemoryGb: mem,
            quantity: 1
          };
        }
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
  }
];
