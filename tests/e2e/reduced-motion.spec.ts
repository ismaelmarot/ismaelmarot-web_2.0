import { test, expect } from '@playwright/test';

test.describe('Reduced Motion', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
  });

  test('animations disabled with reduced motion', async ({ page }) => {
    const animations = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      return {
        durationFast: styles.getPropertyValue('--duration-fast').trim(),
        durationNormal: styles.getPropertyValue('--duration-normal').trim(),
      };
    });
    expect(animations.durationFast).toBe('0ms');
    expect(animations.durationNormal).toBe('0ms');
  });
});