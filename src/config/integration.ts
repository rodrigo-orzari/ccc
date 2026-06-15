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
