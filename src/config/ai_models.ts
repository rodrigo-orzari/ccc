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

// All prices are on-demand (pay-as-you-go) in USD per 1M tokens.
// Sources (fetched June 2026):
//   OpenAI    — developers.openai.com/api/docs/models
//   Anthropic — platform.claude.com/docs/en/about-claude/pricing
//   GCP       — cloud.google.com/vertex-ai/generative-ai/pricing
//   Bedrock   — aws.amazon.com/bedrock/pricing/
//   Azure     — azure.microsoft.com/pricing/details/azure-openai/ (via Microsoft Foundry)

export const AI_MODELS: AIModelConfig[] = [

  // ── OpenAI ────────────────────────────────────────────────────────────
  {
    providerSlug: 'openai',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'GPT-5.5',
    inputPricePer1M: 5.00,
    outputPricePer1M: 30.00,
    contextWindowK: 128,
    modelTier: 'Frontier',
    multimodal: 'Yes',
  },
  {
    providerSlug: 'openai',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'GPT-5.4',
    inputPricePer1M: 2.50,
    outputPricePer1M: 15.00,
    contextWindowK: 128,
    modelTier: 'Standard',
    multimodal: 'Yes',
  },
  {
    providerSlug: 'openai',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'GPT-5.4 mini',
    inputPricePer1M: 0.75,
    outputPricePer1M: 4.50,
    contextWindowK: 128,
    modelTier: 'Efficient',
    multimodal: 'Yes',
  },
  {
    providerSlug: 'openai',
    serviceName: 'Embeddings',
    geography: 'Global',
    modelName: 'text-embedding-3-large',
    inputPricePer1M: 0.13,
    modelTier: 'Standard',
    multimodal: 'No',
  },

  // ── Anthropic ─────────────────────────────────────────────────────────
  {
    providerSlug: 'anthropic',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'Claude Opus 4.8',
    inputPricePer1M: 5.00,
    outputPricePer1M: 25.00,
    contextWindowK: 1000,
    modelTier: 'Frontier',
    multimodal: 'Yes',
  },
  {
    providerSlug: 'anthropic',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'Claude Sonnet 4.6',
    inputPricePer1M: 3.00,
    outputPricePer1M: 15.00,
    contextWindowK: 1000,
    modelTier: 'Standard',
    multimodal: 'Yes',
  },
  {
    providerSlug: 'anthropic',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'Claude Haiku 4.5',
    inputPricePer1M: 1.00,
    outputPricePer1M: 5.00,
    contextWindowK: 200,
    modelTier: 'Efficient',
    multimodal: 'Yes',
  },

  // ── Google Vertex AI ──────────────────────────────────────────────────
  {
    providerSlug: 'gcp',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'Gemini 2.5 Pro',
    inputPricePer1M: 1.25,
    outputPricePer1M: 10.00,
    contextWindowK: 1000,
    modelTier: 'Frontier',
    multimodal: 'Yes',
  },
  {
    providerSlug: 'gcp',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'Gemini 2.5 Flash',
    inputPricePer1M: 0.30,
    outputPricePer1M: 2.50,
    contextWindowK: 1000,
    modelTier: 'Standard',
    multimodal: 'Yes',
  },
  {
    providerSlug: 'gcp',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'Gemini 2.0 Flash',
    inputPricePer1M: 0.15,
    outputPricePer1M: 0.60,
    contextWindowK: 1000,
    modelTier: 'Efficient',
    multimodal: 'Yes',
  },

  // ── AWS Bedrock ───────────────────────────────────────────────────────
  {
    providerSlug: 'aws',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'Claude Sonnet 4.6 (Bedrock)',
    inputPricePer1M: 3.00,
    outputPricePer1M: 15.00,
    contextWindowK: 1000,
    modelTier: 'Standard',
    multimodal: 'Yes',
  },
  {
    providerSlug: 'aws',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'Llama 4 Maverick (Bedrock)',
    inputPricePer1M: 0.24,
    outputPricePer1M: 0.97,
    contextWindowK: 1000,
    modelTier: 'Efficient',
    multimodal: 'Yes',
  },

  // ── Azure (Microsoft Foundry) ─────────────────────────────────────────
  {
    providerSlug: 'azure',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'GPT-5.5 (Azure)',
    inputPricePer1M: 5.00,
    outputPricePer1M: 30.00,
    contextWindowK: 128,
    modelTier: 'Frontier',
    multimodal: 'Yes',
  },
  {
    providerSlug: 'azure',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'GPT-5.4 (Azure)',
    inputPricePer1M: 2.50,
    outputPricePer1M: 15.00,
    contextWindowK: 128,
    modelTier: 'Standard',
    multimodal: 'Yes',
  },
  {
    providerSlug: 'azure',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'GPT-5.4 mini (Azure)',
    inputPricePer1M: 0.75,
    outputPricePer1M: 4.50,
    contextWindowK: 128,
    modelTier: 'Efficient',
    multimodal: 'Yes',
  },
  
  // ── Oracle (OCI Generative AI) ──────────────────────────────────────────
  {
    providerSlug: 'oracle',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'Cohere Command R+',
    inputPricePer1M: 3.00,
    outputPricePer1M: 15.00,
    contextWindowK: 128,
    modelTier: 'Frontier',
    multimodal: 'No',
  },
  {
    providerSlug: 'oracle',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'Cohere Command R',
    inputPricePer1M: 0.50,
    outputPricePer1M: 1.50,
    contextWindowK: 128,
    modelTier: 'Standard',
    multimodal: 'No',
  },
  {
    providerSlug: 'oracle',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'Meta Llama 3 70B',
    inputPricePer1M: 0.75,
    outputPricePer1M: 0.75,
    contextWindowK: 8,
    modelTier: 'Efficient',
    multimodal: 'No',
  },

  // ── DigitalOcean (GenAI Platform) ───────────────────────────────────────
  {
    providerSlug: 'digitalocean',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'Anthropic Claude Opus 4.8',
    inputPricePer1M: 5.00,
    outputPricePer1M: 25.00,
    contextWindowK: 1000,
    modelTier: 'Frontier',
    multimodal: 'Yes',
  },
  {
    providerSlug: 'digitalocean',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'Anthropic Claude Sonnet 4.6',
    inputPricePer1M: 3.00,
    outputPricePer1M: 15.00,
    contextWindowK: 1000,
    modelTier: 'Standard',
    multimodal: 'Yes',
  },
  {
    providerSlug: 'digitalocean',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'Anthropic Claude Haiku 4.5',
    inputPricePer1M: 1.00,
    outputPricePer1M: 5.00,
    contextWindowK: 200,
    modelTier: 'Efficient',
    multimodal: 'Yes',
  },
  {
    providerSlug: 'digitalocean',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'Meta Llama 3 70B Instruct',
    inputPricePer1M: 0.70,
    outputPricePer1M: 0.90,
    contextWindowK: 8,
    modelTier: 'Standard',
    multimodal: 'No',
  },
  {
    providerSlug: 'digitalocean',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'Meta Llama 3 8B Instruct',
    inputPricePer1M: 0.10,
    outputPricePer1M: 0.20,
    contextWindowK: 8,
    modelTier: 'Efficient',
    multimodal: 'No',
  },
  {
    providerSlug: 'digitalocean',
    serviceName: 'Embeddings',
    geography: 'Global',
    modelName: 'All MiniLM L6 v2',
    inputPricePer1M: 0.0090,
    modelTier: 'Standard',
    multimodal: 'No',
  },

  // ── Alibaba Cloud (Model Studio / DashScope) ────────────────────────────
  {
    providerSlug: 'alibaba',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'Qwen-Max',
    inputPricePer1M: 1.20,
    outputPricePer1M: 6.00,
    contextWindowK: 32,
    modelTier: 'Frontier',
    multimodal: 'Yes',
  },
  {
    providerSlug: 'alibaba',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'Qwen-Plus',
    inputPricePer1M: 0.40,
    outputPricePer1M: 1.20,
    contextWindowK: 128,
    modelTier: 'Standard',
    multimodal: 'Yes',
  },
  {
    providerSlug: 'alibaba',
    serviceName: 'Foundational Models',
    geography: 'Global',
    modelName: 'Qwen-Turbo',
    inputPricePer1M: 0.10,
    outputPricePer1M: 0.30,
    contextWindowK: 128,
    modelTier: 'Efficient',
    multimodal: 'No',
  },
];
