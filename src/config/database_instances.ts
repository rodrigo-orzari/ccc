// Static pricing data for cloud database services.
// Sources: GCP Cloud SQL (us-central1) and Oracle Autonomous Database (us-phoenix-1)
// on-demand / pay-as-you-go, USD per hour, as of early 2025.
// Update these when provider pricing pages change.

export interface CloudSqlInstanceConfig {
  type: string;
  vcpus: number;
  memory: number;
  price: number;
  engine: 'PostgreSQL' | 'MySQL' | 'SQL Server';
}

export interface OracleAutonomousConfig {
  type: string;
  ocpus: number;
  memory: number;
  price: number;
  workload: 'ATP' | 'ADW';
  deploymentType: 'Provisioned' | 'Serverless';
}

// GCP Cloud SQL — us-central1. Instance prices only (excludes storage, HA
// surcharge, and data egress). HA adds a 2× surcharge on top of these.
export const GCP_CLOUD_SQL_INSTANCES: CloudSqlInstanceConfig[] = [
  // Shared-core (micro / small)
  { type: 'db-f1-micro', vcpus: 0.6, memory: 0.6, price: 0.0136, engine: 'PostgreSQL' },
  { type: 'db-g1-small', vcpus: 0.6, memory: 1.7, price: 0.0250, engine: 'PostgreSQL' },

  // Standard — balanced vCPU : memory ratio (3.75 GB / vCPU)
  { type: 'db-n1-standard-1', vcpus: 1,  memory: 3.75,  price: 0.0494, engine: 'PostgreSQL' },
  { type: 'db-n1-standard-2', vcpus: 2,  memory: 7.5,   price: 0.0989, engine: 'PostgreSQL' },
  { type: 'db-n1-standard-4', vcpus: 4,  memory: 15,    price: 0.1977, engine: 'PostgreSQL' },
  { type: 'db-n1-standard-8', vcpus: 8,  memory: 30,    price: 0.3954, engine: 'PostgreSQL' },
  { type: 'db-n1-standard-16', vcpus: 16, memory: 60,   price: 0.7908, engine: 'PostgreSQL' },
  { type: 'db-n1-standard-32', vcpus: 32, memory: 120,  price: 1.5816, engine: 'PostgreSQL' },
  { type: 'db-n1-standard-64', vcpus: 64, memory: 240,  price: 3.1632, engine: 'PostgreSQL' },
  { type: 'db-n1-standard-96', vcpus: 96, memory: 360,  price: 4.7448, engine: 'PostgreSQL' },

  // Highmem — 6.5 GB / vCPU
  { type: 'db-n1-highmem-2',  vcpus: 2,  memory: 13,   price: 0.1319, engine: 'PostgreSQL' },
  { type: 'db-n1-highmem-4',  vcpus: 4,  memory: 26,   price: 0.2638, engine: 'PostgreSQL' },
  { type: 'db-n1-highmem-8',  vcpus: 8,  memory: 52,   price: 0.5275, engine: 'PostgreSQL' },
  { type: 'db-n1-highmem-16', vcpus: 16, memory: 104,  price: 1.0550, engine: 'PostgreSQL' },
  { type: 'db-n1-highmem-32', vcpus: 32, memory: 208,  price: 2.1100, engine: 'PostgreSQL' },
  { type: 'db-n1-highmem-64', vcpus: 64, memory: 416,  price: 4.2200, engine: 'PostgreSQL' },
  { type: 'db-n1-highmem-96', vcpus: 96, memory: 624,  price: 6.3300, engine: 'PostgreSQL' },

  // MySQL — same instance shapes, same prices (storage / HA may differ)
  { type: 'db-n1-standard-1',  vcpus: 1,  memory: 3.75, price: 0.0494, engine: 'MySQL' },
  { type: 'db-n1-standard-2',  vcpus: 2,  memory: 7.5,  price: 0.0989, engine: 'MySQL' },
  { type: 'db-n1-standard-4',  vcpus: 4,  memory: 15,   price: 0.1977, engine: 'MySQL' },
  { type: 'db-n1-standard-8',  vcpus: 8,  memory: 30,   price: 0.3954, engine: 'MySQL' },
  { type: 'db-n1-standard-16', vcpus: 16, memory: 60,   price: 0.7908, engine: 'MySQL' },
  { type: 'db-n1-highmem-4',   vcpus: 4,  memory: 26,   price: 0.2638, engine: 'MySQL' },
  { type: 'db-n1-highmem-8',   vcpus: 8,  memory: 52,   price: 0.5275, engine: 'MySQL' },
  { type: 'db-n1-highmem-16',  vcpus: 16, memory: 104,  price: 1.0550, engine: 'MySQL' },

  // SQL Server Enterprise (highest SQL Server tier)
  { type: 'db-n1-standard-2-sqlserver',  vcpus: 2,  memory: 7.5, price: 0.4160, engine: 'SQL Server' },
  { type: 'db-n1-standard-4-sqlserver',  vcpus: 4,  memory: 15,  price: 0.7840, engine: 'SQL Server' },
  { type: 'db-n1-standard-8-sqlserver',  vcpus: 8,  memory: 30,  price: 1.5200, engine: 'SQL Server' },
  { type: 'db-n1-standard-16-sqlserver', vcpus: 16, memory: 60,  price: 3.0400, engine: 'SQL Server' },
  { type: 'db-n1-highmem-4-sqlserver',   vcpus: 4,  memory: 26,  price: 0.8960, engine: 'SQL Server' },
  { type: 'db-n1-highmem-8-sqlserver',   vcpus: 8,  memory: 52,  price: 1.7920, engine: 'SQL Server' },
];

export const GCP_CLOUD_SQL_REGION = 'us-central1';
export const GCP_CLOUD_SQL_GEOGRAPHY = 'N. America';

// Oracle Autonomous Database — us-phoenix-1.
// Prices are per OCPU-hour, License Included (BYOL is ~40% lower).
// 1 OCPU ≈ 2 vCPUs in comparable workloads.
// Memory: 15 GB per OCPU for ATP; 15 GB per OCPU for ADW.
export const ORACLE_AUTONOMOUS_INSTANCES: OracleAutonomousConfig[] = [
  // ATP Provisioned (1 – 128 OCPUs in 1-OCPU increments)
  { type: 'atp-1ocpu',   ocpus: 1,   memory: 15,   price: 0.6048, workload: 'ATP', deploymentType: 'Provisioned' },
  { type: 'atp-2ocpu',   ocpus: 2,   memory: 30,   price: 1.2096, workload: 'ATP', deploymentType: 'Provisioned' },
  { type: 'atp-4ocpu',   ocpus: 4,   memory: 60,   price: 2.4192, workload: 'ATP', deploymentType: 'Provisioned' },
  { type: 'atp-8ocpu',   ocpus: 8,   memory: 120,  price: 4.8384, workload: 'ATP', deploymentType: 'Provisioned' },
  { type: 'atp-16ocpu',  ocpus: 16,  memory: 240,  price: 9.6768, workload: 'ATP', deploymentType: 'Provisioned' },
  { type: 'atp-32ocpu',  ocpus: 32,  memory: 480,  price: 19.353, workload: 'ATP', deploymentType: 'Provisioned' },
  { type: 'atp-64ocpu',  ocpus: 64,  memory: 960,  price: 38.707, workload: 'ATP', deploymentType: 'Provisioned' },
  { type: 'atp-128ocpu', ocpus: 128, memory: 1920, price: 77.414, workload: 'ATP', deploymentType: 'Provisioned' },

  // ADW Provisioned
  { type: 'adw-1ocpu',   ocpus: 1,   memory: 15,   price: 0.6048, workload: 'ADW', deploymentType: 'Provisioned' },
  { type: 'adw-2ocpu',   ocpus: 2,   memory: 30,   price: 1.2096, workload: 'ADW', deploymentType: 'Provisioned' },
  { type: 'adw-4ocpu',   ocpus: 4,   memory: 60,   price: 2.4192, workload: 'ADW', deploymentType: 'Provisioned' },
  { type: 'adw-8ocpu',   ocpus: 8,   memory: 120,  price: 4.8384, workload: 'ADW', deploymentType: 'Provisioned' },
  { type: 'adw-16ocpu',  ocpus: 16,  memory: 240,  price: 9.6768, workload: 'ADW', deploymentType: 'Provisioned' },
  { type: 'adw-32ocpu',  ocpus: 32,  memory: 480,  price: 19.353, workload: 'ADW', deploymentType: 'Provisioned' },

  // ATP Serverless (billed per ECPU; 1 ECPU ≈ 0.25 OCPU)
  { type: 'atp-serverless',  ocpus: 0, memory: 0, price: 0.1512, workload: 'ATP', deploymentType: 'Serverless' },
  { type: 'adw-serverless',  ocpus: 0, memory: 0, price: 0.1512, workload: 'ADW', deploymentType: 'Serverless' },
];

export const ORACLE_AUTONOMOUS_REGION = 'us-phoenix-1';
export const ORACLE_AUTONOMOUS_GEOGRAPHY = 'N. America';
