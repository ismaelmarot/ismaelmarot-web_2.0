/**
 * The accessibility audit, run through Playwright rather than through axe-cli.
 *
 * axe-cli resolves a chromedriver at run time and the one it reaches for is pinned to a Chrome major
 * version of its own. On CI the runner installed Chrome 153 from Playwright while that driver
 * announced it "only supports Chrome 155", so the job died with SessionNotCreatedError before auditing
 * anything. Pinning CHROME_PATH to Playwright's Chromium does not help: the mismatch is between the
 * driver axe-cli downloads and whatever browser it launches, not between a path variable and a browser.
 *
 * Driving the audit through Playwright removes the second tool. The browser is the one this repository
 * already installs and already tests against, so there is nothing left to keep in step with.
 *
 * `@axe-core/playwright` is already on disk as a dependency of `@axe-core/cli`, so this adds nothing to
 * package.json.
 *
 * Every route is audited, not one. The audit used to visit only `/`, and reported "0 violaciones" with
 * the confidence of a full-site report. It was not one: four of the seven routes had no `<h1>` at all,
 * which is `page-has-heading-one` under the `best-practice` tag this file already enables, and the only
 * route audited was the one that happened to satisfy it. The gap went unnoticed because an audit that
 * visits one page looks exactly like an audit that finds nothing on any page. `specs/018` records it.
 */

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const PUERTO = 4173;
const ORIGEN = `http://localhost:${PUERTO}`;

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.map': 'application/json',
};

/**
 * Serve `dist` the way the preview server does, on the same port, from this process.
 *
 * In-process rather than a backgrounded `http-server` with a `sleep 3` next to it. A fixed sleep before
 * an audit is a race that only ever fails on a loaded runner, and the audit is the thing that is meant
 * to be measuring the page rather than measuring how long a server takes to bind.
 *
 * A path with no file extension is a client-side route, not a missing file. `dist/` holds `index.html`,
 * `404.html`, `assets/` and `favicon.svg`, and nothing at `/about`, because the site is history-routed.
 * Without this fallback the audit would serve an empty body for every route but the root, measure the
 * empty page seven times and report it clean. The rule mirrors what `public/404.html` does in the
 * browser: stash the path, serve the app, let the router resolve it.
 */
async function servir() {
  const servidor = createServer(async (peticion, respuesta) => {
    const ruta = normalize(decodeURIComponent((peticion.url ?? '/').split('?')[0]));
    // `normalize` collapses `..`, and the prefix check rejects anything that climbed above dist, so a
    // crafted path cannot read outside the directory being served.
    const relativa = ruta === '/' ? 'index.html' : ruta.replace(/^\/+/, '');
    let completa = join(process.cwd(), 'dist', relativa);
    if (!completa.startsWith(join(process.cwd(), 'dist'))) {
      respuesta.writeHead(403).end();
      return;
    }
    try {
      const cuerpo = await readFile(completa);
      respuesta.writeHead(200, { 'content-type': TIPOS[extname(completa)] ?? 'application/octet-stream' });
      respuesta.end(cuerpo);
    } catch {
      // No extension means the visitor asked for a route, not for an asset. Serve the app and let the
      // client router answer. A path that does carry an extension really is a missing file.
      if (extname(relativa) !== '') {
        respuesta.writeHead(404).end();
        return;
      }
      try {
        respuesta.writeHead(200, { 'content-type': TIPOS['.html'] });
        respuesta.end(await readFile(join(process.cwd(), 'dist', 'index.html')));
      } catch {
        respuesta.writeHead(404).end();
      }
    }
  });

  await new Promise((resolver) => servidor.listen(PUERTO, resolver));
  return servidor;
}

/** The viewports the audit runs at, matching the ones the browser tests use. */
const VIEWPORTS = [
  { nombre: 'desktop', width: 1440, height: 900 },
  { nombre: 'tablet', width: 768, height: 1024 },
  { nombre: 'movil', width: 390, height: 844 },
  { nombre: 'movil pequeno', width: 320, height: 640 },
];

/**
 * Every route, each with the `<h1>` it must carry.
 *
 * The expected heading is asserted because an audit that reports a page's contents without saying which
 * page it is reading is not a report. `/projects/:id` is discovered from the projects page rather than
 * written down, so a renamed or unpublished repository does not turn this into a failure nobody can act
 * on. `/ruta-que-no-existe` is deliberate: the catch-all is a real page and is audited like one.
 */
const RUTAS = [
  { nombre: 'home', ruta: '/', h1: 'Ismael Marot' },
  { nombre: 'about', ruta: '/about', h1: 'Sobre mí' },
  { nombre: 'projects', ruta: '/projects', h1: 'Proyectos' },
  { nombre: 'technologies', ruta: '/technologies', h1: 'Tecnologías' },
  { nombre: 'contact', ruta: '/contact', h1: 'Contacto' },
  { nombre: '404', ruta: '/ruta-que-no-existe', h1: '404' },
];

async function main() {
  const servidor = await servir();
  const navegador = await chromium.launch();
  let violaciones = 0;

  try {
    for (const vp of VIEWPORTS) {
      const contexto = await navegador.newContext({
        viewport: { width: vp.width, height: vp.height },
      });
      const page = await contexto.newPage();

      // The detail route is resolved once per viewport from the page that publishes it.
      const detalle = await page
        .goto(`${ORIGEN}/projects`, { waitUntil: 'networkidle' })
        .then(async () => {
          const href = await page.locator('a[href^="/projects/"]').first().getAttribute('href');
          if (!href) return null;
          const nombre = await page.locator('h2').first().textContent();
          return { nombre: `detalle ${href}`, ruta: href, h1: nombre?.trim() ?? '' };
        })
        .catch(() => null);

      const rutas = detalle ? [...RUTAS, detalle] : RUTAS;

      for (const { nombre, ruta, h1 } of rutas) {
        await page.goto(ORIGEN + ruta, { waitUntil: 'networkidle' });

        // The heading is checked before axe runs, so a route that silently rendered the wrong page is
        // reported as a routing failure rather than audited and found healthy. The text is compared, not
        // only its presence: a page that answered /contact with the home page has an h1 too.
        const encabezado = await page
          .locator('h1')
          .first()
          .textContent()
          .catch(() => null);
        const esperado = encabezado?.trim() ?? '';
        if (esperado !== h1) {
          console.log(
            `${nombre} ${vp.nombre} ${vp.width}x${vp.height}: h1 inesperado ${JSON.stringify(esperado)}, se esperaba ${JSON.stringify(h1)}`
          );
          violaciones += 1;
          continue;
        }

        const resultados = await new AxeBuilder({ page })
          .withTags(['wcag2aa', 'wcag21aa', 'best-practice'])
          .analyze();

        const total = resultados.violations.length;
        violaciones += total;
        console.log(`${nombre} ${vp.nombre} ${vp.width}x${vp.height}: ${total} violaciones`);

        for (const v of resultados.violations) {
          console.log(`  ${v.impact ?? 'sin impacto'}: ${v.id} — ${v.help}`);
          for (const nodo of v.nodes.slice(0, 3)) console.log(`    ${nodo.target.join(' ')}`);
        }
      }

      await contexto.close();
    }
  } finally {
    await navegador.close();
    servidor.close();
  }

  if (violaciones > 0) {
    console.error(`\n${violaciones} violaciones de accesibilidad.`);
    process.exit(1);
  }
  console.log('\n0 violaciones.');
}

await main();