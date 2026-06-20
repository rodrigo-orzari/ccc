export const VECTOR_DATABASES = [
  // Pinecone
  { provider: 'pinecone', type: 'Serverless (Storage)', vcpus: 0, memory_gb: 0, price: 0.33, unit: 'GB-Month', attributes: { engine: 'Pinecone', deployment_type: 'Serverless', tier: 'Standard' } },
  { provider: 'pinecone', type: 'Dedicated p1.x1', vcpus: 2, memory_gb: 8, price: 0.096, unit: 'Hour', attributes: { engine: 'Pinecone', deployment_type: 'Provisioned', tier: 'Standard' } },
  { provider: 'pinecone', type: 'Dedicated s1.x1', vcpus: 2, memory_gb: 8, price: 0.134, unit: 'Hour', attributes: { engine: 'Pinecone', deployment_type: 'Provisioned', tier: 'Storage Optimized' } },
  
  // Qdrant
  { provider: 'qdrant', type: 'Cloud Standard (4GB)', vcpus: 2, memory_gb: 4, price: 0.188, unit: 'Hour', attributes: { engine: 'Qdrant', deployment_type: 'Provisioned', tier: 'Standard' } },
  { provider: 'qdrant', type: 'Cloud Standard (8GB)', vcpus: 4, memory_gb: 8, price: 0.375, unit: 'Hour', attributes: { engine: 'Qdrant', deployment_type: 'Provisioned', tier: 'Standard' } },

  // Zilliz (Milvus)
  { provider: 'milvus', type: 'Zilliz Serverless', vcpus: 0, memory_gb: 0, price: 0.002, unit: '1M Vectors', attributes: { engine: 'Milvus', deployment_type: 'Serverless', tier: 'Standard' } },
  { provider: 'milvus', type: 'Zilliz Dedicated (1 CU)', vcpus: 2, memory_gb: 8, price: 0.10, unit: 'Hour', attributes: { engine: 'Milvus', deployment_type: 'Provisioned', tier: 'Standard' } },

  // Weaviate
  { provider: 'weaviate', type: 'Serverless', vcpus: 0, memory_gb: 0, price: 0.05, unit: '1M Dimensions', attributes: { engine: 'Weaviate', deployment_type: 'Serverless', tier: 'Standard' } },
  { provider: 'weaviate', type: 'Enterprise Cloud (Small)', vcpus: 4, memory_gb: 16, price: 1.20, unit: 'Hour', attributes: { engine: 'Weaviate', deployment_type: 'Provisioned', tier: 'Enterprise' } },

  // Chroma
  { provider: 'chroma', type: 'Chroma Cloud Serverless', vcpus: 0, memory_gb: 0, price: 0.05, unit: 'GB-Month', attributes: { engine: 'Chroma', deployment_type: 'Serverless', tier: 'Standard' } },
];
