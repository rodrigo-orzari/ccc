/**
 * Cloud Provider Infrastructure Data
 *
 * All data is derived from publicly available infrastructure pages.
 * Sources listed per provider. Last verified: 2026-06-17.
 *
 * Geographies align with the rest of the app:
 *   'N. America' | 'S. America' | 'W. Europe' | 'Asia Pacific' | 'Australia' | 'Mid East & Africa'
 */

export type RegionStatus = 'available' | 'announced' | 'limited';

export interface DatacenterRegion {
  name: string;
  code: string;
  geography: string;
  azCount: number;
  launched?: number;
  status: RegionStatus;
}

export interface ProviderInfrastructure {
  id: string;
  name: string;
  nameShort: string;
  emoji: string;
  color: string;        // hex for accent
  since: number;        // year first cloud service launched
  regions: number;      // launched public regions
  availabilityZones: number;
  edgeLocations: number;
  countriesServed: number;
  governmentRegions: number;
  announcedRegions: number;
  geographyCoverage: Record<string, number>; // geography → region count
  regionList: DatacenterRegion[];
  sources: { label: string; url: string }[];
  lastVerified: string;
}

export const PROVIDER_INFRA: ProviderInfrastructure[] = [
  {
    id: 'aws',
    name: 'Amazon Web Services',
    nameShort: 'AWS',
    emoji: '🟠',
    color: '#FF9900',
    since: 2006,
    regions: 36,
    availabilityZones: 114,
    edgeLocations: 700,
    countriesServed: 245,
    governmentRegions: 6,
    announcedRegions: 6,
    geographyCoverage: {
      'N. America':       7,
      'S. America':       1,
      'W. Europe':        8,
      'Asia Pacific':    13,
      'Australia':        2,
      'Mid East & Africa': 4,
    },
    regionList: [
      // N. America
      { name: 'US East (N. Virginia)',    code: 'us-east-1',     geography: 'N. America',       azCount: 6, launched: 2006, status: 'available' },
      { name: 'US East (Ohio)',           code: 'us-east-2',     geography: 'N. America',       azCount: 3, launched: 2016, status: 'available' },
      { name: 'US West (N. California)',  code: 'us-west-1',     geography: 'N. America',       azCount: 3, launched: 2009, status: 'available' },
      { name: 'US West (Oregon)',         code: 'us-west-2',     geography: 'N. America',       azCount: 4, launched: 2011, status: 'available' },
      { name: 'Canada (Central)',         code: 'ca-central-1',  geography: 'N. America',       azCount: 3, launched: 2016, status: 'available' },
      { name: 'Canada West (Calgary)',    code: 'ca-west-1',     geography: 'N. America',       azCount: 3, launched: 2023, status: 'available' },
      { name: 'Mexico (Central)',         code: 'mx-central-1',  geography: 'N. America',       azCount: 3, launched: 2024, status: 'available' },
      // S. America
      { name: 'South America (São Paulo)', code: 'sa-east-1',   geography: 'S. America',       azCount: 3, launched: 2011, status: 'available' },
      // W. Europe
      { name: 'Europe (Ireland)',         code: 'eu-west-1',     geography: 'W. Europe',        azCount: 3, launched: 2007, status: 'available' },
      { name: 'Europe (London)',          code: 'eu-west-2',     geography: 'W. Europe',        azCount: 3, launched: 2016, status: 'available' },
      { name: 'Europe (Paris)',           code: 'eu-west-3',     geography: 'W. Europe',        azCount: 3, launched: 2017, status: 'available' },
      { name: 'Europe (Frankfurt)',       code: 'eu-central-1',  geography: 'W. Europe',        azCount: 3, launched: 2014, status: 'available' },
      { name: 'Europe (Zurich)',          code: 'eu-central-2',  geography: 'W. Europe',        azCount: 3, launched: 2022, status: 'available' },
      { name: 'Europe (Stockholm)',       code: 'eu-north-1',    geography: 'W. Europe',        azCount: 3, launched: 2018, status: 'available' },
      { name: 'Europe (Milan)',           code: 'eu-south-1',    geography: 'W. Europe',        azCount: 3, launched: 2020, status: 'available' },
      { name: 'Europe (Spain)',           code: 'eu-south-2',    geography: 'W. Europe',        azCount: 3, launched: 2022, status: 'available' },
      // Asia Pacific
      { name: 'Asia Pacific (Tokyo)',     code: 'ap-northeast-1', geography: 'Asia Pacific',    azCount: 4, launched: 2011, status: 'available' },
      { name: 'Asia Pacific (Seoul)',     code: 'ap-northeast-2', geography: 'Asia Pacific',    azCount: 4, launched: 2016, status: 'available' },
      { name: 'Asia Pacific (Osaka)',     code: 'ap-northeast-3', geography: 'Asia Pacific',    azCount: 3, launched: 2021, status: 'available' },
      { name: 'Asia Pacific (Singapore)', code: 'ap-southeast-1', geography: 'Asia Pacific',   azCount: 3, launched: 2010, status: 'available' },
      { name: 'Asia Pacific (Jakarta)',   code: 'ap-southeast-3', geography: 'Asia Pacific',   azCount: 3, launched: 2021, status: 'available' },
      { name: 'Asia Pacific (Mumbai)',    code: 'ap-south-1',    geography: 'Asia Pacific',    azCount: 3, launched: 2016, status: 'available' },
      { name: 'Asia Pacific (Hyderabad)', code: 'ap-south-2',   geography: 'Asia Pacific',    azCount: 3, launched: 2022, status: 'available' },
      { name: 'Asia Pacific (Hong Kong)', code: 'ap-east-1',    geography: 'Asia Pacific',    azCount: 3, launched: 2019, status: 'available' },
      { name: 'Asia Pacific (Thailand)', code: 'ap-southeast-7', geography: 'Asia Pacific',   azCount: 3, launched: 2025, status: 'available' },
      { name: 'Asia Pacific (Malaysia)', code: 'ap-southeast-5', geography: 'Asia Pacific',   azCount: 3, launched: 2025, status: 'available' },
      { name: 'Asia Pacific (Taiwan)',   code: 'ap-east-2',      geography: 'Asia Pacific',   azCount: 3, launched: 2025, status: 'announced' },
      { name: 'Asia Pacific (New Zealand)', code: 'ap-southeast-6', geography: 'Asia Pacific', azCount: 3, launched: 2025, status: 'announced' },
      // Australia
      { name: 'Asia Pacific (Sydney)',    code: 'ap-southeast-2', geography: 'Australia',      azCount: 3, launched: 2012, status: 'available' },
      { name: 'Asia Pacific (Melbourne)', code: 'ap-southeast-4', geography: 'Australia',      azCount: 3, launched: 2023, status: 'available' },
      // Mid East & Africa
      { name: 'Middle East (Bahrain)',    code: 'me-south-1',    geography: 'Mid East & Africa', azCount: 3, launched: 2019, status: 'available' },
      { name: 'Middle East (UAE)',        code: 'me-central-1',  geography: 'Mid East & Africa', azCount: 3, launched: 2022, status: 'available' },
      { name: 'Israel (Tel Aviv)',        code: 'il-central-1',  geography: 'Mid East & Africa', azCount: 3, launched: 2023, status: 'available' },
      { name: 'Africa (Cape Town)',       code: 'af-south-1',    geography: 'Mid East & Africa', azCount: 3, launched: 2020, status: 'available' },
    ],
    sources: [
      { label: 'AWS Global Infrastructure', url: 'https://aws.amazon.com/about-aws/global-infrastructure/' },
      { label: 'AWS Regions & AZs', url: 'https://aws.amazon.com/about-aws/global-infrastructure/regions_az/' },
    ],
    lastVerified: '2026-06-17',
  },

  {
    id: 'azure',
    name: 'Microsoft Azure',
    nameShort: 'Azure',
    emoji: '🔵',
    color: '#0078D4',
    since: 2010,
    regions: 60,
    availabilityZones: 180,
    edgeLocations: 200,
    countriesServed: 140,
    governmentRegions: 8,
    announcedRegions: 10,
    geographyCoverage: {
      'N. America':       10,
      'S. America':        4,
      'W. Europe':        18,
      'Asia Pacific':     12,
      'Australia':         2,
      'Mid East & Africa': 8,
    },
    regionList: [
      // N. America
      { name: 'East US (Virginia)',         code: 'eastus',          geography: 'N. America',       azCount: 3, launched: 2010, status: 'available' },
      { name: 'East US 2 (Virginia)',       code: 'eastus2',         geography: 'N. America',       azCount: 3, launched: 2014, status: 'available' },
      { name: 'West US (California)',       code: 'westus',          geography: 'N. America',       azCount: 0, launched: 2012, status: 'available' },
      { name: 'West US 2 (Washington)',     code: 'westus2',         geography: 'N. America',       azCount: 3, launched: 2016, status: 'available' },
      { name: 'West US 3 (Arizona)',        code: 'westus3',         geography: 'N. America',       azCount: 3, launched: 2021, status: 'available' },
      { name: 'Central US (Iowa)',          code: 'centralus',       geography: 'N. America',       azCount: 3, launched: 2014, status: 'available' },
      { name: 'North Central US (Illinois)', code: 'northcentralus', geography: 'N. America',       azCount: 0, launched: 2010, status: 'available' },
      { name: 'South Central US (Texas)',   code: 'southcentralus',  geography: 'N. America',       azCount: 3, launched: 2010, status: 'available' },
      { name: 'Canada Central (Toronto)',   code: 'canadacentral',   geography: 'N. America',       azCount: 3, launched: 2016, status: 'available' },
      { name: 'Canada East (Quebec City)',  code: 'canadaeast',      geography: 'N. America',       azCount: 0, launched: 2016, status: 'available' },
      // S. America
      { name: 'Brazil South (São Paulo)',   code: 'brazilsouth',     geography: 'S. America',       azCount: 3, launched: 2014, status: 'available' },
      { name: 'Brazil Southeast',          code: 'brazilsoutheast', geography: 'S. America',       azCount: 0, launched: 2021, status: 'available' },
      { name: 'Chile Central',             code: 'chilecentral',    geography: 'S. America',       azCount: 3, launched: 2024, status: 'available' },
      { name: 'Mexico Central',            code: 'mexicocentral',   geography: 'S. America',       azCount: 3, launched: 2024, status: 'available' },
      // W. Europe (sample — Azure has 18 total)
      { name: 'North Europe (Ireland)',     code: 'northeurope',     geography: 'W. Europe',        azCount: 3, launched: 2010, status: 'available' },
      { name: 'West Europe (Netherlands)', code: 'westeurope',      geography: 'W. Europe',        azCount: 3, launched: 2010, status: 'available' },
      { name: 'UK South (London)',         code: 'uksouth',         geography: 'W. Europe',        azCount: 3, launched: 2017, status: 'available' },
      { name: 'UK West (Cardiff)',         code: 'ukwest',          geography: 'W. Europe',        azCount: 0, launched: 2017, status: 'available' },
      { name: 'France Central (Paris)',    code: 'francecentral',   geography: 'W. Europe',        azCount: 3, launched: 2018, status: 'available' },
      { name: 'France South (Marseille)', code: 'francesouth',     geography: 'W. Europe',        azCount: 0, launched: 2018, status: 'available' },
      { name: 'Germany West Central',     code: 'germanywestcentral', geography: 'W. Europe',     azCount: 3, launched: 2019, status: 'available' },
      { name: 'Germany North',            code: 'germanynorth',    geography: 'W. Europe',        azCount: 0, launched: 2019, status: 'available' },
      { name: 'Switzerland North',        code: 'switzerlandnorth', geography: 'W. Europe',       azCount: 3, launched: 2019, status: 'available' },
      { name: 'Sweden Central',           code: 'swedencentral',   geography: 'W. Europe',        azCount: 3, launched: 2021, status: 'available' },
      { name: 'Norway East',              code: 'norwayeast',      geography: 'W. Europe',        azCount: 3, launched: 2020, status: 'available' },
      { name: 'Italy North',              code: 'italynorth',      geography: 'W. Europe',        azCount: 3, launched: 2023, status: 'available' },
      { name: 'Spain Central',            code: 'spaincentral',    geography: 'W. Europe',        azCount: 3, launched: 2023, status: 'available' },
      { name: 'Poland Central',           code: 'polandcentral',   geography: 'W. Europe',        azCount: 3, launched: 2023, status: 'available' },
      // Asia Pacific
      { name: 'East Asia (Hong Kong)',     code: 'eastasia',        geography: 'Asia Pacific',    azCount: 3, launched: 2010, status: 'available' },
      { name: 'Southeast Asia (Singapore)', code: 'southeastasia', geography: 'Asia Pacific',    azCount: 3, launched: 2010, status: 'available' },
      { name: 'Japan East (Tokyo)',        code: 'japaneast',       geography: 'Asia Pacific',    azCount: 3, launched: 2014, status: 'available' },
      { name: 'Japan West (Osaka)',        code: 'japanwest',       geography: 'Asia Pacific',    azCount: 0, launched: 2014, status: 'available' },
      { name: 'Korea Central (Seoul)',     code: 'koreacentral',    geography: 'Asia Pacific',    azCount: 3, launched: 2017, status: 'available' },
      { name: 'Central India (Pune)',      code: 'centralindia',    geography: 'Asia Pacific',    azCount: 3, launched: 2015, status: 'available' },
      { name: 'South India (Chennai)',     code: 'southindia',      geography: 'Asia Pacific',    azCount: 0, launched: 2015, status: 'available' },
      { name: 'Indonesia Central',        code: 'indonesiacentral', geography: 'Asia Pacific',   azCount: 3, launched: 2024, status: 'available' },
      { name: 'Malaysia West',            code: 'malaysiawest',    geography: 'Asia Pacific',    azCount: 3, launched: 2024, status: 'available' },
      { name: 'Taiwan North',             code: 'taiwannorth',     geography: 'Asia Pacific',    azCount: 3, launched: 2024, status: 'announced' },
      // Australia
      { name: 'Australia East (Sydney)',   code: 'australiaeast',   geography: 'Australia',       azCount: 3, launched: 2014, status: 'available' },
      { name: 'Australia Southeast (Melbourne)', code: 'australiasoutheast', geography: 'Australia', azCount: 0, launched: 2014, status: 'available' },
      // Mid East & Africa
      { name: 'UAE North (Dubai)',         code: 'uaenorth',        geography: 'Mid East & Africa', azCount: 3, launched: 2019, status: 'available' },
      { name: 'Qatar Central',            code: 'qatarcentral',    geography: 'Mid East & Africa', azCount: 3, launched: 2022, status: 'available' },
      { name: 'Israel Central',           code: 'israelcentral',   geography: 'Mid East & Africa', azCount: 3, launched: 2023, status: 'available' },
      { name: 'South Africa North (Johannesburg)', code: 'southafricanorth', geography: 'Mid East & Africa', azCount: 3, launched: 2019, status: 'available' },
    ],
    sources: [
      { label: 'Azure Global Infrastructure', url: 'https://azure.microsoft.com/en-us/explore/global-infrastructure/' },
      { label: 'Azure Geographies', url: 'https://azure.microsoft.com/en-us/explore/global-infrastructure/geographies/' },
    ],
    lastVerified: '2026-06-17',
  },

  {
    id: 'gcp',
    name: 'Google Cloud',
    nameShort: 'Google',
    emoji: '🔴',
    color: '#4285F4',
    since: 2008,
    regions: 40,
    availabilityZones: 121,
    edgeLocations: 202,
    countriesServed: 200,
    governmentRegions: 1,
    announcedRegions: 5,
    geographyCoverage: {
      'N. America':        9,
      'S. America':        3,
      'W. Europe':        11,
      'Asia Pacific':     10,
      'Australia':         1,
      'Mid East & Africa': 3,
    },
    regionList: [
      // N. America
      { name: 'Iowa (us-central1)',         code: 'us-central1',          geography: 'N. America',       azCount: 4, launched: 2014, status: 'available' },
      { name: 'South Carolina (us-east1)',  code: 'us-east1',             geography: 'N. America',       azCount: 3, launched: 2015, status: 'available' },
      { name: 'N. Virginia (us-east4)',     code: 'us-east4',             geography: 'N. America',       azCount: 3, launched: 2017, status: 'available' },
      { name: 'Columbus, OH (us-east5)',    code: 'us-east5',             geography: 'N. America',       azCount: 3, launched: 2022, status: 'available' },
      { name: 'Dallas, TX (us-south1)',     code: 'us-south1',            geography: 'N. America',       azCount: 3, launched: 2022, status: 'available' },
      { name: 'Oregon (us-west1)',          code: 'us-west1',             geography: 'N. America',       azCount: 3, launched: 2016, status: 'available' },
      { name: 'Los Angeles (us-west2)',     code: 'us-west2',             geography: 'N. America',       azCount: 3, launched: 2018, status: 'available' },
      { name: 'Salt Lake City (us-west3)',  code: 'us-west3',             geography: 'N. America',       azCount: 3, launched: 2021, status: 'available' },
      { name: 'Las Vegas (us-west4)',       code: 'us-west4',             geography: 'N. America',       azCount: 3, launched: 2020, status: 'available' },
      // S. America
      { name: 'São Paulo (southamerica-east1)', code: 'southamerica-east1', geography: 'S. America',    azCount: 3, launched: 2017, status: 'available' },
      { name: 'Santiago (southamerica-west1)', code: 'southamerica-west1', geography: 'S. America',     azCount: 3, launched: 2021, status: 'available' },
      { name: 'Mexico (northamerica-south1)', code: 'northamerica-south1', geography: 'S. America',     azCount: 3, launched: 2024, status: 'available' },
      // W. Europe
      { name: 'Belgium (europe-west1)',     code: 'europe-west1',         geography: 'W. Europe',        azCount: 3, launched: 2015, status: 'available' },
      { name: 'London (europe-west2)',      code: 'europe-west2',         geography: 'W. Europe',        azCount: 3, launched: 2017, status: 'available' },
      { name: 'Frankfurt (europe-west3)',   code: 'europe-west3',         geography: 'W. Europe',        azCount: 3, launched: 2017, status: 'available' },
      { name: 'Netherlands (europe-west4)', code: 'europe-west4',         geography: 'W. Europe',        azCount: 3, launched: 2018, status: 'available' },
      { name: 'Zurich (europe-west6)',      code: 'europe-west6',         geography: 'W. Europe',        azCount: 3, launched: 2019, status: 'available' },
      { name: 'Milan (europe-west8)',       code: 'europe-west8',         geography: 'W. Europe',        azCount: 3, launched: 2022, status: 'available' },
      { name: 'Paris (europe-west9)',       code: 'europe-west9',         geography: 'W. Europe',        azCount: 3, launched: 2022, status: 'available' },
      { name: 'Berlin (europe-west10)',     code: 'europe-west10',        geography: 'W. Europe',        azCount: 3, launched: 2023, status: 'available' },
      { name: 'Turin (europe-west12)',      code: 'europe-west12',        geography: 'W. Europe',        azCount: 3, launched: 2023, status: 'available' },
      { name: 'Finland (europe-north1)',    code: 'europe-north1',        geography: 'W. Europe',        azCount: 3, launched: 2018, status: 'available' },
      { name: 'Warsaw (europe-central2)',   code: 'europe-central2',      geography: 'W. Europe',        azCount: 3, launched: 2021, status: 'available' },
      // Asia Pacific
      { name: 'Taiwan (asia-east1)',        code: 'asia-east1',           geography: 'Asia Pacific',    azCount: 3, launched: 2014, status: 'available' },
      { name: 'Hong Kong (asia-east2)',     code: 'asia-east2',           geography: 'Asia Pacific',    azCount: 3, launched: 2018, status: 'available' },
      { name: 'Tokyo (asia-northeast1)',    code: 'asia-northeast1',      geography: 'Asia Pacific',    azCount: 3, launched: 2016, status: 'available' },
      { name: 'Osaka (asia-northeast2)',    code: 'asia-northeast2',      geography: 'Asia Pacific',    azCount: 3, launched: 2020, status: 'available' },
      { name: 'Seoul (asia-northeast3)',    code: 'asia-northeast3',      geography: 'Asia Pacific',    azCount: 3, launched: 2020, status: 'available' },
      { name: 'Mumbai (asia-south1)',       code: 'asia-south1',          geography: 'Asia Pacific',    azCount: 3, launched: 2017, status: 'available' },
      { name: 'Delhi (asia-south2)',        code: 'asia-south2',          geography: 'Asia Pacific',    azCount: 3, launched: 2021, status: 'available' },
      { name: 'Singapore (asia-southeast1)', code: 'asia-southeast1',    geography: 'Asia Pacific',    azCount: 3, launched: 2017, status: 'available' },
      { name: 'Jakarta (asia-southeast2)', code: 'asia-southeast2',      geography: 'Asia Pacific',    azCount: 3, launched: 2020, status: 'available' },
      { name: 'Kuala Lumpur (asia-southeast3)', code: 'asia-southeast3', geography: 'Asia Pacific',    azCount: 3, launched: 2024, status: 'available' },
      // Australia
      { name: 'Sydney (australia-southeast1)', code: 'australia-southeast1', geography: 'Australia',  azCount: 3, launched: 2017, status: 'available' },
      // Mid East & Africa
      { name: 'Tel Aviv (me-west1)',        code: 'me-west1',             geography: 'Mid East & Africa', azCount: 3, launched: 2022, status: 'available' },
      { name: 'Doha (me-central1)',         code: 'me-central1',          geography: 'Mid East & Africa', azCount: 3, launched: 2023, status: 'available' },
      { name: 'Johannesburg (africa-south1)', code: 'africa-south1',     geography: 'Mid East & Africa', azCount: 3, launched: 2024, status: 'available' },
    ],
    sources: [
      { label: 'Google Cloud Locations', url: 'https://cloud.google.com/about/locations' },
      { label: 'Google Network Infrastructure', url: 'https://cloud.google.com/network-intelligence-center' },
    ],
    lastVerified: '2026-06-17',
  },

  {
    id: 'oracle',
    name: 'Oracle Cloud Infrastructure',
    nameShort: 'Oracle',
    emoji: '🔴',
    color: '#F80000',
    since: 2016,
    regions: 46,
    availabilityZones: 138,
    edgeLocations: 100,
    countriesServed: 50,
    governmentRegions: 12,
    announcedRegions: 8,
    geographyCoverage: {
      'N. America':        7,
      'S. America':        3,
      'W. Europe':        11,
      'Asia Pacific':     12,
      'Australia':         2,
      'Mid East & Africa': 5,
    },
    regionList: [
      // N. America
      { name: 'US East (Ashburn)',           code: 'us-ashburn-1',      geography: 'N. America',       azCount: 3, launched: 2018, status: 'available' },
      { name: 'US West (Phoenix)',           code: 'us-phoenix-1',      geography: 'N. America',       azCount: 3, launched: 2018, status: 'available' },
      { name: 'US West (San Jose)',          code: 'us-sanjose-1',      geography: 'N. America',       azCount: 3, launched: 2020, status: 'available' },
      { name: 'US Midwest (Chicago)',        code: 'us-chicago-1',      geography: 'N. America',       azCount: 3, launched: 2022, status: 'available' },
      { name: 'Canada Southeast (Montreal)', code: 'ca-montreal-1',    geography: 'N. America',       azCount: 3, launched: 2022, status: 'available' },
      { name: 'Canada West (Vancouver)',     code: 'ca-vancouver-1',   geography: 'N. America',       azCount: 3, launched: 2024, status: 'available' },
      { name: 'Mexico Central (Queretaro)',  code: 'mx-queretaro-1',   geography: 'N. America',       azCount: 3, launched: 2021, status: 'available' },
      // S. America
      { name: 'Brazil East (São Paulo)',     code: 'sa-saopaulo-1',    geography: 'S. America',       azCount: 3, launched: 2021, status: 'available' },
      { name: 'Brazil Southeast (Vinhedo)', code: 'sa-vinhedo-1',     geography: 'S. America',       azCount: 3, launched: 2022, status: 'available' },
      { name: 'Chile (Santiago)',            code: 'sa-santiago-1',    geography: 'S. America',       azCount: 3, launched: 2022, status: 'available' },
      // W. Europe
      { name: 'Germany Central (Frankfurt)', code: 'eu-frankfurt-1',  geography: 'W. Europe',        azCount: 3, launched: 2019, status: 'available' },
      { name: 'Netherlands (Amsterdam)',     code: 'eu-amsterdam-1',   geography: 'W. Europe',        azCount: 3, launched: 2019, status: 'available' },
      { name: 'UK South (London)',           code: 'uk-london-1',      geography: 'W. Europe',        azCount: 3, launched: 2019, status: 'available' },
      { name: 'Switzerland North (Zurich)', code: 'eu-zurich-1',      geography: 'W. Europe',        azCount: 3, launched: 2021, status: 'available' },
      { name: 'France South (Marseille)',   code: 'eu-marseille-1',   geography: 'W. Europe',        azCount: 3, launched: 2022, status: 'available' },
      { name: 'Italy (Milan)',              code: 'eu-milan-1',       geography: 'W. Europe',        azCount: 3, launched: 2022, status: 'available' },
      { name: 'Spain (Madrid)',             code: 'eu-madrid-1',      geography: 'W. Europe',        azCount: 3, launched: 2022, status: 'available' },
      { name: 'Sweden (Stockholm)',         code: 'eu-stockholm-1',   geography: 'W. Europe',        azCount: 3, launched: 2022, status: 'available' },
      { name: 'Poland (Warsaw)',            code: 'eu-warsaw-1',      geography: 'W. Europe',        azCount: 3, launched: 2023, status: 'available' },
      { name: 'Greece (Athens)',            code: 'eu-athens-1',      geography: 'W. Europe',        azCount: 3, launched: 2023, status: 'available' },
      // Asia Pacific
      { name: 'Japan East (Tokyo)',         code: 'ap-tokyo-1',       geography: 'Asia Pacific',    azCount: 3, launched: 2020, status: 'available' },
      { name: 'Japan West (Osaka)',         code: 'ap-osaka-1',       geography: 'Asia Pacific',    azCount: 3, launched: 2021, status: 'available' },
      { name: 'South Korea (Seoul)',        code: 'ap-seoul-1',       geography: 'Asia Pacific',    azCount: 3, launched: 2020, status: 'available' },
      { name: 'South Korea (Chuncheon)',    code: 'ap-chuncheon-1',   geography: 'Asia Pacific',    azCount: 3, launched: 2021, status: 'available' },
      { name: 'India West (Mumbai)',        code: 'ap-mumbai-1',      geography: 'Asia Pacific',    azCount: 3, launched: 2019, status: 'available' },
      { name: 'India South (Hyderabad)',    code: 'ap-hyderabad-1',   geography: 'Asia Pacific',    azCount: 3, launched: 2019, status: 'available' },
      { name: 'Singapore',                 code: 'ap-singapore-1',   geography: 'Asia Pacific',    azCount: 3, launched: 2019, status: 'available' },
      { name: 'Singapore 2',              code: 'ap-singapore-2',   geography: 'Asia Pacific',    azCount: 3, launched: 2022, status: 'available' },
      { name: 'Australia East (Sydney)',   code: 'ap-sydney-1',      geography: 'Australia',       azCount: 3, launched: 2019, status: 'available' },
      { name: 'Australia Southeast (Melbourne)', code: 'ap-melbourne-1', geography: 'Australia',  azCount: 3, launched: 2020, status: 'available' },
      // Mid East & Africa
      { name: 'UAE East (Dubai)',          code: 'me-dubai-1',       geography: 'Mid East & Africa', azCount: 3, launched: 2021, status: 'available' },
      { name: 'Saudi Arabia West (Jeddah)', code: 'me-jeddah-1',    geography: 'Mid East & Africa', azCount: 3, launched: 2021, status: 'available' },
      { name: 'Israel (Jerusalem)',        code: 'il-jerusalem-1',   geography: 'Mid East & Africa', azCount: 3, launched: 2022, status: 'available' },
      { name: 'South Africa (Johannesburg)', code: 'af-johannesburg-1', geography: 'Mid East & Africa', azCount: 3, launched: 2022, status: 'available' },
    ],
    sources: [
      { label: 'OCI Cloud Regions', url: 'https://www.oracle.com/cloud/data-regions/' },
      { label: 'OCI Infrastructure', url: 'https://www.oracle.com/cloud/architecture-and-regions/' },
    ],
    lastVerified: '2026-06-17',
  },

  {
    id: 'digitalocean',
    name: 'DigitalOcean',
    nameShort: 'DigitalOcean',
    emoji: '🔵',
    color: '#0080FF',
    since: 2011,
    regions: 15,
    availabilityZones: 0, // DigitalOcean uses single-DC regions, not traditional AZs
    edgeLocations: 15,
    countriesServed: 9,
    governmentRegions: 0,
    announcedRegions: 0,
    geographyCoverage: {
      'N. America':        4,
      'S. America':        1,
      'W. Europe':         3,
      'Asia Pacific':      4,
      'Australia':         1,
      'Mid East & Africa': 1,
    },
    regionList: [
      { name: 'New York 1',         code: 'nyc1', geography: 'N. America',       azCount: 1, launched: 2012, status: 'available' },
      { name: 'New York 3',         code: 'nyc3', geography: 'N. America',       azCount: 1, launched: 2014, status: 'available' },
      { name: 'San Francisco 3',    code: 'sfo3', geography: 'N. America',       azCount: 1, launched: 2021, status: 'available' },
      { name: 'Toronto',            code: 'tor1', geography: 'N. America',       azCount: 1, launched: 2020, status: 'available' },
      { name: 'São Paulo',          code: 'bra1', geography: 'S. America',       azCount: 1, launched: 2024, status: 'available' },
      { name: 'Amsterdam 3',        code: 'ams3', geography: 'W. Europe',        azCount: 1, launched: 2014, status: 'available' },
      { name: 'Frankfurt 1',        code: 'fra1', geography: 'W. Europe',        azCount: 1, launched: 2016, status: 'available' },
      { name: 'London 1',           code: 'lon1', geography: 'W. Europe',        azCount: 1, launched: 2016, status: 'available' },
      { name: 'Singapore 1',        code: 'sgp1', geography: 'Asia Pacific',    azCount: 1, launched: 2014, status: 'available' },
      { name: 'Bangalore 1',        code: 'blr1', geography: 'Asia Pacific',    azCount: 1, launched: 2020, status: 'available' },
      { name: 'Hyderabad',          code: 'hyd1', geography: 'Asia Pacific',    azCount: 1, launched: 2024, status: 'available' },
      { name: 'Osaka',              code: 'osa1', geography: 'Asia Pacific',    azCount: 1, launched: 2024, status: 'available' },
      { name: 'Sydney',             code: 'syd1', geography: 'Australia',       azCount: 1, launched: 2023, status: 'available' },
      { name: 'Dubai',              code: 'dub1', geography: 'Mid East & Africa', azCount: 1, launched: 2024, status: 'available' },
    ],
    sources: [
      { label: 'DigitalOcean Regional Availability', url: 'https://docs.digitalocean.com/products/platform/availability-matrix/' },
    ],
    lastVerified: '2026-06-17',
  },

  {
    id: 'alibaba',
    name: 'Alibaba Cloud',
    nameShort: 'Alibaba',
    emoji: '🟠',
    color: '#FF6A00',
    since: 2009,
    regions: 30,
    availabilityZones: 89,
    edgeLocations: 2800,
    countriesServed: 24,
    governmentRegions: 0,
    announcedRegions: 3,
    geographyCoverage: {
      'N. America':        2,
      'S. America':        1,
      'W. Europe':         3,
      'Asia Pacific':     17,
      'Australia':         1,
      'Mid East & Africa': 2,
    },
    regionList: [
      // Asia Pacific (core market)
      { name: 'China (Hangzhou)',         code: 'cn-hangzhou',        geography: 'Asia Pacific',    azCount: 6, launched: 2009, status: 'available' },
      { name: 'China (Shanghai)',         code: 'cn-shanghai',        geography: 'Asia Pacific',    azCount: 8, launched: 2010, status: 'available' },
      { name: 'China (Beijing)',          code: 'cn-beijing',         geography: 'Asia Pacific',    azCount: 6, launched: 2011, status: 'available' },
      { name: 'China (Shenzhen)',         code: 'cn-shenzhen',        geography: 'Asia Pacific',    azCount: 4, launched: 2012, status: 'available' },
      { name: 'China (Chengdu)',          code: 'cn-chengdu',         geography: 'Asia Pacific',    azCount: 2, launched: 2018, status: 'available' },
      { name: 'China (Heyuan)',           code: 'cn-heyuan',          geography: 'Asia Pacific',    azCount: 2, launched: 2019, status: 'available' },
      { name: 'China (Wulanchabu)',       code: 'cn-wulanchabu',      geography: 'Asia Pacific',    azCount: 3, launched: 2018, status: 'available' },
      { name: 'China (Hong Kong)',        code: 'cn-hongkong',        geography: 'Asia Pacific',    azCount: 3, launched: 2014, status: 'available' },
      { name: 'Singapore',               code: 'ap-southeast-1',     geography: 'Asia Pacific',    azCount: 3, launched: 2015, status: 'available' },
      { name: 'Malaysia (Kuala Lumpur)', code: 'ap-southeast-3',     geography: 'Asia Pacific',    azCount: 3, launched: 2022, status: 'available' },
      { name: 'Indonesia (Jakarta)',     code: 'ap-southeast-5',     geography: 'Asia Pacific',    azCount: 3, launched: 2018, status: 'available' },
      { name: 'Philippines (Manila)',    code: 'ap-southeast-6',     geography: 'Asia Pacific',    azCount: 2, launched: 2023, status: 'available' },
      { name: 'Thailand (Bangkok)',      code: 'ap-southeast-7',     geography: 'Asia Pacific',    azCount: 2, launched: 2023, status: 'available' },
      { name: 'Japan (Tokyo)',           code: 'ap-northeast-1',     geography: 'Asia Pacific',    azCount: 3, launched: 2016, status: 'available' },
      { name: 'South Korea (Seoul)',     code: 'ap-northeast-2',     geography: 'Asia Pacific',    azCount: 2, launched: 2020, status: 'available' },
      { name: 'India (Mumbai)',          code: 'ap-south-1',         geography: 'Asia Pacific',    azCount: 3, launched: 2018, status: 'available' },
      { name: 'India (Nanjing)',         code: 'cn-nanjing',         geography: 'Asia Pacific',    azCount: 2, launched: 2022, status: 'available' },
      // N. America
      { name: 'US East (Virginia)',      code: 'us-east-1',          geography: 'N. America',       azCount: 3, launched: 2015, status: 'available' },
      { name: 'US West (Silicon Valley)', code: 'us-west-1',         geography: 'N. America',       azCount: 3, launched: 2015, status: 'available' },
      // S. America
      { name: 'Brazil (São Paulo)',      code: 'sa-east-1',          geography: 'S. America',       azCount: 2, launched: 2020, status: 'available' },
      // W. Europe
      { name: 'Germany (Frankfurt)',     code: 'eu-central-1',       geography: 'W. Europe',        azCount: 3, launched: 2016, status: 'available' },
      { name: 'UK (London)',             code: 'eu-west-1',          geography: 'W. Europe',        azCount: 3, launched: 2021, status: 'available' },
      { name: 'France (Paris)',          code: 'eu-west-2',          geography: 'W. Europe',        azCount: 2, launched: 2023, status: 'available' },
      // Australia
      { name: 'Australia (Sydney)',      code: 'ap-southeast-2',     geography: 'Australia',        azCount: 3, launched: 2016, status: 'available' },
      // Mid East & Africa
      { name: 'UAE (Dubai)',             code: 'me-east-1',          geography: 'Mid East & Africa', azCount: 2, launched: 2019, status: 'available' },
      { name: 'South Africa (Johannesburg)', code: 'af-south-1',    geography: 'Mid East & Africa', azCount: 2, launched: 2023, status: 'available' },
    ],
    sources: [
      { label: 'Alibaba Cloud Global Infrastructure', url: 'https://www.alibabacloud.com/global-locations' },
    ],
    lastVerified: '2026-06-17',
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    nameShort: 'Cloudflare',
    emoji: '🟠',
    color: '#F38020',
    since: 2009,
    regions: 300,
    availabilityZones: 0,
    edgeLocations: 300,
    countriesServed: 180,
    governmentRegions: 0,
    announcedRegions: 0,
    geographyCoverage: {
      'N. America':       100,
      'S. America':       15,
      'W. Europe':        80,
      'Asia Pacific':     85,
      'Australia':        10,
      'Mid East & Africa': 10,
    },
    regionList: [
      { name: 'North America (Distributed)', code: 'na-edge', geography: 'N. America', azCount: 0, launched: 2009, status: 'available' },
      { name: 'Europe (Distributed)', code: 'eu-edge', geography: 'W. Europe', azCount: 0, launched: 2009, status: 'available' },
      { name: 'Asia Pacific (Distributed)', code: 'apac-edge', geography: 'Asia Pacific', azCount: 0, launched: 2015, status: 'available' },
      { name: 'South America (Distributed)', code: 'sa-edge', geography: 'S. America', azCount: 0, launched: 2016, status: 'available' },
    ],
    sources: [
      { label: 'Cloudflare Global Network', url: 'https://www.cloudflare.com/network/' },
    ],
    lastVerified: '2026-06-17',
  },
];

export const GEOGRAPHIES = [
  'N. America',
  'S. America',
  'W. Europe',
  'Asia Pacific',
  'Australia',
  'Mid East & Africa',
] as const;

export type Geography = typeof GEOGRAPHIES[number];
