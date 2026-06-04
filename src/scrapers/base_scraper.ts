import { chromium, Browser, Page, BrowserContext } from '@playwright/test';

export abstract class BaseScraper<T> {
  protected browser: Browser | null = null;
  protected context: BrowserContext | null = null;
  protected page: Page | null = null;

  async init() {
    console.log(`[Scraper] Initializing headless browser for ${this.constructor.name}...`);
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 720 },
    });
    this.page = await this.context.newPage();
    
    // Attempt basic stealth evasion
    await this.page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });
  }

  async close() {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
    console.log(`[Scraper] Browser closed for ${this.constructor.name}.`);
  }

  /**
   * The core scraping logic. Must return an array of strongly-typed items.
   */
  abstract scrape(): Promise<T[]>;

  /**
   * Run the scraper lifecycle securely.
   */
  async run(): Promise<T[]> {
    try {
      await this.init();
      return await this.scrape();
    } catch (err) {
      console.error(`[Scraper] ❌ Error in ${this.constructor.name}:`, err);
      throw err;
    } finally {
      await this.close();
    }
  }
}
