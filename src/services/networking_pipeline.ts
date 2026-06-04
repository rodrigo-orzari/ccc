import { Pool } from 'pg';
import { PriceDriftResult } from './pricing_pipeline.ts';

const STATIC_NETWORKING_PRICING = [
  // --- AWS ---
  { provider: 'aws', service: 'Data Transfer', category: 'Internet Egress', instance_type: 'First 10TB/month', price_per_unit: 0.09, unit: 'GB', geography: 'Global', attributes: { transfer_tier: 'First 10TB/month', destination: 'Internet', included_transfer: '100 GB/mo free' } },
  { provider: 'aws', service: 'Data Transfer', category: 'Internet Egress', instance_type: 'Next 40TB/month', price_per_unit: 0.085, unit: 'GB', geography: 'Global', attributes: { transfer_tier: 'Next 40TB/month', destination: 'Internet', included_transfer: 'None' } },
  { provider: 'aws', service: 'Data Transfer', category: 'Intra-Cloud Transfer', instance_type: 'Cross-AZ Transfer', price_per_unit: 0.01, unit: 'GB', geography: 'Global', attributes: { transfer_tier: 'Flat Rate', destination: 'Same Region (Different AZ)', included_transfer: 'None' } },
  { provider: 'aws', service: 'Public IPv4', category: 'IP Addresses', instance_type: 'Public IPv4 Address', price_per_unit: 0.005, unit: 'Hour', geography: 'Global', attributes: { transfer_tier: 'Flat Rate', destination: 'N/A', included_transfer: 'None' } },
  { provider: 'aws', service: 'Load Balancing', category: 'Application Load Balancer', instance_type: 'ALB Hourly', price_per_unit: 0.0225, unit: 'Hour', geography: 'US East', attributes: { transfer_tier: 'Hourly Base', destination: 'N/A', included_transfer: 'None' } },
  { provider: 'aws', service: 'Load Balancing', category: 'Application Load Balancer', instance_type: 'ALB LCU/Hour', price_per_unit: 0.008, unit: 'LCU', geography: 'US East', attributes: { transfer_tier: 'Per LCU', destination: 'N/A', included_transfer: 'None' } },
  
  // --- Google Cloud ---
  { provider: 'gcp', service: 'Data Transfer', category: 'Internet Egress', instance_type: 'Premium Tier (0-10TB)', price_per_unit: 0.105, unit: 'GB', geography: 'Global', attributes: { transfer_tier: '0 - 10TB/month', destination: 'Internet', included_transfer: '200 GB/mo free' } },
  { provider: 'gcp', service: 'Data Transfer', category: 'Internet Egress', instance_type: 'Standard Tier', price_per_unit: 0.085, unit: 'GB', geography: 'Global', attributes: { transfer_tier: 'Flat Rate', destination: 'Internet', included_transfer: '200 GB/mo free' } },
  { provider: 'gcp', service: 'Data Transfer', category: 'Intra-Cloud Transfer', instance_type: 'Cross-AZ Transfer', price_per_unit: 0.01, unit: 'GB', geography: 'Global', attributes: { transfer_tier: 'Flat Rate', destination: 'Same Region (Different AZ)', included_transfer: 'None' } },
  { provider: 'gcp', service: 'Public IPv4', category: 'IP Addresses', instance_type: 'Public IPv4 (In Use)', price_per_unit: 0.005, unit: 'Hour', geography: 'Global', attributes: { transfer_tier: 'Flat Rate', destination: 'N/A', included_transfer: 'None' } },

  // --- Azure ---
  { provider: 'azure', service: 'Data Transfer', category: 'Internet Egress', instance_type: 'First 10TB/month', price_per_unit: 0.087, unit: 'GB', geography: 'Global', attributes: { transfer_tier: 'First 10TB/month', destination: 'Internet', included_transfer: '100 GB/mo free' } },
  { provider: 'azure', service: 'Data Transfer', category: 'Internet Egress', instance_type: 'Next 40TB/month', price_per_unit: 0.083, unit: 'GB', geography: 'Global', attributes: { transfer_tier: 'Next 40TB/month', destination: 'Internet', included_transfer: 'None' } },
  { provider: 'azure', service: 'Data Transfer', category: 'Intra-Cloud Transfer', instance_type: 'Cross-AZ Transfer', price_per_unit: 0.01, unit: 'GB', geography: 'Global', attributes: { transfer_tier: 'Flat Rate', destination: 'Same Region (Different AZ)', included_transfer: 'None' } },
  { provider: 'azure', service: 'Public IPv4', category: 'IP Addresses', instance_type: 'Public IPv4 (Static)', price_per_unit: 0.0036, unit: 'Hour', geography: 'Global', attributes: { transfer_tier: 'Flat Rate', destination: 'N/A', included_transfer: 'None' } },

  // --- Oracle ---
  { provider: 'oracle', service: 'Data Transfer', category: 'Internet Egress', instance_type: 'Outbound Data Transfer', price_per_unit: 0.0085, unit: 'GB', geography: 'Global', attributes: { transfer_tier: 'Over 10TB/month', destination: 'Internet', included_transfer: '10 TB/mo free' } },
  { provider: 'oracle', service: 'Data Transfer', category: 'Intra-Cloud Transfer', instance_type: 'Cross-AZ Transfer', price_per_unit: 0, unit: 'GB', geography: 'Global', attributes: { transfer_tier: 'Flat Rate', destination: 'Same Region (Different AZ)', included_transfer: 'Unlimited' } },
  { provider: 'oracle', service: 'Load Balancing', category: 'Flexible Load Balancer', instance_type: 'Base Rate (10 Mbps)', price_per_unit: 0.0113, unit: 'Hour', geography: 'Global', attributes: { transfer_tier: 'Base', destination: 'N/A', included_transfer: 'None' } },

  // --- DigitalOcean ---
  { provider: 'digitalocean', service: 'Data Transfer', category: 'Internet Egress', instance_type: 'Overage (Post-Allowance)', price_per_unit: 0.01, unit: 'GB', geography: 'Global', attributes: { transfer_tier: 'Over Allowance', destination: 'Internet', included_transfer: '1TB - 11TB/mo free' } },
  { provider: 'digitalocean', service: 'Data Transfer', category: 'Intra-Cloud Transfer', instance_type: 'Internal VPC Transfer', price_per_unit: 0, unit: 'GB', geography: 'Global', attributes: { transfer_tier: 'Flat Rate', destination: 'Same Region (Internal VPC)', included_transfer: 'Unlimited' } },
  { provider: 'digitalocean', service: 'Load Balancing', category: 'Managed Load Balancer', instance_type: 'Small (1 Node)', price_per_unit: 0.01785, unit: 'Hour', geography: 'Global', attributes: { transfer_tier: 'Base Rate', destination: 'N/A', included_transfer: '10,000 Concurrent' } }
];

export class NetworkingPricingPipeline {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async run() {
    console.log('🚀 Starting Networking Pricing Pipeline...');
    const results: any[] = [];
    const driftAlerts: PriceDriftResult[] = [];

    // Ensure services exist
    await this.setupNetworkingServices();

    const client = await this.pool.connect();
    let recordsAdded = 0;

    try {
      await client.query('BEGIN');

      // Clear existing static networking data to avoid duplicates
      await client.query(`
        DELETE FROM pricing_records 
        WHERE data_source = 'static_config' 
        AND service_id IN (
          SELECT id FROM services WHERE category = 'networking'
        )
      `);

      for (const record of STATIC_NETWORKING_PRICING) {
        // Fetch provider and service IDs
        const providerRes = await client.query('SELECT id FROM providers WHERE slug = $1', [record.provider]);
        if (providerRes.rows.length === 0) continue;

        let serviceRes = await client.query('SELECT id FROM services WHERE provider_id = $1 AND name = $2 AND category = $3', [providerRes.rows[0].id, record.service, 'networking']);
        let serviceId: string;

        if (serviceRes.rows.length === 0) {
          const insertService = await client.query(
            'INSERT INTO services (provider_id, name, category) VALUES ($1, $2, $3) RETURNING id',
            [providerRes.rows[0].id, record.service, 'networking']
          );
          serviceId = insertService.rows[0].id;
        } else {
          serviceId = serviceRes.rows[0].id;
        }

        // Insert pricing record
        await client.query(
          `INSERT INTO pricing_records 
            (service_id, instance_type, category, geography, price_per_unit, unit, attributes, data_source, updated_at) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, 'static_config', NOW())`,
          [
            serviceId,
            record.instance_type,
            record.category,
            record.geography,
            record.price_per_unit,
            record.unit,
            JSON.stringify(record.attributes)
          ]
        );
        recordsAdded++;
      }

      await client.query('COMMIT');
      results.push({ provider: 'all_networking', status: 'success', recordsProcessed: recordsAdded, driftAlerts });
      console.log(`✅ Networking Pricing Pipeline Completed. Inserted ${recordsAdded} records.`);
    } catch (e: any) {
      await client.query('ROLLBACK');
      console.error('❌ Networking Pipeline failed:', e);
      throw e;
    } finally {
      client.release();
    }

    return results;
  }

  private async setupNetworkingServices() {
    const client = await this.pool.connect();
    try {
      const services = ['Data Transfer', 'Virtual Private Cloud (VPC)', 'Load Balancing', 'Dedicated Connection', 'Public IPv4'];
      for (const service of services) {
        await client.query(`
          INSERT INTO services (provider_id, name, category)
          SELECT id, $1, 'networking' FROM providers WHERE slug IN ('aws', 'gcp', 'azure', 'oracle', 'digitalocean')
          ON CONFLICT (provider_id, name) DO UPDATE SET category = 'networking';
        `, [service]);
      }
    } finally {
      client.release();
    }
  }
}
