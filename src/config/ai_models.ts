export interface AIModelConfig {
  providerSlug: string;
  serviceName: string;
  regionSlug?: string;
  geography: string;
  modelName: string;
  inputPricePer1M: number;
  outputPricePer1M?: number;
  contextWindowK?: number;
  modelTier: string;
  multimodal: string;
  trainingCutoff?: string;
}

export const AI_MODELS: AIModelConfig[] = [
  // OpenAI
  {
    providerSlug: 'openai',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'GPT-4o',
    inputPricePer1M: 5.00,
    outputPricePer1M: 15.00,
    contextWindowK: 128,
    modelTier: 'Flagship (e.g. GPT-4o)',
    multimodal: 'Yes',
    trainingCutoff: 'Oct 2023',
  },
  {
    providerSlug: 'openai',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'GPT-4o-mini',
    inputPricePer1M: 0.15,
    outputPricePer1M: 0.60,
    contextWindowK: 128,
    modelTier: 'Small/Fast (e.g. Haiku)',
    multimodal: 'Yes',
    trainingCutoff: 'Oct 2023',
  },
  {
    providerSlug: 'openai',
    serviceName: 'Embeddings',
    geography: 'Global',
    modelName: 'text-embedding-3-large',
    inputPricePer1M: 0.13,
    modelTier: 'Flagship (e.g. GPT-4o)',
    multimodal: 'No',
  },

  // Anthropic
  {
    providerSlug: 'anthropic',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'Claude 3.5 Sonnet',
    inputPricePer1M: 3.00,
    outputPricePer1M: 15.00,
    contextWindowK: 200,
    modelTier: 'Flagship (e.g. GPT-4o)',
    multimodal: 'Yes',
  },
  {
    providerSlug: 'anthropic',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'Claude 3 Haiku',
    inputPricePer1M: 0.25,
    outputPricePer1M: 1.25,
    contextWindowK: 200,
    modelTier: 'Small/Fast (e.g. Haiku)',
    multimodal: 'Yes',
  },

  // Google Vertex AI
  {
    providerSlug: 'gcp',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'Gemini 1.5 Pro',
    inputPricePer1M: 3.50,
    outputPricePer1M: 10.50,
    contextWindowK: 2000,
    modelTier: 'Flagship (e.g. GPT-4o)',
    multimodal: 'Yes',
  },
  {
    providerSlug: 'gcp',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'Gemini 1.5 Flash',
    inputPricePer1M: 0.075,
    outputPricePer1M: 0.30,
    contextWindowK: 1000,
    modelTier: 'Small/Fast (e.g. Haiku)',
    multimodal: 'Yes',
  },

  // AWS Bedrock (Anthropic models as an example of Bedrock)
  {
    providerSlug: 'aws',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'Claude 3.5 Sonnet (Bedrock)',
    inputPricePer1M: 3.00,
    outputPricePer1M: 15.00,
    contextWindowK: 200,
    modelTier: 'Flagship (e.g. GPT-4o)',
    multimodal: 'Yes',
  },
  {
    providerSlug: 'aws',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'Llama 3 70B (Bedrock)',
    inputPricePer1M: 2.65,
    outputPricePer1M: 3.50,
    contextWindowK: 8,
    modelTier: 'Flagship (e.g. GPT-4o)',
    multimodal: 'No',
  },

  // Azure OpenAI
  {
    providerSlug: 'azure',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'GPT-4o (Azure)',
    inputPricePer1M: 5.00,
    outputPricePer1M: 15.00,
    contextWindowK: 128,
    modelTier: 'Flagship (e.g. GPT-4o)',
    multimodal: 'Yes',
  }
];
