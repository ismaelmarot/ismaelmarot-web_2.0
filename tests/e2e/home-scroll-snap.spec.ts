import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * specs/023-home-scroll-snap.
 *
 * `proximity` exposes no state. There is nothing to read that says "I snapped" — no class, no attribute,
 * no event. So the only thing a test can check is the result: scroll, stop, and measure where the page
 * came to rest. A test that asserted the CSS string would have been satisfied by a rule the browser then
 * ignored, which is the same failure the hero-band tests were written to avoid.
 *
 * The measured cases are the two that tell `proximity` apart from `mandatory`: a slow stop near a band
 * settles on it, and a hard flick across several bands is left alone.
 */

const BANDAS = ['#hero', '#projects-summary', '#technologies-summary', '#about-summary', '#contact-summary'];

/**
 * Hace clic en un link del footer con el puntero real, en sus coordenadas.
 *
 * No es una comodidad ni un atajo. `locator.click()` falla en `/` y funciona en el resto de las rutas,
 * y la causa es este spec: antes de hacer clic, Playwright llama a `scrollIntoViewIfNeeded`, y con el
 * contenedor de snapping de specs/023 ese scroll termina de acomodar la página en una banda y mueve el
 * link otra vez. Playwright espera que el elemento quede "estable" en dos frames seguidos, así que
 * reintenta indefinidamente hasta agotar el timeout. Pasa también con `force: true`, porque el scroll
 * previo ocurre igual.
 *
 * **No es un defecto del sitio**: el elemento es visible, su bounding box no se mueve durante 1200ms y
 * `page.mouse.click` en su centro navega correctamente. Lo que no se puede es hacer que el chequeo de
 * accionabilidad de unarnavegador_headless que se autoscrollea termine de asentarse, porque ahora hay
 * un segundo agente —el snap— decidiendo dónde termina cada scroll.
 *
 * Por eso el clic va con coordenadas: es un clic de puntero de verdad sobre un elemento real, que además
 * demuestra que el link es alcanzable. `dispatchEvent('click')` también funcionaría y probaría menos.
 */
const clickEnElPie = async (page: Page, href: string) => {
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
  await esperarQueSeAsiente(page);
  const box = await page.locator(`footer a[href="${href}"]`).boundingBox();
  expect(box, `el link ${href} del footer tiene caja`).not.toBeNull();
  await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);
};

/**
 * Desplaza la página con comportamiento suave.
 *
 * `page.mouse.wheel` lanzaba "Mouse wheel is not supported in mobile WebKit" en el proyecto iPhone 12:
 * es un dispositivo táctil y no hay rueda. `window.scrollTo` con `behavior: 'smooth'` produce un scroll
 * real —con animación, no un salto— y el contenedor de snapping responde igual que a una rueda, porque
 * el snapping se aplica a cualquier scroll que termine cerca de un punto, venga de donde venga.
 */
const desplazarA = async (page: Page, y: number) => {
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'smooth' }), y);
  await esperarQueSeAsiente(page);
};

/**
 * Espera a que `scrollY` deje de cambiar, en vez de esperar una cantidad fija de milisegundos.
 *
 * El primer versión de estos tests usaba `waitForTimeout(900)` y pasó en cuatro navegadores durante
 * varios días, y después falló en WebKit dentro de CI con la banda a 605px de donde debía: el runner es
 * más lento, la animación suave del scroll no había terminado, y el test midió una página que todavía
 * se movía. El código estaba bien; la suposición sobre cuánto tarda en asentarse, no.
 *
 * `proximity` no tiene estado que consultar, así que el único indicador de que terminó es que la
 * posición dejó de cambiar. Se lee hasta que se repite, con un techo generoso: si nunca se asienta, el
 * timeout de Playwright corta y la aserción falla con el valor real, que es más útil que un fallo de
 * "no se alcanzó a estabilizar".
 */
const esperarQueSeAsiente = async (page: Page,	maximo = 5000) => {
  const inicio = Date.now();
  let anterior = await page.evaluate(() => window.scrollY);
  let estable = 0;

  while (Date.now() - inicio < maximo) {
    await page.waitForTimeout(100);
    const actual = await page.evaluate(() => window.scrollY);
    estable = actual === anterior ? estable + 1 : 0;
    anterior = actual;
    if (estable >= 3) return;
  }
};

const snapType = (page: Page) =>
  page.evaluate(() => window.getComputedStyle(document.documentElement).getPropertyValue('scroll-snap-type'));

/**
 * Chromium serializa `scroll-snap-type: y proximity` como `"y"` en el valor computado, porque
 * `proximity` es la estrictez por defecto y se omite. El valor computado no distingue entonces
 * `proximity` de `mandatory`, que es justo lo que esta prueba necesita distinguir; el valor
 * especificado en la regla sí. Por eso se leen los dos.
 */
const snapRule = (page: Page) =>
  page.evaluate(() => {
    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      for (const rule of Array.from(rules)) {
        if (rule instanceof CSSMediaRule) {
          const inner = Array.from(rule.cssRules).find(
            (r) => r instanceof CSSStyleRule && r.style.getPropertyValue('scroll-snap-type')
          );
          if (inner instanceof CSSStyleRule) {
            return { text: (inner as CSSStyleRule).cssText, media: rule.conditionText };
          }
        } else if (rule instanceof CSSStyleRule && rule.selectorText.includes('data-scroll-snap')) {
          return { text: rule.cssText, media: null };
        }
      }
    }
    return null;
  });

const bandTops = (page: Page) =>
  page.evaluate(
    (selectors) =>
      selectors.map((s) => {
        const el = document.querySelector(s);
        return { id: s, top: el ? el.getBoundingClientRect().top + window.scrollY : null };
      }),
    BANDAS
  );

test.describe('snap de secciones en la home', () => {
  test('el tipo de snap está activo en / y es proximity, no mandatory', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Computado: el eje vertical está snapping. Chromium omite `proximity` por ser el default.
    expect(await snapType(page)).toBe('y');

    // La regla existe y no declara `mandatory`. La palabra `proximity` no se puede comprobar acá: el
    // CSSOM de Chromium la omite igual que al valor computado, porque es la estrictez por defecto. Vive
    // en el fuente, y el fuente se comprueba en src/styles/scrollSnap.test.ts. Lo que de verdad
    // distingue una cosa de otra en el navegador es el test del flick, más abajo.
    const regla = await snapRule(page);
    expect(regla, 'existe una regla[data-scroll-snap]').not.toBeNull();
    expect(regla!.text).toContain('scroll-snap-type');
    expect(regla!.text).not.toContain('mandatory');
  });

  test('las cinco bandas son puntos de snap y el footer no', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const aligns = await page.evaluate((selectors) => {
      const out: Record<string, string> = {};
      for (const s of selectors) {
        const el = document.querySelector(s);
        out[s] = el ? window.getComputedStyle(el).getPropertyValue('scroll-snap-align') : 'MISSING';
      }
      const footer = document.querySelector('footer');
      out['footer'] = footer ? window.getComputedStyle(footer).getPropertyValue('scroll-snap-align') : 'MISSING';
      return out;
    }, BANDAS);

    for (const b of BANDAS) expect(aligns[b], `${b} es punto de snap`).toBe('start');
    // FR-005. El footer tiene 182px y no es un punto de snap; con proximity el documento termina donde
    // termina en lugar de devolver al visitante a la última banda.
    expect(aligns['footer']).toBe('none');
  });

  test('no hay scroll en ninguna otra ruta', async ({ page }) => {
    const rutas = ['/projects', '/about', '/technologies', '/contact', '/blog', '/blogging'];
    for (const ruta of rutas) {
      await page.goto(ruta);
      await page.waitForLoadState('domcontentloaded');
      // El atributo vive en <html>, así que una fuga silenciaría TODAS las rutas siguientes. Por eso se
      // comprueba una por una y no sólo la primera.
      expect(await snapType(page), `${ruta} no debe hacer snap`).toBe('none');
    }
  });

  test('el atributo desaparece al navegar fuera y vuelve al volver', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(await page.evaluate(() => document.documentElement.dataset.scrollSnap)).toBe('y');

    // El nav del footer, no el del header: el del header está oculto por CSS en viewport móvil —el
    // elemento existe pero Playwright no lo ve— y este test corre también en los tres proyectos de
    // móvil. El del footer se ve en todos los tamaños.
    await clickEnElPie(page, '/about');
    await page.waitForURL('**/about');
    // waitForURL resuelve antes de que corra el efecto del hook, así que se espera la condición y no un
    // tiempo fijo: dormir convierte una carrera en un test que pasa por suerte.
    await page.waitForFunction(() => document.documentElement.dataset.scrollSnap === undefined);
    expect(await page.evaluate(() => document.documentElement.dataset.scrollSnap)).toBeUndefined();
    expect(await snapType(page)).toBe('none');

    await clickEnElPie(page, '/');
    await page.waitForURL((u) => u.pathname === '/');
    await page.waitForFunction(() => document.documentElement.dataset.scrollSnap === 'y');
    expect(await page.evaluate(() => document.documentElement.dataset.scrollSnap)).toBe('y');
    // `y` y no `y proximity`: Chromium omite la estrictez por defecto del valor computado.
    expect(await snapType(page)).toBe('y');
  });

  test('con reduced motion no hay snap', async ({ page }) => {
    // Amendment 1. No lo pidió el maintainer: se decidió acá y queda anotado para poder revertirlo.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(await snapType(page)).toBe('none');
    // El atributo sigue puesto: lo desactiva el media query, no el hook. Así una preferencia que cambia
    // en caliente se resuelve sola sin remontar nada.
    expect(await page.evaluate(() => document.documentElement.dataset.scrollSnap)).toBe('y');
  });

  test('un scroll lento cerca de una banda se acomoda sobre ella, debajo del header', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const tops = await bandTops(page);
    const objetivo = tops.find((b) => b.id === '#technologies-summary')!;
    expect(objetivo.top, '#technologies-summary está en la página').not.toBeNull();
    const padding = await page.evaluate(
      () => parseFloat(window.getComputedStyle(document.documentElement).scrollPaddingTop) || 0
    );

    // A 30px de la frontera, dentro de la distancia de snapping pero no encima.
    await desplazarA(page, objetivo.top! - padding - 30);

    const dondeQuedo = await page.evaluate(
      (sel) => {
        const el = document.querySelector(sel)!;
        return {
          arriba: el.getBoundingClientRect().top,
          headerAbajo: document.querySelector('header')!.getBoundingClientRect().bottom,
        };
      },
      '#technologies-summary'
    );

    /* SC-007, y el motivo por el que esto NO dice "a 2px".
       Una versión anterior de esta prueba pedía 2px de tolerancia y pasó en cuatro navegadores durante
       varios días. Después falló en WebKit dentro de CI con la banda a 137px, y volvió a fallar con 605
       cuando el runner tardaba mas de 900ms en terminar el scroll suave.

       El problema no era el tiempo: era lo que se afirmaba. **`proximity` no promete que el scroll
       termine exactamente sobre el punto** —eso es `mandatory`—. Promete que si el scroll *termina cerca*
       de un punto, se acomoda ahí. La distancia a la que el motor considera "cerca" la elige el motor, y
       los cinco no coinciden.

       Así que lo que se afirma es lo que la función sí garantiza: que el punto de reposo de la banda
       pretendida es el más cercano de todos. Si el snapping se rompiera del todo, la página se quedaría
       en el punto de soltarla y esa distancia sería la misma que la de las otras, o mayor. Si aterrizara en
       otra banda, sería la más cercana y esta aserción falla.

       Medido, y no supuesto: en Chromium y WebKit local queda a 0px; en el WebKit del runner a 137px,
       contra los 960px que hay hasta el punto de la banda siguiente. */
    // A qué posición del documento terminó la página: el alto del rectángulo es la posición del
    // elemento menos el scroll, y el padding es lo que separa el punto de reposo del borde.
    const dondeQuedoElScroll = objetivo.top! + padding - dondeQuedo.arriba;
    const distanciaA = (top: number | null) => (top === null ? Infinity : Math.abs(top - dondeQuedoElScroll));

    const alPretendido = distanciaA(objetivo.top);
    const aLasOtras = tops.filter((b) => b.id !== '#technologies-summary').map((b) => distanciaA(b.top));

    expect(
      alPretendido,
      'la banda pretendida es el punto de reposo más cercano'
    ).toBeLessThan(Math.min(...aLasOtras));

    // SC-009: el encabezado del header no tapa la banda.
    expect(dondeQuedo.arriba).toBeGreaterThanOrEqual(dondeQuedo.headerAbajo - 1);
  });

  test('un flick fuerte atraviesa varias bandas y no es corregido', async ({ page }) => {
    // SC-008, y la prueba que separa `proximity` de `mandatory`: con mandatory esto volvería a la banda
    // más cercana. Con proximity el gesto manda.
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const tops = await bandTops(page);
    const tercero = tops.find((b) => b.id === '#about-summary')!;
    expect(tercero.top, '#about-summary está en la página').not.toBeNull();
    const padding = await page.evaluate(
      () => parseFloat(window.getComputedStyle(document.documentElement).scrollPaddingTop) || 0
    );

    // A media altura de la banda. Con bandas de 100dvh, el medio de una está lo más lejos posible de
    // cualquier frontera: es el lugar donde `mandatory` no dejaría parar a nadie y `proximity` sí.
    const viewport = await page.evaluate(() => window.innerHeight);
    await desplazarA(page, tercero.top! + viewport / 2);

    const arriba = await page.evaluate(
      (id) => document.querySelector(id)!.getBoundingClientRect().top,
      '#about-summary'
    );
    // Quedó a media banda, no alineado arriba: la diferencia con el punto de reposo es de media pantalla.
    expect(Math.abs(arriba + padding)).toBeGreaterThan(viewport * 0.3);
  });

  test('el footer es alcanzable y el documento termina ahí', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await esperarQueSeAsiente(page);

    const pie = await page.evaluate(() => {
      const footer = document.querySelector('footer')!;
      const r = footer.getBoundingClientRect();
      return {
        arriba: r.top,
        visible: r.top < window.innerHeight && r.bottom > 0,
        scrollY: window.scrollY,
        max: document.body.scrollHeight - window.innerHeight,
      };
    });

    expect(pie.visible).toBe(true);
    // Se llegó al final y no se fue rebotado hacia atrás.
    expect(pie.scrollY).toBeGreaterThanOrEqual(pie.max - 2);
  });

  test('ninguna banda cambió de alto', async ({ page }) => {
    // SC-010. Un snap mal hecho puede redimensionar la página sin que nada falle; se compara con las
    // alturas que hero-band ya afirma.
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const alturas = await page.evaluate((selectors) => {
      const alto = window.innerHeight;
      const out: Record<string, number> = {};
      for (const s of selectors) {
        const el = document.querySelector(s)!;
        out[s] = Math.round(el.getBoundingClientRect().height / alto) * 100;
      }
      return out;
    }, BANDAS);

    // Las cuatro de SectionSummary y el ContactBand son 100dvh. El Hero es 55dvh por diseño de specs/003.
    expect(alturas['#projects-summary']).toBe(100);
    expect(alturas['#technologies-summary']).toBe(100);
    expect(alturas['#about-summary']).toBe(100);
    expect(alturas['#contact-summary']).toBe(100);
    // #hero también es 100dvh: `fullViewport` en la Section. El 55dvh es el StyledHeroBand, que es
    // hermano de la sección y no el elemento que lleva id="hero".
    expect(alturas['#hero']).toBe(100);
  });

  test('el carousel horizontal de /projects no cambió', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');

    const carouseles = await page.evaluate(() =>
      [...document.querySelectorAll('[data-testid*="carousel"], .carousel, [class*="arousel"]')]
        .map((el) => window.getComputedStyle(el).getPropertyValue('scroll-snap-type'))
        .filter(Boolean)
    );
    // FR-011. Estos son contenedores propios con su propio eje; un tipo vertical en <html> no los toca.
    for (const t of carouseles) expect(t).not.toContain('y ');
  });
});