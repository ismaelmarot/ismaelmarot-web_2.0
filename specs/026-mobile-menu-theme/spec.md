# Feature Specification: The Mobile Menu Takes the Header's Theme

**Feature Branch**: `026-mobile-menu-theme`

**Created**: 2026-10-16

**Status**: Draft

**Input**: User description: "Quiero ajustar el menú desplegable mobile de la navbar: el menú debe adaptar
sus colores al tema visual de la barra superior. Navbar con fondo negro: menú con fondo negro y texto
blanco, y el texto pasa a azul al pasar el cursor o al activar el elemento. Navbar con fondo blanco:
menú con fondo blanco y texto negro, y el texto pasa a azul igual. El comportamiento debe ser coherente
con el estado visual real de la navbar, sin flashes, contrastes insuficientes ni combinaciones de colores
incorrectas. Mantener el diseño minimalista inspirado en Apple, la accesibilidad, la navegación por teclado
y la adaptación responsive existente. Reutilizar los tokens y mecanismos de tema existentes; no duplicar
colores ni agregar soluciones paralelas."

## The gap this specification fills

The header chooses between three visual treatments by overriding nine CSS custom properties inside its
own styled component, `Header.styles.ts:42-58`. The repository already records why the mobile menu is
exempt from that, in production, at `Header.styles.ts:40-41`:

> The mobile menu is portaled to document.body, outside this subtree, so it keeps its white panel and
> dark text without any of this reaching it.

`Header.tsx:88-96` portals the menu to `document.body`, so it hangs outside the subtree those overrides
reach. `--color-text-primary: #ffffff` and `--color-accent: #0a84ff` resolve against `:root` and never
arrive.

**The result today, measured, and identical in both header states**: a white panel, `#1D1D1F` text, and a
`#0071E3` hover. With a black navbar, a white panel covers the screen.

**The reading mechanism was never the problem.** Every colour in `src/styles/tokens.ts` is the string
`var(--color-*)`, not a duplicated JavaScript value — `tokens.colors.textPrimary` is
`'var(--color-text-primary)'` (`tokens.ts:45`), `tokens.colors.accent` is `'var(--color-accent)'`
(`tokens.ts:12`), `tokens.colors.background` is `'var(--color-background)'` (`tokens.ts:48`). Both the
header and the menu already read the same properties. What is broken is the *reach* of the override.

**Nothing about the palette is missing.** The two accents this feature needs already exist and were
measured in `specs/022-navigation-hover`: `#0A84FF` on black at 5.76:1, `#0071E3` on white at 4.70:1.

## What this specification is deliberately not

**It is not a new palette.** No colour is chosen here. Both accents and the nine overrides already exist;
this feature changes which of them reaches which surface.

**It does not change the header.** Its three treatments, its own dark block and its behaviour outside
this change are untouched. The header is the reference the menu reads, not a thing this feature edits
visually.

**It does not change where the menu is portaled.** Moving the portal inside the header subtree would let
the cascade arrive on its own, but it would put the menu inside the stacking context its `z-index`
depends on. That is a risk this feature does not take.

**It does not fix the focus trap.** `useMobileMenu.ts:4` creates a `menuRef` that `MobileMenu.tsx:41`
never connects to any element, so the trap at `useMobileMenu.ts:16-20` and the initial focus at `:15` are
no-ops today. That is a pre-existing defect, it belongs to the menu's own behaviour rather than its
colour, and this feature leaves it alone.

## The touch question, answered before it was written down

Tapping on iOS Safari does **not** make an element match `:focus-visible` — that pseudo-class is reserved
for keyboard and assistive technology. A rule carrying only `:focus-visible` would therefore never fire
on the devices this menu exists for.

`:hover` alone is also not enough. On touch it applies on tap and sticks, which is the classic stuck-hover
defect. **It is not a risk in this component**: every item navigates and calls `closeMenu`
(`MobileMenu.tsx:58`), so the element unmounts and the stuck state does not survive the return. That is
why `:hover` is safe here and usually is not.

So all three states carry the accent: `:hover` for a pointer, `:active` for a press, `:focus-visible` for
keyboard.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Open the menu on a black navbar and see a black menu (Priority: P1)

A visitor on a phone opens the menu while the hero's black band is still behind the navbar. The menu
covers the whole screen, and it must continue the band rather than flash a white sheet over it.

**Why this priority**: It is the request, and it is the case that is visibly wrong today.

**Independent Test**: Load `/` at scroll 0 in a mobile viewport, open the menu, and measure the panel's
computed `background-color` and the resting colour of a navigation item.

**Acceptance Scenarios**:

1. **Given** the navbar is black, **When** the menu opens, **Then** the panel measures `rgb(0, 0, 0)`.
2. **Given** the navbar is black, **When** the menu is open, **Then** a navigation item at rest measures `rgb(255, 255, 255)`.
3. **Given** the menu is opening on a black navbar, **When** the entrance animation runs, **Then** no white or translucent white is visible at any point in it.

---

### User Story 2 - Open the menu on a white navbar and see a white menu (Priority: P1)

A visitor on a phone opens the menu from a page with no black band, with the navbar scrolled and solid.
The menu must match it rather than coincidentally match the other case.

**Why this priority**: The other half of the request, and the case where a change could plausibly break
the existing behaviour.

**Independent Test**: Load `/about` scrolled past the navbar's threshold, open the menu in a mobile
viewport, and measure the panel and a navigation item.

**Acceptance Scenarios**:

1. **Given** the navbar is white, **When** the menu opens, **Then** the panel measures `rgb(255, 255, 255)`.
2. **Given** the navbar is white, **When** the menu is open, **Then** a navigation item at rest measures `rgb(21, 29, 31)`.
3. **Given** the navbar is white, **When** the menu is open, **Then** the close button and the call to action are legible against it.

---

### User Story 3 - See the item turn blue under the pointer, under a finger and under the keyboard (Priority: P1)

A visitor moves the pointer over an item, taps one, or tabs to it, and in every case the text turns blue
in a way that reads against the surface it is on.

**Why this priority**: It is the interaction half of the request, and on touch it is the only half that
is currently missing.

**Independent Test**: With the menu open, measure the item's computed colour while hovered, while
pressed and while focused, in both themes.

**Acceptance Scenarios**:

1. **Given** a dark menu, **When** an item is hovered, pressed or focused, **Then** it measures `rgb(10, 132, 255)`.
2. **Given** a light menu, **When** an item is hovered, pressed or focused, **Then** it measures `rgb(0, 113, 227)`.
3. **Given** the menu is dark, **When** an item is on the current section, **Then** it keeps the current-section treatment the navigation already defines and does not lose it to the interaction colour.
4. **Given** a visitor is on a touch device, **When** they press an item, **Then** the accent appears without waiting for a hover that may never come.

---

### User Story 4 - Reach every item with the keyboard in either theme (Priority: P2)

A visitor who does not use a pointer tabs through the menu. Every stop must be visible and identifiable
in both themes, and the current section must still be announced.

**Why this priority**: Not asked for as a colour, but it is the accessibility half of "turns blue on
focus", and the constitution makes it a gate rather than a nicety.

**Independent Test**: With the menu open, tab from the close button through every item and read the
computed outline colour at each stop.

**Acceptance Scenarios**:

1. **Given** the menu is dark, **When** focus moves to an item, **Then** the focus ring is visible against black.
2. **Given** the menu is light, **When** focus moves to an item, **Then** the focus ring is visible against white.
3. **Given** the menu is open, **When** the visitor tabs, **Then** every navigation item and the call to action are reachable in order.

---

### Edge Cases

- **The menu is opened while the page is at the very top of a page with no dark region.** The header is
  transparent there, and the menu must still be opaque; it takes the light surface, which is what a
  transparent header over a white page reads as.
- **The header changes state while the menu is open.** `useMobileMenu.ts:14` sets `overflow: hidden` on
  the body, so the page cannot scroll and the state cannot change. If it ever could, the theme arrives as
  a prop and follows on the next render.
- **The call to action.** `MobileMenu.styles.ts:91-122` declares a second mobile menu link style that
  renders only the call to action, while `Navigation.styles.ts:75-95` declares the one the items use.
  Both carry the same text colour and the same hover, and both change.
- **A longer address-like label in the menu.** Not applicable; the menu holds navigation labels only.
- **Reduced motion.** The entrance animation already exists and `tokens.css` zeroes transition and
  animation durations under `prefers-reduced-motion`. This feature adds no new motion.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The mobile menu MUST adopt the theme the header carried at the moment it was opened.
- **FR-002**: With a black navbar, the panel MUST be `#000000` and navigation text at rest MUST be `#ffffff`.
- **FR-003**: With a white navbar — including the transparent and the scrolled treatments — the panel MUST be `#FFFFFF` and navigation text at rest MUST be `#1D1D1F`.
- **FR-004**: Navigation items and the call to action MUST take the accent on `:hover`, on `:active` and on `:focus-visible`.
- **FR-005**: The accent MUST be `#0A84FF` on the dark surface and `#0071E3` on the light surface — the two values `specs/022` established and measured.
- **FR-006**: The close button MUST be legible in both themes, including its hover background and its focus ring.
- **FR-007**: The entrance animation MUST start from a colour that is correct for whichever theme is active, so that no white or translucent white is visible over a dark panel.
- **FR-008**: The nine colour overrides MUST have exactly one definition in the repository.
- **FR-009**: The header's own appearance and behaviour MUST NOT change outside this feature's scope.
- **FR-010**: No new dependency, no new component, no change to where the menu is portaled, no change to any token file or to `tokens.css`, and no change to the Playwright configuration.

### Key Entities

- **Theme flag**: the header's existing `overDark`, computed in `useHeader` by comparing the bottom of the
  `[data-header-contrast="dark"]` region against the header's height. Read by both surfaces; not new.
- **Dark surface overrides**: the nine custom properties the header already declares for a dark
  treatment. Moved, not invented.
- **Accent pair**: `#0A84FF` on dark, `#0071E3` on light, selected by the overrides rather than by any
  component knowing which theme it is in.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: With the navbar black, the panel's computed `background-color` is `rgb(0, 0, 0)`, and a navigation item, the call to action and the close button each read `rgb(255, 255, 255)` at rest. Measured in a browser, not asserted from the stylesheet.
- **SC-002**: With the navbar white, the panel's computed `background-color` is `rgb(255, 255, 255)`, and a navigation item, the call to action and the close button each read `rgb(21, 29, 31)` at rest.
- **SC-003**: On the dark surface, the interaction colour is `rgb(10, 132, 255)` and its contrast against `#000000` is at least 4.5:1. `specs/022` measured 5.76:1.
- **SC-004**: On the light surface, the interaction colour is `rgb(0, 113, 227)` and its contrast against `#FFFFFF` is at least 4.5:1. `specs/022` measured 4.70:1.
- **SC-005**: Keyboard focus reaches the close button and every navigation item in order, and every focusable element in the menu carries a visible focus indication. **Two mechanisms, not one, and the difference is not incidental.** The close button and the call to action draw an outline with `tokens.colors.focus`, which is `var(--color-accent)` and so takes each theme's accent with it: `rgb(10, 132, 255)` on the dark surface and `rgb(0, 113, 227)` on the light one. The navigation items carry no outline at all today — `Navigation.styles.ts` declares none — and are indicated instead by the colour change FR-004 puts on `:focus-visible`. That a keyboard user can still see where they are is what this criterion requires; the criterion does not claim the menu has an outline on every element, because it does not.
- **SC-006**: Each of the nine dark-theme override declarations appears exactly once in non-test source under `src/`. Two things sit outside the criterion, and both deliberately: the test files, which assert these values on purpose, and `tokens.css`, which declares the same property names carrying the light theme's values — a different value, not a second copy of this one.
- **SC-007**: Lint, type checking, the unit tests, the component tests and the build pass.
- **SC-008**: axe reports zero violations on every route at every viewport in the audit matrix.
- **SC-009**: The end-to-end suite stays green in Chromium, WebKit, Mobile Chrome and Mobile Safari.
- **SC-010**: The entrance animation's first keyframe sets `background-color` to either `transparent` or the panel's own surface, so no frame of it can paint a colour lighter than the surface it lands on. Read from the emitted stylesheet rather than watched frame by frame, because a frame that never renders cannot be asserted on afterwards.

**What FR-009 and FR-010 are verified by, since neither is a browser measurement.** FR-009, that the header's appearance does not change, is verified by `Header.test.tsx`'s four dark-theme tests passing *without having been edited* — the only evidence that moving nine declarations did not move a pixel. FR-010, that there is no new dependency, no new component and no change to the portal, is verified by what the commits do not contain. Neither is a measurable outcome and neither is dressed up as one.

## On what is and is not backed by these criteria

**SC-001 through SC-005 are measurements on a rendered page.** Colours are read from computed styles and
contrast is recomputed with the full WCAG formula, not read out of a declaration. WebKit returns colours
already passed through the display profile, so the helper compares per channel with a tolerance of 12,
the tolerance `specs/022` established and justified.

**SC-006 is a source scan**, the pattern `Navigation.test.tsx` already uses to keep a value from coming
back, with the two exclusions its wording names.

**SC-010 is read from the emitted stylesheet**, not from a recording of the animation. It is the honest
form of "no flash": it proves the first keyframe cannot paint a wrong colour, and it does not pretend to
have watched the other 359 milliseconds.

**Nothing here is asserted about how the change looks.** No screenshot is compared. The criteria are about
values that can be measured and about properties that can be read, which is the same line `specs/022`
drew.

**One thing SC-005 records rather than fixes.** The navigation items in the mobile menu have no focus
outline: `Navigation.styles.ts` declares no `:focus-visible` rule and no `outline` at all, while
`MobileMenu.styles.ts:74,119` draw one for the close button and the call to action. This is
pre-existing and it is a behaviour question rather than a colour one — adding outlines would change what
the menu is, not how it looks — so it is stated here so that nobody reads SC-005 as saying the menu has a
ring on every element. The colour change FR-004 puts on `:focus-visible` is what indicates focus on those
items today, and SC-003 and SC-004 measure that colour.

**Nothing in this document has been executed yet.** It is a specification, its status is Draft, and no
criterion above has been measured.

## Assumptions

- **"The navbar's background" means the treatment the header is actually displaying**, which is what
  `overDark` reports, not a colour guessed at the call site.
- **The menu is opaque in both themes.** It covers the viewport, so it cannot be transparent over content.
- **The two accents stay as `specs/022` left them.** Neither is re-derived, and no third value is
  introduced for either theme.
- **The dark region's owner does not change.** `Hero.tsx:63` keeps publishing
  `data-header-contrast="dark"`; this feature reads it and does not touch it.
