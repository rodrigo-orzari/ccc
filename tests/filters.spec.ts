import { test, expect } from '@playwright/test';

test.describe('Dashboard Filter Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard
    await page.goto('/');
    // Wait for initial data load (loading indicator goes away)
    await page.waitForFunction(() => !document.querySelector('.animate-spin'));
  });

  test('VMs: Default counts display properly', async ({ page }) => {
    // Assert AWS tile is visible and has a count
    const awsTile = page.locator('div', { hasText: 'AWS' }).locator('xpath=ancestor::div[contains(@class, "group")]').first();
    await expect(awsTile).toBeVisible();

    // Verify it doesn't say 0 OF 0 initially
    const countText = await awsTile.innerText();
    expect(countText).not.toContain('0 OF 0');
  });

  test('Serverless: Clearing all languages forces 0 results', async ({ page }) => {
    // Click Serverless tab
    await page.getByRole('button', { name: /Serverless/ }).click();
    await page.waitForFunction(() => !document.querySelector('.animate-spin'));

    const awsTile = page.locator('div:has-text("AWS")').filter({ has: page.locator('span:has-text("OF")') }).first();
    const initialText = await awsTile.innerText();
    expect(initialText).not.toContain('0 OF'); // Initially it should have full counts

    // Expand language support section if needed
    const langHeader = page.locator('button', { hasText: 'Language Support' });
    if (await langHeader.isVisible()) {
      await langHeader.click();
    }

    // Click 'Clear All' next to Language Support
    const clearAllBtn = page.locator('h2', { hasText: 'Language Support' })
      .locator('xpath=following-sibling::button')
      .filter({ hasText: 'Clear All' });
      
    if (await clearAllBtn.isVisible()) {
      await clearAllBtn.click();
      await page.waitForTimeout(500); // give React state time to update

      // The count should now be 0 OF [Total]
      const clearedText = await awsTile.innerText();
      expect(clearedText).toContain('0 OF');

      // The table should be empty
      const emptyState = page.getByText('No matches for your filters.');
      await expect(emptyState).toBeVisible();
    }
  });

  test('Database: Provider selection updates total items', async ({ page }) => {
    // Click Databases tab
    await page.getByRole('button', { name: /Databases/ }).click();
    await page.waitForFunction(() => !document.querySelector('.animate-spin'));

    // Check table has rows
    const rows = page.locator('table tbody tr');
    const initialRowCount = await rows.count();
    expect(initialRowCount).toBeGreaterThan(0);

    // Click AWS provider to toggle it off
    const awsTile = page.locator('div:has-text("AWS")').filter({ has: page.locator('span:has-text("OF")') }).first();
    await awsTile.click();
    await page.waitForTimeout(500);

    // Row count should be different if AWS was removed
    const newRowCount = await rows.count();
    expect(newRowCount).not.toEqual(initialRowCount);
  });
});
