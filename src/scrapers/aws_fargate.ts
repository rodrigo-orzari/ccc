import axios from 'axios';
import { BaseScraper } from './base_scraper.ts';

export class AwsFargateScraper extends BaseScraper<any> {
  // Override run to bypass Playwright headless browser initialization entirely,
  // since this scraper only uses standard HTTP API requests via axios.
  async run(): Promise<any[]> {
    return this.scrape();
  }

  async scrape(): Promise<any[]> {
    console.log('[AwsFargateScraper] Fetching AmazonECS pricing API...');
    
    // Using Live API directly for much higher reliability than DOM scraping
    const ecsUrl = 'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonECS/current/index.json';
    const { data: ecsData } = await axios.get(ecsUrl);
    
    // Find US East 1 (N. Virginia) prices for baseline
    let vcpuPriceX86 = 0.04048;
    let memPriceX86 = 0.004445;
    let vcpuPriceArm = 0.03238;
    let memPriceArm = 0.00356;

    for (const sku in ecsData.products) {
      const p = ecsData.products[sku];
      if (p.attributes.location === 'US East (N. Virginia)' && p.attributes.usagetype?.includes('Fargate')) {
        const terms = ecsData.terms.OnDemand[sku];
        if (!terms) continue;
        const priceDim = Object.values(terms)[0] as any;
        const priceDetails = Object.values(priceDim.priceDimensions)[0] as any;
        const price = parseFloat(priceDetails.pricePerUnit.USD);

        if (p.attributes.usagetype === 'Fargate-vCPU-Hours:perCPU') vcpuPriceX86 = price;
        if (p.attributes.usagetype === 'Fargate-GB-Hours') memPriceX86 = price;
        if (p.attributes.usagetype === 'Fargate-ARM-vCPU-Hours:perCPU') vcpuPriceArm = price;
        if (p.attributes.usagetype === 'Fargate-ARM-GB-Hours') memPriceArm = price;
      }
    }

    console.log(`[AwsFargateScraper] Live Rates - x86: $${vcpuPriceX86}/vCPU, $${memPriceX86}/GB | ARM: $${vcpuPriceArm}/vCPU, $${memPriceArm}/GB`);

    const calculateFargatePrice = (vcpus: number, memoryGb: number, arch: 'x86_64' | 'ARM64') => {
      if (arch === 'x86_64') return (vcpus * vcpuPriceX86) + (memoryGb * memPriceX86);
      return (vcpus * vcpuPriceArm) + (memoryGb * memPriceArm);
    };

    const generateConfigs = (arch: 'x86_64' | 'ARM64', vendor: 'Intel' | 'AWS') => {
      const getAttrs = () => ({
        orchestrator: 'Serverless',
        compute_type: 'Serverless',
        architecture: arch === 'x86_64' ? 'x86' : 'ARM',
        billing_granularity: 'Second',
      });
      return [
        { type: `Fargate-0.5vCPU-1GB-${arch}`, vcpus: 0.5, memory: 1, cpuVendor: vendor, price: calculateFargatePrice(0.5, 1, arch), attributes: getAttrs() },
        { type: `Fargate-1vCPU-2GB-${arch}`, vcpus: 1, memory: 2, cpuVendor: vendor, price: calculateFargatePrice(1, 2, arch), attributes: getAttrs() },
        { type: `Fargate-2vCPU-4GB-${arch}`, vcpus: 2, memory: 4, cpuVendor: vendor, price: calculateFargatePrice(2, 4, arch), attributes: getAttrs() },
        { type: `Fargate-4vCPU-8GB-${arch}`, vcpus: 4, memory: 8, cpuVendor: vendor, price: calculateFargatePrice(4, 8, arch), attributes: getAttrs() },
        { type: `Fargate-8vCPU-16GB-${arch}`, vcpus: 8, memory: 16, cpuVendor: vendor, price: calculateFargatePrice(8, 16, arch), attributes: getAttrs() },
        { type: `Fargate-16vCPU-32GB-${arch}`, vcpus: 16, memory: 32, cpuVendor: vendor, price: calculateFargatePrice(16, 32, arch), attributes: getAttrs() },
      ];
    };

    const instances = [
      ...generateConfigs('x86_64', 'Intel'),
      ...generateConfigs('ARM64', 'AWS')
    ];

    return instances;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const scraper = new AwsFargateScraper();
  scraper.run().then(res => console.log(res.slice(0, 3))).catch(console.error);
}
