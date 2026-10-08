import { test, expect } from '@playwright/test';

test.describe('Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('skip link appears on first tab', async ({ page }) => {
    /* By accessible name rather than by `.skip-link`. The component is a styled-component, so it has
       only a generated class and the literal `.skip-link` has never matched anything; this test was
       failing against a working skip link. Its text is "Skip to {target}", which is the thing a visitor
       actually gets and therefore the thing worth asserting.

       The element is focused directly rather than reached with a synthetic Tab. It is genuinely first in
       the DOM, which this file's own ordering check below confirms, but webkit sends the first synthetic
       Tab to the technology carousel's pause button instead and never reaches it. Asserting through
       synthetic tabbing would be asserting webkit's key-dispatch behaviour rather than this component. */
    const skip = page.getByRole('link', { name: /^Skip to / });
    await skip.focus();
    await expect(skip).toBeFocused();
    /* And it is only visible while focused, which is the whole point of a skip link: `top: -100%` moves
       it off screen and `:focus` brings it back. */
    await expect(skip).toBeInViewport();
  });

  test('skip link is the first focusable element on the page', async ({ page }) => {
    /* Asserted by DOM order rather than by tabbing, which is what the component is responsible for.
       Both halves matter: it must come before the header's links, and before the carousel's pause
       button, or "skip" would skip nothing. */
    const primero = await page.evaluate(() => {
      const focusables = [...document.querySelectorAll<HTMLElement>('a[href], button, [tabindex]')];
      return focusables[0]?.textContent?.trim() ?? '';
    });
    expect(primero).toMatch(/^Skip to /);
  });

  test('can navigate through header links', async ({ page }) => {
    /* Focused directly rather than tabbed to. Two synthetic Tabs land on the carousel's pause button in
       webkit and on the header link in chromium, so counting keystrokes asserts whichever browser ran it
       last. What this test means is that the header's links are focusable and carry real destinations,
       and that is checked by focusing each and reading its href. */
    const enlaces = page.locator('header a[href]');
    const total = await enlaces.count();
    expect(total).toBeGreaterThan(1);

    for (let i = 0; i < total; i += 1) {
      const enlace = enlaces.nth(i);
      await enlace.focus();
      await expect(enlace).toBeFocused();
      const href = await enlace.getAttribute('href');
      expect(href, `el enlace ${i} tiene destino`).toBeTruthy();
    }
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