# Data Model: Apple-Inspired Navbar

No hay persistencia ni entidades de negocio. Modelo de UI:

## NavItem
- `label: string` — texto visible del enlace.
- `href: string` — destino (`#seccion` o URL externa).
- `external?: boolean` — abre en nueva pestaña.
- `ariaLabel?: string` — etiqueta accesible opcional.

Reglas: `href` interno debe corresponder a una sección existente del Index (`#about`, `#projects`, `#technologies`, `#contact`); `external=true` implica `target="_blank" rel="noopener noreferrer"`.

## HeaderState
- `isScrolled: boolean` — true cuando `window.scrollY > 20` (existente en `useHeader`).
- `menuOpen: boolean` — controla visibilidad de `MobileMenu`; transición de estado: `closed → open` (hamburger) y `open → closed` (selección de sección, overlay, Escape, cambio de breakpoint).
- `useCompactNav: boolean` — true cuando el ancho disponible no permite mostrar todos los enlaces con legibilidad (tablet angosta y mobile).

## MobileMenuState
- `isOpen: boolean` — controla render/diálogo.
- Responsabilidades ya cubiertas: bloqueo de scroll del body, focus trap, restauración de foco, cierre con Escape.
