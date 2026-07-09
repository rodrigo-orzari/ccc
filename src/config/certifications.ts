// ─────────────────────────────────────────────────────────────────────────────
// Cloud compliance certifications & regulations matrix.
//
// This is CURATED STATIC DATA (like datacenter_data.ts) — compliance status
// changes rarely (roughly annually), so there is no live ingestion pipeline.
// Each provider's holdings were compiled from that provider's OFFICIAL public
// compliance documentation on the `lastVerified` date below. Wikipedia / official
// standard-body links are used only to DEFINE each standard, never as the source
// of truth for who holds it.
//
// Refresh cadence: re-verify against each provider's sourceUrl every ~6 months.
// HOW TO REFRESH: see CERTIFICATIONS_REFRESH.md at the repo root — it contains the
// ready-to-paste Claude Code prompt and review steps.
// A "not held" (absence from a provider's list) means "not found in that
// provider's published documentation as of the verification date" — see the
// disclaimer rendered on /certifications. This is not legal advice.
// ─────────────────────────────────────────────────────────────────────────────

import { GEOGRAPHIES } from './index';

export type CertScope = (typeof GEOGRAPHIES)[number] | 'Global';
export type CertCategory = 'Security' | 'Privacy' | 'Industry' | 'Government / Regional';

export interface Certification {
  id: string;
  name: string;
  category: CertCategory;
  // Jurisdiction the standard belongs to. 'Global' = internationally recognized;
  // otherwise mapped to one of the app's GEOGRAPHIES buckets so the geo filter
  // uses the same vocabulary as every other page.
  scope: CertScope;
  description: string;
  // Link to a definition of the standard (Wikipedia where a solid page exists,
  // otherwise the official standard body's landing page).
  definitionUrl: string;
}

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'iso-27001',
    name: 'ISO/IEC 27001',
    category: 'Security',
    scope: 'Global',
    description: 'International standard for information security management systems (ISMS).',
    definitionUrl: 'https://en.wikipedia.org/wiki/ISO/IEC_27001',
  },
  {
    id: 'iso-27017',
    name: 'ISO/IEC 27017',
    category: 'Security',
    scope: 'Global',
    description: 'Code of practice for information security controls for cloud services.',
    definitionUrl: 'https://en.wikipedia.org/wiki/ISO/IEC_27017',
  },
  {
    id: 'iso-27018',
    name: 'ISO/IEC 27018',
    category: 'Privacy',
    scope: 'Global',
    description: 'Code of practice for protecting personally identifiable information (PII) in public clouds.',
    definitionUrl: 'https://en.wikipedia.org/wiki/ISO/IEC_27018',
  },
  {
    id: 'soc-1',
    name: 'SOC 1',
    category: 'Security',
    scope: 'Global',
    description: 'AICPA audit of controls relevant to financial reporting.',
    definitionUrl: 'https://en.wikipedia.org/wiki/System_and_Organization_Controls',
  },
  {
    id: 'soc-2',
    name: 'SOC 2',
    category: 'Security',
    scope: 'Global',
    description: 'AICPA audit of controls for security, availability, processing integrity, confidentiality and privacy.',
    definitionUrl: 'https://en.wikipedia.org/wiki/System_and_Organization_Controls',
  },
  {
    id: 'soc-3',
    name: 'SOC 3',
    category: 'Security',
    scope: 'Global',
    description: 'Publicly shareable, general-use version of the SOC 2 report.',
    definitionUrl: 'https://en.wikipedia.org/wiki/System_and_Organization_Controls',
  },
  {
    id: 'pci-dss',
    name: 'PCI DSS',
    category: 'Industry',
    scope: 'Global',
    description: 'Payment Card Industry Data Security Standard for handling cardholder data.',
    definitionUrl: 'https://en.wikipedia.org/wiki/Payment_Card_Industry_Data_Security_Standard',
  },
  {
    id: 'hipaa',
    name: 'HIPAA',
    category: 'Industry',
    scope: 'N. America',
    description: 'US healthcare law governing protected health information (via a Business Associate Agreement).',
    definitionUrl: 'https://en.wikipedia.org/wiki/Health_Insurance_Portability_and_Accountability_Act',
  },
  {
    id: 'fedramp-high',
    name: 'FedRAMP High',
    category: 'Government / Regional',
    scope: 'N. America',
    description: 'US government authorization for high-impact cloud workloads.',
    definitionUrl: 'https://en.wikipedia.org/wiki/FedRAMP',
  },
  {
    id: 'fedramp-moderate',
    name: 'FedRAMP Moderate',
    category: 'Government / Regional',
    scope: 'N. America',
    description: 'US government authorization for moderate-impact cloud workloads.',
    definitionUrl: 'https://en.wikipedia.org/wiki/FedRAMP',
  },
  {
    id: 'csa-star',
    name: 'CSA STAR',
    category: 'Security',
    scope: 'Global',
    description: 'Cloud Security Alliance Security Trust Assurance and Risk registry.',
    definitionUrl: 'https://en.wikipedia.org/wiki/Cloud_Security_Alliance',
  },
  {
    id: 'fips-140-2',
    name: 'FIPS 140-2',
    category: 'Security',
    scope: 'N. America',
    description: 'US government standard for cryptographic module validation.',
    definitionUrl: 'https://en.wikipedia.org/wiki/FIPS_140-2',
  },
  {
    id: 'hitrust',
    name: 'HITRUST CSF',
    category: 'Industry',
    scope: 'N. America',
    description: 'Certifiable security framework widely used in US healthcare.',
    definitionUrl: 'https://en.wikipedia.org/wiki/HITRUST',
  },
  {
    id: 'gdpr',
    name: 'GDPR',
    category: 'Privacy',
    scope: 'W. Europe',
    description: 'EU General Data Protection Regulation for personal data.',
    definitionUrl: 'https://en.wikipedia.org/wiki/General_Data_Protection_Regulation',
  },
  {
    id: 'irap',
    name: 'IRAP',
    category: 'Government / Regional',
    scope: 'Australia',
    description: 'Australian Government Information Security Registered Assessors Program.',
    definitionUrl: 'https://www.cyber.gov.au/irap',
  },
  {
    id: 'c5',
    name: 'BSI C5',
    category: 'Government / Regional',
    scope: 'W. Europe',
    description: 'Germany’s Cloud Computing Compliance Criteria Catalogue (BSI).',
    definitionUrl: 'https://www.bsi.bund.de/EN/Topics/CloudComputing/Compliance_Criteria_Catalogue/Compliance_Criteria_Catalogue_node.html',
  },
  {
    id: 'ens',
    name: 'ENS',
    category: 'Government / Regional',
    scope: 'W. Europe',
    description: 'Spain’s Esquema Nacional de Seguridad (National Security Framework).',
    definitionUrl: 'https://ens.ccn.cni.es/en/',
  },
  {
    id: 'mtcs',
    name: 'MTCS',
    category: 'Government / Regional',
    scope: 'Asia Pacific',
    description: 'Singapore’s Multi-Tier Cloud Security standard (SS 584).',
    definitionUrl: 'https://www.imda.gov.sg/regulations-and-licensing-listing/ict-standards-and-quality-of-service/it-standards-and-frameworks',
  },
];

export const CERT_BY_ID: Record<string, Certification> = Object.fromEntries(
  CERTIFICATIONS.map((c) => [c.id, c]),
);

// Each provider's official compliance page — the source of truth for its holdings,
// and what gets re-checked on the ~6-month refresh.
export interface ComplianceSource {
  id: string;
  name: string;
  color: string;
  sourceUrl: string;
  sourceLabel: string;
  lastVerified: string; // ISO date
}

export const COMPLIANCE_PROVIDERS: ComplianceSource[] = [
  { id: 'aws', name: 'AWS', color: '#FF9900', sourceUrl: 'https://aws.amazon.com/compliance/programs/', sourceLabel: 'AWS Compliance Programs', lastVerified: '2026-07-09' },
  { id: 'azure', name: 'Azure', color: '#00BCFF', sourceUrl: 'https://learn.microsoft.com/en-us/azure/compliance/', sourceLabel: 'Azure Compliance Offerings', lastVerified: '2026-07-09' },
  { id: 'gcp', name: 'Google Cloud', color: '#34A853', sourceUrl: 'https://cloud.google.com/security/compliance/offerings', sourceLabel: 'Google Cloud Compliance', lastVerified: '2026-07-09' },
  { id: 'oracle', name: 'Oracle', color: '#F80000', sourceUrl: 'https://www.oracle.com/corporate/cloud-compliance/', sourceLabel: 'Oracle Cloud Compliance', lastVerified: '2026-07-09' },
  { id: 'alibaba', name: 'Alibaba Cloud', color: '#FF6A00', sourceUrl: 'https://www.alibabacloud.com/en/trust-center', sourceLabel: 'Alibaba Cloud Trust Center', lastVerified: '2026-07-09' },
  { id: 'cloudflare', name: 'Cloudflare', color: '#F38020', sourceUrl: 'https://www.cloudflare.com/trust-hub/compliance-resources/', sourceLabel: 'Cloudflare Trust Hub', lastVerified: '2026-07-09' },
  { id: 'digitalocean', name: 'DigitalOcean', color: '#0069FF', sourceUrl: 'https://www.digitalocean.com/trust/certification-reports', sourceLabel: 'DigitalOcean Trust Platform', lastVerified: '2026-07-09' },
];

// provider id → certification ids held, per that provider's published docs.
// See header note on what "not listed" means.
export const PROVIDER_CERTIFICATIONS: Record<string, string[]> = {
  aws: [
    'iso-27001', 'iso-27017', 'iso-27018', 'soc-1', 'soc-2', 'soc-3', 'pci-dss', 'hipaa',
    'fedramp-high', 'fedramp-moderate', 'csa-star', 'fips-140-2', 'hitrust', 'gdpr', 'irap', 'c5', 'ens', 'mtcs',
  ],
  azure: [
    'iso-27001', 'iso-27017', 'iso-27018', 'soc-1', 'soc-2', 'soc-3', 'pci-dss', 'hipaa',
    'fedramp-high', 'fedramp-moderate', 'csa-star', 'fips-140-2', 'hitrust', 'gdpr', 'irap', 'c5', 'ens', 'mtcs',
  ],
  gcp: [
    'iso-27001', 'iso-27017', 'iso-27018', 'soc-1', 'soc-2', 'soc-3', 'pci-dss', 'hipaa',
    'fedramp-high', 'fedramp-moderate', 'csa-star', 'fips-140-2', 'hitrust', 'gdpr', 'irap', 'c5', 'ens', 'mtcs',
  ],
  oracle: [
    'iso-27001', 'iso-27017', 'iso-27018', 'soc-1', 'soc-2', 'soc-3', 'pci-dss', 'hipaa',
    'fedramp-high', 'fedramp-moderate', 'csa-star', 'fips-140-2', 'gdpr', 'irap', 'c5',
  ],
  alibaba: [
    'iso-27001', 'iso-27017', 'iso-27018', 'soc-1', 'soc-2', 'soc-3', 'pci-dss', 'hipaa',
    'csa-star', 'gdpr', 'c5', 'mtcs',
  ],
  cloudflare: [
    'iso-27001', 'iso-27018', 'soc-2', 'pci-dss', 'hipaa', 'gdpr',
  ],
  digitalocean: [
    'iso-27001', 'soc-2', 'soc-3', 'pci-dss', 'csa-star', 'gdpr',
  ],
};

export function providerHasCert(providerId: string, certId: string): boolean {
  return (PROVIDER_CERTIFICATIONS[providerId] ?? []).includes(certId);
}
