import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import cron from 'node-cron';
import { PricingPipeline } from './src/services/pricing_pipeline.ts';

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

  // PostgreSQL Connection Pool
  const pool = new Pool({
    ...(process.env.DATABASE_URL ? parseDbUrl(process.env.DATABASE_URL) : {}),
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  app.use(cors());
  app.use(express.json());

  // Function to initialize database schema
  const initDb = async () => {
    try {
      const schemaPath = path.join(process.cwd(), 'src/db/schema.sql');
      if (!fs.existsSync(schemaPath)) return false;
      const schema = fs.readFileSync(schemaPath, 'utf8');
      const client = await pool.connect();
      await client.query(schema);

      // Safety: Add columns if they don't exist (since CREATE TABLE IF NOT EXISTS doesn't update schema)
      await client.query(`
        ALTER TABLE pricing_records ADD COLUMN IF NOT EXISTS cpu_vendor VARCHAR(50);
        ALTER TABLE pricing_records ADD COLUMN IF NOT EXISTS gpu_count INTEGER DEFAULT 0;
        ALTER TABLE pricing_records ADD COLUMN IF NOT EXISTS category VARCHAR(50);
      `);

      // Update provider names to preferred display names
      await client.query(`
        UPDATE providers SET name = 'AWS' WHERE slug = 'aws';
        UPDATE providers SET name = 'Azure' WHERE slug = 'azure';
        UPDATE providers SET name = 'Google' WHERE slug = 'gcp';
        UPDATE providers SET name = 'Oracle' WHERE slug = 'oracle';

        -- Migrate architecture names
        UPDATE pricing_records SET arch = 'x86 64' WHERE arch = 'x86_64' OR arch = 'x86';
        UPDATE pricing_records SET arch = 'ARM' WHERE arch = 'ARM64';

        -- Refine CPU Vendor associations
        UPDATE pricing_records SET cpu_vendor = 'AWS' WHERE instance_type ILIKE '%graviton%' OR instance_type ~* '[a-z][0-9]g\\..*';
        UPDATE pricing_records SET cpu_vendor = 'Ampere' WHERE instance_type ILIKE '%ampere%' OR instance_type ILIKE '%altra%' OR instance_type ILIKE 't2a%';
        UPDATE pricing_records SET cpu_vendor = 'AMD' WHERE instance_type ILIKE '%epyc%' OR instance_type ILIKE '%amd%' OR instance_type ILIKE 't2d%' OR instance_type ~* '[a-z][0-9]a\\..*';

        -- Backfill gpu_count for legacy rows that were tagged with category='GPU' but missing the flag
        UPDATE pricing_records SET gpu_count = 1 WHERE category = 'GPU' AND (gpu_count IS NULL OR gpu_count = 0);

        -- Reclassify any legacy category='GPU' rows by memory/vCPU ratio (GPU is now a capability, not a category)
        UPDATE pricing_records SET category =
          CASE
            WHEN (CAST(memory_gb AS FLOAT) / NULLIF(vcpus, 0)) <= 2.1 THEN 'Compute optimized'
            WHEN (CAST(memory_gb AS FLOAT) / NULLIF(vcpus, 0)) >= 7.5 THEN 'Memory optimized'
            ELSE 'General purpose'
          END
        WHERE category = 'GPU';
      `);

      client.release();
      console.log('✅ Database schema initialized successfully.');
      return true;
    } catch (err) {
      console.error('❌ Failed to initialize database schema:', err);
      return false;
    }
  };

  let pipelineStatus = {
    running: false,
    lastRun: null as Date | null,
    lastResult: null as any
  };

  // 1. Initial Auto-Init
  if (process.env.DATABASE_URL) {
    initDb().then(async (success) => {
      if (success) {
        // Check if we have data, if not, trigger a fetch "now"
        try {
          const client = await pool.connect();
          const res = await client.query(`
            SELECT p.slug, COUNT(pr.id) as count
            FROM providers p
            LEFT JOIN services s ON s.provider_id = p.id
            LEFT JOIN pricing_records pr ON pr.service_id = s.id
            GROUP BY p.slug
          `);
          client.release();

          const needsFetch = res.rows.some(r => parseInt(r.count) < 5);

          if (needsFetch) {
            console.log('🚀 Some providers have sparse data. Triggering pricing update...');
            pipelineStatus.running = true;
            const pipeline = new PricingPipeline(pool);
            pipeline.run().then(results => {
              pipelineStatus.running = false;
              pipelineStatus.lastRun = new Date();
              pipelineStatus.lastResult = results;
              console.log('✅ Pipeline fetch completed:', results);
            }).catch(err => {
              pipelineStatus.running = false;
              pipelineStatus.lastResult = { error: err.message };
            });
          }
        } catch (err) {
          console.error('❌ Error checking database state:', err);
        }
      }
    });
  } else {
    console.warn('⚠️ DATABASE_URL is not set. Database functionality will be limited.');
  }

  // 2. Automated Background Job (Runs every Sunday at midnight)
  cron.schedule('0 0 * * 0', async () => {
    console.log('🕒 Starting scheduled pricing pipeline update...');
    try {
      const pipeline = new PricingPipeline(pool);
      const results = await pipeline.run();
      console.log('✅ Scheduled pipeline completed:', results);
    } catch (err) {
      console.error('❌ Scheduled pipeline failed:', err);
    }
  });

  // API Routes
  app.get('/api/ping', (req, res) => {
    res.json({ status: 'pong', env: process.env.NODE_ENV, timestamp: new Date().toISOString() });
  });

  app.get('/api/health', async (req, res) => {
    try {
      const client = await pool.connect();
      const countRes = await client.query('SELECT COUNT(*) FROM pricing_records');
      const providerRes = await client.query(`
        SELECT p.slug, COUNT(pr.id) as count
        FROM providers p
        LEFT JOIN services s ON s.provider_id = p.id
        LEFT JOIN pricing_records pr ON pr.service_id = s.id
        GROUP BY p.slug
      `);
      const lastUpdatedRes = await client.query('SELECT MAX(updated_at) as last_updated FROM pricing_records');
      client.release();
      res.json({
        status: 'ok',
        database: 'connected',
        total_records: parseInt(countRes.rows[0].count),
        by_provider: providerRes.rows,
        last_updated: lastUpdatedRes.rows[0].last_updated
      });
    } catch (err: any) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  });

  // Init DB Route (Like --create-db-only)
  app.post('/api/admin/init-db', async (req, res) => {
    const success = await initDb();
    if (success) {
      res.json({ message: 'Database initialized successfully.' });
    } else {
      res.status(500).json({ error: 'Failed to initialize database.' });
    }
  });

  // Run Pipeline Route (Like run_local.py)
  app.post('/api/admin/fetch-pricing', async (req, res) => {
    try {
      const pipeline = new PricingPipeline(pool);
      const results = await pipeline.run();

      // Also trigger the migration/cleanup logic after fetch
      await initDb();

      res.json({ message: 'Pipeline run completed and data migrated', results });
    } catch (err: any) {
      res.status(500).json({ error: 'Pipeline failed', details: err.message });
    }
  });

  // Build the WHERE-clause fragment + values for pricing filters (shared between
  // /api/pricing and /api/pricing/counts so filter behaviour stays consistent).
  function buildPricingFilters(query: any) {
    const {
      provider, geography, os, arch, cpuVendor, gpu, category,
      minVcpu, maxVcpu, minMemory, maxMemory, minPrice, maxPrice, search
    } = query;

    const conditions: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (provider) { conditions.push(`p.slug = ANY($${paramCount++})`); values.push((provider as string).split(',')); }
    if (geography) { conditions.push(`pr.geography = ANY($${paramCount++})`); values.push((geography as string).split(',')); }
    if (os) { conditions.push(`pr.os = ANY($${paramCount++})`); values.push((os as string).split(',')); }
    if (arch) {
      const archList = (arch as string).split(',').map(a => a === 'x86' ? 'x86 64' : a);
      conditions.push(`pr.arch = ANY($${paramCount++})`);
      values.push(archList);
    }
    if (cpuVendor) { conditions.push(`pr.cpu_vendor = ANY($${paramCount++})`); values.push((cpuVendor as string).split(',')); }
    if (category && category !== 'All categories') { conditions.push(`pr.category = ANY($${paramCount++})`); values.push((category as string).split(',')); }
    if (gpu === 'true') conditions.push(`pr.gpu_count > 0`);
    else if (gpu === 'false') conditions.push(`pr.gpu_count = 0`);
    if (minVcpu) { conditions.push(`pr.vcpus >= $${paramCount++}`); values.push(minVcpu); }
    if (maxVcpu) { conditions.push(`pr.vcpus <= $${paramCount++}`); values.push(maxVcpu); }
    if (minMemory) { conditions.push(`pr.memory_gb >= $${paramCount++}`); values.push(minMemory); }
    if (maxMemory) { conditions.push(`pr.memory_gb <= $${paramCount++}`); values.push(maxMemory); }
    if (minPrice) { conditions.push(`pr.price_per_unit >= $${paramCount++}`); values.push(minPrice); }
    if (maxPrice) { conditions.push(`pr.price_per_unit <= $${paramCount++}`); values.push(maxPrice); }
    if (search) {
      conditions.push(`(pr.instance_type ILIKE $${paramCount} OR p.name ILIKE $${paramCount})`);
      values.push(`%${search}%`);
      paramCount++;
    }

    return {
      whereClause: conditions.length ? 'AND ' + conditions.join(' AND ') : '',
      values,
      paramCount
    };
  }

  // Per-provider counts respecting current filters (drives the summary cards)
  app.get('/api/pricing/counts', async (req, res) => {
    try {
      const { whereClause, values } = buildPricingFilters(req.query);
      const query = `
        SELECT p.slug, COUNT(pr.id) as count
        FROM providers p
        LEFT JOIN services s ON s.provider_id = p.id
        LEFT JOIN pricing_records pr ON pr.service_id = s.id
        LEFT JOIN regions r ON pr.region_id = r.id
        WHERE 1=1 ${whereClause}
        GROUP BY p.slug
      `;
      const client = await pool.connect();
      const result = await client.query(query, values);
      client.release();
      res.json(result.rows);
    } catch (err: any) {
      console.error('Counts API error:', err);
      res.status(500).json({ error: 'Failed to fetch counts', details: err.message });
    }
  });

  // Fetch Pricing Data for Frontend with Filtering
  app.get('/api/pricing', async (req, res) => {
    try {
      const isAggregated = req.query.aggregate === 'true';

      let selectClause = `
        p.name as provider,
        s.name as service,
        r.slug as region,
        pr.instance_type,
        pr.vcpus,
        pr.memory_gb,
        pr.arch,
        pr.os,
        pr.cpu_vendor,
        pr.gpu_count,
        pr.geography,
        pr.price_per_unit,
        pr.unit,
        pr.category,
        pr.updated_at
      `;

      if (isAggregated) {
        selectClause = `
          p.name as provider,
          'Various' as service,
          'Various' as region,
          pr.instance_type,
          pr.vcpus,
          pr.memory_gb,
          pr.arch,
          pr.os,
          pr.cpu_vendor,
          pr.gpu_count,
          'Various' as geography,
          MIN(pr.price_per_unit) as min_price,
          AVG(pr.price_per_unit) as avg_price,
          MAX(pr.price_per_unit) as max_price,
          MIN(pr.price_per_unit) as price_per_unit,
          pr.unit,
          pr.category,
          MAX(pr.updated_at) as updated_at
        `;
      }

      let query = `
        SELECT ${selectClause}
        FROM pricing_records pr
        JOIN services s ON pr.service_id = s.id
        JOIN regions r ON pr.region_id = r.id
        JOIN providers p ON s.provider_id = p.id
        WHERE 1=1
      `;

      const { whereClause, values } = buildPricingFilters(req.query);
      query += ' ' + whereClause;

      if (isAggregated) {
        query += `
          GROUP BY
            p.name, pr.instance_type, pr.vcpus, pr.memory_gb,
            pr.arch, pr.os, pr.cpu_vendor, pr.gpu_count, pr.category, pr.unit
          ORDER BY avg_price ASC
          LIMIT 1000
        `;
      } else {
        query += ` ORDER BY pr.price_per_unit ASC LIMIT 1000`;
      }

      const client = await pool.connect();
      console.log('SQL Query:', query);
      console.log('SQL Params:', values);
      const result = await client.query(query, values);
      client.release();
      res.json(result.rows);
    } catch (err: any) {
      console.error('API Error:', err);
      res.status(500).json({ error: 'Failed to fetch pricing data', details: err.message });
    }
  });

  // Vite middleware for development
  const isProduction = process.env.NODE_ENV === 'production';
  console.log(`Mode: ${isProduction ? 'Production' : 'Development'}`);

  if (!isProduction) {
    console.log('Starting Vite in middleware mode...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    console.log(`Serving static files from: ${distPath}`);

    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        const indexPath = path.join(distPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          console.error(`Index file not found at: ${indexPath}`);
          res.status(404).send('Application not built correctly. index.html missing in dist.');
        }
      });
    } else {
      console.error(`Dist directory not found at: ${distPath}`);
      app.get('*', (req, res) => {
        res.status(404).send('Application not built. dist directory missing.');
      });
    }
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
});
