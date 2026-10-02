# Feature Specification: Apple-Inspired Navbar/Header

**Feature Branch**: `002-apple-inspired-navbar`

**Created**: 2026-10-01

**Status**: Draft

**Input**: User description: "Rediseñar y adaptar el Navbar/Header con estética y comportamiento inspirados en apple.com: minimalista, limpio y premium, responsive (desktop/tablet/mobile), sin copiar literalmente su diseño; tablet progresiva con hamburger cuando los enlaces no quepan; mobile con hamburger y menú animado, accesible por teclado y cierre al seleccionar sección; respetar arquitectura existente (componentes con .tsx/.styles.ts/use*.ts/index.ts, alias @/, styled-components)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navegación desktop minimalista (Priority: P1)

Un visitante en desktop ve un navbar horizontal compacto con el nombre del portfolio, los enlaces principales y el CTA de GitHub, con espaciado generoso y tipografía pequeña/elegante. Al pasar el cursor sobre un enlace cambia sutilmente; el enlace activo se distingue con color de acento.

**Why this priority**: Es la experiencia principal de la mayoría de los visitantes y define el lenguaje visual del rediseño.

**Independent Test**: Abrir el sitio en viewport ≥1024px y verificar estructura horizontal, hover/active sutiles y ausencia de bordes/sombras innecesarios.

**Acceptance Scenarios**:

1. **Given** el sitio en viewport ≥1024px, **When** el usuario observa el header, **Then** ve logo/nombre a la izquierda, enlaces con separación horizontal amplia y tipografía pequeña/mediana.
2. **Given** un enlace, **When** el usuario hace hover, **Then** el cambio de color es sutil y no hay transformaciones llamativas.
3. **Given** una sección activa, **When** el usuario observa el navbar, **Then** el enlace correspondiente se muestra con el color de acento y `aria-current`.

---

### User Story 2 - Navegación tablet progresiva (Priority: P2)

Un visitante en tablet ve el mismo navbar con separación reducida progresivamente; cuando los enlaces dejan de caber correctamente, la navegación se vuelve compacta mostrando un botón hamburger.

**Why this priority**: Evita que los enlaces se compriman o envuelvan de forma incorrecta en anchos intermedios.

**Independent Test**: Redimensionar el viewport entre 768px y 1024px y verificar que la separación se reduce y que el hamburger aparece antes de que los enlaces se corten.

**Acceptance Scenarios**:

1. **Given** viewport tablet, **When** aún hay espacio suficiente, **Then** todos los enlaces se muestran con espaciado reducido.
2. **Given** viewport tablet angosto, **When** los enlaces no caben correctamente, **Then** se ocultan y aparece el botón hamburger.
3. **Given** el hamburger visible, **When** el usuario lo pulsa, **Then** se abre el menú mobile/compacto.

---

### User Story 3 - Navegación mobile con menú hamburger (Priority: P1)

Un visitante en mobile ve solo el nombre del portfolio y un botón hamburger. Al pulsarlo se abre un menú limpio y minimalista que puede cerrarse, cerrarse con Escape, cerrarse al tocar el overlay y cerrarse automáticamente al seleccionar una sección.

**Why this priority**: En mobile no existe otra forma de acceder a las secciones; es crítico para la usabilidad.

**Independent Test**: En viewport <768px, abrir el menú con el botón y con teclado, cerrarlo de las cuatro formas y verificar la transición sutil.

**Acceptance Scenarios**:

1. **Given** viewport <768px, **When** el usuario observa el header, **Then** ve el logo/nombre y el botón hamburger; los enlaces horizontales están ocultos.
2. **Given** el menú cerrado, **When** el usuario pulsa el hamburger, **Then** el menú aparece con una transición sutil y el botón refleja estado expandido (`aria-expanded="true"`).
3. **Given** el menú abierto, **When** el usuario selecciona una sección, **Then** el menú se cierra y la página navega a esa sección.
4. **Given** el menú abierto, **When** el usuario pulsa Escape o toca el overlay, **Then** el menú se cierra.
5. **Given** el botón hamburger, **When** el usuario navega con teclado, **Then** el botón es alcanzable, activable con Enter/Space y muestra `:focus-visible`.

---

### Edge Cases

- ¿Qué ocurre cuando el usuario rota el dispositivo de mobile a tablet con el menú abierto? → El menú debe cerrarse al cruzar el breakpoint.
- ¿Qué ocurre con `prefers-reduced-motion`? → Las transiciones del menú deben reducirse a ~0ms (los tokens ya anulan las duraciones).
- ¿Qué ocurre si el contenido del menú excede la altura de la pantalla? → El contenido del menú debe ser scrollable internamente.
- ¿Qué ocurre al hacer scroll con el menú abierto? → El fondo debe bloquearse para evitar scroll doble.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El header MUST mantener una estructura horizontal con el nombre/logo del portfolio, los enlaces principales y el CTA accesibles en desktop.
- **FR-002**: El navbar MUST ser compacto (altura reducida, aprox. 48–56px), sin bordes ni sombras decorativos; al hacer scroll puede mostrar fondo con blur y separador sutil.
- **FR-003**: Los enlaces MUST tener estados hover y active sutiles (cambio de color, sin subrayados gruesos ni efectos llamativos).
- **FR-004**: En tablet (768–1024px) el espaciado horizontal MUST reducirse progresivamente y la navegación MUST volverse compacta (hamburger) cuando los enlaces no quepan correctamente; no se permite compresión proporcional que degrade la legibilidad.
- **FR-005**: En mobile (<768px) el navbar MUST ocultar los enlaces horizontales y mostrar un botón hamburger.
- **FR-006**: El botón hamburger MUST abrir y cerrar el menú, con estados visuales adecuados (hover, active, focus-visible, aria-expanded).
- **FR-007**: El menú mobile MUST ser minimalista, con transición/animación sutil (≤300ms), cierre por selección de sección, overlay click y tecla Escape.
- **FR-008**: El menú MUST ser navegable por teclado: focus visible, activación con Enter/Space, Escape para cerrar y orden de tabulación lógico.
- **FR-009**: El menú MUST bloquear el scroll del fondo mientras está abierto y el contenido del menú MUST ser scrollable.
- **FR-010**: Al cruzar un breakpoint con el menú abierto, el menú MUST cerrarse.
- **FR-011**: El rediseño MUST respetar los breakpoints existentes (`--bp-mobile: 768px`, `--bp-tablet: 1024px`, `--bp-desktop: 1280px`) y los tokens de diseño existentes (colores, espacio, tipografía, sombras, z-index).
- **FR-012**: El rediseño MUST NOT copiar literalmente el diseño, código ni elementos propietarios de apple.com; solo se toma inspiración de principios (simplicidad, jerarquía, espacio, tipografía pequeña, motion sutil).
- **FR-013**: La arquitectura MUST mantener la convención Componente/{Componente.tsx, Componente.styles.ts, useComponente.ts, index.ts}, styled-components para estilos, lógica en hooks y alias `@/`.
- **FR-014**: El componente MobileMenu existente MUST reutilizarse e integrarse al Header, reestilado al lenguaje Apple.

### Key Entities

- **NavItem**: `{ label, href, external?, ariaLabel? }` — elemento de navegación ya existente en `Header`/`Navigation`.
- **Header**: contenedor sticky/fixed con logo, navegación y CTA.
- **MobileMenu**: diálogo modal con overlay, navegación y CTA; controlado por `isOpen`/`onClose`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El navbar se ve correctamente (sin cortes, solapes ni wrapping de enlaces) en viewports de 360px, 768px, 1024px y 1440px de ancho.
- **SC-002**: En mobile, el usuario puede abrir, navegar y cerrar el menú usando solo el teclado en menos de 10 segundos.
- **SC-003**: En mobile, el menú se cierra en el 100% de los casos al seleccionar una sección, pulsar Escape o tocar el overlay.
- **SC-004**: Las transiciones del menú duran ≤300ms y se reducen a ~0ms con `prefers-reduced-motion`.
- **SC-005**: El hamburger aparece en tablet antes de que cualquier enlace pierda legibilidad (sin texto cortado ni overflow).
- **SC-006**: Los tests existentes de Header/Navigation/MobileMenu se actualizan y pasan; el lint y typecheck del proyecto pasan.

## Assumptions

- Los breakpoints existentes (768/1024/1280) son adecuados y se reutilizan; el paso a navegación compacta en tablet se dispara por falta de espacio real de los enlaces, no por un breakpoint nuevo.
- El componente `MobileMenu` existente se reutiliza y se integra en `Header`; no se crea un menú nuevo.
- La paleta, tipografía (Inter, pesos 400/500/600/700) y tokens actuales ya reflejan la dirección Apple y no se redefinen.
- El CTA de GitHub se mantiene en desktop; en mobile aparece dentro del menú.
- El header actual con blur al hacer scroll (`useHeader`) se conserva como comportamiento base.
