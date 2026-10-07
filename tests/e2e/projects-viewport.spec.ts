import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

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

/* Amendment 3. Short desktop viewports are here because the previous criteria only ever used a
   900px-tall viewport, which is how a real overflow went unnoticed: measured on production, the
   section was 795 of 720 at 1280x720, 782 of 700 at 1024x700 and 782 of 768 at 1024x768. Every
   measurement in this file before now would have passed while all three were broken. */
const ALTOS = [
  { width: 1024, height: 700 },
  { width: 1024, height: 768 },
  { width: 1280, height: 720 },
  { width: 1440, height: 760 },
];

test.describe('Projects section is one screen', () => {
  /* Set the viewport and then navigate, rather than navigating and resizing. Rendering at the
     default 1280x720 and then resizing measures before the viewport-dependent layout has settled,
     which is the same bug that made the Hero tests fail intermittently. Every test below calls
     `irA(page, vp)`. */
  const irA = async (page: Page, vp: { width: number; height: number }) => {
    await page.setViewportSize(vp);
    await page.goto('/projects');
    await page.waitForSelector('#projects article');
  };

  for (const vp of VIEWPORTS) {
    test(`the section measures exactly the viewport at ${vp.width}x${vp.height}`, async ({ page }) => {
      await irA(page, vp);

      const height = await page.evaluate(
        () => document.querySelector('#projects')!.getBoundingClientRect().height
      );

      // One pixel of tolerance, because sub-pixel layout is real and is not a defect.
      expect(Math.abs(height - vp.height)).toBeLessThanOrEqual(1);
    });

    test(`no card runs past the bottom at ${vp.width}x${vp.height}`, async ({ page }) => {
      await irA(page, vp);

      const desbordes = await page.evaluate(() => {
        const limite = document.querySelector('#projects')!.getBoundingClientRect().bottom;
        return [...document.querySelectorAll('#projects article')]
          .map((a) => Math.round(a.getBoundingClientRect().bottom - limite))
          .filter((delta) => delta > 1);
      });

      expect(desbordes).toEqual([]);
    });

    test(`no horizontal overflow at ${vp.width}x${vp.height}`, async ({ page }) => {
      await irA(page, vp);

      const desborda = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth
      );

      // This is the one that rejected forcing the carousel controls onto a single row: they are
      // 360px of intrinsic width against 288px available at 320px, so they wrap on purpose.
      expect(desborda).toBe(false);
    });
  }

  for (const vp of ALTOS) {
    test(`the section fits a short desktop viewport at ${vp.width}x${vp.height}`, async ({ page }) => {
      await irA(page, vp);

      const m = await page.evaluate(() => {
        const section = document.querySelector('#projects')!;
        const article = section.querySelector('article')!;
        return {
          alto: Math.round(section.getBoundingClientRect().height),
          vh: window.innerHeight,
          cola: Math.round(article.getBoundingClientRect().bottom - section.getBoundingClientRect().bottom),
        };
      });

      expect(Math.abs(m.alto - m.vh), `seccion ${m.alto} de ${m.vh}`).toBeLessThanOrEqual(1);
      expect(m.cola).toBeLessThanOrEqual(1);
    });
  }

  test('the card is smaller on desktop than it was', async ({ page }) => {
    await irA(page, { width: 1440, height: 900 });

    const card = await page.evaluate(() => {
      const article = document.querySelector('#projects article')!;
      const r = article.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height) };
    });

    // 800x476 before Amendment 3. 620 wide, and no taller than 380, which is where the 96px icon
    // row, the description clamp, the badges and the 52px action all still fit.
    expect(card.w).toBe(620);
    expect(card.h).toBeLessThanOrEqual(380);
  });

  test('the card is white on a light section, separated by shadow and not by a border', async ({ page }) => {
    await irA(page, { width: 1440, height: 900 });

    const card = await page.evaluate(() => {
      const article = document.querySelector('#projects article')!;
      const s = getComputedStyle(article);
      const section = getComputedStyle(document.querySelector('#projects')!);
      return {
        fondo: s.backgroundColor,
        // Width and style only: a border that is absent has no colour worth asserting, and
        // asking for one invented a value the browser never had to produce.
        borde: s.borderTopWidth + ' ' + s.borderTopStyle,
        sombra: s.boxShadow,
        fondoSeccion: section.backgroundColor,
        nombre: getComputedStyle(article.querySelector('h3')!).color,
        marco: getComputedStyle(article.querySelector('[data-testid="project-icon-frame"]')!)
          .backgroundColor,
        // Scoped to the category list by its accessible name. A plain `ul span` matches the
        // carousel's own list first, whose children are the icon frames, and reads the frame's
        // colour instead of the chip's.
        chip: getComputedStyle(
          article.querySelector('[aria-label^="Categorias"] span, [aria-label^="Categorías"] span')!
        ).backgroundColor,
        chipTexto: getComputedStyle(
          article.querySelector('[aria-label^="Categorias"] span, [aria-label^="Categorías"] span')!
        ).color,
      };
    });

    expect(card.fondo).toBe('rgb(255, 255, 255)');
    // A #D2D2D7 border would measure 1.51:1 against white and WCAG holds a non-text boundary to
    // 3:1, so the separator is the shadow and the border is not there.
    expect(card.borde).toBe('0px none');
    expect(card.sombra).not.toBe('none');
    // Dark text on the light card, and a frame that is a step darker than the card rather than a
    // translucent white, which would compose to the card's own colour and leave no frame at all.
    expect(card.nombre).toBe('rgb(29, 29, 31)');
    expect(card.marco).toBe('rgb(232, 232, 237)');
    // #F2F2F7 with #48484A text, 8.18:1. The Badge's own subtle variant is #F5F5F7, which is
    // 1.02:1 against this card and made the chips invisible.
    expect(card.chip).toBe('rgb(242, 242, 247)');
    expect(card.chipTexto).toBe('rgb(72, 72, 74)');
  });

  test('the description is never cut through the middle of a line', async ({ page }) => {
    for (const vp of VIEWPORTS) {
      await irA(page, vp);

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

  test('the icon frame is 96px on desktop and 80px on a phone', async ({ page }) => {
    const lado = async (vp: { width: number; height: number }) => {
      await irA(page, vp);
      return page.evaluate(() => {
        const marco = document.querySelector('#projects [data-testid="project-icon-frame"]')!;
        return Math.round(marco.getBoundingClientRect().width);
      });
    };

    // 120px before Amendment 3, which took it to 96px to match the smaller card.
    expect(await lado({ width: 1440, height: 900 })).toBe(96);
    expect(await lado({ width: 320, height: 640 })).toBe(80);
  });

  test('the filter is one scrollable row on a phone and one row of buttons on desktop', async ({ page }) => {
    const filtro = async (vp: { width: number; height: number }) => {
      await irA(page, vp);
      return page.evaluate(() => {
        const f = document.querySelector('#projects [role="group"][aria-label*="Filtrar"]')!;
        const botones = [...f.querySelectorAll('button')];
        return {
          filas: new Set(botones.map((b) => Math.round(b.getBoundingClientRect().top))).size,
          desliza: f.scrollWidth > f.clientWidth + 1,
        };
      });
    };

    expect(await filtro({ width: 1440, height: 900 })).toEqual({ filas: 1, desliza: false });

    expect(await filtro({ width: 320, height: 640 })).toEqual({ filas: 1, desliza: true });

  });
});