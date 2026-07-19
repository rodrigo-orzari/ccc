import type { Sql } from 'postgres';
import { PriceDriftResult, ensureProviderId } from './pricing_pipeline.ts';

const STATIC_CERTIFICATE_PRICING = [
  // --- AWS Certificate Manager ---
  { provider: 'aws', service: 'AWS Certificate Manager', category: 'Certificate Management', instance_type: 'Public SSL/TLS Certificate', price_per_unit: 0.00, unit: 'Month', geography: 'Global', attributes: { service_type: 'Certificate Management', cert_type: 'Public SSL/TLS', cost: 'Free' } },
  { provider: 'aws', service: 'AWS Certificate Manager', category: 'Certificate Management', instance_type: 'Private Certificate Authority (per month)', price_per_unit: 400.00, unit: 'Month', geography: 'Global', attributes: { service_type: 'Certificate Management', cert_type: 'Private CA', billing_model: 'Monthly' } },
  { provider: 'aws', service: 'AWS Certificate Manager', category: 'Certificate Management', instance_type: 'Private Certificate (per certificate)', price_per_unit: 0.75, unit: 'Month', geography: 'Global', attributes: { service_type: 'Certificate Management', cert_type: 'Private Certificate', billing_model: 'Per Certificate' } },

  // --- Azure Key Vault (Certificate Management capability) ---
  { provider: 'azure', service: 'Azure Key Vault (Certificate Management)', category: 'Certificate Management', instance_type: 'Certificate Operations (10K)', price_per_unit: 0.34, unit: '10K Operations', geography: 'Global', attributes: { service_type: 'Certificate Management', cert_type: 'Managed Certificates', billing_model: 'Operations' } },
  { provider: 'azure', service: 'Azure Key Vault (Certificate Management)', category: 'Certificate Management', instance_type: 'Managed Certificate (per month)', price_per_unit: 1.00, unit: 'Month', geography: 'Global', attributes: { service_type: 'Certificate Management', cert_type: 'Auto-renewal', billing_model: 'Monthly' } },

  // --- Google Cloud Certificate Authority Service ---
  { provider: 'gcp', service: 'Google Cloud Certificate Authority Service', category: 'Certificate Management', instance_type: 'Certificate Authority (per month)', price_per_unit: 600.00, unit: 'Month', geography: 'Global', attributes: { service_type: 'Certificate Management', cert_type: 'Root/Subordinate CA', billing_model: 'Monthly' } },
  { provider: 'gcp', service: 'Google Cloud Certificate Authority Service', category: 'Certificate Management', instance_type: 'Certificate Issued (per certificate)', price_per_unit: 1.00, unit: 'Certificate', geography: 'Global', attributes: { service_type: 'Certificate Management', cert_type: 'Issued Certificate', billing_model: 'Per Certificate' } },
  { provider: 'gcp', service: 'Google Cloud Managed Certificates', category: 'Certificate Management', instance_type: 'SSL Certificate (auto-managed)', price_per_unit: 0.00, unit: 'Month', geography: 'Global', attributes: { service_type: 'Certificate Management', cert_type: 'Public Managed', cost: 'Free' } },

  // --- Oracle Certificate Authority ---
  { provider: 'oracle', service: 'Oracle Certificate Authority', category: 'Certificate Management', instance_type: 'CA Authority (per month)', price_per_unit: 500.00, unit: 'Month', geography: 'Global', attributes: { service_type: 'Certificate Management', cert_type: 'Root/Subordinate CA', billing_model: 'Monthly' } },
  { provider: 'oracle', service: 'Oracle Certificate Authority', category: 'Certificate Management', instance_type: 'Certificate (per certificate/month)', price_per_unit: 5.00, unit: 'Month', geography: 'Global', attributes: { service_type: 'Certificate Management', cert_type: 'Managed Certificate', billing_model: 'Per Certificate' } },

  // --- Alibaba Certificate Authority ---
  { provider: 'alibaba', service: 'Alibaba Certificate Authority', category: 'Certificate Management', instance_type: 'CA Instance (per month)', price_per_unit: 300.00, unit: 'Month', geography: 'cn-hangzhou', attributes: { service_type: 'Certificate Management', cert_type: 'Root/Subordinate CA', billing_model: 'Monthly' } },
  { provider: 'alibaba', service: 'Alibaba Certificate Authority', category: 'Certificate Management', instance_type: 'Certificate (per month)', price_per_unit: 3.00, unit: 'Month', geography: 'Global', attributes: { service_type: 'Certificate Management', cert_type: 'Issued Certificate', billing_model: 'Per Certificate' } },

  // --- DigitalOcean Managed Certificates (App Platform) ---
  { provider: 'digitalocean', service: 'DigitalOcean Managed Certificates', category: 'Certificate Management', instance_type: 'Managed Certificate', price_per_unit: 0.00, unit: 'Month', geography: 'Global', attributes: { service_type: 'Certificate Management', cert_type: 'Auto-renewed', cost: 'Free' } },
];

export class CertificateManagementPricingPipeline {
  private sql: Sql;

  constructor(sql: Sql) {
    this.sql = sql;
  }

  async run() {
    console.log('🚀 Starting Certificate Management Pricing Pipeline...');
    const results: any[] = [];
    let recordsAdded = 0;

    await this.sql.begin(async (sql) => {
      // Clear existing certificate data
      await sql`
        DELETE FROM pricing_records
        WHERE data_source = 'static_config'
        AND service_id IN (
          SELECT id FROM services WHERE category = 'certificate_management'
        )
      `;

      for (const record of STATIC_CERTIFICATE_PRICING) {
        const providerId = await ensureProviderId(sql, record.provider);

        let serviceRes = await sql`SELECT id FROM services WHERE provider_id = ${providerId} AND name = ${record.service} AND category = 'certificate_management'`;
        let serviceId: string;

        if (serviceRes.length === 0) {
          const insertService = await sql`
            INSERT INTO services (provider_id, name, category) VALUES (${providerId}, ${record.service}, 'certificate_management') RETURNING id
          `;
          serviceId = insertService[0].id;
        } else {
          serviceId = serviceRes[0].id;
        }

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

    results.push({ provider: 'all_certificate', status: 'success', recordsProcessed: recordsAdded });
    console.log(`✅ Certificate Management Pricing Pipeline Completed. Inserted ${recordsAdded} records.`);
    return results;
  }
}
