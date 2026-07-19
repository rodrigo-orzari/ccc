import { test, expect } from '@playwright/test';

const PRODUCT_TYPES = [
  'vm', 'gpu', 'database', 'serverless', 'containers',
  'networking', 'storage', 'data-analytics', 'ai', 'app-hosting', 'security', 'integration'
];

test.describe('UI Consistency and Sanity Checks', () => {
  for (const pt of PRODUCT_TYPES) {
    test(`Product Type: ${pt} - Filters and Table Headers align`, async ({ page }) => {
      // 1. Navigate to the product type
      await page.goto(`/?product=${pt}`);
      
      // 2. Wait for the table headers and at least one row or empty state to load
      await page.waitForSelector('table thead tr th', { state: 'visible' });

      // 3. Extract all filter section titles from the Sidebar
      // The titles are typically inside h2 buttons in the FilterSidebar
      const filterLocators = page.locator('aside h2 button');
      const filterCount = await filterLocators.count();
      const filters: string[] = [];
      for (let i = 0; i < filterCount; i++) {
        const text = await filterLocators.nth(i).textContent();
        if (text) {
          // Remove the down arrow or extra text like tooltips
          filters.push(text.replace('ⓘ', '').trim());
        }
      }

      // 4. Extract all column headers from the PricingTable
      const headerLocators = page.locator('table thead tr th');
      const headerCount = await headerLocators.count();
      const columns: string[] = [];
      for (let i = 0; i < headerCount; i++) {
        const text = await headerLocators.nth(i).textContent();
        if (text) {
           // Remove sort arrows and tooltip markers
          columns.push(text.replace(/↑|↓|↕|ⓘ/g, '').trim());
        }
      }

      // 5. Basic sanity assertions
      
      // Provider and Product should always be columns
      expect(columns.some(c => c.includes('Provider'))).toBeTruthy();
      expect(columns.some(c => c.includes('Product'))).toBeTruthy();

      // Ensure we have some filters (unless it's a very simple page, but all currently have filters)
      if (pt !== 'security') {
        expect(filters.length).toBeGreaterThan(0);
      }
      
      // Ensure the table has columns
      expect(columns.length).toBeGreaterThan(3);

      // Log the extracted schema for debugging and visibility in CI
      console.log(`[${pt}] Filters:`, filters);
      console.log(`[${pt}] Columns:`, columns);

      // We could add more explicit mappings here for strict validation, e.g.:
      if (pt === 'gpu') {
        expect(columns).toContain('GPU Vendor');
        expect(columns).not.toContain('CPU Vendor');
        expect(filters.some(f => f.includes('GPU Vendor'))).toBeTruthy();
      }

      if (pt === 'database') {
        expect(columns).toContain('Database Family');
        expect(columns).not.toContain('Tier'); // Tier was the confusing one
      }
    });
  }
});
