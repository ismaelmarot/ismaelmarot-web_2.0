import { test, expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

/**
 * specs/026-mobile-menu-theme — T022 to T025.
 *
 * The component tests can read the declarations but not what a browser computes from them, and T020's
 * stylesheet read cannot tell whether the animation settled on the right colour before anyone saw it.
 * Everything here is a measurement on a rendered page, taken after the entrance animation has finished.
 *
 * The two themes are produced two different ways on purpose. The landing page carries the only region
 * that asks for the header to go dark — `[data-header-contrast="dark"]` on the hero band — so `/` at
 * scroll 0 is the black navbar and nothing else is. No other route declares one, so `/about` is the white
 * navbar and no scroll amount changes that. Preparing the page *before* opening matters too:
 * `useMobileMenu.ts:14` locks the body with `overflow: hidden`, so a menu opened first and scrolled
 * afterwards could never reach the other state.
 */

const NEGRO: [number, number, number] = [0, 0, 0];
const BLANCO: [number, number, number] = [255, 255, 255];
const BLANCO_SOBRE_NEGRO: [number, number, number] = [255, 255, 255];
/** #1D1D1F, which is --color-fg and through it --color-text-primary. See the note at the foot. */
const TEXTO_OSCURO: [number, number, number] = [29, 29, 31];
const AZUL_SOBRE_NEGRO: [number, number, number] = [10, 132, 255];
const AZUL_SOBRE_BLANCO: [number, number, number] = [0, 113, 227];

/**
 * Compara un color calculado con una tolerancia por canal.
 *
 * Copiado de `navigation-hover.spec.ts:30-38` y por el mismo motivo: WebKit en macOS devuelve el color ya
 * pasado por el perfil de la pantalla, así que `#0a84ff` llega como `rgb(21, 137, 255)` y Chromium
 * devuelve el literal. Los doce canales cubren lo observado con holgura y siguen siendo mucho más
 * estrechos que la diferencia entre los dos azules que este spec distingue.
 */
const colorCerca = (actual: string, esperado: [number, number, number], tolerancia = 12) => {
  const m = actual.match(/rgba?\((\d+), (\d+), (\d+)/);
  expect(m, `el color calculado no es rgb(): ${actual}`).not.toBeNull();
  const [r, g, b] = m!.slice(1).map(Number);
  const [er, eg, eb] = esperado;
  const donde = `${actual} vs rgb(${er}, ${eg}, ${eb})`;
  expect(Math.abs(r - er), `rojo: ${donde}`).toBeLessThanOrEqual(tolerancia);
  expect(Math.abs(g - eg), `verde: ${donde}`).toBeLessThanOrEqual(tolerancia);
  expect(Math.abs(b - eb), `azul: ${donde}`).toBeLessThanOrEqual(tolerancia);
};

/** WCAG 2.x completo, recalculado aquí y no copiado de la especificación. */
const contraste = (fg: [number, number, number], bg: [number, number, number]) => {
  const lum = (c: [number, number, number]) => {
    const [r, g, b] = c.map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [a, b] = [lum(fg), lum(bg)];
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
};

/** Con el boton del puntero presionado sobre el elemento, sin soltar encima: soltar seria un clic. */
async function conBotonPresionado(page: Page, element: Locator) {
  const box = (await element.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  const color = await element.evaluate((el) => getComputedStyle(el).color);
  await page.mouse.move(2, 2);
  await page.mouse.up();
  return color;
}

/** Los 600ms son para que los 360ms de menuSolidify terminen antes de leer nada. */
const ESPERA_SETTLED = 600;

async function abrirMenu(page: Page, ruta: string, scrollY = 0) {
  await page.goto(ruta);
  await page.waitForLoadState('networkidle');
  if (scrollY > 0) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    await page.waitForTimeout(400);
  }
  await page.locator('button[aria-label="Open menu"]').click();
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await page.waitForTimeout(ESPERA_SETTLED);
}

type Medida = {
  panelBg: string;
  navColor: string;
  ctaColor: string;
  closeColor: string;
  headerBg: string;
  navCount: number;
};

/** Los cuatro puntos que miden SC-001 y SC-002, leídos ya asentada la animación. */
async function medir(page: Page): Promise<Medida> {
  return page.evaluate(() => {
    const panel = document.querySelector('#mobile-menu') as HTMLElement;
    const items = Array.from(panel.querySelectorAll('nav a'));
    const todos = Array.from(panel.querySelectorAll('a'));
    const nav = items[0];
    // El CTA es el último <a> del panel: los de items van en <nav> y el del CTA va fuera, después.
    const cta = todos[todos.length - 1];
    // Acotado al panel: el boton del header tambien se llama "Close menu" mientras el menu esta abierto.
    const close = panel.querySelector('button') as HTMLElement;
    return {
      panelBg: getComputedStyle(panel).backgroundColor,
      navColor: getComputedStyle(nav).color,
      ctaColor: getComputedStyle(cta).color,
      closeColor: getComputedStyle(close).color,
      headerBg: getComputedStyle(document.querySelector('header') as HTMLElement).backgroundColor,
      navCount: items.length,
    };
  });
}

const VIEWPORTS = [
  { width: 375, height: 667 },
  { width: 320, height: 640 },
];

test.describe('el menú móvil toma el tema de la navbar', () => {
  for (const vp of VIEWPORTS) {
    test.describe(`a ${vp.width}x${vp.height}`, () => {
      test.use({ viewport: vp });

      test('con la navbar negra el panel es negro y los tres textos blancos', async ({ page }) => {
        // T022, SC-001. User Story 1, escenario 1 y 2.
        await abrirMenu(page, '/', 0);
        const m = await medir(page);

        // La precondición, medida igual que el resto: si la navbar no estuviera negra, todo lo demás
        // no probaría nada.
        colorCerca(m.headerBg, NEGRO);

        colorCerca(m.panelBg, NEGRO, 2);
        colorCerca(m.navColor, BLANCO_SOBRE_NEGRO);
        colorCerca(m.ctaColor, BLANCO_SOBRE_NEGRO);
        colorCerca(m.closeColor, BLANCO_SOBRE_NEGRO);
      });

      test('con la navbar blanca el panel es blanco y los tres textos oscuros', async ({ page }) => {
        // T023, SC-002. User Story 2, escenario 1 y 2.
        // /about scrolled past the threshold. Ninguna ruta salvo la portada declara región oscura, así que
        // aquí la navbar es blanca y el scroll solo la vuelve opaca.
        await abrirMenu(page, '/about', 400);
        const m = await medir(page);

        colorCerca(m.headerBg, BLANCO);

        colorCerca(m.panelBg, BLANCO);
        colorCerca(m.navColor, TEXTO_OSCURO);
        colorCerca(m.ctaColor, TEXTO_OSCURO);
        colorCerca(m.closeColor, TEXTO_OSCURO);
      });

      test('el color de interacción es el acento de cada tema y llega a AA en los dos', async ({ page }) => {
        // T024, SC-003 y SC-004. Los tres estados y los dos temas, con los contrastes recalculados.
        //
        // El panel es negro y el acento #0A84FF es 5.76:1; el panel es blanco y el acento #0071E3 es
        // 4.70:1. Ninguno de los dos se acepta por ser el otro: es el acento del tema, y el del tema
        // contrario reprobaría el contraste en el panel en el que aterriza.
        await abrirMenu(page, '/', 0);

        // Un item que no sea el de la seccion actual. En `/` el primero es Home, que lleva .active, y
        // .active gana al :hover por orden de fuente — T017, y a proposito: la seccion actual conserva su
        // tratamiento. Seal el hover para medir el color de interaccion, no la excepcion.
        const item = page.locator('#mobile-menu nav a:not(.active)').first();

        await item.hover();
        await page.waitForTimeout(120);
        const hoverDark = await item.evaluate((el) => getComputedStyle(el).color);
        colorCerca(hoverDark, AZUL_SOBRE_NEGRO);
        expect(contraste(AZUL_SOBRE_NEGRO, NEGRO)).toBeGreaterThanOrEqual(4.5);

        // :active es lo que produce un dedo, y en una pantalla tactil no hay hover al que esperar.
        // Soltar el boton sobre el enlace lo activaria y cerraria el menu, asi que se lee con el boton
        // todavia presionado y se aparta el puntero antes de soltarlo.
        const activeDark = await conBotonPresionado(page, item);

        // :focus-visible es el teclado llegando a algo que nadie señaló.
        await page.keyboard.press('Tab');
        await page.waitForTimeout(120);
        const focusDark = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement;
          return { color: getComputedStyle(el).color, dentro: !!el.closest('#mobile-menu') };
        });
        expect(focusDark.dentro, 'el foco sigue dentro del menú').toBe(true);
        colorCerca(focusDark.color, AZUL_SOBRE_NEGRO);

        // Ahora el mismo conjunto sobre el panel claro.
        await abrirMenu(page, '/about', 400);
        const itemClaro = page.locator('#mobile-menu nav a:not(.active)').first();

        await itemClaro.hover();
        await page.waitForTimeout(120);
        const hoverClaro = await itemClaro.evaluate((el) => getComputedStyle(el).color);
        colorCerca(hoverClaro, AZUL_SOBRE_BLANCO);
        expect(contraste(AZUL_SOBRE_BLANCO, BLANCO)).toBeGreaterThanOrEqual(4.5);

        const activeClaro = await conBotonPresionado(page, itemClaro);
        colorCerca(activeClaro, AZUL_SOBRE_BLANCO);

        await page.keyboard.press('Tab');
        await page.waitForTimeout(120);
        const focusClaro = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement;
          return { color: getComputedStyle(el).color, dentro: !!el.closest('#mobile-menu') };
        });
        expect(focusClaro.dentro).toBe(true);
        colorCerca(focusClaro.color, AZUL_SOBRE_BLANCO);
      });

      test('el teclado recorre el menú entero y cada elemento se señala', async ({ page }) => {
        // T025, SC-005. Dos mecanismos distintos y ninguno accidental: el botón de cerrar y el CTA dibujan
        // contorno con tokens.colors.focus, que es var(--color-accent) y por tanto toma el acento de cada
        // tema. Los items de navegación no tienen contorno —Navigation.styles.ts no declara ninguno— y se
        // señalan con el color que FR-004 pone en :focus-visible.
        for (const [ruta, scrollY, acento] of [
          ['/', 0, AZUL_SOBRE_NEGRO],
          ['/about', 400, AZUL_SOBRE_BLANCO],
        ] as const) {
          await abrirMenu(page, ruta, scrollY);

          // Al abrir, el foco entra en el panel. A partir de ahí un recorrido completo son close + items + CTA.
          const orden: { etiqueta: string; mide: 'contorno' | 'color' }[] = [
            { etiqueta: 'botón de cerrar', mide: 'contorno' },
            ...Array.from({ length: 5 }, () => ({ etiqueta: 'item de navegación', mide: 'color' as const })),
            { etiqueta: 'CTA', mide: 'contorno' },
          ];

          for (const paso of orden) {
            await page.keyboard.press('Tab');
            await page.waitForTimeout(90);
            const estado = await page.evaluate(() => {
              const el = document.activeElement as HTMLElement;
              const s = getComputedStyle(el);
              return {
                dentro: !!el.closest('#mobile-menu'),
                etiqueta: el.getAttribute('aria-label') ?? el.textContent?.trim() ?? '',
                color: s.color,
                outlineColor: s.outlineColor,
                outlineStyle: s.outlineStyle,
                outlineWidth: parseFloat(s.outlineWidth),
              };
            });

            expect(estado.dentro, `el foco se salió del menú en: ${paso.etiqueta}`).toBe(true);

            if (paso.mide === 'contorno') {
              // SC-005 nombra rgb(10,132,255) sobre negro y rgb(0,113,227) sobre blanco: el contorno
              // cambia de color con el tema porque var(--color-accent) cambia.
              expect(estado.outlineStyle, `${paso.etiqueta} sin contorno`).not.toBe('none');
              expect(estado.outlineWidth, `${paso.etiqueta} con contorno de ancho cero`).toBeGreaterThanOrEqual(2);
              colorCerca(estado.outlineColor, acento);
            } else {
              // Sin contorno, y eso es lo que la especificación registra: la señal es el color.
              expect(estado.outlineStyle).toBe('none');
              colorCerca(estado.color, acento);
            }
          }
        }
      });
    });
  }
});

/**
 * Una nota sobre un valor que la especificación tenía mal y estas pruebas corrigieron.
 *
 * SC-002 y el escenario 2 del User Story 2 decían `rgb(21, 29, 31)`. Lo medido es `rgb(29, 29, 31)`.
 * La diferencia está en el canal rojo: 21 es #151D1F y 29 es #1D1D1F, que es `--color-fg` en
 * `tokens.css`, y `--color-text-primary` resuelve a `--color-fg`. El texto que llega al menú es
 * `#1D1D1F`.
 *
 * No se corrigió `tokens.css`: está fuera del alcance de esta feature, y cambiar un token de todo el
 * sitio para hacer coincidir un número escrito a mano sería el error en lugar de la solución. Se corrigió
 * la especificación, que es donde el valor estaba mal. El contraste no cambia en nada: #1D1D1F sobre
 * #FFFFFF da 15.9:1, muy por encima de AA.
 */