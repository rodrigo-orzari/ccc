import { BaseScraper } from './base_scraper.ts';

export class AwsFargateScraper extends BaseScraper<any> {
  async scrape(): Promise<any[]> {
    if (!this.page) throw new Error('Page not initialized');

    console.log('[AwsFargateScraper] Navigating to Fargate pricing...');
    await this.page.goto('https://aws.amazon.com/fargate/pricing/', { waitUntil: 'domcontentloaded' });
    await this.page.waitForTimeout(5000); 

    const text = await this.page.evaluate(() => document.body.innerText);
    console.log('[AwsFargateScraper] PAGE TEXT EXTRACT:', text.slice(0, 3000));
    
    // Attempt to extract vCPU and Memory prices via regex from text
    const matches = Array.from(text.matchAll(/\\$([0-9.]+)\s*per\s*(vCPU|GB)/gi));
    console.log('[AwsFargateScraper] Regex Price Matches:', matches.map(m => m[0]));
    
    return [];
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const scraper = new AwsFargateScraper();
  scraper.run().then(() => console.log('Done')).catch(console.error);
}
