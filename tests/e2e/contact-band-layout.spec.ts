import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * specs/027-contact-band-hierarchy.
 *
 * This file replaces the `specs/025` arrangement with the `specs/027` one. The band's subject moved from
 * the address to the question, so the assertions that held the address against the Hero's "Web Developer"
 * line now hold the question against the "Sobre mí" section title, and the row that `specs/025` raised to
 * the top with `order` is now the last thing in the band.
 *
 * **A table is a record of one measurement on one day. This is the same knowledge with something that
 * fails.** Every assertion here measures the rendered page, because the whole feature is a claim about
 * sizes and widths and a stylesheet assertion would pass on a value that overflows.
 */

const ANCHOS = [
  { nombre: 'escritorio', width: 1440, height: 900 },
  { nombre: 'escritorio chico', width: 1024, height: 800 },
  { nombre: 'tablet', width: 768, height: 1024 },
  { nombre: 'movil', width: 390, height: 844 },
  { nombre: 'movil pequeno', width: 320, height: 640 },
];

interface Medida {
  preguntaFuente: string;
  tituloFuente: string;
  mailFuente: string;
  fraseFuente: string;
  descripcionFuente: string;
  distanciaBotonFila: number;
  lineas: number;
  desborda: boolean;
  ordenVertical: number[];
  filaAbajoDelEncabezado: boolean;
  encabezadoPrimero: boolean;
  redesALaIzquierda: boolean;
  mailALaDerecha: boolean;
  botonALaIzquierda: boolean;
  anchoDisponible: number;
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
    const titulo = document.querySelector('#about-summary h2') as HTMLElement;
    // specs/028: the sentence's coordinate is the "Me interesa…" description in the band above this one.
    const descripcion = document.querySelector('#about-summary p') as HTMLElement;

    const caja = (e: Element) => e.getBoundingClientRect();
    const altoLinea = parseFloat(getComputedStyle(mail).lineHeight);
    const primero = banda.querySelector('h2, p, a, ul');

    return {
      preguntaFuente: getComputedStyle(encabezado).fontSize,
      tituloFuente: getComputedStyle(titulo).fontSize,
      mailFuente: getComputedStyle(mail).fontSize,
      fraseFuente: getComputedStyle(frase).fontSize,
      descripcionFuente: getComputedStyle(descripcion).fontSize,
      // specs/028: the air the band owns is the distance between its last copy element and the row.
      // Measured rather than read off a stylesheet, so a margin smuggled in anywhere fails it the
      // same way a gap that never rendered would; roundoff gets 1px of slack.
      distanciaBotonFila: Math.round(caja(fila).top - caja(boton).bottom),
      lineas: Math.round(caja(mail).height / altoLinea),
      // scrollWidth exceeds clientWidth when the flex line cannot hold the address, the arrow and the
      // gap together. This is the assertion specs/021's table could not make.
      desborda: mail.scrollWidth > mail.clientWidth + 1,
      // The whole arrangement is one claim: question, sentence, call to action, row, top to bottom.
      ordenVertical: [
        caja(encabezado).top,
        caja(frase).top,
        caja(boton).top,
        caja(fila).top,
      ].map(Math.round),
      filaAbajoDelEncabezado: caja(fila).top > caja(encabezado).top,
      encabezadoPrimero: primero?.tagName === 'H2',
      redesALaIzquierda: redes ? caja(redes).right < caja(mail).left : false,
      // 2px of slack for sub-pixel layout; the address hugs the row's right edge.
      mailALaDerecha: caja(fila).right - caja(mail).right < 4,
      // The call to action is left-aligned within the copy, whose column starts at the question's own
      // left edge — not at the band's, which the centred, max-widthed inner can sit 80px inside of at
      // 1440. Measuring against the heading is measuring what `align-items: flex-start` promises, and
      // it is the same number at every viewport because the three children share one flex line.
      botonALaIzquierda: Math.abs(caja(boton).left - caja(encabezado).left) < 4,
      // The width a media query sees, which is not the width Playwright was asked for. On a platform
      // with classic scrollbars the two differ, and at 768 that difference is enough to flip a
      // breakpoint. Everything the CSS branches on branches on this, so this is what the assertions
      // have to branch on too.
      anchoDisponible: document.documentElement.clientWidth,
    };
  });
}

test.describe('la banda de contacto', () => {
  for (const vp of ANCHOS) {
    test.describe(vp.nombre, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });

      test('la pregunta mide lo mismo que el título Sobre mí', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        const m = await medir(page);

        // The request, literally: the question reads at the section-title scale, the token the
        // "Sobre mí" heading already uses. Measured on the rendered page, not read from a stylesheet.
        expect(parseFloat(m.preguntaFuente)).toBe(parseFloat(m.tituloFuente));
      });

      test('el mail es un escalón menos que la pregunta', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        const m = await medir(page);

        // specs/027 moved the display from the address to the question. The address keeps its own
        // token, whose ceiling is the token one step below the section title, so the two cannot be
        // equal and the address can never outgrow the question.
        expect(parseFloat(m.mailFuente)).toBeLessThan(parseFloat(m.preguntaFuente));
      });

      test('la frase mide lo mismo que el texto de Sobre mí, y no gana sobre la pregunta', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        const m = await medir(page);

        // specs/028's request, literally: the sentence reads the same size as the "Me interesa…"
        // description two bands above it. Measured on the rendered page, not read off a stylesheet.
        expect(parseFloat(m.fraseFuente)).toBe(parseFloat(m.descripcionFuente));
        // And the hierarchy specs/027 settled survives the sentence's wider token at every viewport:
        // its 20px floor is above the address's 18px on a phone, which is fine — the sentence is not
        // the display. The question remains the largest thing in the band.
        expect(parseFloat(m.preguntaFuente)).toBeGreaterThan(parseFloat(m.fraseFuente));
      });

      test('el aire entre el bloque y la fila mide el escalón que specs/028 pide', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        const m = await medir(page);

        // 48px is the step the band owns between its last copy element and the row — `space[12]` on the
        // parent's gap, up from the 40px the band carried through specs/027. One pixel of slack covers
        // the roundoff in the measurement; the distance is what a margin smuggled in anywhere would
        // spoil, which is why it is measured and not read off a stylesheet.
        expect(m.distanciaBotonFila, 'la fila respira un escalón más').toBeGreaterThan(40);
        expect(Math.abs(m.distanciaBotonFila - 48), '48px, espacio-aguja').toBeLessThanOrEqual(1);
      });

      test('el mail no parte ni desborda su columna', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        const m = await medir(page);

        expect(m.lineas, 'el mail cabe en una línea').toBe(1);
        expect(m.desborda, 'el mail no desborda su columna').toBe(false);
      });

      test('la pregunta va arriba, la fila abajo, y el encabezado es lo primero', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        const m = await medir(page);

        expect(m.filaAbajoDelEncabezado).toBe(true);
        // Y el orden de lectura no da la vuelta: el encabezado sigue siendo lo primero del DOM.
        expect(m.encabezadoPrimero).toBe(true);
        // Y el dibujo es una pila: pregunta, frase, botón, fila.
        const orden = m.ordenVertical;
        expect(orden[0]).toBeLessThan(orden[1]);
        expect(orden[1]).toBeLessThan(orden[2]);
        expect(orden[2]).toBeLessThan(orden[3]);
      });

      test('las redes quedan a la izquierda del mail, en la misma fila', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        const m = await medir(page);

        // En móvil la fila se apila y las redes quedan encima, no al lado. Que se apilen es lo
        // correcto; lo que no puede pasar es que se solapen.
        //
        // El umbral es `anchoDisponible`, que es lo que ve una media query. En macOS las barras de
        // desplazamiento no ocupan ancho, así que con viewport 768 el ancho disponible también es 768
        // y las dos cosas coinciden; en Linux la barra es clásica y se come unos 15px, de modo que con
        // viewport 768 el ancho disponible es 753, la regla de `ContactBand.styles.ts` sí dispara y la
        // fila se apila. Preguntar por `vp.width` era preguntarle al número equivocado.
        if (m.anchoDisponible > 767) {
          expect(m.redesALaIzquierda, 'con dos columnas, las redes quedan a la izquierda del mail').toBe(true);
        } else {
          expect(m.redesALaIzquierda, 'apiladas, las redes no pueden quedar a la izquierda').toBe(false);
        }
      });
    });
  }

  test('el mail está a la derecha en escritorio y a la izquierda en móvil', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect((await medir(page)).mailALaDerecha).toBe(true);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForLoadState('domcontentloaded');
    expect((await medir(page)).mailALaDerecha).toBe(false);
  });

  test('el botón está a la izquierda en escritorio y en móvil', async ({ page }) => {
    for (const vp of [
      { width: 1440, height: 900 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(vp);
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      expect((await medir(page)).botonALaIzquierda).toBe(true);
    }
  });

  test('la banda sigue siendo del alto de una pantalla', async ({ page }) => {
    // specs/027 mueve cosas dentro de la banda. Esto es lo que comprueba que no la movió de alto, y
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

    // Y la frase no es un encabezado, que es lo que mantiene esa cuenta en uno.
    await expect(banda.getByTestId('contact-tagline')).toHaveText(/./);
    expect(await banda.getByRole('heading', { level: 2 }).count()).toBe(1);
  });
});
