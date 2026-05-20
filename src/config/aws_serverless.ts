/**
 * AWS Lambda Pricing Configuration (Fallback)
 *
 * Pricing as of May 2026 (GB-second rates converted to GB-hour)
 * x86 (Intel):    $0.0000166667 per GB-second
 * ARM (Graviton): $0.0000133334 per GB-second (20% discount)
 *
 * Memory range: 128MB to 10,240MB
 * All tiers include both x86 and ARM architecture options
 */

export const AWS_SERVERLESS = [
  // 128MB tier
  { type: 'Lambda-128MB-x86', vcpus: 1, memory: 0.125, cpuVendor: 'Intel', price: 0.0000166667 * 3600 * 0.125 },
  { type: 'Lambda-128MB-ARM', vcpus: 1, memory: 0.125, cpuVendor: 'AWS', price: 0.0000133334 * 3600 * 0.125 },

  // 256MB tier
  { type: 'Lambda-256MB-x86', vcpus: 1, memory: 0.256, cpuVendor: 'Intel', price: 0.0000166667 * 3600 * 0.256 },
  { type: 'Lambda-256MB-ARM', vcpus: 1, memory: 0.256, cpuVendor: 'AWS', price: 0.0000133334 * 3600 * 0.256 },

  // 512MB tier
  { type: 'Lambda-512MB-x86', vcpus: 1, memory: 0.512, cpuVendor: 'Intel', price: 0.0000166667 * 3600 * 0.512 },
  { type: 'Lambda-512MB-ARM', vcpus: 1, memory: 0.512, cpuVendor: 'AWS', price: 0.0000133334 * 3600 * 0.512 },

  // 1GB tier
  { type: 'Lambda-1GB-x86', vcpus: 1, memory: 1, cpuVendor: 'Intel', price: 0.0000166667 * 3600 * 1 },
  { type: 'Lambda-1GB-ARM', vcpus: 1, memory: 1, cpuVendor: 'AWS', price: 0.0000133334 * 3600 * 1 },

  // 1.5GB tier
  { type: 'Lambda-1536MB-x86', vcpus: 1, memory: 1.5, cpuVendor: 'Intel', price: 0.0000166667 * 3600 * 1.5 },
  { type: 'Lambda-1536MB-ARM', vcpus: 1, memory: 1.5, cpuVendor: 'AWS', price: 0.0000133334 * 3600 * 1.5 },

  // 2GB tier
  { type: 'Lambda-2GB-x86', vcpus: 1, memory: 2, cpuVendor: 'Intel', price: 0.0000166667 * 3600 * 2 },
  { type: 'Lambda-2GB-ARM', vcpus: 1, memory: 2, cpuVendor: 'AWS', price: 0.0000133334 * 3600 * 2 },

  // 2.5GB tier
  { type: 'Lambda-2560MB-x86', vcpus: 1, memory: 2.5, cpuVendor: 'Intel', price: 0.0000166667 * 3600 * 2.5 },
  { type: 'Lambda-2560MB-ARM', vcpus: 1, memory: 2.5, cpuVendor: 'AWS', price: 0.0000133334 * 3600 * 2.5 },

  // 3GB tier
  { type: 'Lambda-3GB-x86', vcpus: 1, memory: 3, cpuVendor: 'Intel', price: 0.0000166667 * 3600 * 3 },
  { type: 'Lambda-3GB-ARM', vcpus: 1, memory: 3, cpuVendor: 'AWS', price: 0.0000133334 * 3600 * 3 },

  // 3.5GB tier
  { type: 'Lambda-3584MB-x86', vcpus: 1, memory: 3.5, cpuVendor: 'Intel', price: 0.0000166667 * 3600 * 3.5 },
  { type: 'Lambda-3584MB-ARM', vcpus: 1, memory: 3.5, cpuVendor: 'AWS', price: 0.0000133334 * 3600 * 3.5 },

  // 4GB tier
  { type: 'Lambda-4GB-x86', vcpus: 1, memory: 4, cpuVendor: 'Intel', price: 0.0000166667 * 3600 * 4 },
  { type: 'Lambda-4GB-ARM', vcpus: 1, memory: 4, cpuVendor: 'AWS', price: 0.0000133334 * 3600 * 4 },

  // 4.5GB tier
  { type: 'Lambda-4608MB-x86', vcpus: 1, memory: 4.5, cpuVendor: 'Intel', price: 0.0000166667 * 3600 * 4.5 },
  { type: 'Lambda-4608MB-ARM', vcpus: 1, memory: 4.5, cpuVendor: 'AWS', price: 0.0000133334 * 3600 * 4.5 },

  // 5GB tier
  { type: 'Lambda-5GB-x86', vcpus: 1, memory: 5, cpuVendor: 'Intel', price: 0.0000166667 * 3600 * 5 },
  { type: 'Lambda-5GB-ARM', vcpus: 1, memory: 5, cpuVendor: 'AWS', price: 0.0000133334 * 3600 * 5 },

  // 5.5GB tier
  { type: 'Lambda-5632MB-x86', vcpus: 1, memory: 5.5, cpuVendor: 'Intel', price: 0.0000166667 * 3600 * 5.5 },
  { type: 'Lambda-5632MB-ARM', vcpus: 1, memory: 5.5, cpuVendor: 'AWS', price: 0.0000133334 * 3600 * 5.5 },

  // 6GB tier
  { type: 'Lambda-6GB-x86', vcpus: 1, memory: 6, cpuVendor: 'Intel', price: 0.0000166667 * 3600 * 6 },
  { type: 'Lambda-6GB-ARM', vcpus: 1, memory: 6, cpuVendor: 'AWS', price: 0.0000133334 * 3600 * 6 },

  // 6.5GB tier
  { type: 'Lambda-6656MB-x86', vcpus: 1, memory: 6.5, cpuVendor: 'Intel', price: 0.0000166667 * 3600 * 6.5 },
  { type: 'Lambda-6656MB-ARM', vcpus: 1, memory: 6.5, cpuVendor: 'AWS', price: 0.0000133334 * 3600 * 6.5 },

  // 7GB tier
  { type: 'Lambda-7GB-x86', vcpus: 1, memory: 7, cpuVendor: 'Intel', price: 0.0000166667 * 3600 * 7 },
  { type: 'Lambda-7GB-ARM', vcpus: 1, memory: 7, cpuVendor: 'AWS', price: 0.0000133334 * 3600 * 7 },

  // 7.5GB tier
  { type: 'Lambda-7680MB-x86', vcpus: 1, memory: 7.5, cpuVendor: 'Intel', price: 0.0000166667 * 3600 * 7.5 },
  { type: 'Lambda-7680MB-ARM', vcpus: 1, memory: 7.5, cpuVendor: 'AWS', price: 0.0000133334 * 3600 * 7.5 },

  // 8GB tier
  { type: 'Lambda-8GB-x86', vcpus: 1, memory: 8, cpuVendor: 'Intel', price: 0.0000166667 * 3600 * 8 },
  { type: 'Lambda-8GB-ARM', vcpus: 1, memory: 8, cpuVendor: 'AWS', price: 0.0000133334 * 3600 * 8 },

  // 8.5GB tier
  { type: 'Lambda-8704MB-x86', vcpus: 1, memory: 8.5, cpuVendor: 'Intel', price: 0.0000166667 * 3600 * 8.5 },
  { type: 'Lambda-8704MB-ARM', vcpus: 1, memory: 8.5, cpuVendor: 'AWS', price: 0.0000133334 * 3600 * 8.5 },

  // 9GB tier
  { type: 'Lambda-9GB-x86', vcpus: 1, memory: 9, cpuVendor: 'Intel', price: 0.0000166667 * 3600 * 9 },
  { type: 'Lambda-9GB-ARM', vcpus: 1, memory: 9, cpuVendor: 'AWS', price: 0.0000133334 * 3600 * 9 },

  // 9.5GB tier
  { type: 'Lambda-9728MB-x86', vcpus: 1, memory: 9.5, cpuVendor: 'Intel', price: 0.0000166667 * 3600 * 9.5 },
  { type: 'Lambda-9728MB-ARM', vcpus: 1, memory: 9.5, cpuVendor: 'AWS', price: 0.0000133334 * 3600 * 9.5 },

  // 10GB tier (max supported)
  { type: 'Lambda-10GB-x86', vcpus: 1, memory: 10, cpuVendor: 'Intel', price: 0.0000166667 * 3600 * 10 },
  { type: 'Lambda-10GB-ARM', vcpus: 1, memory: 10, cpuVendor: 'AWS', price: 0.0000133334 * 3600 * 10 },
];

export const AWS_SERVERLESS_REGION = 'us-east-1';
export const AWS_SERVERLESS_GEOGRAPHY = 'N. America';
