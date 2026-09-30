import { test, expect } from '@playwright/test';

test.describe('Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('skip link appears on first tab', async ({ page }) => {
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link:focus')).toBeVisible();
  });

  test('can navigate through header links', async ({ page }) => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    // Focus should move through navigation
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON']).toContain(focused);
  });

  test('mobile menu keyboard accessible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.keyboard.press('Tab');
    // Find and activate mobile menu button
    const menuButton = page.locator('button[aria-label="Close menu"], button[aria-label*="menu" i]').first();
    if (await menuButton.isVisible()) {
      await menuButton.focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('[role="dialog"]')).toBeVisible();
    }
  });
});