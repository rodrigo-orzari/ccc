import { WorkloadDefinition } from '@/types';

export const WORKLOADS: WorkloadDefinition[] = [
  {
    id: 'rag-assistant',
    name: 'RAG Assistant Starter Kit',
    description: 'Deploy an AI-powered chatbot with document retrieval using App Platform, Serverless Inference, and Knowledge Base.',
    icon: '🤖',
    parameters: [
      {
        id: 'dailyUsers',
        label: 'Daily Active Users',
        type: 'slider',
        min: 100,
        max: 50000,
        step: 100,
        defaultValue: 1000,
        unit: 'users'
      },
      {
        id: 'queriesPerUser',
        label: 'Queries per User/Day',
        type: 'slider',
        min: 1,
        max: 100,
        step: 1,
        defaultValue: 10,
        unit: 'queries'
      }
    ],
    components: [
      {
        id: 'chatbot-app',
        name: 'Chatbot App',
        description: 'App Platform / Frontend hosting',
        icon: '💬',
        getRequirements: (params) => {
          // e.g. 1 vCPU and 2GB RAM per 10k users
          const loadFactor = Math.max(1, Math.ceil(params.dailyUsers / 10000));
          return {
            productType: 'app-hosting',
            minVcpus: 1,
            minMemoryGb: 2,
            quantity: loadFactor
          };
        }
      },
      {
        id: 'inference',
        name: 'Inference Endpoint',
        description: 'Serverless LLM / Agent Platform',
        icon: '🧠',
        getRequirements: (params) => {
          return {
            productType: 'serverless',
            category: 'Compute',
            quantity: 1
          };
        }
      },
      {
        id: 'knowledge-base',
        name: 'Knowledge Base',
        description: 'Vector Database for retrieval context',
        icon: '📚',
        getRequirements: (params) => {
          // e.g. more users might mean more cache/memory needed
          const mem = params.dailyUsers > 10000 ? 8 : 4;
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
    id: 'observability-stack',
    name: 'Observability Starter Kit',
    description: 'Deploy Elasticsearch, Logstash, and Kibana for centralized logging and monitoring.',
    icon: '📈',
    parameters: [
      {
        id: 'logVolumeGB',
        label: 'Daily Log Volume',
        type: 'slider',
        min: 10,
        max: 1000,
        step: 10,
        defaultValue: 50,
        unit: 'GB/day'
      }
    ],
    components: [
      {
        id: 'logstash',
        name: 'Logstash Ingestion',
        description: 'Ingest and process logs',
        icon: '💧',
        getRequirements: (params) => {
          const vcpus = Math.max(2, Math.ceil(params.logVolumeGB / 100) * 2);
          const mem = vcpus * 2;
          return {
            productType: 'vm',
            category: 'Compute optimized',
            minVcpus: vcpus,
            minMemoryGb: mem,
            quantity: 1
          };
        }
      },
      {
        id: 'elasticsearch',
        name: 'Elasticsearch Node',
        description: 'Store and index logs',
        icon: '🔍',
        getRequirements: (params) => {
          const mem = Math.max(4, Math.ceil(params.logVolumeGB / 50) * 4);
          const vcpus = Math.max(2, mem / 4);
          return {
            productType: 'vm',
            category: 'Memory optimized',
            minVcpus: vcpus,
            minMemoryGb: mem,
            quantity: 2 // Typical HA setup requires 2+ nodes
          };
        }
      },
      {
        id: 'kibana',
        name: 'Kibana Dashboard',
        description: 'Search and visualize logs',
        icon: '📊',
        getRequirements: (params) => {
          return {
            productType: 'vm',
            category: 'General purpose',
            minVcpus: 2,
            minMemoryGb: 4,
            quantity: 1
          };
        }
      }
    ]
  },
  {
    id: 'data-workflow',
    name: 'Data Workflow Starter Kit',
    description: 'Deploy a production-ready Apache Airflow environment with managed Postgres and Valkey keystore.',
    icon: '⚙️',
    parameters: [
      {
        id: 'concurrentTasks',
        label: 'Concurrent Tasks',
        type: 'slider',
        min: 10,
        max: 1000,
        step: 10,
        defaultValue: 50,
        unit: 'tasks'
      }
    ],
    components: [
      {
        id: 'airflow',
        name: 'Workflow Engine',
        description: 'Airflow Scheduler & Webserver',
        icon: '🌬️',
        getRequirements: (params) => {
          const vcpus = Math.max(2, Math.ceil(params.concurrentTasks / 50) * 2);
          return {
            productType: 'vm',
            category: 'General purpose',
            minVcpus: vcpus,
            minMemoryGb: vcpus * 4,
            quantity: 1
          };
        }
      },
      {
        id: 'valkey',
        name: 'Execution Cache',
        description: 'Valkey / Redis task dispatcher',
        icon: '⚡',
        getRequirements: (params) => {
          const mem = Math.max(2, Math.ceil(params.concurrentTasks / 100) * 2);
          return {
            productType: 'database',
            minMemoryGb: mem,
            quantity: 1
          };
        }
      },
      {
        id: 'postgres',
        name: 'State Database',
        description: 'PostgreSQL for task state',
        icon: '🐘',
        getRequirements: (params) => {
          const vcpus = Math.max(2, Math.ceil(params.concurrentTasks / 200) * 2);
          return {
            productType: 'database',
            minVcpus: vcpus,
            minMemoryGb: vcpus * 4,
            quantity: 1
          };
        }
      }
    ]
  }
];
