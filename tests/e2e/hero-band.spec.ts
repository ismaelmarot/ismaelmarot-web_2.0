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
  /* Deliberately no `goto` in a beforeEach. Setting the viewport and then navigating means the
     page is first laid out at the exact size being measured, so dvh resolves once. Doing it the
     other way round, which is what this file did before, renders at the default 1280x720 and then
     resizes, and the occasional run measured the band before the viewport-dependent styles had
     settled: intermittent failures at 320x640, 360x640 and 375x667, which are the sizes whose
     60% and 55% are closest together and therefore the least forgiving of a stale layout.
     Each test calls `irA(page, vp)` instead. */
  const irA = async (page: Page, vp: { width: number; height: number }) => {
    await page.setViewportSize(vp);
    await page.goto('/');
    // Waits for the Hero to exist rather than for a fixed delay, so the measurement never races
    // the first paint. The band is the first thing on the page, so it is the right signal.
    await page.waitForSelector('[data-testid="hero-band"]');
  };

  for (const vp of MOVIL) {
    test(`la banda mide 60% en ${vp.width}x${vp.height}`, async ({ page }) => {
      await irA(page, vp);

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
      await irA(page, vp);

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
      await irA(page, vp);

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
    test(`el texto queda pegado a la banda en ${vp.width}x${vp.height}`, async ({ page }) => {
      await irA(page, vp);

      const { hueco, esperado } = await page.evaluate(() => {
        const banda = document.querySelector('[data-testid="hero-band"]')!;
        const tagline = document.querySelector('[data-testid="hero-body"] p')!;
        const margen = parseFloat(getComputedStyle(banda).marginBottom);
        return {
          hueco: Math.round(tagline.getBoundingClientRect().top - banda.getBoundingClientRect().bottom),
          // Read the band's own margin rather than hardcoding 24: it is
          // clamp(space-6, 3.5vw, space-10), which is 24px up to 686px of width and then fluid,
          // so at 767x1024 it is 26.85px. Asserting a literal 24 was asserting the wrong number
          // and had to be corrected after production measured 27.
          esperado: Math.round(margen),
        };
      });

      expect(hueco, `hueco ${hueco}px a ${vp.width}x${vp.height}`).toBe(esperado);
    });
  }

  // FR-046 and SC-022: desktop keeps the centred block. This asserts the auto margin is still in
  // force there, by checking that the space above the block grows with the leftover rather than
  // staying pinned to the band's margin. An earlier version compared two gaps directly and allowed
  // a 45px difference, which was a number invented to pass; the real relationship is that the gap
  // is a share of the leftover.
  for (const vp of ESCRITORIO) {
    test(`el bloque sigue centrado en escritorio a ${vp.width}x${vp.height}`, async ({ page }) => {
      await irA(page, vp);

      const { hueco, sobrante, centrado, margenBanda } = await page.evaluate(() => {
        const hero = document.querySelector('#hero')!;
        const body = document.querySelector('[data-testid="hero-body"]')!;
        const banda = document.querySelector('[data-testid="hero-band"]')!;
        const tagline = document.querySelector('[data-testid="hero-body"] p')!;
        const hr = hero.getBoundingClientRect();
        const tr = tagline.getBoundingClientRect();
        return {
          hueco: Math.round(tr.top - banda.getBoundingClientRect().bottom),
          // What is left in the section's content box after the band, its margin and the block.
          // The auto margins split this evenly, so the gap is the band's margin plus half of it.
          // Verified at three sizes: 768x1024 leaves 229 and shows 26.88 + 114.5 = 141;
          // 1024x768 leaves 71 and shows 35.8 + 35.6 = 71; 1440x900 leaves 102 and shows
          // 40 + 51 = 91. The section's own block padding is excluded because the auto margin
          // only ever distributed the content box, which is what made my first formula wrong.
          sobrante: Math.round(
            hr.height -
              parseFloat(getComputedStyle(hero).paddingTop) -
              parseFloat(getComputedStyle(hero).paddingBottom) -
              banda.getBoundingClientRect().height -
              parseFloat(getComputedStyle(banda).marginBottom) -
              body.getBoundingClientRect().height
          ),
          // Computed margins come back as strings, so this has to be parsed: Math.abs on a string
          // is NaN and NaN > 1 is false, which made the check report the margin as inactive.
          centrado: Math.abs(parseFloat(getComputedStyle(body).marginTop)) > 1,
          margenBanda: parseFloat(getComputedStyle(banda).marginBottom),
        };
      });

      // Centred means a real share of the leftover, not a fixed gap: at 768x1024 it is 141px and
      // at 1440x900 it is 91px, and both are half of what is left rather than the band's margin.
      const esperado = Math.round(parseFloat(String(margenBanda)) + sobrante / 2);

      expect(centrado, 'el margen auto sigue activo en escritorio').toBe(true);
      expect(hueco, `hueco ${hueco}px a ${vp.width}x${vp.height}`).toBe(esperado);
      // And it is genuinely a share of the leftover rather than a fixed number: at 768x1024 the
      // gap is 141px and at 1024x768 it is 71px, and neither is the band's margin.
      expect(hueco).toBeGreaterThan(30);
    });
  }

  test('el nombre queda por debajo de la barra en todos los tamanos', async ({ page }) => {
    for (const vp of [...MOVIL, ...ESCRITORIO]) {
      await irA(page, vp);

      const m = await medir(page);

      // 52px is --header-height. The band's top padding reserves the header plus a spacing step,
      // so a name above that line would be drawn under the fixed header.
      expect(m.clearance, `clearance ${m.clearance} a ${vp.width}x${vp.height}`).toBeGreaterThan(0);
    }
  });

  test('no hay overflow horizontal en movil', async ({ page }) => {
    for (const vp of [...MOVIL, ...ESCRITORIO]) {
      await irA(page, vp);

      const desborda = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

      expect(desborda, `overflow horizontal a ${vp.width}x${vp.height}`).toBe(false);
    }
  });
});