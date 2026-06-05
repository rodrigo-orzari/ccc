import { BaseScraper } from './base_scraper.ts';

export class AwsFargateScraper extends BaseScraper<any> {
  async scrape(): Promise<any[]> {
    if (!this.page) throw new Error('Page not initialized');

    console.log('[AwsFargateScraper] Navigating to Fargate pricing...');
    
    const requestUrls: string[] = [];
    this.page.on('request', request => requestUrls.push(request.url()));

    await this.page.goto('https://aws.amazon.com/fargate/pricing/', { waitUntil: 'networkidle' });
    
    console.log('[AwsFargateScraper] Intercepted requests for JSON:');
    requestUrls.filter(u => u.endsWith('.json') || u.includes('pricing')).forEach(u => console.log(u));
    
    return [];
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const scraper = new AwsFargateScraper();
  scraper.run().then(() => console.log('Done')).catch(console.error);
}
