import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Parse DATABASE_URL manually so pg never sees the sslmode parameter,
  // which in pg 8.x overrides rejectUnauthorized when set to 'require'.
  function parseDbUrl(url: string) {
    const u = new URL(url);
    return {
      host: u.hostname,
      port: u.port ? parseInt(u.port) : 5432,
      database: u.pathname.replace(/^\//, ''),
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
    };
  }

  const pool = new Pool({
    ...(process.env.DATABASE_URL ? parseDbUrl(process.env.DATABASE_URL) : {}),
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: 'connected (simulated check)' });
  });

  // Example route to fetch data from Postgres
  app.get('/api/data', async (req, res) => {
    try {
      if (!process.env.DATABASE_URL) {
        return res.status(400).json({ error: 'DATABASE_URL environment variable is not set.' });
      }
      const client = await pool.connect();
      const result = await client.query('SELECT NOW() as current_time');
      client.release();
      res.json({ time: result.rows[0].current_time });
    } catch (err: any) {
      console.error('Database error:', err);
      res.status(500).json({ error: 'Database connection failed', details: err.message });
    }
  });

  // List all tables and their row counts
  app.get('/api/tables', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query(`
        SELECT table_name,
               (SELECT COUNT(*) FROM information_schema.columns c WHERE c.table_name = t.table_name AND c.table_schema = 'public') AS column_count,
               (xpath('/row/cnt/text()', query_to_xml(format('SELECT COUNT(*) AS cnt FROM %I', table_name), false, true, '')))[1]::text::int AS row_count
        FROM information_schema.tables t
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);
      client.release();
      res.json({ tables: result.rows });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
});
