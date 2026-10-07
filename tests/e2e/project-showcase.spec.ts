import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * specs/012-project-showcase.
 *
 * The scene is the feature, so these assert it in a real browser. Two things cannot be checked in jsdom:
 * whether the 3D transform actually produces a 3D matrix rather than a flat rectangle, and whether the
 * layered panels read as depth at a given viewport.
 */
const irA = async (page: Page, vp: { width: number; height: number }) => {
  await page.setViewportSize(vp);
  await page.goto('/');
  await page.waitForSelector('#projects-summary [data-testid="showcase-scene"]');
};

const escenas = '[data-testid="showcase-scene"]';
const escena = '[data-testid="showcase-stage"]';
const pila = '[data-testid="showcase-stack"]';

test.describe('Las escenas de proyectos', () => {
  for (const vp of [
    { width: 1440, height: 900 },
    { width: 1280, height: 800 },
    { width: 1024, height: 768 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
    { width: 320, height: 640 },
  ]) {
    test(`${vp.width >= 1280 ? 'cuatro' : vp.width >= 1024 ? 'dos' : 'una'} escena por fila en ${vp.width}x${vp.height}`, async ({ page }) => {
      await irA(page, vp);

      const grid = await page.evaluate(() => {
        const g = document.querySelector<HTMLElement>('[data-testid="showcase-grid"]')!;
        return {
          // How many scenes the grid puts side by side. This, not the number of scenes, is what
          // "one per row" means: four scenes are always rendered, and below 1024 they stack.
          columnas: getComputedStyle(g).gridTemplateColumns.split(' ').length,
          escenas: document.querySelectorAll('[data-testid="showcase-scene"]').length,
        };
      });

      const esperadas = vp.width >= 1280 ? 4 : vp.width >= 1024 ? 2 : 1;
      expect(grid.columnas).toBe(esperadas);
      expect(grid.escenas).toBe(4);
    });
  }

  test('la escena usa perspectiva real y no un rectángulo plano', async ({ page }) => {
    await irA(page, { width: 1440, height: 900 });

    const medidas = await page.evaluate(
      ({ stage, stack }) => {
        const s = document.querySelector<HTMLElement>(stage)!;
        const p = document.querySelector<HTMLElement>(stack)!;
        return {
          perspective: getComputedStyle(s).perspective,
          transform: getComputedStyle(p).transform,
          preserve: getComputedStyle(p).transformStyle,
        };
      },
      { stage: escena, stack: pila }
    );

    // A perspective above zero is what makes the tilt read as 3D, and a matrix3d is what carries the
    // rotateX/rotateY. A flat scene would report `none` or a 2d matrix.
    expect(medidas.perspective).not.toBe('none');
    expect(Number.parseFloat(medidas.perspective)).toBeGreaterThan(0);
    expect(medidas.transform).toMatch(/matrix3d/);
    expect(medidas.preserve).toBe('preserve-3d');
  });

  test('cada escena tiene dos paneles en ángulos distintos', async ({ page }) => {
    await irA(page, { width: 1440, height: 900 });

    // Scoped to one scene: indexing sibling collections by position breaks the moment the rotation
    // remounts a column between the querySelectorAll and the map.
    const medidas = await page.evaluate((sel) => {
      const escena = document.querySelector<HTMLElement>(sel)!;
      const atras = escena.querySelector<HTMLElement>('[data-testid="showcase-back-panel"]')!;
      const delante = escena.querySelector<HTMLElement>('[data-testid="showcase-front-panel"]')!;
      const pila = escena.querySelector<HTMLElement>('[data-testid="showcase-stack"]')!;
      return {
        atras: getComputedStyle(atras).transform,
        delante: getComputedStyle(delante).transform,
        pila: getComputedStyle(pila).transform,
      };
    }, escenas);

    expect(medidas.pila).toMatch(/matrix3d/);
    expect(medidas.atras).toMatch(/matrix3d/);
    expect(medidas.atras).not.toBe(medidas.pila);
    // The front panel inherits the stack's rotation, so its own transform is flat by design.
    expect(
      medidas.delante === 'none' || medidas.delante === 'matrix(1, 0, 0, 1, 0, 0)'
    ).toBe(true);
  });

  test('la captura se muestra entera y sin deformar', async ({ page }) => {
    await irA(page, { width: 1440, height: 900 });

    const img = page.locator('[data-testid="showcase-front-panel"] img').first();
    // The screenshots are lazy, so naturalWidth is 0 until the image actually loads. Reading it before
    // that reports NaN rather than the ratio.
    await img.waitFor({ state: 'visible' });
    await expect
      .poll(async () => img.evaluate((el) => (el as HTMLImageElement).naturalWidth), {
        timeout: 15000,
      })
      .toBeGreaterThan(0);

    const ajuste = await img.evaluate((el) => {
      const imagen = el as HTMLImageElement;
      return {
        fit: getComputedStyle(imagen).objectFit,
        // contain means the artwork keeps its own ratio inside the panel: the rendered box may be
        // larger, but the painted image is never stretched to fill it.
        naturalRatio: imagen.naturalWidth / imagen.naturalHeight,
        // Every source is portrait, so the ratio must stay below 1 whatever the panel is.
        vertical: imagen.naturalHeight > imagen.naturalWidth,
      };
    });

    expect(ajuste.fit).toBe('contain');
    expect(Number.isFinite(ajuste.naturalRatio)).toBe(true);
    expect(ajuste.naturalRatio).toBeGreaterThan(0);
    expect(ajuste.vertical).toBe(true);
  });

  test('cada escena lleva el nombre y la descripción de su proyecto', async ({ page }) => {
    await irA(page, { width: 1440, height: 900 });

    const pares = await page.evaluate((sel) => {
      return [...document.querySelectorAll<HTMLElement>(sel)].map((e) => ({
        nombre: e.querySelector('h3')?.textContent?.trim() ?? '',
        descripcion: e.querySelector('p')?.textContent?.trim() ?? '',
        alt: e.querySelector('img')?.getAttribute('alt') ?? '',
      }));
    }, escenas);

    expect(pares).toHaveLength(4);
    for (const par of pares) {
      expect(par.nombre).not.toBe('');
      expect(par.descripcion).not.toBe('');
      expect(par.alt).toBe(`Captura de ${par.nombre}`);
    }
  });

  test('cada proyecto conserva su color aunque cambie de columna', async ({ page }) => {
    await irA(page, { width: 1440, height: 900 });

    const leerColores = () =>
      page.evaluate((sel) => {
        // name -> accent, so a project can be looked up across cycles by identity rather than by
        // which column it currently occupies.
        const mapa: Record<string, string> = {};
        for (const escena of document.querySelectorAll<HTMLElement>(sel)) {
          const nombre = escena.querySelector('h3')?.textContent?.trim();
          const fondo = escena.querySelector<HTMLElement>('[data-testid="showcase-back-panel"]');
          if (nombre && fondo) mapa[nombre] = getComputedStyle(fondo).backgroundImage;
        }
        return mapa;
      }, escenas);

    const antes = await leerColores();
    expect(Object.keys(antes)).toHaveLength(4);

    await page.waitForTimeout(6500);
    const despues = await leerColores();

    // Rotating changes which four projects are visible, so the sets differ by design. What must not
    // change is the colour of a project that appears in both cycles.
    const compartidos = Object.keys(antes).filter((nombre) => nombre in despues);
    expect(compartidos.length).toBeGreaterThan(0);
    for (const nombre of compartidos) {
      expect(despues[nombre]).toBe(antes[nombre]);
    }
  });

  test('la rotación no repite un proyecto en la misma columna', async ({ page }) => {
    await irA(page, { width: 1440, height: 900 });

    const nombreEnLaPrimeraColumna = () =>
      page.evaluate((sel) => {
        const escena = document.querySelector<HTMLElement>(sel)!;
        return escena.querySelector('h3')?.textContent?.trim() ?? '';
      }, escenas);

    const visto = await nombreEnLaPrimeraColumna();
    await page.waitForTimeout(6500);
    expect(await nombreEnLaPrimeraColumna()).not.toBe(visto);
  });

  test('el puntero sobre la escena detiene la rotación', async ({ page }) => {
    await irA(page, { width: 1440, height: 900 });

    const antes = await page.evaluate(
      (sel) => document.querySelector<HTMLElement>(sel)!.querySelector('h3')?.textContent,
      escenas
    );

    await page.hover('[data-testid="project-showcase"]');
    await page.waitForTimeout(6500);

    const despues = await page.evaluate(
      (sel) => document.querySelector<HTMLElement>(sel)!.querySelector('h3')?.textContent,
      escenas
    );

    expect(despues).toBe(antes);
  });

  test('con movimiento reducido no rota ni flota', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await irA(page, { width: 1440, height: 900 });

    const antes = await page.evaluate(
      (sel) => document.querySelector<HTMLElement>(sel)!.querySelector('h3')?.textContent,
      escenas
    );

    await page.waitForTimeout(8000);

    const despues = await page.evaluate(
      (sel) => document.querySelector<HTMLElement>(sel)!.querySelector('h3')?.textContent,
      escenas
    );

    expect(despues).toBe(antes);

    // The float animation is what reduced motion has to remove. The static tilt stays, because a tilt
    // that does not change over time is not movement.
    const animacion = await page.evaluate(
      (sel) => getComputedStyle(document.querySelector<HTMLElement>(sel)!).animationName,
      pila
    );
    expect(animacion).toBe('none');
  });

  test('no hay desbordamiento horizontal a 320px', async ({ page }) => {
    await irA(page, { width: 320, height: 640 });

    const desborde = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));

    expect(desborde.scroll).toBeLessThanOrEqual(desborde.client + 1);
  });

  test('no hay botón play/pause', async ({ page }) => {
    await irA(page, { width: 1440, height: 900 });

    const botones = await page.evaluate(
      (sel) =>
        document.querySelectorAll<HTMLElement>(`${sel} button`).length,
      '[data-testid="project-showcase"]'
    );

    expect(botones).toBe(0);
  });

  test('la franja de iconos sigue igual', async ({ page }) => {
    await irA(page, { width: 1440, height: 900 });

    const iconos = await page.evaluate(() => {
      const frames = [...document.querySelectorAll<HTMLElement>('[data-testid="project-icon-frame"]')];
      return frames.map((f) => {
        const r = f.getBoundingClientRect();
        return {
          tamano: `${Math.round(r.width)}x${Math.round(r.height)}`,
          sombra: getComputedStyle(f).boxShadow,
        };
      });
    });

    expect(iconos).toHaveLength(6);
    for (const icono of iconos) expect(icono.tamano).toBe('96x96');
    // The three-layer shadow from Amendment 1 of specs/011.
    const capas = iconos[0]!.sombra.match(/rgba?\([^)]+\)/g) ?? [];
    expect(capas.length).toBeGreaterThanOrEqual(3);
  });
});