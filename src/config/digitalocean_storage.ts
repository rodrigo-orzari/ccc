/**
 * DigitalOcean Storage Pricing Configuration (Fallback)
 * List prices, NYC3, USD per GB-month. DO offers object (Spaces) and block
 * (Volumes) storage; no managed file/archive tiers, so those are omitted.
 */
export const DIGITALOCEAN_STORAGE_REGION = 'nyc3';
export const DIGITALOCEAN_STORAGE_GEOGRAPHY = 'N. America';

export const DIGITALOCEAN_STORAGE = [
  { type: 'Spaces Object Storage', price: 0.02, unit: 'GB-Month', attributes: { storage_type: 'Object', tier: 'Standard', redundancy: 'Single-Zone' } },
  { type: 'Block Storage Volumes', price: 0.10, unit: 'GB-Month', attributes: { storage_type: 'Block',  tier: 'Standard', redundancy: 'Single-Zone', media: 'SSD' } },
];
