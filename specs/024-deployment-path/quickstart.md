# Quickstart: Desplegar

Cómo llevar un cambio de este repositorio al sitio publicado, y cómo comprobar que llegó.

El workflow que hace esto **no está en este repositorio**: vive en
`ismaelmarot/ismaelmarot.github.io/.github/workflows/deploy.yml`. Lee el `main` de este repositorio,
construye y publica. Ver [spec.md](./spec.md) para por qué está repartido así.

---

## Lo primero: un push no despliega

**Publicar no es parte del CI de este repositorio.** El CI tiene seis jobs — Lint, TypeCheck, Tests,
Build, E2E Tests, Accessibility — y ninguno publica nada.

Desplegar pasa por el workflow del otro repositorio, que se dispara de tres formas:

| Disparador | Frecuencia | Cuándo se usa |
|---|---|---|
| `schedule: 15 */4 * * *` | cada 4 horas | solo para refrescar los datos del calendario |
| `workflow_dispatch` | a mano | **este documento** |
| `push` al `main` del destino | nunca | nadie pushea a un repo de salida |

**El cron no es un disparador de código.** Existe porque el calendario de contribuciones compara cada
celda contra la fecha del visitante y se envejece solo. Si se espera que el código salga en el próximo
tick, puede tardar hasta cuatro horas.

**Para esto, usar `workflow_dispatch`.**

---

## Desplegar ahora

```bash
gh workflow run deploy.yml --repo ismaelmarot/ismaelmarot.github.io
```

Esperar y ver el resultado:

```bash
gh run watch $(gh run list --repo ismaelmarot/ismaelmarot.github.io --limit 1 \
  --json databaseId -q '.[0].databaseId')
```

Tarda entre 1 y 2 minutos. Los pasos son: checkout de la fuente → `npm ci` → `fetch:github` →
`npm run build` → `upload-pages-artifact` → `deploy-pages`.

**Nota**: `fetch:github` corre en cada despliegue, así que un despliegue manual también refresca el
calendario. No hay forma de desplegar el código sin refrescar los datos.

---

## Comprobar que llegó

**El workflow no verifica nada después de publicar.** Termina en `deploy-pages` y no vuelve a mirar el
sitio. Todo lo de abajo es manual, y por eso hay que hacerlo.

Un run en verde dice que el workflow terminó. **No dice que se esté sirviendo lo correcto**: una
página cacheada o un despliegue viejo pasan ese chequeo igual.

### 1. El bundle publicado contiene el cambio

Esto es el que de verdad importa. Un despliegue viejo pasa todo lo demás.

```bash
# El CSS publicado
CSS=$(curl -s https://ismaelmarot.github.io/ | grep -oE '/assets/index-[A-Za-z0-9_-]+\.css')
curl -s "https://ismaelmarot.github.io$CSS" | grep -o 'scroll-snap-type:[^;}]*'
```

Debe imprimir `scroll-snap-type:y proximity`. Si no aparece, el despliegue no llegó.

Para un cambio puntual, buscar en el bundle la cadena que ese cambio introduce:

```bash
JS=$(curl -s https://ismaelmarot.github.io/ | grep -oE '/assets/index-[A-Za-z0-9_-]+\.js')
curl -s "https://ismaelmarot.github.io$JS" | grep -c '0a84ff'
```

### 2. La home carga

```bash
curl -s https://ismaelmarot.github.io/ | grep -oE '/assets/index-[A-Za-z0-9_-]+\.(js|css)'
```

Deben salir dos rutas con el mismo hash que las de arriba. Si el hash del CSS no coincide entre pasos,
se está sirviendo otra versión.

### 3. Una ruta profunda funciona

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://ismaelmarot.github.io/contact
```

**Devuelve `404`. Y está bien.** No es una falla: GitHub Pages no tiene regla de reescritura para una app
con history routing, así que sirve `404.html`, que guarda la ruta en `sessionStorage` y hace
`location.replace('/')`. El script en el `<head>` de `index.html` la reproduce antes de que arranque el
router.

Para comprobarlo de verdad hay que abrir un navegador, no usar `curl`:

```
https://ismaelmarot.github.io/contact   →  <h1>Contacto</h1>
```

Un `404` con `curl` y un 404 abierto en el navegador son cosas distintas. El primero es lo esperado.

### 4. Lo que se rompió no está

Si el cambio quitaba algo, comprobar que no quedó:

```bash
curl -s "https://ismaelmarot.github.io$JS" | grep -c 'link-hover-decoration'
```

Debe dar `0`.

---

## Cuando algo falla

**El run del deploy está en rojo.** Ver el log:

```bash
gh run view <id> --repo ismaelmarot/ismaelmarot.github.io --log-failed
```

Lo más frecuente es `Fetch GitHub data`: el token automático puede estar limitado por cuota de la API. El
sitio sigue sirviendo la versión anterior, que es mejor que no servir nada.

**El run está verde pero el sitio no cambió.** Casi siempre es caché de CDN. Repetir el chequeo del paso 1
con el query string de la URL, y esperar unos minutos.

**Un despliegue quedó con el `main` viejo.** El workflow lee `ref: main` **cuando arranca**, no cuando se
programó. Con `cancel-in-progress: false` los runs se encolan, así que uno que esperó publica el `main`
de ese momento. Comparar la hora del commit con la hora del run:

```bash
gh run list --repo ismaelmarot/ismaelmarot.github.io --limit 5 \
  --json createdAt,conclusion -q '.[]|"\(.createdAt) \(.conclusion)"'
```

**Nunca hubo despliegue y esperabas uno.** El cron no es un disparador de código. Ver arriba.

---

## Cosas que parecen fallas y no lo son

**El repo de destino tiene archivos que el sitio no sirve.** Su raíz tiene un `index.html` y un `im_web/`
de un sitio estático escrito a mano. Está commiteado y **nunca se sirve**, porque `build_type` es
`workflow`: Pages usa el artefacto que sube el workflow, no la rama.

**El único modo de que ese sitio viejo salga en vivo es cambiar la configuración de Pages para servir
desde la rama.** Nada fallaría: el workflow seguiría dando verde mientras sirve otro sitio. El primero en
darse cuenta sería un visitante. Ver [spec.md](./spec.md).

**El cron tarda más de cuatro horas.** GitHub encola los workflows programados. En este repo se midieron
inicios a las 08:37Z, 09:44Z, 09:55Z, 10:28Z y 10:40Z contra un `03:15` declarado.

**`main` no tiene protección de rama**, y el deploy lee `main`. Nada impide que un push en rojo se
publique. Comprobar el CI antes de desplegar:

```bash
gh run list --limit 1 --json conclusion -q '.[0].conclusion'
```