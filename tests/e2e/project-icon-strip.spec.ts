import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * specs/011-project-icon-strip.
 *
 * The entrance is the feature, so these assert it in a real browser rather than through computed
 * style. The component tests already cover the declarations; what they cannot show is whether the
 * sequence actually ran, ran once, and stayed put under reduced motion.
 */
const irA = async (page: Page, vp: { width: number; height: number }) => {
  await page.setViewportSize(vp);
  await page.goto('/');
  await page.waitForSelector('#projects-summary [data-testid="project-icon-frame"]');
};

const marcos = '[data-testid="project-icon-frame"]';

test.describe('La franja de iconos de proyectos', () => {
  for (const vp of [
    { width: 1440, height: 900 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
    { width: 320, height: 640 },
  ]) {
    test(`seis marcos de 96px en ${vp.width}x${vp.height}`, async ({ page }) => {
      await irA(page, vp);

      const m = await page.evaluate((sel) => {
        const frames = [...document.querySelectorAll<HTMLElement>(sel)];
        const sec = document.querySelector('#projects-summary')!;
        return {
          n: frames.length,
          tamanos: frames.map((f) => {
            const r = f.getBoundingClientRect();
            return `${Math.round(r.width)}x${Math.round(r.height)}`;
          }),
          radios: frames.map((f) => getComputedStyle(f).borderRadius),
          fondos: [...new Set(frames.map((f) => getComputedStyle(f).backgroundColor))],
          ajuste: frames.map((f) => {
            const img = f.querySelector('img');
            return img ? getComputedStyle(img).objectFit : '-';
          }),
          // The section is exactly one screen and the page does not scroll sideways, which is what
          // the horizontal row on a phone could have broken.
          seccion: Math.round(sec.getBoundingClientRect().height),
          vh: window.innerHeight,
          overflowX: document.documentElement.scrollWidth > window.innerWidth,
        };
      }, marcos);

      expect(m.n, 'un marco por proyecto').toBe(6);
      expect([...new Set(m.tamanos)], 'todos los marcos del mismo tamaño').toHaveLength(1);
      expect(m.tamanos[0]).toBe('96x96');
      expect([...new Set(m.radios)], '22% de 96 es 21px').toEqual(['21px']);
      expect(m.fondos).toEqual(['rgb(232, 232, 237)']);
      // Cover, not contain or stretch: the sources are not square, one is 379x366.
      expect([...new Set(m.ajuste)]).toEqual(['cover']);
      expect(Math.abs(m.seccion - m.vh)).toBeLessThanOrEqual(1);
      expect(m.overflowX, 'la pagina no debe desbordar en horizontal').toBe(false);
    });
  }

  test('cada icono nombra su proyecto', async ({ page }) => {
    await irA(page, { width: 1440, height: 900 });
    const alts = await page.evaluate((sel) =>
      [...document.querySelectorAll(sel)].map((f) => f.querySelector('img')?.getAttribute('alt') ?? null)
    , marcos);
    expect(alts.every((a) => typeof a === 'string' && a.length > 0)).toBe(true);
    expect(alts).toContain('Icono de trash2treasure');
  });

  test('los iconos no se animan hasta que la sección entra en pantalla', async ({ page }) => {
    await irA(page, { width: 1440, height: 900 });
    await page.waitForTimeout(1200);

    // At 1440x900 the Projects section starts exactly at the fold, so it has not been seen.
    const antes = await page.evaluate((sel) => {
      const sec = document.querySelector('#projects-summary')!;
      const f = document.querySelector<HTMLElement>(sel)!;
      return {
        enPantalla: sec.getBoundingClientRect().top < window.innerHeight,
        animaciones: f.getAnimations().length,
        opacidad: getComputedStyle(f).opacity,
      };
    }, marcos);

    expect(antes.enPantalla, 'la sección no debería estar visible todavía').toBe(false);
    // Nothing has run, and the icons are visible rather than waiting for an animation.
    expect(antes.animaciones).toBe(0);
    expect(Number(antes.opacidad)).toBe(1);
  });

  test('al entrar en pantalla los seis se animan con 60ms de retraso entre ellos', async ({ page }) => {
    await irA(page, { width: 1440, height: 900 });
    await page.locator('#projects-summary').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    const m = await page.evaluate((sel) => {
      const frames = [...document.querySelectorAll<HTMLElement>(sel)];
      return {
        retardos: frames.map((f) => getComputedStyle(f).animationDelay),
        // The stagger is the point: six identical delays would arrive as one block.
        distintos: new Set(frames.map((f) => getComputedStyle(f).animationDelay)).size,
        opacidadFinal: getComputedStyle(frames[0]!).opacity,
        transformFinal: getComputedStyle(frames[0]!).transform,
      };
    }, marcos);

    expect(m.retardos).toEqual(['0s', '0.06s', '0.12s', '0.18s', '0.24s', '0.3s']);
    expect(m.distintos).toBe(6);
    expect(Number(m.opacidadFinal)).toBe(1);
    expect(m.transformFinal).toBe('matrix(1, 0, 0, 1, 0, 0)');
  });

  test('la entrada no se repite al volver a la sección', async ({ page }) => {
    await irA(page, { width: 1440, height: 900 });
    await page.locator('#projects-summary').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    // Marks the node so a re-created one is distinguishable from the same one.
    await page.evaluate((sel) => {
      document.querySelector(sel)?.setAttribute('data-marca', 'original');
    }, marcos);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    await page.locator('#projects-summary').scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const m = await page.evaluate((sel) => {
      const f = document.querySelector<HTMLElement>(sel)!;
      return {
        mismoNodo: f.getAttribute('data-marca') === 'original',
        // getAnimations reports what is running; animationName only reports the rule that is
        // attached, which stays present after the animation has finished and proves nothing.
        corriendo: f.getAnimations().filter((a) => a.playState === 'running').length,
      };
    }, marcos);

    expect(m.mismoNodo, 'el nodo no debería recrearse').toBe(true);
    expect(m.corriendo, 'ninguna animación corriendo en la segunda visita').toBe(0);
  });

  test('bajo reduced motion los iconos son visibles y no se mueven', async ({ browser }) => {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      locale: 'es-ES',
      reducedMotion: 'reduce',
    });
    const page = await ctx.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForSelector('#projects-summary [data-testid="project-icon-frame"]');
    await page.locator('#projects-summary').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);

    const m = await page.evaluate((sel) => {
      const frames = [...document.querySelectorAll<HTMLElement>(sel)];
      return {
        animacion: getComputedStyle(frames[0]!).animationName,
        transform: getComputedStyle(frames[0]!).transform,
        transicion: getComputedStyle(frames[0]!).transitionDuration,
        opacidad: getComputedStyle(frames[0]!).opacity,
        visibles: frames.every((f) => f.getBoundingClientRect().height > 0),
      };
    }, marcos);

    expect(m.animacion, 'sin animación de entrada').toBe('none');
    expect(m.transform, 'sin escala').toBe('none');
    expect(m.transicion, 'sin transición').toBe('0s');
    expect(Number(m.opacidad)).toBe(1);
    expect(m.visibles).toBe(true);
    await ctx.close();
  });

  test('en móvil la fila se desliza y el borde cortado se desvanece', async ({ page }) => {
    await irA(page, { width: 390, height: 844 });
    await page.locator('#projects-summary').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    const m = await page.evaluate((sel) => {
      const f = document.querySelector<HTMLElement>(sel)!;
      const fila = f.parentElement!;
      const s = getComputedStyle(fila);
      return {
        overflowX: s.overflowX,
        // 6 frames of 96 plus five gaps of 16 is 656, plus the row's own padding, against 342.
        desborde: fila.scrollWidth > fila.clientWidth,
        scrollWidth: fila.scrollWidth,
        clientWidth: fila.clientWidth,
        barra: s.scrollbarWidth,
        mascara: s.maskImage || s.webkitMaskImage || '',
        // Every frame must be reachable, which is the point of scrolling rather than wrapping.
        alcanzables: [...document.querySelectorAll(sel)].length,
        overflowXPagina: document.documentElement.scrollWidth > window.innerWidth,
      };
    }, marcos);

    expect(m.desborde, 'la fila debe desbordar y ser deslizable').toBe(true);
    expect(m.overflowX).toBe('auto');
    expect(m.scrollWidth).toBeGreaterThan(m.clientWidth);
    expect(m.barra, 'sin barra visible').toBe('none');
    // Without the mask a cut frame reads as clipped rather than as continuing.
    expect(m.mascara).toContain('linear-gradient');
    expect(m.alcanzables).toBe(6);
    expect(m.overflowXPagina, 'la página no debe desbordar').toBe(false);
  });

  test('en escritorio la fila no necesita deslizarse', async ({ page }) => {
    await irA(page, { width: 1440, height: 900 });
    await page.locator('#projects-summary').scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    const m = await page.evaluate((sel) => {
      const fila = document.querySelector<HTMLElement>(sel)!.parentElement!;
      return { scrollWidth: fila.scrollWidth, clientWidth: fila.clientWidth };
    }, marcos);

    expect(m.scrollWidth).toBe(m.clientWidth);
  });
});
