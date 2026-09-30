import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.waitForLoadState('networkidle');
    expect(errors).toHaveLength(0);
  });

  test('displays all 5 sections', async ({ page }) => {
    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('#about')).toBeVisible();
    await expect(page.locator('#projects')).toBeVisible();
    await expect(page.locator('#technologies')).toBeVisible();
    await expect(page.locator('#contact')).toBeVisible();
  });

  test('navigation works', async ({ page }) => {
    await page.click('a[href="#about"]');
    await expect(page.locator('#about')).toBeInViewport();
  });

  test('responsive design at mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('header')).toBeVisible();
  });

  test('responsive design at tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('header')).toBeVisible();
  });

  test('responsive design at desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.locator('header')).toBeVisible();
  });
});