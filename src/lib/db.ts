import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL Connection via Postgres.js
const sql = postgres(process.env.DATABASE_URL || '', {
  ssl: process.env.DATABASE_CA_CERT ? {
    rejectUnauthorized: false,
    ca: Buffer.from(process.env.DATABASE_CA_CERT, 'base64')
  } : {
    rejectUnauthorized: false
  },
  max: 10,
  idle_timeout: 20
});

export default sql;
