import { test, expect, type Page } from '@playwright/test';

/**
 * Every route, visited in a real browser.
 *
 * The rest of this suite visits two of them: `/` and `/projects`. That is not enough, and the reason is
 * that the gaps it left stayed invisible. Four of seven routes had no `<h1>` for as long as the audit
 * reported zero violations, because the audit visited only one route too — and `/` is the route that
 * happens to have one. `specs/018` fixes the headings; this file is what would have caught them.
 *
 * The detail route's id is discovered from the projects page rather than typed in. A repository that is
 * renamed or unpublished would otherwise turn this file into a test that fails for a reason nobody can
 * act on. The 404 route is the one hard-coded path here, because its whole purpose is to be a path that
 * resolves to nothing.
 */
const RUTAS = [
  { ruta: '/', h1: 'Ismael Marot' },
  { ruta: '/about', h1: 'Sobre mí' },
  { ruta: '/projects', h1: 'Proyectos' },
  { ruta: '/technologies', h1: 'Tecnologías' },
  { ruta: '/contact', h1: 'Contacto' },
  { ruta: '/ruta-que-no-existe', h1: '404' },
];

/**
 * Collects a page's console errors and uncaught exceptions so a route's output is asserted on that route.
 *
 * A page can render perfectly and still log an error, and the audit's zero violations would not say so.
 */
function vigilar(page: Page): string[] {
  const errores: string[] = [];
  page.on('pageerror', (error) => errores.push(error.message));
  page.on('console', (mensaje) => {
    if (mensaje.type() === 'error') errores.push(mensaje.text());
  });
  return errores;
}

/** Every heading level on the page, in document order. */
async function nivelesDeHeading(page: Page): Promise<number[]> {
  return page.$$eval('h1,h2,h3,h4,h5,h6', (elementos) =>
    elementos.map((elemento) => Number(elemento.tagName[1]))
  );
}

test.describe('Cada ruta renderiza', () => {
  for (const { ruta, h1 } of RUTAS) {
    test(`${ruta} carga, se nombra y no registra errores`, async ({ page }) => {
      const errores = vigilar(page);

      const respuesta = await page.goto(ruta, { waitUntil: 'networkidle' });

      expect(respuesta?.ok()).toBe(true);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toHaveText(h1);
      await expect(page.locator('main')).toBeVisible();

      /* GitHub Pages serves this site from the account root with no rewrite rule, so a hard load of
         /about is answered by 404.html, which stashes the path in sessionStorage and replays it. If that
         replay ever breaks the visitor lands on the home page instead, and this is what would say so. */
      await expect(page).toHaveURL(new RegExp(`${ruta.replace(/\//g, '\\/')}$`));

      expect(errores).toEqual([]);
    });

    test(`${ruta} tiene un h1 y no salta niveles`, async ({ page }) => {
      await page.goto(ruta, { waitUntil: 'networkidle' });

      const niveles = await nivelesDeHeading(page);

      /* h1 once, and never more than one level below the one before it. An h1 followed straight by an h3
         fails `heading-order` under the same best-practice tag that flags a missing h1, so promoting the
         top heading without demoting its children would trade one violation for another. */
      expect(niveles.filter((nivel) => nivel === 1)).toHaveLength(1);
      expect(niveles[0]).toBe(1);
      for (let i = 1; i < niveles.length; i += 1) {
        expect(niveles[i] - niveles[i - 1]).toBeLessThanOrEqual(1);
      }
    });
  }

  test('el detalle de un proyecto carga y se nombra con el proyecto', async ({ page }) => {
    const errores = vigilar(page);

    await page.goto('/projects', { waitUntil: 'networkidle' });
    const enlace = page.locator('a[href^="/projects/"]').first();
    const href = await enlace.getAttribute('href');
    expect(href, 'the projects page published no project link').toBeTruthy();

    await page.goto(href!, { waitUntil: 'networkidle' });

    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText('trash2treasure');
    await expect(page).toHaveURL(new RegExp(`${href!.replace(/\//g, '\\/')}$`));
    expect(errores).toEqual([]);
  });

  test('el detalle responde con el 404 a un id que no existe', async ({ page }) => {
    await page.goto('/projects/0-no-existe', { waitUntil: 'networkidle' });

    await expect(page.locator('h1')).toHaveText('404');
    await expect(page).toHaveURL(/\/projects\/0-no-existe$/);
  });

  test('la página de proyectos nombra la página con h1 y lista cada proyecto como h2', async ({ page }) => {
    await page.goto('/projects', { waitUntil: 'networkidle' });

    await expect(page.locator('h1')).toHaveText('Proyectos');

    const nombres = await page.$$eval('h2', (elementos) =>
      elementos.map((elemento) => elemento.textContent?.trim() ?? '')
    );
    const enlaces = await page.locator('a[href^="/projects/"]').count();

    /* One h2 per published project, in the published order. Counted against the links the page itself
       renders rather than against a number typed into the test, so a project that appears or disappears
       is caught rather than absorbed. Read from a browser rather than from jsdom: jsdom passes whether or
       not the stylesheet loaded, which is the difference this whole file exists for. */
    expect(nombres).toHaveLength(enlaces);
    expect(nombres).toContain('Cash Counter');
    expect(nombres).toContain('trash2treasure');
  });
});