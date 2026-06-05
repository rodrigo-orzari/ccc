export const ALIBABA_DB_REGION = 'ap-southeast-1';
export const ALIBABA_DB_GEOGRAPHY = 'Asia Pacific';

export const ALIBABA_DB_INSTANCES = [
  // ApsaraDB RDS for MySQL (High Availability Edition)
  { type: 'mysql.n2.small.2c', engine: 'MySQL', vcpus: 2, memory: 4, price: 0.12 },
  { type: 'mysql.n4.large.2c', engine: 'MySQL', vcpus: 4, memory: 8, price: 0.24 },
  { type: 'mysql.n8.xlarge.2c', engine: 'MySQL', vcpus: 8, memory: 16, price: 0.48 },

  // ApsaraDB RDS for PostgreSQL (High Availability Edition)
  { type: 'pg.n2.small.2c', engine: 'PostgreSQL', vcpus: 2, memory: 4, price: 0.13 },
  { type: 'pg.n4.large.2c', engine: 'PostgreSQL', vcpus: 4, memory: 8, price: 0.26 },
  { type: 'pg.n8.xlarge.2c', engine: 'PostgreSQL', vcpus: 8, memory: 16, price: 0.52 },
];
