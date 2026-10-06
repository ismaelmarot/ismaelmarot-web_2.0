import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * Amendments 5 and 6 of specs/003-landing-home-page.
 *
 * The component tests for this section assert CSS strings, which is enough to prove that `60dvh`
 * appears in a stylesheet and not enough to prove that the band is 60% of the screen. The short
 * viewport fallback shipped for weeks while every component test was green, and it was the reason a
 * 375x667 iPhone SE rendered the band at 38% of its viewport. So these tests measure.
 *
 * `page.evaluate` rather than `boundingBox`, for the same reason as the carousel tests: it reads the
 * geometry the CSS engine resolved, which is the number the band's percentage depends on.
 */
const MOVIL = [
  { width: 320, height: 640 },
  { width: 360, height: 640 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 414, height: 896 },
  { width: 430, height: 932 },
  { width: 767, height: 1024 },
];

const ESCRITORIO = [
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
];

const medir = (page: Page) =>
  page.evaluate(() => {
    const hero = document.querySelector('#hero')!;
    const banda = hero.querySelector('[data-testid="hero-band"]')!;
    const nombre = banda.querySelector('h1') ?? banda.firstElementChild!;
    const hr = hero.getBoundingClientRect();
    const br = banda.getBoundingClientRect();
    return {
      vh: window.innerHeight,
      banda: Math.round(br.height),
      porcentaje: Math.round((br.height / window.innerHeight) * 100),
      seccion: Math.round(hr.height),
      desborde: Math.round(hr.height - window.innerHeight),
      clearance: Math.round(nombre.getBoundingClientRect().top - 52),
      cola: Math.round(br.bottom - window.innerHeight),
    };
  });

test.describe('La banda del Hero y el bloque de texto, medidos en el navegador', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  for (const vp of MOVIL) {
    test(`la banda mide 60% en ${vp.width}x${vp.height}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.waitForTimeout(250);

      const m = await medir(page);

      expect(m.banda, `banda ${m.banda} de ${m.vh}`).toBe(Math.round(vp.height * 0.6));
      // One pixel, because sub-pixel layout is real and is not a defect.
      expect(Math.abs(m.seccion - vp.height)).toBeLessThanOrEqual(1);
      expect(m.desborde).toBeLessThanOrEqual(1);
      expect(m.cola).toBeLessThanOrEqual(1);
    });
  }

  for (const vp of ESCRITORIO) {
    test(`la banda sigue al 55% en ${vp.width}x${vp.height}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.waitForTimeout(250);

      const m = await medir(page);

      expect(m.banda, `banda ${m.banda} de ${m.vh}`).toBe(Math.round(vp.height * 0.55));
      expect(Math.abs(m.seccion - vp.height)).toBeLessThanOrEqual(1);
    });
  }

  // Amendment 6, FR-043. Los dos CTA miden 182px y 143px con 16px de hueco, 341px juntos, contra
  // 288px disponibles a 320px. Envuelven, y una fila envuelta cuesta 52px enteros: los 58px por los
  // que la banda no llegaba al 60% ahi. Este test mide la altura real de la fila de CTA en vez de
  // fiarse de que la regla existe.
  for (const vp of [
    { width: 320, height: 640 },
    { width: 360, height: 640 },
  ]) {
    test(`los CTA comparten una fila a ${vp.width}x${vp.height}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.waitForTimeout(250);

      const cta = await page.evaluate(() => {
        const botones = [...document.querySelectorAll('[data-testid="hero-body"] a')];
        const filas = new Set(botones.map((b) => Math.round(b.getBoundingClientRect().top)));
        return {
          filas: filas.size,
          alturas: botones.map((b) => Math.round(b.getBoundingClientRect().height)),
          suma: botones.reduce((a, b) => a + b.getBoundingClientRect().width, 0),
          desbordeHorizontal: document.documentElement.scrollWidth > window.innerWidth,
        };
      });

      expect(cta.filas, `los CTA ocupan ${cta.filas} fila(s)`).toBe(1);
      // FR-004: 44px es el minimo, y 52px es lo que tienen por encima. Encojer la fuente no puede
      // costar alto, que es el punto de la amendment.
      for (const alto of cta.alturas) expect(alto).toBeGreaterThanOrEqual(44);
      expect(cta.desbordeHorizontal).toBe(false);
    });
  }

  // Amendment 7, FR-045 and SC-039. The band-to-tagline gap was not the band's margin, which has
  // always been 24px; it was `margin-block: auto` splitting a leftover that grows with the screen.
  // One declaration produced 29px at 320x640 and 124px at 767x1024, so the measurement is the only
  // thing that can hold this to 24px everywhere.
  for (const vp of MOVIL) {
    test(`el texto queda a 24px de la banda en ${vp.width}x${vp.height}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.waitForTimeout(250);

      const hueco = await page.evaluate(() => {
        const banda = document.querySelector('[data-testid="hero-band"]')!;
        const tagline = document.querySelector('[data-testid="hero-body"] p')!;
        return Math.round(tagline.getBoundingClientRect().top - banda.getBoundingClientRect().bottom);
      });

      // The band's own margin-bottom, which is what the gap always looked like it was.
      expect(hueco, `hueco ${hueco}px a ${vp.width}x${vp.height}`).toBe(24);
    });
  }

  for (const vp of ESCRITORIO) {
    test(`el bloque sigue centrado en escritorio a ${vp.width}x${vp.height}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.waitForTimeout(250);

      const { arriba, abajo } = await page.evaluate(() => {
        const banda = document.querySelector('[data-testid="hero-band"]')!;
        const botones = document.querySelector('[data-testid="hero-body"] a')!;
        const hero = document.querySelector('#hero')!;
        return {
          arriba: Math.round(botones.getBoundingClientRect().top - banda.getBoundingClientRect().bottom),
          abajo: Math.round(hero.getBoundingClientRect().bottom - botones.getBoundingClientRect().bottom),
        };
      });

      // FR-046 and SC-022: desktop keeps the centred block, so the two gaps stay close.
      expect(Math.abs(arriba - abajo)).toBeLessThanOrEqual(45);
    });
  }

  test('el nombre queda por debajo de la barra en todos los tamanos', async ({ page }) => {
    for (const vp of [...MOVIL, ...ESCRITORIO]) {
      await page.setViewportSize(vp);
      await page.waitForTimeout(250);

      const m = await medir(page);

      // 52px is --header-height. The band's top padding reserves the header plus a spacing step,
      // so a name above that line would be drawn under the fixed header.
      expect(m.clearance, `clearance ${m.clearance} a ${vp.width}x${vp.height}`).toBeGreaterThan(0);
    }
  });

  test('no hay overflow horizontal en movil', async ({ page }) => {
    for (const vp of [...MOVIL, ...ESCRITORIO]) {
      await page.setViewportSize(vp);
      await page.waitForTimeout(250);

      const desborda = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

      expect(desborda, `overflow horizontal a ${vp.width}x${vp.height}`).toBe(false);
    }
  });
});