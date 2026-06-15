/**
 * Static Fallback Config for App Hosting (PaaS)
 * Services like Azure App Service, DigitalOcean App Platform, AWS App Runner
 */

export const AZURE_APP_HOSTING = [
  { type: 'Basic B1', vcpus: 1, memory_gb: 1.75, price: 54.75, unit: 'Mo', attributes: { os: 'Linux', tier: 'Basic', compute_type: 'Dedicated' } },
  { type: 'Premium V3 P1v3', vcpus: 2, memory_gb: 8, price: 164.25, unit: 'Mo', attributes: { os: 'Linux', tier: 'Premium', compute_type: 'Dedicated' } },
  { type: 'Premium V3 P2v3', vcpus: 4, memory_gb: 16, price: 328.50, unit: 'Mo', attributes: { os: 'Linux', tier: 'Premium', compute_type: 'Dedicated' } },
];

export const DO_APP_HOSTING = [
  { type: 'Basic App', vcpus: 1, memory_gb: 1, price: 5.00, unit: 'Mo', attributes: { os: 'Linux', tier: 'Basic', compute_type: 'Shared' } },
  { type: 'Professional App', vcpus: 1, memory_gb: 2, price: 20.00, unit: 'Mo', attributes: { os: 'Linux', tier: 'Professional', compute_type: 'Dedicated' } },
  { type: 'Professional App', vcpus: 4, memory_gb: 8, price: 80.00, unit: 'Mo', attributes: { os: 'Linux', tier: 'Professional', compute_type: 'Dedicated' } },
];

export const AWS_APP_HOSTING = [
  { type: 'App Runner', vcpus: 1, memory_gb: 2, price: 46.80, unit: 'Mo', attributes: { os: 'Linux', tier: 'Standard', compute_type: 'Dedicated' } },
  { type: 'App Runner', vcpus: 2, memory_gb: 4, price: 93.60, unit: 'Mo', attributes: { os: 'Linux', tier: 'Standard', compute_type: 'Dedicated' } },
];

export const GCP_APP_HOSTING = [
  { type: 'App Engine Standard B1', vcpus: 1, memory_gb: 0.25, price: 36.50, unit: 'Mo', attributes: { os: 'Linux', tier: 'Basic', compute_type: 'Shared' } },
  { type: 'App Engine Standard B2', vcpus: 1, memory_gb: 0.5, price: 73.00, unit: 'Mo', attributes: { os: 'Linux', tier: 'Standard', compute_type: 'Shared' } },
  { type: 'App Engine Flex 2vCPU', vcpus: 2, memory_gb: 4, price: 85.00, unit: 'Mo', attributes: { os: 'Linux', tier: 'Premium', compute_type: 'Dedicated' } },
];

export const ALIBABA_APP_HOSTING = [
  { type: 'Simple App Server 1C1G', vcpus: 1, memory_gb: 1, price: 3.50, unit: 'Mo', attributes: { os: 'Linux', tier: 'Basic', compute_type: 'Shared' } },
  { type: 'Simple App Server 2C2G', vcpus: 2, memory_gb: 2, price: 9.00, unit: 'Mo', attributes: { os: 'Linux', tier: 'Standard', compute_type: 'Shared' } },
  { type: 'Web+ Standard', vcpus: 2, memory_gb: 4, price: 42.00, unit: 'Mo', attributes: { os: 'Linux', tier: 'Professional', compute_type: 'Dedicated' } },
];

export const ORACLE_APP_HOSTING = [
  { type: 'WebLogic Server SE', vcpus: 2, memory_gb: 15, price: 105.00, unit: 'Mo', attributes: { os: 'Linux', tier: 'Premium', compute_type: 'Dedicated' } },
];
