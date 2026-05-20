/**
 * DigitalOcean App Platform Functions Pricing Configuration
 *
 * Pricing as of May 2026 (Consumption Plan)
 * - Compute: Included with DigitalOcean App Platform
 * - Invocations: Free tier includes 200M invocations/month
 * - After free tier: $0.0000015 per invocation
 * - Per-second execution: Included in the App Platform compute
 *
 * DigitalOcean Functions run on shared infrastructure
 * Memory allocation is automatic (not user-configurable)
 * Supported runtimes: Node.js, Python, Go
 *
 * Supported Languages: JavaScript (Node.js), Python, Go, TypeScript
 */

const DIGITALOCEAN_FUNCTIONS_LANGUAGES = ['JavaScript', 'Python', 'Go', 'TypeScript'];

export const DIGITALOCEAN_SERVERLESS = [
  // DigitalOcean Functions - Single Tier (Auto-scaled)
  {
    type: 'AppPlatform-Functions-Shared',
    vcpus: 1,
    memory: 0.512, // Approximate shared compute
    cpuVendor: 'Intel',
    price: 0, // Included in App Platform subscription or free tier
    supportedLanguages: DIGITALOCEAN_FUNCTIONS_LANGUAGES,
  },
];

export const DIGITALOCEAN_SERVERLESS_REGION = 'nyc';
export const DIGITALOCEAN_SERVERLESS_GEOGRAPHY = 'N. America';
