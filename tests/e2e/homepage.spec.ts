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
    /* The four banded sections are `SectionSummary` elements whose ids carry a `-summary` suffix, and
       the Hero keeps a bare `hero`. These tests asked for `#about`, `#projects`, `#technologies` and
       `#contact`, none of which has ever existed on this page, so they failed against a correct build
       and passed against nothing. Corrected here rather than deleted, because the assertion underneath
       is right: five bands render and are visible. */
    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('#projects-summary')).toBeVisible();
    await expect(page.locator('#technologies-summary')).toBeVisible();
    await expect(page.locator('#about-summary')).toBeVisible();
    await expect(page.locator('#contact-summary')).toBeVisible();
  });

  test('navigation works', async ({ page }) => {
    /* The header carries links to the routes, not to anchors: About is `/about`, not `#about`. */
    await page.click('a[href="/about"]');
    await expect(page).toHaveURL(/\/about$/);
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