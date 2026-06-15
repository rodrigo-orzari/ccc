/**
 * Static Fallback Config for Integration & Messaging
 * Services like Azure Service Bus, AWS API Gateway, GCP Pub/Sub
 */

export const AZURE_INTEGRATION = [
  { type: 'Service Bus Standard', category: 'Message Queue', price: 0.013, unit: 'per 1M Operations', attributes: { base_price_mo: 10.00, tier: 'Standard', max_message_size_kb: 256 } },
  { type: 'Service Bus Premium', category: 'Message Queue', price: 668.00, unit: 'Mo', attributes: { base_price_mo: 668.00, tier: 'Premium', max_message_size_kb: 102400 } },
  { type: 'Event Grid', category: 'Event Bus', price: 0.60, unit: 'per 1M Operations', attributes: { tier: 'Standard', max_message_size_kb: 1024 } },
];

export const AWS_INTEGRATION = [
  { type: 'API Gateway REST', category: 'API Gateway', price: 3.50, unit: 'per 1M Requests', attributes: { tier: 'Standard', protocols: 'REST' } },
  { type: 'API Gateway HTTP', category: 'API Gateway', price: 1.00, unit: 'per 1M Requests', attributes: { tier: 'Standard', protocols: 'HTTP' } },
  { type: 'SQS Standard', category: 'Message Queue', price: 0.40, unit: 'per 1M Requests', attributes: { tier: 'Standard', max_message_size_kb: 256 } },
  { type: 'SQS FIFO', category: 'Message Queue', price: 0.50, unit: 'per 1M Requests', attributes: { tier: 'FIFO', max_message_size_kb: 256 } },
];

export const GCP_INTEGRATION = [
  { type: 'Pub/Sub', category: 'Message Queue', price: 40.00, unit: 'per TB', attributes: { tier: 'Standard', max_message_size_kb: 10240 } },
  { type: 'API Gateway', category: 'API Gateway', price: 3.00, unit: 'per 1M Requests', attributes: { tier: 'Standard', protocols: 'REST' } },
  { type: 'Workflows', category: 'Workflow', price: 0.01, unit: 'per 1k Steps', attributes: { tier: 'Standard' } },
];

export const ALIBABA_INTEGRATION = [
  { type: 'RocketMQ Standard', category: 'Message Queue', price: 45.00, unit: 'Mo', attributes: { tier: 'Standard', max_message_size_kb: 4096 } },
  { type: 'RocketMQ Premium', category: 'Message Queue', price: 150.00, unit: 'Mo', attributes: { tier: 'Premium', max_message_size_kb: 4096 } },
  { type: 'API Gateway', category: 'API Gateway', price: 2.50, unit: 'per 1M Requests', attributes: { tier: 'Standard', protocols: 'REST' } },
];

export const ORACLE_INTEGRATION = [
  { type: 'OCI Streaming', category: 'Event Bus', price: 2.50, unit: 'per 10GB/Hr', attributes: { tier: 'Standard', max_message_size_kb: 1024 } },
  { type: 'API Gateway', category: 'API Gateway', price: 3.00, unit: 'per 1M Requests', attributes: { tier: 'Standard', protocols: 'REST' } },
];
