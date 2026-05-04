// Static pricing data for cloud database services.
// Sources: GCP Cloud SQL (us-central1), Oracle Autonomous DB (us-phoenix-1),
// DigitalOcean Managed Databases (nyc1).
// On-demand / pay-as-you-go, USD per hour.
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
  price: number;
  workload: 'ATP' | 'ADW';
}

export interface DigitalOceanDbInstanceConfig {
  type: string;
  vcpus: number;
  memory: number;
  price: number;
  engine: 'PostgreSQL' | 'MySQL' | 'MongoDB' | 'Valkey';
}

// ─── GCP Cloud SQL ─────────────────────────────────────────────────────────────
// us-central1, instance prices only (excludes storage, HA surcharge, egress).
// HA adds a 2× surcharge on top. Updated May 2025.
export const GCP_CLOUD_SQL_INSTANCES: CloudSqlInstanceConfig[] = [
  // Shared-core
  { type: 'db-f1-micro', vcpus: 0.6, memory: 0.6, price: 0.0136, engine: 'PostgreSQL' },
  { type: 'db-g1-small', vcpus: 0.6, memory: 1.7, price: 0.0250, engine: 'PostgreSQL' },

  // Standard — 3.75 GB/vCPU (N1, Enterprise edition)
  { type: 'db-n1-standard-1',  vcpus: 1,  memory: 3.75,  price: 0.0494, engine: 'PostgreSQL' },
  { type: 'db-n1-standard-2',  vcpus: 2,  memory: 7.5,   price: 0.0989, engine: 'PostgreSQL' },
  { type: 'db-n1-standard-4',  vcpus: 4,  memory: 15,    price: 0.1977, engine: 'PostgreSQL' },
  { type: 'db-n1-standard-8',  vcpus: 8,  memory: 30,    price: 0.3954, engine: 'PostgreSQL' },
  { type: 'db-n1-standard-16', vcpus: 16, memory: 60,    price: 0.7908, engine: 'PostgreSQL' },
  { type: 'db-n1-standard-32', vcpus: 32, memory: 120,   price: 1.5816, engine: 'PostgreSQL' },
  { type: 'db-n1-standard-64', vcpus: 64, memory: 240,   price: 3.1632, engine: 'PostgreSQL' },
  { type: 'db-n1-standard-96', vcpus: 96, memory: 360,   price: 4.7448, engine: 'PostgreSQL' },

  // Highmem — 6.5 GB/vCPU (N1, Enterprise edition)
  { type: 'db-n1-highmem-2',  vcpus: 2,  memory: 13,   price: 0.1319, engine: 'PostgreSQL' },
  { type: 'db-n1-highmem-4',  vcpus: 4,  memory: 26,   price: 0.2638, engine: 'PostgreSQL' },
  { type: 'db-n1-highmem-8',  vcpus: 8,  memory: 52,   price: 0.5275, engine: 'PostgreSQL' },
  { type: 'db-n1-highmem-16', vcpus: 16, memory: 104,  price: 1.0550, engine: 'PostgreSQL' },
  { type: 'db-n1-highmem-32', vcpus: 32, memory: 208,  price: 2.1100, engine: 'PostgreSQL' },
  { type: 'db-n1-highmem-64', vcpus: 64, memory: 416,  price: 4.2200, engine: 'PostgreSQL' },
  { type: 'db-n1-highmem-96', vcpus: 96, memory: 624,  price: 6.3300, engine: 'PostgreSQL' },

  // MySQL — N1 shapes (same per-CPU price as PostgreSQL)
  { type: 'db-n1-standard-1',  vcpus: 1,  memory: 3.75, price: 0.0494, engine: 'MySQL' },
  { type: 'db-n1-standard-2',  vcpus: 2,  memory: 7.5,  price: 0.0989, engine: 'MySQL' },
  { type: 'db-n1-standard-4',  vcpus: 4,  memory: 15,   price: 0.1977, engine: 'MySQL' },
  { type: 'db-n1-standard-8',  vcpus: 8,  memory: 30,   price: 0.3954, engine: 'MySQL' },
  { type: 'db-n1-standard-16', vcpus: 16, memory: 60,   price: 0.7908, engine: 'MySQL' },
  { type: 'db-n1-standard-32', vcpus: 32, memory: 120,  price: 1.5816, engine: 'MySQL' },
  { type: 'db-n1-standard-64', vcpus: 64, memory: 240,  price: 3.1632, engine: 'MySQL' },
  { type: 'db-n1-highmem-4',   vcpus: 4,  memory: 26,   price: 0.2638, engine: 'MySQL' },
  { type: 'db-n1-highmem-8',   vcpus: 8,  memory: 52,   price: 0.5275, engine: 'MySQL' },
  { type: 'db-n1-highmem-16',  vcpus: 16, memory: 104,  price: 1.0550, engine: 'MySQL' },
  { type: 'db-n1-highmem-32',  vcpus: 32, memory: 208,  price: 2.1100, engine: 'MySQL' },
  { type: 'db-n1-highmem-64',  vcpus: 64, memory: 416,  price: 4.2200, engine: 'MySQL' },

  // SQL Server Enterprise — N1 shapes
  { type: 'db-n1-standard-2-sqlserver',  vcpus: 2,  memory: 7.5,  price: 0.4160, engine: 'SQL Server' },
  { type: 'db-n1-standard-4-sqlserver',  vcpus: 4,  memory: 15,   price: 0.7840, engine: 'SQL Server' },
  { type: 'db-n1-standard-8-sqlserver',  vcpus: 8,  memory: 30,   price: 1.5200, engine: 'SQL Server' },
  { type: 'db-n1-standard-16-sqlserver', vcpus: 16, memory: 60,   price: 3.0400, engine: 'SQL Server' },
  { type: 'db-n1-highmem-4-sqlserver',   vcpus: 4,  memory: 26,   price: 0.8960, engine: 'SQL Server' },
  { type: 'db-n1-highmem-8-sqlserver',   vcpus: 8,  memory: 52,   price: 1.7920, engine: 'SQL Server' },
  { type: 'db-n1-highmem-16-sqlserver',  vcpus: 16, memory: 104,  price: 3.5840, engine: 'SQL Server' },
];

export const GCP_CLOUD_SQL_REGION    = 'us-central1';
export const GCP_CLOUD_SQL_GEOGRAPHY = 'N. America';

// ─── Oracle Autonomous Database ────────────────────────────────────────────────
// us-phoenix-1, Serverless (formerly Shared) tier.
// Billing metric: ECPU-Hour (License Included). OCPU billing was retired in 2024.
// Price: $0.336/ECPU-hr for ATP and ADW (verified May 2025).
// Serverless auto-scales; vcpus and memory are reported as 0.
export const ORACLE_AUTONOMOUS_INSTANCES: OracleAutonomousConfig[] = [
  { type: 'atp-serverless', price: 0.336, workload: 'ATP' },
  { type: 'adw-serverless', price: 0.336, workload: 'ADW' },
];

export const ORACLE_AUTONOMOUS_REGION    = 'us-phoenix-1';
export const ORACLE_AUTONOMOUS_GEOGRAPHY = 'N. America';

// ─── DigitalOcean Managed Databases ────────────────────────────────────────────
// nyc1. Single-node (primary only) hourly prices from digitalocean.com/pricing/managed-databases.
// HA (standby replica) doubles the cost. Updated May 2025.
export const DIGITALOCEAN_DB_INSTANCES: DigitalOceanDbInstanceConfig[] = [
  // PostgreSQL
  { type: 'db-s-1vcpu-1gb-pg',  engine: 'PostgreSQL', vcpus: 1,  memory: 1,  price: 0.02254 },
  { type: 'db-s-1vcpu-2gb-pg',  engine: 'PostgreSQL', vcpus: 1,  memory: 2,  price: 0.04531 },
  { type: 'db-s-2vcpu-4gb-pg',  engine: 'PostgreSQL', vcpus: 2,  memory: 4,  price: 0.09063 },
  { type: 'db-s-4vcpu-8gb-pg',  engine: 'PostgreSQL', vcpus: 4,  memory: 8,  price: 0.18170 },
  { type: 'db-s-6vcpu-16gb-pg', engine: 'PostgreSQL', vcpus: 6,  memory: 16, price: 0.36362 },

  // MySQL
  { type: 'db-s-1vcpu-1gb-mysql',  engine: 'MySQL', vcpus: 1,  memory: 1,  price: 0.02254 },
  { type: 'db-s-1vcpu-2gb-mysql',  engine: 'MySQL', vcpus: 1,  memory: 2,  price: 0.04531 },
  { type: 'db-s-2vcpu-4gb-mysql',  engine: 'MySQL', vcpus: 2,  memory: 4,  price: 0.09063 },
  { type: 'db-s-4vcpu-8gb-mysql',  engine: 'MySQL', vcpus: 4,  memory: 8,  price: 0.18170 },
  { type: 'db-s-6vcpu-16gb-mysql', engine: 'MySQL', vcpus: 6,  memory: 16, price: 0.36362 },

  // MongoDB
  { type: 'db-s-1vcpu-1gb-mongodb',   engine: 'MongoDB', vcpus: 1,  memory: 1,  price: 0.02266 },
  { type: 'db-s-1vcpu-2gb-mongodb',   engine: 'MongoDB', vcpus: 1,  memory: 2,  price: 0.04540 },
  { type: 'db-s-2vcpu-4gb-mongodb',   engine: 'MongoDB', vcpus: 2,  memory: 4,  price: 0.09054 },
  { type: 'db-s-4vcpu-8gb-mongodb',   engine: 'MongoDB', vcpus: 4,  memory: 8,  price: 0.18125 },
  { type: 'db-s-6vcpu-16gb-mongodb',  engine: 'MongoDB', vcpus: 6,  memory: 16, price: 0.36268 },
  { type: 'db-s-8vcpu-32gb-mongodb',  engine: 'MongoDB', vcpus: 8,  memory: 32, price: 0.72554 },
  { type: 'db-s-16vcpu-64gb-mongodb', engine: 'MongoDB', vcpus: 16, memory: 64, price: 1.45125 },

  // Valkey (Redis-compatible open-source fork, replaces Redis on DO)
  { type: 'db-s-1vcpu-1gb-valkey',   engine: 'Valkey', vcpus: 1,  memory: 1,  price: 0.02232 },
  { type: 'db-s-1vcpu-2gb-valkey',   engine: 'Valkey', vcpus: 1,  memory: 2,  price: 0.04464 },
  { type: 'db-s-2vcpu-4gb-valkey',   engine: 'Valkey', vcpus: 2,  memory: 4,  price: 0.08929 },
  { type: 'db-s-4vcpu-8gb-valkey',   engine: 'Valkey', vcpus: 4,  memory: 8,  price: 0.17857 },
  { type: 'db-s-6vcpu-16gb-valkey',  engine: 'Valkey', vcpus: 6,  memory: 16, price: 0.35714 },
  { type: 'db-s-8vcpu-32gb-valkey',  engine: 'Valkey', vcpus: 8,  memory: 32, price: 0.71429 },
  { type: 'db-s-16vcpu-64gb-valkey', engine: 'Valkey', vcpus: 16, memory: 64, price: 1.42857 },
];

export const DIGITALOCEAN_DB_REGION    = 'nyc1';
export const DIGITALOCEAN_DB_GEOGRAPHY = 'N. America';
