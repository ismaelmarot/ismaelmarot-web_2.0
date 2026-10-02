# Phase 0 Research: Apple-Inspired Navbar

## Decision: Reutilizar breakpoints existentes (768/1024/1280)
- **Rationale**: `tokens.css` ya define `--bp-mobile/tablet/desktop`; no hay evidencia de que deban cambiarse. El cambio desktop→compacto se dispara por espacio real de enlaces, no por un cuarto breakpoint.
- **Alternatives considered**: introducir breakpoint intermedio (~900px) — rechazado por YAGNI y porque el requisito es progresividad, no un salto binario.

## Decision: Fallback a hamburger por falta de espacio (no por ancho fijo) en tablet
- **Rationale**: Garantiza que los enlaces nunca se corten ni pierdan legibilidad; coincide con FR-004 y criterio SC-005. Se implementa con matchMedia como aproximación + CSS que oculta links solo cuando el contenedor no los contiene (guard en `useHeader` con ResizeObserver del contenedor opcional; mínimo viable: matchMedia en 768 y medición en resize).
- **Alternatives considered**: hamburger directo en todo tablet (768–1024) — rechazado porque desperdicia espacio en tablets anchas.

## Decision: Reutilizar `MobileMenu` existente
- **Rationale**: Ya implementa overlay, focus trap, Escape, scroll lock y restauración de foco (`useMobileMenu.ts`). Encaja con la convención de arquitectura y evita duplicación.
- **Alternatives considered**: menú nuevo — rechazado por KISS.

## Decision: Estilos solo styled-components en `*.styles.ts`
- **Rationale**: Constitución y convención del proyecto lo exigen; Tailwind/CSS Modules prohibidos.

## Decision: Tokens existentes como única fuente de verdad
- **Rationale**: colores, sombras reducidas, z-index, transiciones (`--transition-fast 120ms`, `--transition-normal 200ms`) y reduced-motion ya están definidos; no se agregan tokens salvo necesidad.

## Decision: Animación del menú ≤200–300ms y reduced-motion
- **Rationale**: Cumple SC-004; los tokens ya anulan duraciones con `prefers-reduced-motion`.

## Unknowns resueltos

Ningún NEEDS CLARIFICATION pendiente del spec.
