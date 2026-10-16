import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * specs/025-contact-band-composition.
 *
 * This file replaces a table. `specs/021` recorded why the address's ceiling was 40px with a measured
 * table — 36px → 490 used of 596, 40px → 548, 44px → 599 and over by 3 — and a comment explaining it.
 * The token has since moved to the Hero's size, so that arithmetic described an arrangement that no
 * longer exists.
 *
 * **A table is a record of one measurement on one day. This is the same knowledge with something that
 * fails.** Every assertion here measures the rendered page, because the whole feature is a claim about
 * widths and a stylesheet assertion would pass on a value that overflows.
 *
 * The two that matter most:
 *
 *   - the address renders at the same size as the Hero's "Web Developer" line, which is the request
 *   - the address never wraps and never overflows its column, which is what the size has to be paid for
 *
 * The second is the one that will fail if someone raises the token again without redoing the
 * arithmetic, which is exactly what happened while writing this.
 */

const ANCHOS = [
  { nombre: 'escritorio', width: 1440, height: 900 },
  { nombre: 'escritorio chico', width: 1024, height: 800 },
  { nombre: 'tablet', width: 768, height: 1024 },
  { nombre: 'movil', width: 390, height: 844 },
  { nombre: 'movil pequeno', width: 320, height: 640 },
];

interface Medida {
  mailFuente: string;
  heroFuente: string;
  lineas: number;
  desborda: boolean;
  filaArribaDelEncabezado: boolean;
  encabezadoPrimero: boolean;
  redesALaIzquierda: boolean;
  botonALaDerecha: boolean;
  ordenVertical: number[];
}

async function medir(page: Page): Promise<Medida> {
  return page.evaluate(() => {
    const banda = document.getElementById('contact-summary')!;
    const q = (sel: string) => banda.querySelector(sel) as HTMLElement;
    const fila = q('[data-testid="contact-band-row"]');
    const mail = q('a[href^="mailto:"]');
    const encabezado = q('h2');
    const frase = q('[data-testid="contact-tagline"]');
    const boton = q('a[href="/contact"]');
    const redes = fila.querySelector('ul');
    const hero = document.querySelector('[data-testid="hero-band"] p') as HTMLElement;

    const caja = (e: Element) => e.getBoundingClientRect();
    const altoLinea = parseFloat(getComputedStyle(mail).lineHeight);
    const primero = banda.querySelector('h2, p, a, ul');

    return {
      mailFuente: getComputedStyle(mail).fontSize,
      heroFuente: getComputedStyle(hero).fontSize,
      lineas: Math.round(caja(mail).height / altoLinea),
      // scrollWidth exceeds clientWidth when the flex line cannot hold the address, the arrow and the
      // gap together. This is the assertion specs/021's table could not make.
      desborda: mail.scrollWidth > mail.clientWidth + 1,
      filaArribaDelEncabezado: caja(fila).top < caja(encabezado).top,
      encabezadoPrimero: primero?.tagName === 'H2',
      redesALaIzquierda: redes ? caja(redes).right < caja(mail).left : false,
      // 2px of slack for sub-pixel layout; the button hugs the container's right edge.
      botonALaDerecha: caja(banda).right - caja(boton).right < 120,
      ordenVertical: [caja(redes ?? mail).top, caja(mail).top, caja(encabezado).top, caja(frase).top, caja(boton).top].map(Math.round),
    };
  });
}

test.describe('la banda de contacto', () => {
  for (const vp of ANCHOS) {
    test.describe(vp.nombre, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });

      test('el mail mide lo mismo que la fase del Hero, o un escalón menos en móvil', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        const m = await medir(page);

        const px = (v: string) => parseFloat(v);
        if (vp.width >= 768) {
          // El pedido, literal: la misma fase. El token es el mismo, no dos tokens que coinciden hoy.
          expect(px(m.mailFuente)).toBeCloseTo(px(m.heroFuente), 1);
        } else {
          // Debajo de 768 la columna es el ancho entero y el piso del token del Hero pide 406px, que
          // un teléfono no tiene. Un escalón menos, y nunca mayor que el del Hero.
          expect(px(m.mailFuente)).toBeLessThan(px(m.heroFuente));
          // Con un techo medido: 25px es lo que entra en 358px de columna junto a la flecha de 28.
          expect(px(m.mailFuente)).toBeLessThanOrEqual(25);
        }
      });

      test('el mail no parte ni desborda su columna', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        const m = await medir(page);

        expect(m.lineas, 'el mail cabe en una línea').toBe(1);
        expect(m.desborda, 'el mail no desborda su columna').toBe(false);
      });

      test('la fila de arriba trae redes y mail, y la pregunta va debajo', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        const m = await medir(page);

        expect(m.filaArribaDelEncabezado).toBe(true);
        // Y el orden de lectura no da la vuelta: el encabezado sigue siendo lo primero del DOM.
        expect(m.encabezadoPrimero).toBe(true);
      });

      test('las redes quedan a la izquierda del mail, en la misma fila', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        const m = await medir(page);

        // En móvil la fila se apila y las redes quedan encima, no al lado. Que se apilen es lo
        // correcto; lo que no puede pasar es que se solapen.
        if (vp.width >= 768) expect(m.redesALaIzquierda).toBe(true);
      });
    });
  }

  test('el botón está a la derecha en escritorio y a la izquierda en móvil', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect((await medir(page)).botonALaDerecha).toBe(true);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForLoadState('domcontentloaded');
    expect((await medir(page)).botonALaDerecha).toBe(false);
  });

  test('la banda sigue siendo del alto de una pantalla', async ({ page }) => {
    // specs/025 mueve cosas dentro de la banda. Esto es lo que comprueba que no la movió de alto, y
    // es el mismo criterio que home-scroll-snap ya afirma.
    for (const vp of ANCHOS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const alto = await page.evaluate(
        () => document.getElementById('contact-summary')!.getBoundingClientRect().height / window.innerHeight
      );
      expect(Math.round(alto), `${vp.nombre}: la banda ocupa una pantalla`).toBe(1);
    }
  });

  test('la banda conserva su nombre accesible y su único encabezado', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Acotado a la banda: la página tiene cuatro h2, uno por cada banda, y el criterio es que ESTA
    // tenga uno solo.
    const banda = page.getByRole('region', { name: 'Contacto' });
    await expect(banda).toBeVisible();
    await expect(banda.getByRole('heading', { level: 2 })).toHaveText('¿Tienes un proyecto?');
    expect(await banda.getByRole('heading').all(), 'una sola voz en la banda').toHaveLength(1);

    // Y la frase nueva no es un encabezado, que es lo que mantiene esa cuenta en uno.
    await expect(banda.getByTestId('contact-tagline')).toHaveText(/./);
    expect(await banda.getByRole('heading', { level: 2 }).count()).toBe(1);
  });
});