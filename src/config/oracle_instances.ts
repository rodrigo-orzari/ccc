// Oracle Cloud Infrastructure (OCI) Compute instance pricing.
//
// OCI does not currently expose a public, no-auth pricing API, so this
// catalogue is maintained manually. Source: https://www.oracle.com/cloud/compute/pricing/
// To update prices: edit the entries below; the next pipeline run will refresh
// the database. Keep `cpuVendor` accurate (it drives the Arch derivation).

export interface OracleInstanceConfig {
  type: string;
  vcpus: number;
  memory: number;
  price: number;
  cpuVendor: 'Intel' | 'AMD' | 'Ampere' | 'AWS';
}

export const ORACLE_REGION = 'us-phoenix-1';
export const ORACLE_GEOGRAPHY = 'N. America';

export const ORACLE_INSTANCES: OracleInstanceConfig[] = [
  { type: 'VM.Standard.E4.Flex',  vcpus: 1, memory: 16, price: 0.025, cpuVendor: 'AMD' },
  { type: 'VM.Standard3.Flex',    vcpus: 1, memory: 16, price: 0.04,  cpuVendor: 'Intel' },
  { type: 'VM.Standard.A1.Flex',  vcpus: 1, memory: 6,  price: 0.015, cpuVendor: 'Ampere' },
];
