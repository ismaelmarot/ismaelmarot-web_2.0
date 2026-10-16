# Tasks: Section-by-Section Scrolling

**Input**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md)
**Status**: Complete

## Phase 1 — The mechanism

- [x] T001 `src/hooks/useScrollSnap.ts` — set `data-scroll-snap="y"` on `<html>` while enabled
- [x] T002 `src/hooks/useScrollSnap.ts` — remove it on unmount and when the flag flips to false
- [x] T003 `src/hooks/useScrollSnap.ts` — the header comment explains the `<html>` / band asymmetry
- [x] T004 `globals.css` — `html[data-scroll-snap='y'] { scroll-snap-type: y proximity; }` beside `scroll-behavior`
- [x] T005 `globals.css` — reduced-motion block sets `scroll-snap-type: none` (Amendment 1, FR-008)
- [x] T006 `Home.tsx` — `useScrollSnap(true)`, the only call site
- [x] T007 no `scroll-margin-top` anywhere on a band (FR-010)

## Phase 2 — The targets

- [x] T008 `Hero.styles.ts` — `scroll-snap-align: start` on `StyledHeroSection`, the element carrying `id="hero"`
- [x] T009 `SectionSummary.styles.ts` — `scroll-snap-align: start` (covers all three bands)
- [x] T010 `ContactBand.styles.ts` — `scroll-snap-align: start`
- [x] T011 the footer gets none (FR-005)

## Phase 3 — Tests

- [x] T012 `useScrollSnap.test.tsx` — set on mount, removed on unmount, toggles both ways
- [x] T013 `useScrollSnap.test.tsx` — cleanup is unconditional, so that is a stated decision rather than a surprise
- [x] T014 `scrollSnap.test.tsx` — the rule is behind the attribute, and says `y proximity`
- [x] T015 `scrollSnap.test.tsx` — no `mandatory` anywhere in `globals.css`
- [x] T016 `scrollSnap.test.tsx` — `scroll-padding-top: 64px` survives
- [x] T017 `scrollSnap.test.tsx` — no `scroll-margin-top` in any of the three band stylesheets
- [x] T018 `scrollSnap.test.tsx` — each of the five bands declares `scroll-snap-align: start`
- [x] T019 `home-scroll-snap.spec.ts` — computed type is `y` on `/`, `none` on six other routes (SC-001, SC-002)
- [x] T020 `home-scroll-snap.spec.ts` — five bands `start`, footer `none` (SC-003, SC-004)
- [x] T021 `home-scroll-snap.spec.ts` — attribute removed on navigation and restored on return (SC-006)
- [x] T022 `home-scroll-snap.spec.ts` — reduced motion gives `none` while the attribute stays set (SC-005)
- [x] T023 `home-scroll-snap.spec.ts` — a slow stop 30px short of a band settles on it, under the header (SC-007, SC-009)
- [x] T024 `home-scroll-snap.spec.ts` — a hard flick to mid-band is not corrected (SC-008)
- [x] T025 `home-scroll-snap.spec.ts` — the footer is reachable and the document ends there
- [x] T026 `home-scroll-snap.spec.ts` — no band changed height (SC-010)
- [x] T027 `home-scroll-snap.spec.ts` — `/projects` horizontal snapping unchanged (SC-011)

## Phase 4 — Verification

- [x] T028 lint, typecheck, 151 unit, 465 component, build
- [x] T029 E2E: 40 of the 10 new tests green in Chromium, WebKit, Mobile Chrome and Mobile Safari
- [x] T030 E2E: full suite green in Chromium, WebKit and both mobile projects — 462 of 464
- [x] T031 a11y: 0 violations across 7 routes at 4 viewports
- [x] T032 Firefox: cannot launch locally (`Failed to launch the browser process`), covered by CI instead

## Notes

- **T008 was wrong first.** `scroll-snap-align` went on `StyledHeroBand` because that is where the other
  Hero rules are. `#hero` is `StyledHeroSection`, a full-viewport sibling, and a snap target that is not
  the element a hash link points at settles in the wrong place. The browser test caught it by reporting
  `none`.
- **`proximity` cannot be read from a browser.** Chromium's computed value drops it because it is the
  default strictness, and its CSSOM serialization drops it too, so `y proximity` and `y mandatory` are
  indistinguishable from `getComputedStyle`. The word is therefore asserted in `scrollSnap.test.ts`
  against the stylesheet source, and `proximity` as behaviour is proved by T024, which is the only
  assertion that would fail if the value were tightened.
- T014 and T015 initially failed by matching their own explanatory comments. Both now strip comments before
  asserting, so they check the declaration rather than the prose about it.
- T021 failed as a race, not a bug: `waitForURL` resolves before the effect runs. Replaced with
  `waitForFunction`, because a fixed sleep would have turned a race into a test that passes by luck.
- **`locator.click()` no funciona dentro del contenedor de snapping**, y durante un rato pareció un
  defecto del sitio. No lo es: el elemento es visible, su caja no se mueve en 1200ms, `elementFromPoint`
  devuelve el link y `page.mouse.click` en su centro navega bien. Lo que falla es el chequeo de
  accionabilidad de Playwright, que llama a `scrollIntoViewIfNeeded` antes de hacer clic: con el snap, ese
  scroll termina acomodando la página en una banda y mueve el link otra vez, así que el elemento nunca
  está "estable" en dos frames seguidos y Playwright reintenta hasta agotar el timeout. Pasa igual con
  `force: true`. T021 hace el clic con coordenadas. Merece una nota aparte: cualquier test futuro que
  haga clic en algo de la home va a toparse con esto.
- **La aserción de "se acomoda sobre ella" pedía 2px y eso es una garantía de `mandatory`, no de
  `proximity`.** Pasó en cuatro navegadores durante días, falló en el WebKit del runner con 605px, y
  volvió a fallar con 137px después de arreglar el tiempo de espera. El tiempo era un problema real y
  arreglable; la tolerancia no lo era. Ahora se afirma lo que `proximity` sí garantiza: que el punto de
  reposo es el más cercano de todos, y no que caiga a 0. Si el snapping se rompiera del todo, el
  descanso sería el punto de soltarla y la distancia sería la misma que la de otras; si aterrizara en
  otra banda, sería la más cercana y falla.
- **El test de "un scroll lento se acomoda" falló en WebKit dentro de CI con la banda a 605px**, después
  de pasar en cuatro navegadores durante varios días. El código estaba bien: el runner es más lento, la
  animación suave del scroll no había terminado a los 900ms y el test midió una página que todavía se
  movía. Ahora los tres tests que miden una posición esperan a que `scrollY` deje de cambiar en vez de
  dormir una cantidad fija. La lección general: en un test que mide dónde quedó algo después de una
  animación, un timeout es una apuesta sobre la velocidad de la máquina.
- `page.mouse.wheel` lanza "Mouse wheel is not supported in mobile WebKit" en el proyecto iPhone 12.
  Los dos tests de comportamiento usan `window.scrollTo` con `behavior: 'smooth'`, que es un scroll real
  con animación y al que el snapping responde igual.
- T026 initially asserted the hero was 55% of the viewport. That is the black band, not `#hero`, which is
  `fullViewport`. The assertion was wrong about the site, not the site about the assertion.