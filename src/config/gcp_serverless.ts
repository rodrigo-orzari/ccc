/**
 * GCP Cloud Run Pricing Configuration (Fallback)
 *
 * Pricing as of May 2026 (converted to per GB-hour for consistency)
 * CPU: $0.00002400 per vCPU-second
 * Memory: $0.00000250 per GB-second
 *
 * Common configurations: 1, 2, 4 vCPU with proportional memory
 * Note: GCP pricing is vCPU + Memory combined (not just memory like Lambda)
 */

export const GCP_SERVERLESS = [
  // 1 vCPU configurations (512MB to 2GB)
  {
    type: 'CloudRun-1vCPU-512MB',
    vcpus: 1,
    memory: 0.512,
    cpuVendor: 'Intel',
    price: (0.00002400 * 1 * 3600) + (0.00000250 * 0.512 * 3600),
  },
  {
    type: 'CloudRun-1vCPU-1GB',
    vcpus: 1,
    memory: 1,
    cpuVendor: 'Intel',
    price: (0.00002400 * 1 * 3600) + (0.00000250 * 1 * 3600),
  },
  {
    type: 'CloudRun-1vCPU-2GB',
    vcpus: 1,
    memory: 2,
    cpuVendor: 'Intel',
    price: (0.00002400 * 1 * 3600) + (0.00000250 * 2 * 3600),
  },

  // 2 vCPU configurations (1GB to 4GB)
  {
    type: 'CloudRun-2vCPU-1GB',
    vcpus: 2,
    memory: 1,
    cpuVendor: 'Intel',
    price: (0.00002400 * 2 * 3600) + (0.00000250 * 1 * 3600),
  },
  {
    type: 'CloudRun-2vCPU-2GB',
    vcpus: 2,
    memory: 2,
    cpuVendor: 'Intel',
    price: (0.00002400 * 2 * 3600) + (0.00000250 * 2 * 3600),
  },
  {
    type: 'CloudRun-2vCPU-4GB',
    vcpus: 2,
    memory: 4,
    cpuVendor: 'Intel',
    price: (0.00002400 * 2 * 3600) + (0.00000250 * 4 * 3600),
  },

  // 4 vCPU configurations (2GB to 8GB)
  {
    type: 'CloudRun-4vCPU-2GB',
    vcpus: 4,
    memory: 2,
    cpuVendor: 'Intel',
    price: (0.00002400 * 4 * 3600) + (0.00000250 * 2 * 3600),
  },
  {
    type: 'CloudRun-4vCPU-4GB',
    vcpus: 4,
    memory: 4,
    cpuVendor: 'Intel',
    price: (0.00002400 * 4 * 3600) + (0.00000250 * 4 * 3600),
  },
  {
    type: 'CloudRun-4vCPU-8GB',
    vcpus: 4,
    memory: 8,
    cpuVendor: 'Intel',
    price: (0.00002400 * 4 * 3600) + (0.00000250 * 8 * 3600),
  },
];

export const GCP_SERVERLESS_REGION = 'us-central1';
export const GCP_SERVERLESS_GEOGRAPHY = 'N. America';
