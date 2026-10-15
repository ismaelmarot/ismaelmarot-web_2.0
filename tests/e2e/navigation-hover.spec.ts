import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * specs/022-navigation-hover.
 *
 * The component tests can only read the declaration, because a hover is a pointer state and jsdom has
 * no pointer and no computed cascade. These measure the two things that matter: which colour actually
 * lands under the pointer, and that nothing underlines it.
 *
 * The two are different because of what is behind the header. Over the landing page's black band the
 * dark theme is in force and --color-accent is overridden; over a white section it is not. Reading one
 * state and assuming the other would repeat the bug this feature exists to fix.
 */

const LINK = 'header nav a[href="/about"]';

async function headerState(page: Page) {
  return page.evaluate((selector) => {
    const header = document.querySelector('header');
    const link = document.querySelector(selector);
    if (!header || !link) throw new Error('header or link missing');
    const style = window.getComputedStyle(link);
    return {
      overDark: header.className.includes('overDark') || getComputedStyle(header).backgroundColor === 'rgb(0, 0, 0)',
      background: getComputedStyle(header).backgroundColor,
      color: style.color,
      decoration: style.textDecorationLine,
      underlineThickness: style.textDecorationThickness,
    };
  }, LINK);
}

/**
 * Hovering the pointer is what the feature describes, so the pointer does the hovering. `:hover` via
 * `evaluate` would prove the rule resolves, not that a visitor reaches it.
 */
async function hoverAndMeasure(page: Page, scrollY: number) {
  await page.evaluate((y) => window.scrollTo(0, y), scrollY);
  await page.waitForTimeout(350);
  const link = page.locator(LINK).first();
  await link.hover();
  await page.waitForTimeout(120);
  return headerState(page);
}

test.describe('navigation hover', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('turns blue and stays un-underlined over the black band', async ({ page }) => {
    // At the top of the landing page the header sits over the 355px black band, which is the state the
    // report was about.
    const state = await hoverAndMeasure(page, 0);
    expect(state.background).toBe('rgb(0, 0, 0)');
    // #0a84ff, which is 5.76:1 on #000. The stock #0071E3 would be 4.47:1 and is not.
    expect(state.color).toBe('rgb(10, 132, 255)');
    expect(state.decoration).toBe('none');
  });

  test('turns blue and stays un-underlined over a white section', async ({ page }) => {
    // Scrolled past the band the header is light, so this is the state it already behaved correctly in.
    const state = await hoverAndMeasure(page, 4000);
    expect(state.background).not.toBe('rgb(0, 0, 0)');
    // #0071E3, 4.70:1 on #fff — the accent the light theme already had, untouched.
    expect(state.color).toBe('rgb(0, 113, 227)');
    expect(state.decoration).toBe('none');
  });

  test('returns to the resting colour when the pointer leaves', async ({ page }) => {
    await page.locator(LINK).first().hover();
    await page.mouse.move(5, 300);
    await page.waitForTimeout(120);
    const state = await headerState(page);
    // Resting is #ffffff over the black band, because the dark theme overrides --color-text-secondary.
    expect(state.color).toBe('rgb(255, 255, 255)');
    expect(state.decoration).toBe('none');
  });

  test('reaches AA against the header it lands on, in both states', async ({ page }) => {
    // The numbers the specification quotes, recomputed here rather than copied, so a change to either
    // token has to be acknowledged in the same place the colour is.
    const relative = (fg: number[], bg: number[]) => {
      const lum = (c: number[]) => {
        const [r, g, b] = c.map((v) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const a = lum(fg);
      const b = lum(bg);
      const [hi, lo] = a > b ? [a, b] : [b, a];
      return (hi + 0.05) / (lo + 0.05);
    };

    const dark = await hoverAndMeasure(page, 0);
    expect(dark.color).toBe('rgb(10, 132, 255)');
    expect(relative([10, 132, 255], [0, 0, 0])).toBeGreaterThanOrEqual(4.5);

    const light = await hoverAndMeasure(page, 4000);
    expect(light.color).toBe('rgb(0, 113, 227)');
    expect(relative([0, 113, 227], [255, 255, 255])).toBeGreaterThanOrEqual(4.5);
  });

  test('keeps a focus indicator, since the underline is no longer one', async ({ page }) => {
    // FR-003 removed an affordance. What replaces it for a keyboard visitor is not the colour, so the
    // focus ring has to still be there. Tabbed to rather than focused directly, because the claim is
    // about the keyboard path and the number of stops before the navigation is not fixed.
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());

    let focused = false;
    for (let i = 0; i < 12 && !focused; i++) {
      await page.keyboard.press('Tab');
      focused = await page.evaluate(
        (selector) => document.activeElement?.matches(selector) ?? false,
        LINK
      );
    }
    expect(focused, 'the navigation link is reachable by Tab').toBe(true);

    const ring = await page.evaluate((selector) => {
      const el = document.querySelector(selector) as HTMLElement;
      const s = window.getComputedStyle(el);
      return {
        width: s.outlineWidth,
        style: s.outlineStyle,
        color: s.outlineColor,
        resting: window.getComputedStyle(document.body).backgroundColor,
      };
    }, LINK);

    expect(ring.width).not.toBe('0px');
    expect(ring.style).not.toBe('none');
    // The ring reads --color-accent too, so over the black band it is the lighter blue and not the one
    // that would miss AA there. Asserted rather than assumed: the dark theme override reaches it for
    // free only while both rules read the same token.
    expect(ring.color).toBe('rgb(10, 132, 255)');
  });
});