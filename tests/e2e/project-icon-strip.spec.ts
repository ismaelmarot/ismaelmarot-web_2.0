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

/**
 * Bring the row into view and wait for it.
 *
 * `irA` waits for the frames to exist in the DOM, which is enough for the geometry tests because they
 * measure with getBoundingClientRect and a laid-out element measures correctly wherever it is. The
 * rotation needs the row to be genuinely on screen: the strip's observer is `triggerOnce`, so until the
 * row enters the viewport it reports not-visible and no interval is created at all. At 1440x900 the row
 * sits 1462px down, well below the fold, so a rotation test that did not scroll would wait forever for a
 * change that was never going to be scheduled.
 */
const irAEnPantalla = async (page: Page, vp: { width: number; height: number }) => {
  await irA(page, vp);
  await page.locator(marcos).first().scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const marco = document.querySelector('[data-testid="project-icon-frame"]');
    if (!marco) return false;
    return marco.getBoundingClientRect().top < window.innerHeight;
  });
  /* The observer reports the intersection on its own callback, and the interval starts after that. */
  await page.waitForTimeout(300);
};

/** The apps on screen, in slot order, read from the alt text a screen reader is given. */
const appsVisibles = (page: Page) =>
  page.$$eval('img[alt^="Icono de"]', (els) => els.map((e) => e.getAttribute('alt') ?? ''));

/**
 * Wait for the row's apps to actually change, rather than for a fixed duration.
 *
 * Sampling at "interval plus a margin" looks equivalent and is not: the row renews on a 4s timer, so a
 * sample taken 5s after the last one lands either one or two rotations later depending on where the
 * timer happened to be, and an out-of-phase sample compares an arrangement against itself. Waiting for
 * the change makes each sample one rotation apart by construction.
 */
const esperarRotacion = async (page: Page, previa: string[]) => {
  await page.waitForFunction(
    (prev: string[]) => {
      const alt = [...document.querySelectorAll('img[alt^="Icono de"]')].map(
        (e) => e.getAttribute('alt') ?? ''
      );
      return alt.some((a, i) => a !== prev[i]);
    },
    previa,
    { timeout: 20000 }
  );
  /* Past the fade, so the swap has happened and the icons are back at full opacity. */
  await page.waitForTimeout(400);
};

test.describe('La franja de iconos de proyectos', () => {
  /* The frame count is a function of the viewport since feature 011's Amendment 5: six above 700px and
     one at or below it, because specs/013 replaced the phone carousel with a single rotating icon.
     Everything else this block asserts — 96x96, the 22% radius, cover, the background, the absence of a
     border, one screen of height and no horizontal overflow — applies to every viewport, so it is
     asserted for all four rather than only the desktop ones. */
  for (const vp of [
    { width: 1440, height: 900, marcos: 6 },
    { width: 768, height: 1024, marcos: 6 },
    { width: 390, height: 844, marcos: 1 },
    { width: 320, height: 640, marcos: 1 },
  ]) {
    test(`${vp.marcos === 6 ? 'seis' : 'un'} marco de 96px en ${vp.width}x${vp.height}`, async ({ page }) => {
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

      expect(m.n, `marcos en ${vp.width}px`).toBe(vp.marcos);
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

  test('SC-014: en móvil muestra un solo icono, centrado, y la fila no se desliza', async ({ page }) => {
    /* specs/013 removed feature 011's horizontal carousel. It was built because six 96px frames are
       656px and a phone is 390px, and a clipped row hides half the work; scrolling solved that and
       introduced a horizontal scroller inside a vertical page, which competes with the page's own
       scroll. The rotation now surfaces the other five apps instead, so there is nothing to scroll to. */
    await irA(page, { width: 390, height: 844 });
    await page.locator('#projects-summary').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    const m = await page.evaluate((sel) => {
      const fila = document.querySelector<HTMLElement>('[data-testid="project-icon-row"]')!;
      const s = getComputedStyle(fila);
      const marcos = [...document.querySelectorAll<HTMLElement>(sel)];
      const banda = document.querySelector<HTMLElement>('#projects-summary')!;
      const marco = marcos[0]!.getBoundingClientRect();
      const centroFila = fila.getBoundingClientRect().left + fila.getBoundingClientRect().width / 2;
      return {
        marcos: marcos.length,
        overflowX: s.overflowX,
        justificado: s.justifyContent,
        scrollWidth: fila.scrollWidth,
        clientWidth: fila.clientWidth,
        desviacionDelCentro: Math.abs(marco.left + marco.width / 2 - centroFila),
        // The band is shorter now: one 96px row instead of a scrollable one.
        banda: banda.getBoundingClientRect().height,
        overflowXPagina: document.documentElement.scrollWidth > window.innerWidth,
      };
    }, marcos);

    expect(m.marcos, 'un solo marco en móvil').toBe(1);
    expect(m.overflowX, 'ya no es un scroller').toBe('visible');
    expect(m.scrollWidth, 'y por lo tanto no hay nada que deslizar').toBe(m.clientWidth);
    expect(m.justificado, 'el icono queda centrado').toBe('center');
    // Two pixels of tolerance for sub-pixel rounding on a 390px viewport.
    expect(m.desviacionDelCentro, 'el marco está centrado en la fila').toBeLessThanOrEqual(2);
    expect(m.overflowXPagina, 'la página no debe desbordar').toBe(false);
    return m;
  });

  test('SC-014: el único icono de móvil cambia de app en cada rotación', async ({ page }) => {
    test.setTimeout(90000);
    await irA(page, { width: 390, height: 844 });
    await page.locator('#projects-summary').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const appsVisiblesEnMovil = () => page.$$eval('img[alt^="Icono de"]', (els) =>
      els.map((e) => e.getAttribute('alt') ?? '')
    );

    let previo = await appsVisiblesEnMovil();
    expect(previo, 'un solo icono').toHaveLength(1);

    for (let ciclo = 0; ciclo < 3; ciclo += 1) {
      await esperarRotacion(page, previo);
      const actual = await appsVisiblesEnMovil();
      expect(actual, `ciclo ${ciclo}`).toHaveLength(1);
      expect(actual[0], `ciclo ${ciclo}: ${previo[0]} -> ${actual[0]}`).not.toBe(previo[0]);
      previo = actual;
    }
  });

  test('SC-015: el cambio entre seis y un marco ocurre en el mismo breakpoint', async ({ page }) => {
    /* One boundary, so there is no viewport range where the carousel's styles apply while six frames
       are still in the document, or the reverse. 701px must be six frames and 700px exactly one. */
    const casos: { ancho: number; esperados: number }[] = [
      { ancho: 701, esperados: 6 },
      { ancho: 700, esperados: 1 },
      { ancho: 699, esperados: 1 },
    ];
    for (const { ancho, esperados } of casos) {
      await irA(page, { width: ancho, height: 900 });
      const n = await page.locator(marcos).count();
      expect(n, `${ancho}px`).toBe(esperados);
    }
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

  test.describe('la rotacion de apps', () => {
    test('SC-001 y SC-002: los seis espacios cambian y ninguno conserva su app', async ({ page }) => {
      /* Five rotations at 4s each is 20s of waiting, which is past the default timeout. */
      test.setTimeout(90000);
      await irAEnPantalla(page, { width: 1440, height: 900 });

      let previo = await appsVisibles(page);

      for (let ciclo = 0; ciclo < 4; ciclo += 1) {
        await esperarRotacion(page, previo);
        const actual = await appsVisibles(page);

        actual.forEach((alt, espacio) => {
          expect(alt, `ciclo ${ciclo}, espacio ${espacio}: ${previo[espacio]} -> ${alt}`).not.toBe(
            previo[espacio]
          );
        });
        expect(new Set(actual).size, `ciclo ${ciclo}: sin repetidos`).toBe(actual.length);
        previo = actual;
      }
    });

    test('SC-004: con el tiempo se ven las seis apps', async ({ page }) => {
      test.setTimeout(90000);
      await irAEnPantalla(page, { width: 1440, height: 900 });

      const vistas = new Set(await appsVisibles(page));
      let previo = await appsVisibles(page);

      for (let ciclo = 0; ciclo < 5; ciclo += 1) {
        await esperarRotacion(page, previo);
        (await appsVisibles(page)).forEach((alt) => vistas.add(alt));
        previo = await appsVisibles(page);
      }

      expect(vistas.size).toBe(6);
    });

    test('SC-005: los seis espacios no se mueven ni cambian de tamano al rotar', async ({ page }) => {
      test.setTimeout(90000);
      await irAEnPantalla(page, { width: 1440, height: 900 });

      /* Past the entrance before taking the first measurement. Feature 011's entrance animates each
         frame's `scale` from 0.9 with a 60ms stagger, and a frame mid-scale measures narrower than its
         neighbours: a first reading came back as 96, 96, 95, 94, 93, 91 and the post-rotation reading as
         a clean 96 six times. Comparing the two reported the slots moving and resizing when nothing had
         moved. The stagger runs to 300ms and the animation to 500ms after it, so 1000ms is the whole of
         it. */
      await page.waitForTimeout(1000);

      const antes = await page.$$eval(marcos, (els) =>
        els.map((e) => {
          const r = e.getBoundingClientRect();
          return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
        })
      );

      const previo = await appsVisibles(page);
      await esperarRotacion(page, previo);

      const despues = await page.$$eval(marcos, (els) =>
        els.map((e) => {
          const r = e.getBoundingClientRect();
          return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
        })
      );

      expect(despues).toEqual(antes);
    });

    test('SC-007: el desplazamiento acumulado de la pagina se mantiene bajo 0.1 rotando', async ({ page }) => {
      test.setTimeout(90000);
      await irAEnPantalla(page, { width: 1440, height: 900 });

      let previo = await appsVisibles(page);
      for (let ciclo = 0; ciclo < 3; ciclo += 1) {
        await esperarRotacion(page, previo);
        previo = await appsVisibles(page);
      }

      const total = await page.evaluate(() => {
        let acumulado = 0;
        for (const entry of performance.getEntriesByType('layout-shift') as unknown as {
          value: number;
          hadRecentInput: boolean;
        }[]) {
          if (entry.hadRecentInput === false) acumulado += entry.value;
        }
        return acumulado;
      });

      expect(total, 'CLS acumulado').toBeLessThan(0.1);
    });

    test('la fila se desvanece y reaparece, no cambia de golpe', async ({ page }) => {
      test.setTimeout(90000);
      await irAEnPantalla(page, { width: 1440, height: 900 });

      /* Sample during the first half of the fade: the opacity has to be on its way down. */
      const opacidades = await page.evaluate(async () => {
        const marcos = [...document.querySelectorAll<HTMLElement>('[data-testid="project-icon-frame"]')];
        const leidas: number[] = [];
        for (let i = 0; i < 24; i += 1) {
          leidas.push(Number(getComputedStyle(marcos[0]!).opacity));
          await new Promise((r) => setTimeout(r, 60));
        }
        return leidas;
      });

      const minimo = Math.min(...opacidades);
      const maximo = Math.max(...opacidades);
      expect(maximo, 'los iconos vuelven a verse').toBeGreaterThan(0.9);
      expect(minimo, 'los iconos se desvanecen a mitad de camino').toBeLessThan(0.9);
    });

    test('SC-008: bajo movimiento reducido la fila no cambia y no hay transicion', async ({ browser }) => {
      const ctx = await browser.newContext({
        reducedMotion: 'reduce',
        locale: 'es-ES',
        viewport: { width: 1440, height: 900 },
      });
      const page = await ctx.newPage();
      await irAEnPantalla(page, { width: 1440, height: 900 });

      const antes = await appsVisibles(page);
      await page.waitForTimeout(13000);
      expect(await appsVisibles(page)).toEqual(antes);

      const transicion = await page.$eval(
        '[data-testid="project-icon-frame"]',
        (e) => getComputedStyle(e).transitionDuration
      );
      expect(transicion, 'feature 011 SC-006').toBe('0s');
      await ctx.close();
    });

    test('SC-009: no cambia con el cursor encima ni con la pestana oculta', async ({ page }) => {
      test.setTimeout(90000);
      await irAEnPantalla(page, { width: 1440, height: 900 });

      /* Hovering the row's centre rather than the first frame. The frames have gaps between them, and
         in webkit a pointer aimed at a frame's edge lands in a gap, which is outside the frame but still
         inside the row, so the row's mouseenter has to be aimed at the row itself for the test to mean
         what it says.

         The baseline is read after the hover has settled: the interval is rebuilt whenever the focus
         state changes, so a rotation already in flight when the pointer arrives completes on its own
         terms, and reading before that measures the transition into the paused state. */
      await page.hover('[data-testid="project-icon-row"]', { position: { x: 5, y: 5 } });
      await page.waitForTimeout(800);
      const conHover = await appsVisibles(page);
      await page.waitForTimeout(9000);
      expect(await appsVisibles(page), 'con el cursor encima').toEqual(conHover);

      /* The document hidden state, checked by overriding the property the hook reads. */
      await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
      });
      await page.waitForTimeout(9000);
      expect(await appsVisibles(page), 'con la pestana oculta').toEqual(conHover);

    });
  });
});
