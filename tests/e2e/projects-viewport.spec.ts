import { test, expect } from '@playwright/test';

/**
 * Amendment 1 of specs/008-projects-carousel.
 *
 * Every other Projects test asserts a CSS string, which is exactly how 271px of vertical overflow
 * reached production on a 320x640 phone: `expect(css).toContain('min-height')` is perfectly happy
 * about a section that measures 911px. The defect was arithmetic, and only measurement catches
 * arithmetic, so these tests measure in a real browser at the sizes that were broken.
 *
 * `boundingBox` is not used because it rounds through the layout viewport and reports the position
 * on the page rather than the used height. `evaluate` reads the same geometry the CSS engine
 * resolved, which is the number the section's own height depends on.
 */
const VIEWPORTS = [
  { width: 320, height: 640 },
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 414, height: 896 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

test.describe('Projects section is one screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
  });

  for (const vp of VIEWPORTS) {
    test(`the section measures exactly the viewport at ${vp.width}x${vp.height}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.waitForTimeout(250);

      const height = await page.evaluate(
        () => document.querySelector('#projects')!.getBoundingClientRect().height
      );

      // One pixel of tolerance, because sub-pixel layout is real and is not a defect.
      expect(Math.abs(height - vp.height)).toBeLessThanOrEqual(1);
    });

    test(`no card runs past the bottom at ${vp.width}x${vp.height}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.waitForTimeout(250);

      const desbordes = await page.evaluate(() => {
        const limite = document.querySelector('#projects')!.getBoundingClientRect().bottom;
        return [...document.querySelectorAll('#projects article')]
          .map((a) => Math.round(a.getBoundingClientRect().bottom - limite))
          .filter((delta) => delta > 1);
      });

      expect(desbordes).toEqual([]);
    });

    test(`no horizontal overflow at ${vp.width}x${vp.height}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.waitForTimeout(250);

      const desborda = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth
      );

      // This is the one that rejected forcing the carousel controls onto a single row: they are
      // 360px of intrinsic width against 288px available at 320px, so they wrap on purpose.
      expect(desborda).toBe(false);
    });
  }

  test('the description is never cut through the middle of a line', async ({ page }) => {
    for (const vp of VIEWPORTS) {
      await page.setViewportSize(vp);
      await page.waitForTimeout(250);

      const descripciones = await page.evaluate(() =>
        [...document.querySelectorAll('#projects article')].map((a) => {
          const p = a.querySelector('p')!;
          return {
            alto: p.getBoundingClientRect().height,
            interlineado: parseFloat(getComputedStyle(p).lineHeight),
          };
        })
      );

      for (const d of descripciones) {
        const lineas = d.alto / d.interlineado;
        // A fractional result means the container clipped the text rather than the clamp, which
        // reads as a fault rather than as truncation.
        expect(
          Math.abs(lineas - Math.round(lineas)),
          `descripcion cortada a ${vp.width}x${vp.height}: ${lineas} lineas`
        ).toBeLessThanOrEqual(0.06);
      }
    }
  });

  test('the icon frame is 120px on desktop and 80px on a phone', async ({ page }) => {
    const lado = async () => {
      await page.waitForTimeout(250);
      return page.evaluate(() => {
        const marco = document.querySelector('#projects [data-testid="project-icon-frame"]')!;
        const r = marco.getBoundingClientRect();
        return Math.round(r.width);
      });
    };

    await page.setViewportSize({ width: 1440, height: 900 });
    expect(await lado()).toBe(120);

    await page.setViewportSize({ width: 320, height: 640 });
    expect(await lado()).toBe(80);
  });

  test('the filter is one scrollable row on a phone and one row of buttons on desktop', async ({ page }) => {
    const filtro = async () => {
      await page.waitForTimeout(250);
      return page.evaluate(() => {
        const f = document.querySelector('#projects [role="group"][aria-label*="Filtrar"]')!;
        const botones = [...f.querySelectorAll('button')];
        return {
          filas: new Set(botones.map((b) => Math.round(b.getBoundingClientRect().top))).size,
          desliza: f.scrollWidth > f.clientWidth + 1,
        };
      });
    };

    await page.setViewportSize({ width: 1440, height: 900 });
    expect(await filtro()).toEqual({ filas: 1, desliza: false });

    await page.setViewportSize({ width: 320, height: 640 });
    // Seven options of roughly 549px cannot fit 288px, so the row scrolls rather than wrapping
    // into three rows, which cost 148px at this size.
    expect(await filtro()).toEqual({ filas: 1, desliza: true });
  });
});