import type { Sql } from 'postgres';
import { PriceDriftResult } from './pricing_pipeline.ts';

const STATIC_NETWORKING_PRICING = [
  // --- AWS ---
  { provider: 'aws', service: 'Data Transfer', category: 'Internet Egress', instance_type: 'First 10TB/month', price_per_unit: 0.09, unit: 'GB', geography: 'Global', attributes: { transfer_tier: 'First 10TB/month', destination: 'Internet', included_transfer: '100 GB/mo free', connection_type: 'N/A', routing_type: 'N/A', ha_support: 'N/A', vpc_support: 'N/A', transfer_direction: 'Egress' } },
  { provider: 'aws', service: 'Data Transfer', category: 'Internet Egress', instance_type: 'Next 40TB/month', price_per_unit: 0.085, unit: 'GB', geography: 'Global', attributes: { transfer_tier: 'Next 40TB/month', destination: 'Internet', included_transfer: 'None', connection_type: 'N/A', routing_type: 'N/A', ha_support: 'N/A', vpc_support: 'N/A', transfer_direction: 'Egress' } },
  { provider: 'aws', service: 'Data Transfer', category: 'Intra-Cloud Transfer', instance_type: 'Cross-AZ Transfer', price_per_unit: 0.01, unit: 'GB', geography: 'Global', attributes: { transfer_tier: 'Flat Rate', destination: 'Same Region (Different AZ)', included_transfer: 'None', connection_type: 'N/A', routing_type: 'N/A', ha_support: 'N/A', vpc_support: 'Yes', transfer_direction: 'Intra-Cloud' } },
  { provider: 'aws', service: 'Public IPv4', category: 'IP Addresses', instance_type: 'Public IPv4 Address', price_per_unit: 0.005, unit: 'Hour', geography: 'Global', attributes: { transfer_tier: 'Flat Rate', destination: 'N/A', included_transfer: 'None', connection_type: 'N/A', routing_type: 'N/A', ha_support: 'N/A', vpc_support: 'N/A', transfer_direction: 'N/A' } },
  { provider: 'aws', service: 'Load Balancing', category: 'Application Load Balancer', instance_type: 'ALB Hourly', price_per_unit: 0.0225, unit: 'Hour', geography: 'US East', attributes: { transfer_tier: 'Hourly Base', destination: 'N/A', included_transfer: 'None', connection_type: 'Multipoint', routing_type: 'Dynamic', ha_support: 'Yes', vpc_support: 'Yes', transfer_direction: 'Ingress' } },
  { provider: 'aws', service: 'Dedicated Connection', category: 'Direct Connect', instance_type: '1 Gbps Dedicated Port', price_per_unit: 0.30, unit: 'Hour', geography: 'US East', attributes: { transfer_tier: 'Hourly Base', destination: 'On-Premises', included_transfer: 'None', connection_type: 'Point-to-Point', routing_type: 'Fixed', ha_support: 'Yes', vpc_support: 'Yes', transfer_direction: 'N/A' } },
  
  // --- Google Cloud ---
  { provider: 'gcp', service: 'Data Transfer', category: 'Internet Egress', instance_type: 'Premium Tier (0-10TB)', price_per_unit: 0.105, unit: 'GB', geography: 'Global', attributes: { transfer_tier: '0 - 10TB/month', destination: 'Internet', included_transfer: '200 GB/mo free', connection_type: 'N/A', routing_type: 'Dynamic', ha_support: 'N/A', vpc_support: 'N/A', transfer_direction: 'Egress' } },
  { provider: 'gcp', service: 'Data Transfer', category: 'Internet Egress', instance_type: 'Standard Tier', price_per_unit: 0.085, unit: 'GB', geography: 'Global', attributes: { transfer_tier: 'Flat Rate', destination: 'Internet', included_transfer: '200 GB/mo free', connection_type: 'N/A', routing_type: 'Fixed', ha_support: 'N/A', vpc_support: 'N/A', transfer_direction: 'Egress' } },
  { provider: 'gcp', service: 'Data Transfer', category: 'Intra-Cloud Transfer', instance_type: 'Cross-AZ Transfer', price_per_unit: 0.01, unit: 'GB', geography: 'Global', attributes: { transfer_tier: 'Flat Rate', destination: 'Same Region (Different AZ)', included_transfer: 'None', connection_type: 'N/A', routing_type: 'N/A', ha_support: 'N/A', vpc_support: 'Yes', transfer_direction: 'Intra-Cloud' } },
  { provider: 'gcp', service: 'Dedicated Connection', category: 'Cloud Interconnect', instance_type: '10 Gbps Dedicated Interconnect', price_per_unit: 1.70, unit: 'Hour', geography: 'Global', attributes: { transfer_tier: 'Hourly Base', destination: 'On-Premises', included_transfer: 'None', connection_type: 'Point-to-Point', routing_type: 'Dynamic', ha_support: 'Yes', vpc_support: 'Yes', transfer_direction: 'N/A' } },

  // --- Azure ---
  { provider: 'azure', service: 'Data Transfer', category: 'Internet Egress', instance_type: 'First 10TB/month', price_per_unit: 0.087, unit: 'GB', geography: 'Global', attributes: { transfer_tier: 'First 10TB/month', destination: 'Internet', included_transfer: '100 GB/mo free', connection_type: 'N/A', routing_type: 'N/A', ha_support: 'N/A', vpc_support: 'N/A', transfer_direction: 'Egress' } },
  { provider: 'azure', service: 'Data Transfer', category: 'Intra-Cloud Transfer', instance_type: 'Cross-AZ Transfer', price_per_unit: 0.01, unit: 'GB', geography: 'Global', attributes: { transfer_tier: 'Flat Rate', destination: 'Same Region (Different AZ)', included_transfer: 'None', connection_type: 'N/A', routing_type: 'N/A', ha_support: 'N/A', vpc_support: 'Yes', transfer_direction: 'Intra-Cloud' } },
  { provider: 'azure', service: 'Virtual Private Cloud (VPC)', category: 'VNet Peering', instance_type: 'Intra-Region Peering', price_per_unit: 0.01, unit: 'GB', geography: 'Global', attributes: { transfer_tier: 'Flat Rate', destination: 'Same Region (VNet to VNet)', included_transfer: 'None', connection_type: 'Point-to-Point', routing_type: 'Fixed', ha_support: 'Yes', vpc_support: 'Yes', transfer_direction: 'Intra-Cloud' } },
  { provider: 'azure', service: 'Dedicated Connection', category: 'ExpressRoute', instance_type: '1 Gbps Direct Port', price_per_unit: 0.40, unit: 'Hour', geography: 'Global', attributes: { transfer_tier: 'Hourly Base', destination: 'On-Premises', included_transfer: 'None', connection_type: 'Point-to-Point', routing_type: 'Dynamic', ha_support: 'Yes', vpc_support: 'Yes', transfer_direction: 'N/A' } },

  // --- Oracle ---
  { provider: 'oracle', service: 'Data Transfer', category: 'Internet Egress', instance_type: 'Outbound Data Transfer', price_per_unit: 0.0085, unit: 'GB', geography: 'Global', attributes: { transfer_tier: 'Over 10TB/month', destination: 'Internet', included_transfer: '10 TB/mo free', connection_type: 'N/A', routing_type: 'N/A', ha_support: 'N/A', vpc_support: 'N/A', transfer_direction: 'Egress' } },
  { provider: 'oracle', service: 'Load Balancing', category: 'Flexible Load Balancer', instance_type: 'Base Rate (10 Mbps)', price_per_unit: 0.0113, unit: 'Hour', geography: 'Global', attributes: { transfer_tier: 'Base', destination: 'N/A', included_transfer: 'None', connection_type: 'Multipoint', routing_type: 'Dynamic', ha_support: 'Yes', vpc_support: 'Yes', transfer_direction: 'Ingress' } },
  { provider: 'oracle', service: 'Dedicated Connection', category: 'FastConnect', instance_type: '1 Gbps Port', price_per_unit: 0.20, unit: 'Hour', geography: 'Global', attributes: { transfer_tier: 'Hourly Base', destination: 'On-Premises', included_transfer: 'None', connection_type: 'Point-to-Point', routing_type: 'Dynamic', ha_support: 'Yes', vpc_support: 'Yes', transfer_direction: 'N/A' } },

  // --- DigitalOcean ---
  { provider: 'digitalocean', service: 'Data Transfer', category: 'Internet Egress', instance_type: 'Overage (Post-Allowance)', price_per_unit: 0.01, unit: 'GB', geography: 'Global', attributes: { transfer_tier: 'Over Allowance', destination: 'Internet', included_transfer: '1TB - 11TB/mo free', connection_type: 'N/A', routing_type: 'N/A', ha_support: 'N/A', vpc_support: 'N/A', transfer_direction: 'Egress' } },
  { provider: 'digitalocean', service: 'Virtual Private Cloud (VPC)', category: 'Internal VPC Transfer', instance_type: 'VPC Transfer', price_per_unit: 0, unit: 'GB', geography: 'Global', attributes: { transfer_tier: 'Flat Rate', destination: 'Same Region (Internal VPC)', included_transfer: 'Unlimited', connection_type: 'Multipoint', routing_type: 'Fixed', ha_support: 'No', vpc_support: 'Yes', transfer_direction: 'Intra-Cloud' } },
  { provider: 'digitalocean', service: 'Load Balancing', category: 'Managed Load Balancer', instance_type: 'Small (1 Node)', price_per_unit: 0.01785, unit: 'Hour', geography: 'Global', attributes: { transfer_tier: 'Base Rate', destination: 'N/A', included_transfer: '10,000 Concurrent', connection_type: 'Multipoint', routing_type: 'Fixed', ha_support: 'Yes', vpc_support: 'No', transfer_direction: 'Ingress' } },

  // --- Alibaba ---
  { provider: 'alibaba', service: 'Data Transfer', category: 'Internet Egress', instance_type: 'Pay-By-Traffic', price_per_unit: 0.08, unit: 'GB', geography: 'Global', attributes: { transfer_tier: 'Flat Rate', destination: 'Internet', included_transfer: 'None', connection_type: 'N/A', routing_type: 'Dynamic', ha_support: 'N/A', vpc_support: 'N/A', transfer_direction: 'Egress' } },
  { provider: 'alibaba', service: 'Data Transfer', category: 'Intra-Cloud Transfer', instance_type: 'Cross-AZ Transfer', price_per_unit: 0.01, unit: 'GB', geography: 'Global', attributes: { transfer_tier: 'Flat Rate', destination: 'Same Region (Different AZ)', included_transfer: 'None', connection_type: 'N/A', routing_type: 'N/A', ha_support: 'N/A', vpc_support: 'Yes', transfer_direction: 'Intra-Cloud' } },
  { provider: 'alibaba', service: 'Load Balancing', category: 'Server Load Balancer', instance_type: 'SLB Hourly', price_per_unit: 0.02, unit: 'Hour', geography: 'Global', attributes: { transfer_tier: 'Base', destination: 'N/A', included_transfer: 'None', connection_type: 'Multipoint', routing_type: 'Dynamic', ha_support: 'Yes', vpc_support: 'Yes', transfer_direction: 'Ingress' } },
  { provider: 'alibaba', service: 'Public IPv4', category: 'Elastic IP', instance_type: 'EIP (In Use)', price_per_unit: 0.005, unit: 'Hour', geography: 'Global', attributes: { transfer_tier: 'Flat Rate', destination: 'N/A', included_transfer: 'None', connection_type: 'Point-to-Point', routing_type: 'Dynamic', ha_support: 'Yes', vpc_support: 'Yes', transfer_direction: 'N/A' } }
];

export class NetworkingPricingPipeline {
  private sql: Sql;

  constructor(sql: Sql) {
    this.sql = sql;
  }

  
  async run() {
    console.log('🚀 Starting Networking Pricing Pipeline...');
    const results: any[] = [];
    const driftAlerts: PriceDriftResult[] = [];

    // Ensure services exist
    await this.setupNetworkingServices();

    let recordsAdded = 0;

    await this.sql.begin(async (sql) => {
      // Clear existing static networking data to avoid duplicates
      await sql`
        DELETE FROM pricing_records 
        WHERE data_source = 'static_config' 
        AND service_id IN (
          SELECT id FROM services WHERE category = 'networking'
        )
      `;

      for (const record of STATIC_NETWORKING_PRICING) {
        // Fetch provider and service IDs
        const providerRes = await sql`SELECT id FROM providers WHERE slug = ${record.provider}`;
        if (providerRes.length === 0) continue;

        let serviceRes = await sql`SELECT id FROM services WHERE provider_id = ${providerRes[0].id} AND name = ${record.service} AND category = 'networking'`;
        let serviceId: string;

        if (serviceRes.length === 0) {
          const insertService = await sql`
            INSERT INTO services (provider_id, name, category) VALUES (${providerRes[0].id}, ${record.service}, 'networking') RETURNING id
          `;
          serviceId = insertService[0].id;
        } else {
          serviceId = serviceRes[0].id;
        }

        // Insert pricing record
        await sql`
          INSERT INTO pricing_records 
            (service_id, instance_type, category, geography, price_per_unit, unit, attributes, data_source, updated_at) 
           VALUES (
             ${serviceId}, ${record.instance_type}, ${record.category}, ${record.geography}, 
             ${record.price_per_unit}, ${record.unit}, ${sql.json(record.attributes)}, 
             'static_config', NOW()
           )
        `;
        recordsAdded++;
      }
    });

    results.push({ provider: 'all_networking', status: 'success', recordsProcessed: recordsAdded, driftAlerts });
    console.log(`✅ Networking Pricing Pipeline Completed. Inserted ${recordsAdded} records.`);
    return results;
  }

  private async setupNetworkingServices() {
    const services = ['Data Transfer', 'Virtual Private Cloud (VPC)', 'Load Balancing', 'Dedicated Connection', 'Public IPv4'];
    for (const service of services) {
      await this.sql`
        INSERT INTO services (provider_id, name, category)
        SELECT id, ${service}, 'networking' FROM providers WHERE slug IN ('aws', 'gcp', 'azure', 'oracle', 'digitalocean', 'alibaba')
        ON CONFLICT (provider_id, name) DO UPDATE SET category = 'networking'
      `;
    }
  }

}
