import postgres from 'postgres';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { PricingPipeline, PriceDriftResult } from '../services/pricing_pipeline.ts';
import { sendPriceDriftEmail, sendStalenessEmail, StaleDataAlert } from '../services/mailer.ts';

dotenv.config();

console.log('🚀 Starting Background Ingestion Worker...');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set. Worker cannot connect to the database.');
  process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL, {
  ssl: process.env.DATABASE_CA_CERT ? {
    rejectUnauthorized: false,
    ca: Buffer.from(process.env.DATABASE_CA_CERT, 'base64')
  } : process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function checkSparseData() {
  try {
    const res = await sql.unsafe(`
      SELECT p.slug, COUNT(pr.id) as count
      FROM providers p
      LEFT JOIN services s ON s.provider_id = p.id
      LEFT JOIN pricing_records pr ON pr.service_id = s.id
      GROUP BY p.slug
    `);
    const needsFetch = res.some(r => parseInt(r.count) < 5);

    if (needsFetch) {
      console.log('🚀 Some providers have sparse data. Triggering immediate pricing update...');
      const pipeline = new PricingPipeline(sql as any);
      const results = await pipeline.run();
      console.log('✅ Initial sparse-data pipeline fetch completed:', results);
    } else {
      console.log('✅ Database looks populated. No immediate fetch required.');
    }
  } catch (err) {
    console.error('❌ Error checking database state:', err);
  }
}

// 1. Initial Auto-Init Check (Runs once on worker startup)
if (process.env.NODE_ENV !== 'production') {
  // We only run this in dev so we don't accidentally throttle APIs during production boot.
  // In production, data should be seeded via /api/admin/fetch-pricing or the cron job.
  checkSparseData();
} else {
  console.log('📌 Production mode: skipping auto-pricing fetch on startup.');
}

// 2. Automated Background Jobs (Runs every Sunday at midnight)
cron.schedule('0 0 * * 0', async () => {
  console.log('🕒 Starting scheduled pricing pipeline update...');
  try {
    const allDriftAlerts: PriceDriftResult[] = [];
    const pipeline = new PricingPipeline(sql as any);
    const results = await pipeline.run();
    for (const r of results) {
      if (r.driftAlerts) allDriftAlerts.push(...r.driftAlerts);
    }
    if (allDriftAlerts.length > 0) {
      await sendPriceDriftEmail(allDriftAlerts).catch(err =>
        console.error('❌ Failed to send price drift email:', err)
      );
    }
    console.log('✅ Scheduled pipeline completed:', results);
  } catch (err) {
    console.error('❌ Scheduled pipeline failed:', err);
  }

  // Staleness check — alert if any static-config service hasn't been updated in >7 days
  try {
    const staleRes = await sql.unsafe(`
      SELECT p.slug AS provider, s.name AS service, pr.data_source, MAX(pr.updated_at) AS last_updated
      FROM pricing_records pr
      JOIN services s ON pr.service_id = s.id
      JOIN providers p ON s.provider_id = p.id
      WHERE pr.data_source = 'static_config'
      GROUP BY p.slug, s.name, pr.data_source
      HAVING MAX(pr.updated_at) < NOW() - INTERVAL '7 days'
    `);
    if (staleRes.length > 0) {
      const staleAlerts: StaleDataAlert[] = staleRes.map(row => ({
        provider: row.provider,
        service: row.service,
        dataSource: row.data_source,
        lastUpdated: row.last_updated,
        daysSinceUpdate: Math.floor((Date.now() - row.last_updated.getTime()) / 86_400_000),
      }));
      await sendStalenessEmail(staleAlerts).catch(err =>
        console.error('❌ Failed to send staleness email:', err)
      );
    }
  } catch (err) {
    console.error('❌ Staleness check failed:', err);
  }
});

console.log('✅ Background worker registered cron jobs.');
