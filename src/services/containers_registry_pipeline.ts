import type { Sql } from 'postgres';
import type { PriceDriftResult } from './pricing_pipeline';

export class ContainersRegistryPricingPipeline {
  constructor(private sql: Sql) {}

  async run(): Promise<PriceDriftResult[]> {
    const results: PriceDriftResult[] = [];

    // AWS ECR - Elastic Container Registry
    try {
      console.log('🚀 Fetching AWS ECR pricing...');
      const awsEcrPricing = [
        { instance_type: 'ECR Storage', pricing_component: 'Storage (per GB/month)', region: 'us-east-1', price: 0.10 },
        { instance_type: 'ECR Data Transfer Out', pricing_component: 'Data Transfer (per GB)', region: 'us-east-1', price: 0.02 },
        { instance_type: 'ECR API Calls', pricing_component: 'API Operations', region: 'us-east-1', price: 0.0000005 },
      ];

      for (const pricing of awsEcrPricing) {
        await this.sql`
          INSERT INTO pricing_records (
            provider, service, region, instance_type, category,
            price_per_unit, unit, data_source, attributes
          ) VALUES (
            'aws', 'registry', ${pricing.region}, ${pricing.instance_type}, 'registry',
            ${pricing.price.toString()}, 'per unit/month', 'static_config',
            ${JSON.stringify({ pricing_component: pricing.pricing_component })}
          )
          ON CONFLICT DO NOTHING;
        `;
      }
      console.log('✅ AWS ECR: 3 pricing tiers configured');
      results.push({ provider: 'aws', status: 'success', count: 3 });
    } catch (err) {
      console.error('❌ AWS ECR fetch failed:', err);
      results.push({ provider: 'aws', status: 'error', message: String(err) });
    }

    // Azure ACR - Azure Container Registry
    try {
      console.log('🚀 Fetching Azure ACR pricing...');
      const azureAcrPricing = [
        { instance_type: 'ACR Storage', pricing_component: 'Storage (per GB/month)', region: 'eastus', price: 0.10 },
        { instance_type: 'ACR Data Transfer Out', pricing_component: 'Data Transfer (per GB)', region: 'eastus', price: 0.0871 },
        { instance_type: 'ACR Webhook Calls', pricing_component: 'API Operations', region: 'eastus', price: 0.00001 },
      ];

      for (const pricing of azureAcrPricing) {
        await this.sql`
          INSERT INTO pricing_records (
            provider, service, region, instance_type, category,
            price_per_unit, unit, data_source, attributes
          ) VALUES (
            'azure', 'registry', ${pricing.region}, ${pricing.instance_type}, 'registry',
            ${pricing.price.toString()}, 'per unit/month', 'static_config',
            ${JSON.stringify({ pricing_component: pricing.pricing_component })}
          )
          ON CONFLICT DO NOTHING;
        `;
      }
      console.log('✅ Azure ACR: 3 pricing tiers configured');
      results.push({ provider: 'azure', status: 'success', count: 3 });
    } catch (err) {
      console.error('❌ Azure ACR fetch failed:', err);
      results.push({ provider: 'azure', status: 'error', message: String(err) });
    }

    // Google Artifact Registry / GCR
    try {
      console.log('🚀 Fetching Google Artifact Registry pricing...');
      const gcpRegistryPricing = [
        { instance_type: 'Artifact Registry Storage', pricing_component: 'Storage (per GB/month)', region: 'us-central1', price: 0.10 },
        { instance_type: 'Artifact Registry Data Transfer Out', pricing_component: 'Data Transfer (per GB)', region: 'us-central1', price: 0.12 },
      ];

      for (const pricing of gcpRegistryPricing) {
        await this.sql`
          INSERT INTO pricing_records (
            provider, service, region, instance_type, category,
            price_per_unit, unit, data_source, attributes
          ) VALUES (
            'gcp', 'registry', ${pricing.region}, ${pricing.instance_type}, 'registry',
            ${pricing.price.toString()}, 'per unit/month', 'static_config',
            ${JSON.stringify({ pricing_component: pricing.pricing_component })}
          )
          ON CONFLICT DO NOTHING;
        `;
      }
      console.log('✅ Google Artifact Registry: 2 pricing tiers configured');
      results.push({ provider: 'gcp', status: 'success', count: 2 });
    } catch (err) {
      console.error('❌ Google Artifact Registry fetch failed:', err);
      results.push({ provider: 'gcp', status: 'error', message: String(err) });
    }

    // Oracle Container Registry
    try {
      console.log('🚀 Fetching Oracle Container Registry pricing...');
      const oracleRegistryPricing = [
        { instance_type: 'OCR Storage', pricing_component: 'Storage (per GB/month)', region: 'us-ashburn-1', price: 0.05 },
        { instance_type: 'OCR Data Transfer Out', pricing_component: 'Data Transfer (per GB)', region: 'us-ashburn-1', price: 0.02 },
      ];

      for (const pricing of oracleRegistryPricing) {
        await this.sql`
          INSERT INTO pricing_records (
            provider, service, region, instance_type, category,
            price_per_unit, unit, data_source, attributes
          ) VALUES (
            'oracle', 'registry', ${pricing.region}, ${pricing.instance_type}, 'registry',
            ${pricing.price.toString()}, 'per unit/month', 'static_config',
            ${JSON.stringify({ pricing_component: pricing.pricing_component })}
          )
          ON CONFLICT DO NOTHING;
        `;
      }
      console.log('✅ Oracle Container Registry: 2 pricing tiers configured');
      results.push({ provider: 'oracle', status: 'success', count: 2 });
    } catch (err) {
      console.error('❌ Oracle Container Registry fetch failed:', err);
      results.push({ provider: 'oracle', status: 'error', message: String(err) });
    }

    // DigitalOcean Container Registry
    try {
      console.log('🚀 Fetching DigitalOcean Container Registry pricing...');
      const doRegistryPricing = [
        { instance_type: 'DOCR Standard', pricing_component: 'Storage (per GB/month)', region: 'nyc', price: 5.00, description: 'Flat rate for 250GB' },
        { instance_type: 'DOCR Data Transfer Out', pricing_component: 'Data Transfer (per GB)', region: 'nyc', price: 0.05, description: 'Per GB after 1TB included' },
      ];

      for (const pricing of doRegistryPricing) {
        await this.sql`
          INSERT INTO pricing_records (
            provider, service, region, instance_type, category,
            price_per_unit, unit, data_source, attributes
          ) VALUES (
            'digitalocean', 'registry', ${pricing.region}, ${pricing.instance_type}, 'registry',
            ${pricing.price.toString()}, 'per unit/month', 'static_config',
            ${JSON.stringify({ pricing_component: pricing.pricing_component, description: pricing.description })}
          )
          ON CONFLICT DO NOTHING;
        `;
      }
      console.log('✅ DigitalOcean Container Registry: 2 pricing tiers configured');
      results.push({ provider: 'digitalocean', status: 'success', count: 2 });
    } catch (err) {
      console.error('❌ DigitalOcean Container Registry fetch failed:', err);
      results.push({ provider: 'digitalocean', status: 'error', message: String(err) });
    }

    // Alibaba Container Registry
    try {
      console.log('🚀 Fetching Alibaba Container Registry pricing...');
      const alibabaRegistryPricing = [
        { instance_type: 'ACR Storage', pricing_component: 'Storage (per GB/month)', region: 'cn-hangzhou', price: 0.003 },
        { instance_type: 'ACR Data Transfer Out', pricing_component: 'Data Transfer (per GB)', region: 'cn-hangzhou', price: 0.50 },
      ];

      for (const pricing of alibabaRegistryPricing) {
        await this.sql`
          INSERT INTO pricing_records (
            provider, service, region, instance_type, category,
            price_per_unit, unit, data_source, attributes
          ) VALUES (
            'alibaba', 'registry', ${pricing.region}, ${pricing.instance_type}, 'registry',
            ${pricing.price.toString()}, 'per unit/month', 'static_config',
            ${JSON.stringify({ pricing_component: pricing.pricing_component })}
          )
          ON CONFLICT DO NOTHING;
        `;
      }
      console.log('✅ Alibaba Container Registry: 2 pricing tiers configured');
      results.push({ provider: 'alibaba', status: 'success', count: 2 });
    } catch (err) {
      console.error('❌ Alibaba Container Registry fetch failed:', err);
      results.push({ provider: 'alibaba', status: 'error', message: String(err) });
    }

    return results;
  }
}
