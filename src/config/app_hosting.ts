/**
 * Static Fallback Config for App Hosting (PaaS)
 *
 * Services like Azure App Service, AWS App Runner, GCP App Engine, DigitalOcean
 * App Platform, Oracle WebLogic, Alibaba Web+. These are "give us your code,
 * we'll run it" platforms — not raw VMs, not pure serverless functions.
 *
 * Pricing is normalized to monthly (Mo) where possible. tier/compute_type map
 * to the APP_HOSTING_TIERS / APP_HOSTING_COMPUTE_TYPES filter enums.
 */

type Row = {
  type: string;
  vcpus: number;
  memory_gb: number;
  price: number;
  unit: string;
  attributes: { os: string; tier: string; compute_type: string; runtime?: string };
};

export const AZURE_APP_HOSTING: Row[] = [
  { type: 'App Service Free F1',      vcpus: 1, memory_gb: 1,    price: 0,      unit: 'Mo', attributes: { os: 'Linux',   tier: 'Free',     compute_type: 'Shared' } },
  { type: 'App Service Basic B1',     vcpus: 1, memory_gb: 1.75, price: 54.75,  unit: 'Mo', attributes: { os: 'Linux',   tier: 'Basic',    compute_type: 'Dedicated' } },
  { type: 'App Service Basic B2',     vcpus: 2, memory_gb: 3.5,  price: 109.50, unit: 'Mo', attributes: { os: 'Linux',   tier: 'Basic',    compute_type: 'Dedicated' } },
  { type: 'App Service Standard S1',  vcpus: 1, memory_gb: 1.75, price: 73.00,  unit: 'Mo', attributes: { os: 'Linux',   tier: 'Standard', compute_type: 'Dedicated' } },
  { type: 'App Service Premium P1v3', vcpus: 2, memory_gb: 8,    price: 164.25, unit: 'Mo', attributes: { os: 'Linux',   tier: 'Premium',  compute_type: 'Dedicated' } },
  { type: 'App Service Premium P2v3', vcpus: 4, memory_gb: 16,   price: 328.50, unit: 'Mo', attributes: { os: 'Linux',   tier: 'Premium',  compute_type: 'Dedicated' } },
  { type: 'App Service Premium P3v3', vcpus: 8, memory_gb: 32,   price: 657.00, unit: 'Mo', attributes: { os: 'Linux',   tier: 'Premium',  compute_type: 'Dedicated' } },
  { type: 'Static Web Apps Standard', vcpus: 0, memory_gb: 0,    price: 9.00,   unit: 'Mo', attributes: { os: 'Linux',   tier: 'Standard', compute_type: 'Shared' } },
];

export const AWS_APP_HOSTING: Row[] = [
  { type: 'App Runner 0.25vCPU/0.5GB', vcpus: 1, memory_gb: 0.5, price: 11.70,  unit: 'Mo', attributes: { os: 'Linux', tier: 'Basic',    compute_type: 'Dedicated' } },
  { type: 'App Runner 1vCPU/2GB',      vcpus: 1, memory_gb: 2,   price: 46.80,  unit: 'Mo', attributes: { os: 'Linux', tier: 'Standard', compute_type: 'Dedicated' } },
  { type: 'App Runner 2vCPU/4GB',      vcpus: 2, memory_gb: 4,   price: 93.60,  unit: 'Mo', attributes: { os: 'Linux', tier: 'Standard', compute_type: 'Dedicated' } },
  { type: 'App Runner 4vCPU/8GB',      vcpus: 4, memory_gb: 8,   price: 187.20, unit: 'Mo', attributes: { os: 'Linux', tier: 'Premium',  compute_type: 'Dedicated' } },
  { type: 'Lightsail Containers Nano', vcpus: 1, memory_gb: 0.5, price: 7.00,   unit: 'Mo', attributes: { os: 'Linux', tier: 'Basic',    compute_type: 'Shared' } },
  { type: 'Lightsail Containers Small', vcpus: 1, memory_gb: 2,   price: 20.00,  unit: 'Mo', attributes: { os: 'Linux', tier: 'Standard', compute_type: 'Shared' } },
  { type: 'Amplify Hosting Build+Serve', vcpus: 0, memory_gb: 0, price: 13.10, unit: 'Mo', attributes: { os: 'Linux', tier: 'Standard', compute_type: 'Shared', runtime: 'Static + SSR' } },
];

export const GCP_APP_HOSTING: Row[] = [
  { type: 'App Engine Standard F1 (Free)', vcpus: 1, memory_gb: 0.128, price: 0,      unit: 'Mo', attributes: { os: 'Linux', tier: 'Free',     compute_type: 'Shared' } },
  { type: 'App Engine Standard F2',        vcpus: 1, memory_gb: 0.256, price: 36.50,  unit: 'Mo', attributes: { os: 'Linux', tier: 'Basic',    compute_type: 'Shared' } },
  { type: 'App Engine Standard F4',        vcpus: 1, memory_gb: 0.512, price: 73.00,  unit: 'Mo', attributes: { os: 'Linux', tier: 'Standard', compute_type: 'Shared' } },
  { type: 'App Engine Standard F4_1G',     vcpus: 1, memory_gb: 1,     price: 109.50, unit: 'Mo', attributes: { os: 'Linux', tier: 'Standard', compute_type: 'Shared' } },
  { type: 'App Engine Flex 1vCPU/2GB',     vcpus: 1, memory_gb: 2,     price: 50.00,  unit: 'Mo', attributes: { os: 'Linux', tier: 'Standard', compute_type: 'Dedicated' } },
  { type: 'App Engine Flex 2vCPU/4GB',     vcpus: 2, memory_gb: 4,     price: 85.00,  unit: 'Mo', attributes: { os: 'Linux', tier: 'Premium',  compute_type: 'Dedicated' } },
  { type: 'Firebase Hosting',              vcpus: 0, memory_gb: 0,     price: 0.026,  unit: 'per GB transferred', attributes: { os: 'Linux', tier: 'Free',   compute_type: 'Shared', runtime: 'Static' } },
];

export const DO_APP_HOSTING: Row[] = [
  { type: 'App Platform Static',          vcpus: 0, memory_gb: 0,   price: 0,     unit: 'Mo', attributes: { os: 'Linux', tier: 'Free',         compute_type: 'Shared' } },
  { type: 'App Platform Basic XXS',       vcpus: 1, memory_gb: 0.5, price: 5.00,  unit: 'Mo', attributes: { os: 'Linux', tier: 'Basic',        compute_type: 'Shared' } },
  { type: 'App Platform Basic XS',        vcpus: 1, memory_gb: 1,   price: 10.00, unit: 'Mo', attributes: { os: 'Linux', tier: 'Basic',        compute_type: 'Shared' } },
  { type: 'App Platform Professional XS', vcpus: 1, memory_gb: 2,   price: 20.00, unit: 'Mo', attributes: { os: 'Linux', tier: 'Professional', compute_type: 'Dedicated' } },
  { type: 'App Platform Professional S',  vcpus: 2, memory_gb: 4,   price: 40.00, unit: 'Mo', attributes: { os: 'Linux', tier: 'Professional', compute_type: 'Dedicated' } },
  { type: 'App Platform Professional M',  vcpus: 4, memory_gb: 8,   price: 80.00, unit: 'Mo', attributes: { os: 'Linux', tier: 'Professional', compute_type: 'Dedicated' } },
];

export const ORACLE_APP_HOSTING: Row[] = [
  { type: 'WebLogic Server SE',    vcpus: 2, memory_gb: 15, price: 105.00, unit: 'Mo', attributes: { os: 'Linux', tier: 'Standard', compute_type: 'Dedicated' } },
  { type: 'WebLogic Server EE',    vcpus: 2, memory_gb: 15, price: 252.00, unit: 'Mo', attributes: { os: 'Linux', tier: 'Premium',  compute_type: 'Dedicated' } },
  { type: 'WebLogic Server Suite', vcpus: 4, memory_gb: 30, price: 720.00, unit: 'Mo', attributes: { os: 'Linux', tier: 'Premium',  compute_type: 'Dedicated' } },
];

export const ALIBABA_APP_HOSTING: Row[] = [
  { type: 'Simple App Server 1C1G',  vcpus: 1, memory_gb: 1, price: 3.50,  unit: 'Mo', attributes: { os: 'Linux', tier: 'Basic',        compute_type: 'Shared' } },
  { type: 'Simple App Server 2C2G',  vcpus: 2, memory_gb: 2, price: 9.00,  unit: 'Mo', attributes: { os: 'Linux', tier: 'Standard',     compute_type: 'Shared' } },
  { type: 'Simple App Server 2C4G',  vcpus: 2, memory_gb: 4, price: 18.00, unit: 'Mo', attributes: { os: 'Linux', tier: 'Standard',     compute_type: 'Shared' } },
  { type: 'Simple App Server 4C8G',  vcpus: 4, memory_gb: 8, price: 36.00, unit: 'Mo', attributes: { os: 'Linux', tier: 'Standard',     compute_type: 'Shared' } },
  { type: 'Web+ Standard',           vcpus: 2, memory_gb: 4, price: 42.00, unit: 'Mo', attributes: { os: 'Linux', tier: 'Professional', compute_type: 'Dedicated' } },
  { type: 'Web+ Premium',            vcpus: 4, memory_gb: 8, price: 84.00, unit: 'Mo', attributes: { os: 'Linux', tier: 'Premium',      compute_type: 'Dedicated' } },
];
