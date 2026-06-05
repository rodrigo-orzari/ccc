import axios from 'axios';
import { BaseScraper } from './base_scraper.ts';

export class AzureContainerInstancesScraper extends BaseScraper<any> {
  async scrape(): Promise<any[]> {
    console.log('[AzureContainerInstancesScraper] Fetching Azure Retail API for ACI...');
    
    const url = "https://prices.azure.com/api/retail/prices?$filter=serviceName eq 'Container Instances' and armRegionName eq 'eastus'";
    let items: any[] = [];
    let currentUrl: string | null = url;

    while (currentUrl) {
      const { data } = await axios.get(currentUrl);
      items = items.concat(data.Items);
      currentUrl = data.NextPageLink || null;
    }

    let vcpuPrice = 0.046;
    let memPrice = 0.005;

    for (const item of items) {
      if (item.skuName === 'vCPU Duration' && item.type === 'Consumption') vcpuPrice = item.retailPrice;
      if (item.skuName === 'Memory Duration' && item.type === 'Consumption') memPrice = item.retailPrice;
    }

    console.log(`[AzureContainerInstancesScraper] Live Rates - vCPU: $${vcpuPrice}/vCPU-hour, Memory: $${memPrice}/GB-hour`);

    const calculateAciPrice = (vcpus: number, memoryGb: number) => {
      return (vcpus * vcpuPrice) + (memoryGb * memPrice);
    };

    const generateConfigs = () => [
      { type: 'ACI-1vCPU-1GB', vcpus: 1, memory: 1, cpuVendor: 'Intel', price: calculateAciPrice(1, 1) },
      { type: 'ACI-1vCPU-2GB', vcpus: 1, memory: 2, cpuVendor: 'Intel', price: calculateAciPrice(1, 2) },
      { type: 'ACI-2vCPU-4GB', vcpus: 2, memory: 4, cpuVendor: 'Intel', price: calculateAciPrice(2, 4) },
      { type: 'ACI-4vCPU-8GB', vcpus: 4, memory: 8, cpuVendor: 'Intel', price: calculateAciPrice(4, 8) },
      { type: 'ACI-8vCPU-16GB', vcpus: 8, memory: 16, cpuVendor: 'Intel', price: calculateAciPrice(8, 16) },
    ];

    return generateConfigs();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const scraper = new AzureContainerInstancesScraper();
  scraper.run().then(res => console.log(res.slice(0, 3))).catch(console.error);
}
