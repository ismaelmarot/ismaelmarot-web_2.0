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
 */
async function servir() {
  const servidor = createServer(async (peticion, respuesta) => {
    const ruta = normalize(decodeURIComponent((peticion.url ?? '/').split('?')[0]));
    // `normalize` collapses `..`, and the prefix check rejects anything that climbed above dist, so a
    // crafted path cannot read outside the directory being served.
    const relativa = ruta === '/' ? 'index.html' : ruta.replace(/^\/+/, '');
    const completa = join(process.cwd(), 'dist', relativa);
    if (!completa.startsWith(join(process.cwd(), 'dist'))) {
      respuesta.writeHead(403).end();
      return;
    }
    try {
      const cuerpo = await readFile(completa);
      respuesta.writeHead(200, { 'content-type': TIPOS[extname(completa)] ?? 'application/octet-stream' });
      respuesta.end(cuerpo);
    } catch {
      respuesta.writeHead(404).end();
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
      await page.goto(ORIGEN, { waitUntil: 'networkidle' });

      const resultados = await new AxeBuilder({ page })
        .withTags(['wcag2aa', 'wcag21aa', 'best-practice'])
        .analyze();

      const total = resultados.violations.length;
      violaciones += total;
      console.log(`${vp.nombre} ${vp.width}x${vp.height}: ${total} violaciones`);

      for (const v of resultados.violations) {
        console.log(`  ${v.impact ?? 'sin impacto'}: ${v.id} — ${v.help}`);
        for (const nodo of v.nodes.slice(0, 3)) console.log(`    ${nodo.target.join(' ')}`);
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