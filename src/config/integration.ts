/**
 * Integration & Messaging services, folded into the Serverless category.
 *
 * service_type maps the legacy category strings to the new SERVERLESS_SERVICE_TYPES enum:
 *   Message Queue → Messaging
 *   Event Bus     → Eventing
 *   API Gateway   → API Gateway
 *   Workflow      → Workflow
 *
 * These flow through ServerlessPricingPipeline so rows land under
 * service.category = 'serverless' alongside Lambda/Functions/Run.
 */

type RawIntegrationEntry = {
  type: string;
  category: 'Message Queue' | 'Event Bus' | 'API Gateway' | 'Workflow';
  price: number;
  unit: string;
  attributes: Record<string, any>;
};

const CATEGORY_TO_SERVICE_TYPE: Record<RawIntegrationEntry['category'], string> = {
  'Message Queue': 'Messaging',
  'Event Bus': 'Eventing',
  'API Gateway': 'API Gateway',
  'Workflow': 'Workflow',
};

const tag = (entries: RawIntegrationEntry[]) =>
  entries.map(e => ({
    type: e.type,
    price: e.price,
    unit: e.unit,
    attributes: {
      ...e.attributes,
      service_type: CATEGORY_TO_SERVICE_TYPE[e.category],
      deployment_type: 'Serverless',
    },
  }));

export const AZURE_INTEGRATION = tag([
  { type: 'Service Bus Standard', category: 'Message Queue', price: 0.013, unit: 'per 1M Operations', attributes: { base_price_mo: 10.00, tier: 'Standard', max_message_size_kb: 256 } },
  { type: 'Service Bus Premium',  category: 'Message Queue', price: 668.00, unit: 'Mo',               attributes: { base_price_mo: 668.00, tier: 'Premium', max_message_size_kb: 102400 } },
  { type: 'Event Grid',           category: 'Event Bus',     price: 0.60,   unit: 'per 1M Operations', attributes: { tier: 'Standard', max_message_size_kb: 1024 } },
  { type: 'API Management Consumption', category: 'API Gateway', price: 3.50, unit: 'per 1M Requests', attributes: { tier: 'Consumption', protocols: 'REST,SOAP,GraphQL' } },
  { type: 'Logic Apps Consumption', category: 'Workflow',    price: 0.025,  unit: 'per 1k Actions',    attributes: { tier: 'Consumption' } },
]);

export const AWS_INTEGRATION = tag([
  { type: 'API Gateway REST', category: 'API Gateway',   price: 3.50, unit: 'per 1M Requests', attributes: { tier: 'Standard', protocols: 'REST' } },
  { type: 'API Gateway HTTP', category: 'API Gateway',   price: 1.00, unit: 'per 1M Requests', attributes: { tier: 'Standard', protocols: 'HTTP' } },
  { type: 'SQS Standard',     category: 'Message Queue', price: 0.40, unit: 'per 1M Requests', attributes: { tier: 'Standard', max_message_size_kb: 256 } },
  { type: 'SQS FIFO',         category: 'Message Queue', price: 0.50, unit: 'per 1M Requests', attributes: { tier: 'FIFO', max_message_size_kb: 256 } },
  { type: 'EventBridge',      category: 'Event Bus',     price: 1.00, unit: 'per 1M Events',   attributes: { tier: 'Standard', max_message_size_kb: 256 } },
  { type: 'Step Functions Standard', category: 'Workflow', price: 0.025, unit: 'per 1k Transitions', attributes: { tier: 'Standard' } },
]);

export const GCP_INTEGRATION = tag([
  { type: 'Pub/Sub',     category: 'Message Queue', price: 40.00, unit: 'per TB',          attributes: { tier: 'Standard', max_message_size_kb: 10240 } },
  { type: 'API Gateway', category: 'API Gateway',   price: 3.00,  unit: 'per 1M Requests', attributes: { tier: 'Standard', protocols: 'REST' } },
  { type: 'Eventarc',    category: 'Event Bus',     price: 0.35,  unit: 'per 1M Events',   attributes: { tier: 'Standard', max_message_size_kb: 1024 } },
  { type: 'Workflows',   category: 'Workflow',      price: 0.01,  unit: 'per 1k Steps',    attributes: { tier: 'Standard' } },
]);

export const ALIBABA_INTEGRATION = tag([
  { type: 'RocketMQ Standard', category: 'Message Queue', price: 45.00, unit: 'Mo',              attributes: { tier: 'Standard', max_message_size_kb: 4096 } },
  { type: 'RocketMQ Premium',  category: 'Message Queue', price: 150.00, unit: 'Mo',             attributes: { tier: 'Premium',  max_message_size_kb: 4096 } },
  { type: 'API Gateway',       category: 'API Gateway',   price: 2.50,  unit: 'per 1M Requests', attributes: { tier: 'Standard', protocols: 'REST' } },
  { type: 'EventBridge',       category: 'Event Bus',     price: 1.00,  unit: 'per 1M Events',   attributes: { tier: 'Standard' } },
]);

export const ORACLE_INTEGRATION = tag([
  { type: 'OCI Streaming',         category: 'Event Bus',   price: 2.50, unit: 'per 10GB/Hr',     attributes: { tier: 'Standard', max_message_size_kb: 1024 } },
  { type: 'API Gateway',           category: 'API Gateway', price: 3.00, unit: 'per 1M Requests', attributes: { tier: 'Standard', protocols: 'REST' } },
  { type: 'OCI Queue',             category: 'Message Queue', price: 0.50, unit: 'per 1M Requests', attributes: { tier: 'Standard', max_message_size_kb: 256 } },
]);

export const DIGITALOCEAN_INTEGRATION = tag([
  { type: 'API Gateway (Functions)', category: 'API Gateway', price: 0.00, unit: 'per 1M Requests', attributes: { tier: 'Standard', protocols: 'HTTP', note: 'Included with Functions usage' } },
]);
