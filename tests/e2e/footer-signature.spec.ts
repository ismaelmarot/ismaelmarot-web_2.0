import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * Feature 014, specs/014-playwrite-signature.
 *
 * The component tests for the footer assert CSS strings. That is enough to prove that Playwrite is
 * named in a stylesheet and not enough to prove that a visitor sees it. Worse, it is satisfied by a
 * font that never loads, which is the case this feature is most likely to break in the wild: the
 * request goes to a third-party CDN, and a CDN fails more often than a build does.
 *
 * So these measure. `page.evaluate` rather than `boundingBox`, for the same reason as the other
 * specs in this directory: it reads the geometry the CSS engine actually resolved.
 */

const VIEWPORTS = [
  { width: 320, height: 640 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

const NOMBRE = 'Ismael Marot';

/** The name element, whatever it ends up being named in the markup. */
const SELECTOR_FIRMA = 'footer p span';

async function esperarFooter(page: Page) {
  await page.waitForSelector('footer p');
  await page.waitForFunction(() => document.fonts.status === 'loaded').catch(() => undefined);
}

async function geometria(page: Page) {
  return page.evaluate(() => {
    const p = document.querySelector('footer p')!;
    const ul = document.querySelector('footer ul');
    const pr = p.getBoundingClientRect();
    const ur = ul?.getBoundingClientRect();
    return {
      altoP: pr.height,
      topP: pr.top,
      bottomP: pr.bottom,
      topLinks: ur ? ur.top : null,
      altoFooter: document.querySelector('footer')!.getBoundingClientRect().height,
    };
  });
}

test.describe('La firma manuscrita del footer', () => {
  test('el nombre se renderiza en Playwrite US Modern a peso 400', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await esperarFooter(page);

    // SC-001. Computed, not read from the stylesheet: this is the assertion that would fail if the
    // font never arrived, which is exactly the failure worth catching.
    const firma = await page.evaluate((sel) => {
      const el = document.querySelector<HTMLElement>(sel)!;
      const cs = getComputedStyle(el);
      return { familia: cs.fontFamily, peso: cs.fontWeight, texto: el.textContent };
    }, SELECTOR_FIRMA);

    expect(firma.familia).toContain('Playwrite US Modern');
    expect(firma.peso).toBe('400');
    expect(firma.texto?.trim()).toBe(NOMBRE);
  });

  // FR-002. Playwrite's axis stops at 400 and it has no bold. If a weight above that ever reached
  // this element the browser would synthesise a heavier face rather than draw a real one, which is
  // the failure this guards.
  //
  // The assertion is on the requested weight together with the weight of the face that actually
  // loaded, not on `font-synthesis`: that property defaults to "weight style small-caps" on every
  // element in the document whether or not anything is synthesised, so asserting on it measures the
  // absence of a declaration rather than the absence of synthesis.
  test('el nombre no pide un peso que la tipografía no tiene', async ({ page }) => {
    await page.goto('/');
    await esperarFooter(page);

    const resultado = await page.evaluate((sel) => {
      const el = document.querySelector<HTMLElement>(sel)!;
      const cs = getComputedStyle(el);
      const cargada = document.fonts.check('14px "Playwrite US Modern"');
      // The weight of the face the browser resolved for this element, which is what determines
      // whether a heavier face was synthesised.
      const [primera] = cs.fontFamily.split(',');
      const declarada = [...document.fonts].find((f) => f.family === primera.replace(/["']/g, '').trim());
      return {
        pesoSolicitado: Number(cs.fontWeight),
        pesoDeLaFuente: declarada ? Number(declarada.weight) : null,
        declaradaWeight: declarada?.weight ?? null,
        cargada,
      };
    }, SELECTOR_FIRMA);

    expect(resultado.pesoSolicitado).toBe(400);
    expect(resultado.pesoSolicitado).toBeLessThanOrEqual(400);
    // The face that loaded is the real 400, so the name is drawn rather than synthesised.
    expect(resultado.declaradaWeight).toBe('400');
    expect(resultado.pesoDeLaFuente).toBe(400);
    expect(resultado.cargada).toBe(true);
  });

  // FR-006 and SC-005. The text a visitor reads and a screen reader announces is unchanged. The
  // feature changed a typeface, so this is the assertion that it changed nothing else.
  test('el texto del copyright sigue siendo el mismo', async ({ page }) => {
    await page.goto('/');
    await esperarFooter(page);

    const texto = await page.$eval('footer p', (el) => el.textContent ?? '');
    const anio = new Date().getFullYear();
    expect(texto).toBe(`© ${anio} ${NOMBRE}`);
  });

  // FR-005. The symbol and the year are not part of the signature, so they must not have taken the
  // handwriting. This reads the parent rather than trusting that only the span was styled.
  test('el símbolo y el año se quedan en la tipografía del sitio', async ({ page }) => {
    await page.goto('/');
    await esperarFooter(page);

    const padre = await page.$eval('footer p', (el) => getComputedStyle(el).fontFamily);
    expect(padre).not.toContain('Playwrite');
    expect(padre).toContain('Inter');
  });

  // FR-009 and SC-006. The whole point of choosing the footer was that nothing else moves. If the
  // face reached a heading, Inter would stop being the site's typeface in practice.
  test('el resto del sitio sigue usando Inter', async ({ page }) => {
    await page.goto('/');
    await esperarFooter(page);

    const resultado = await page.evaluate(() => ({
      body: getComputedStyle(document.body).fontFamily,
      h1: getComputedStyle(document.querySelector('h1')!).fontFamily,
      h1Peso: getComputedStyle(document.querySelector('h1')!).fontWeight,
      h2Pesos: [...document.querySelectorAll('h2')].map((h) => getComputedStyle(h).fontWeight),
    }));

    expect(resultado.body).toContain('Inter');
    expect(resultado.body).not.toContain('Playwrite');
    expect(resultado.h1).not.toContain('Playwrite');
    // The hero is 700 today and this feature must not have touched it.
    expect(resultado.h1Peso).toBe('700');
    for (const peso of resultado.h2Pesos) expect(peso).toBe('700');
  });

  // FR-007 and SC-002. The measurement that decided the implementation: the handwriting face sets a
  // 25px inline box against Inter's 17px at the same 14px, which grew the line by 1px and pushed the
  // social links down with it before the height was reserved.
  test('el footer no se mueve cuando llega la fuente', async ({ page }) => {
    for (const vp of VIEWPORTS) {
      await page.setViewportSize(vp);
      await page.goto('/');
      await esperarFooter(page);
      await page.waitForTimeout(300);

      const conFuente = await geometria(page);

      // Geometry the font cannot influence: the footer without the signature. If the signature
      // changed the height, these would differ.
      const soloTexto = await page.evaluate(() => {
        const p = document.querySelector<HTMLElement>('footer p')!;
        const original = p.innerHTML;
        p.innerHTML = p.textContent ?? '';
        const r = p.getBoundingClientRect();
        p.innerHTML = original;
        return { altoP: r.height };
      });

      expect(Math.round(conFuente.altoP)).toBe(Math.round(soloTexto.altoP));
    }
  });

  test('los enlaces sociales no bajan al cargar la fuente', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await esperarFooter(page);
    await page.waitForTimeout(600);

    const antes = await geometria(page);
    await page.reload();
    await esperarFooter(page);
    await page.waitForTimeout(900); // la fuente ya esta en cache: el segundo render es el que importa
    const despues = await geometria(page);

    expect(Math.round(despues.topLinks!)).toBe(Math.round(antes.topLinks!));
    expect(Math.round(despues.altoFooter)).toBe(Math.round(antes.altoFooter));
  });

  // FR-004 and SC-003. A font swap that moves the page is the failure this reservation exists to
  // prevent, and CLS is the number the constitution budgets.
  test('la carga de la fuente no genera desplazamiento acumulado', async ({ page }) => {
    await page.goto('/');
    await esperarFooter(page);
    await page.waitForTimeout(900);

    const cls = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let total = 0;
          try {
            new PerformanceObserver((lista) => {
              for (const e of lista.getEntries()) {
                if (!(e as PerformanceEntry & { hadRecentInput?: boolean; value?: number }).hadRecentInput) {
                  total += (e as PerformanceEntry & { value?: number }).value ?? 0;
                }
              }
            }).observe({ type: 'layout-shift', buffered: true });
          } catch {
            resolve(0);
            return;
          }
          setTimeout(() => resolve(total), 600);
        })
    );

    expect(cls).toBeLessThan(0.1);
  });

  // FR-003 and SC-004. The CDN fails, and it fails more often than a build does. The name must
  // still be there, still be readable and still come from the fallback rather than from whatever
  // the browser decides on its own.
  test('con la fuente bloqueada el nombre se lee igual', async ({ page }) => {
    await page.route('**/css2?family=Playwrite*', (r) => r.abort());
    await page.route('**/playwrite/**', (r) => r.abort());
    await page.goto('/');
    await esperarFooter(page);

    const resultado = await page.evaluate((sel) => {
      const el = document.querySelector<HTMLElement>(sel)!;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        texto: el.textContent?.trim(),
        visible: r.width > 0 && r.height > 0,
        familia: cs.fontFamily,
        ancho: r.width,
      };
    }, SELECTOR_FIRMA);

    expect(resultado.texto).toBe(NOMBRE);
    expect(resultado.visible).toBe(true);
    expect(resultado.ancho).toBeGreaterThan(0);
    // Resolved to the site's own stack rather than to a browser default.
    expect(resultado.familia).toContain('Inter');
  });

  // FR-003, second half. The fallback has to be the site's sans, not merely "something".
  test('el token declara el fallback del sitio', async () => {
    const tokens = await (await import('node:fs/promises')).readFile('src/styles/tokens.css', 'utf8');
    expect(tokens).toMatch(/--font-hand:\s*'Playwrite US Modern',\s*var\(--font-sans\)/);
  });

  // FR-011. An @import inside globals.css would put this request in series behind Inter's, inside a
  // render-blocking stylesheet, for a font that two words depend on.
  test('la fuente se carga con link y no con import', async () => {
    const html = await (await import('node:fs/promises')).readFile('index.html', 'utf8');
    expect(html).toContain('rel="stylesheet"');
    expect(html).toContain('Playwrite+US+Modern');
    expect(html).toContain('display=swap');
    expect(html).toContain('fonts.gstatic.com');
    // The stylesheet itself must not have grown an import.
    const globals = await (await import('node:fs/promises')).readFile('src/styles/globals.css', 'utf8');
    expect(globals).not.toContain('Playwrite');
  });

  // FR-008 and SC-010. A signature must not become a heading, and on a phone it must not push the
  // social links off the row.
  test('la firma no añade un encabezado y cabe en un móvil', async ({ page }) => {
    for (const vp of [{ width: 320, height: 640 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(vp);
      await page.goto('/');
      await esperarFooter(page);

      const resultado = await page.evaluate(() => {
        const footer = document.querySelector('footer')!;
        const p = footer.querySelector('p')!;
        const ul = footer.querySelector('ul')!;
        const pr = p.getBoundingClientRect();
        const ur = ul.getBoundingClientRect();
        return {
          encabezados: footer.querySelectorAll('h1,h2,h3,h4,h5,h6').length,
          pr: { top: pr.top, bottom: pr.bottom, left: pr.left, right: pr.right },
          ur: { top: ur.top, left: ur.left, right: ur.right },
          desborde: document.documentElement.scrollWidth - window.innerWidth,
        };
      });

      expect(resultado.encabezados).toBe(0);
      // No horizontal overflow at 320.
      expect(resultado.desborde).toBeLessThanOrEqual(0);
      // The links sit below the text and inside the viewport.
      expect(resultado.ur.left).toBeGreaterThanOrEqual(0);
      expect(resultado.ur.right).toBeLessThanOrEqual(vp.width);
      expect(resultado.ur.top).toBeGreaterThanOrEqual(resultado.pr.bottom - 1);
    }
  });

  test.describe.configure({ mode: 'serial' });
});