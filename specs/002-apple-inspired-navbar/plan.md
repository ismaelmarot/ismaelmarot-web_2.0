# Implementation Plan: Apple-Inspired Navbar/Header

**Branch**: `002-apple-inspired-navbar` | **Date**: 2026-10-01 | **Spec**: [specs/002-apple-inspired-navbar/spec.md](../spec.md)

**Input**: Feature specification from `/specs/002-apple-inspired-navbar/spec.md`

## Summary

Rediseñar el Navbar/Header del portfolio con lenguaje minimalista inspirado en Apple (sin copiarlo): estructura horizontal compacta en desktop, reducción progresiva de espaciado en tablet con fallback a hamburger cuando los enlaces no quepan, y navegación mobile con hamburger + menú (reutilizando `MobileMenu`) animado, accesible y con cierre por selección/Escape/overlay. Se respetan los breakpoints y tokens existentes y la arquitectura por componente.

## Technical Context

**Language/Version**: TypeScript 5.5, React 18.3, Vite 5
**Primary Dependencies**: styled-components 6, react-router (no aplica; anchors `#`), Vitest + Testing Library, Playwright
**Storage**: N/A (sitio estático)
**Testing**: `npm run test` (vitest), `npm run typecheck`, `npm run lint`, `npm run test:e2e`
**Target Platform**: Web (browser moderno), responsive 360–1536px
**Project Type**: Web app estática (Vite SPA de una página)
**Performance Goals**: Nav interactivo <16ms/frame, LCP <2.5s sin regresión, sin CLS al abrir/cerrar menú
**Constraints**: styled-components obligatorio, alias `@/`, breakpoints existentes 768/1024/1280, reduced-motion respetado
**Scale/Scope**: 1 página (`Index`), 3 layout components (Header, Navigation, MobileMenu), 4 enlaces + 1 CTA

## Constitution Check

- I. Component-First: ✅ se modifica Header/MobileMenu/Navigation manteniendo un componente por carpeta.
- II. Type Safety: ✅ props tipadas, contratos actualizados.
- III. Testing: ✅ se actualizan/añaden tests de Header, MobileMenu, Navigation.
- IV. Accessibility & Performance: ✅ foco en aria-expanded, focus trap (ya existe en `useMobileMenu`), reduced motion, transiciones ≤300ms.
- V. Design Principles: ✅ inspiración Apple sin copia literal.
- VI. Simplicity: ✅ sin dependencias nuevas; se reutiliza `MobileMenu` y tokens.
- Styling/styled-components/aliases: ✅.

**Gate result**: PASS.

## Project Structure

```text
src/
├── components/layout/
│   ├── Header/            # Header.tsx, Header.styles.ts, useHeader.ts, Header.test.tsx, index.ts
│   ├── Navigation/        # Navigation.tsx, Navigation.styles.ts, useNavigation.ts, Navigation.test.tsx, index.ts
│   ├── MobileMenu/        # MobileMenu.tsx, MobileMenu.styles.ts, useMobileMenu.ts, MobileMenu.test.tsx, index.ts
│   └── SkipLink/, Footer/
├── styles/                # tokens.css, tokens.ts, globals.css (sin cambios esperados)
└── pages/Index.tsx        # sin cambios (API de Header se mantiene)
```

**Structure Decision**: Se reutiliza la estructura existente de `components/layout/`; no se crean carpetas nuevas ni se duplica arquitectura.

## Complexity Tracking

Sin violaciones de constitución; tabla no aplica.
