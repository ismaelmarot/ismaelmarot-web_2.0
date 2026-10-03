# Feature Specification: Projects Full-Screen Carousel

**Feature Branch**: `008-projects-carousel`

**Created**: 2026-10-03

**Status**: Implemented

**Input**: User description: "En la seccion de proyectos: Quiero que se vean como tarjetas dentro de un carrusel BIEN GRANDES. Juguemos con los tamanos como usa apple. Las tarjetas sin borde, solo con sombreado. Los iconos deben tener un border como los que usa apple para que los iconos que son cuadrados 'se vean redondeados' como efecto visual." Follow-up: "La idea es que la seccion de Proyectos ocupe el 100% de la pantalla."

Follow-up decisions taken with the user during clarification, each one answering an ambiguity found while inspecting the current implementation:

- Movement is native scrolling with snap. Never automatic, so WCAG 2.2.2 does not apply and no pause control is required.
- One project per screen, on every viewport. The section is the showcase; there is no vertical list of projects any more.
- Cards are borderless and separated by shadow alone, on a `#F5F5F7` section so the white cards have an edge to read against.
- Desktop cards are 800px wide. Their height is whatever remains of the viewport after the heading, the filter and the dots, never a fixed value.
- Icons sit in an 88px rounded frame with a hairline border, which is what makes the square PNGs read as rounded.
- Navigation on desktop is a row of dots plus the left and right arrow keys.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Take in one project at a time (Priority: P1)

A visitor opens the projects section and gets a single project filling the screen: a large card with a rounded icon, the name, the description, its categories and a way into its page. Nothing competes for attention, because there is nothing else on screen.

**Why this priority**: This is the whole reason the feature exists. The section previously listed six rows of 167px stacked on a white page, which read as a table rather than as a portfolio of apps.

**Independent Test**: Open `/projects` and verify the section is at least one viewport tall, exactly one card is snapped into view, and that card carries its icon, name, description, categories and action.

**Acceptance Scenarios**:

1. **Given** a visitor opens `/projects`, **When** the section settles, **Then** the section occupies at least the full viewport height and exactly one project card is in view
2. **Given** the card is rendered, **When** it is measured, **Then** it has no border, a 24px radius, 32px of padding and a two-layer shadow
3. **Given** a desktop viewport of 1440px, **When** the card is measured, **Then** it is 800px wide and its height is whatever remains of the viewport, not a fixed number
4. **Given** any card, **When** it is displayed, **Then** the project name reads at 32px, the description at 17px and the action still reads "Ver" for assistive technology
5. **Given** a filtered category with a single project, **When** it is displayed, **Then** the section still fills the viewport with that one card rather than collapsing

---

### User Story 2 - Move to the next project deliberately (Priority: P1)

A visitor moves between projects by swiping, by dragging with a mouse, or with the arrow keys once the strip has focus. Nothing moves on its own, so a visitor reading is never interrupted and never loses their place.

**Why this priority**: One project per screen hides the other five. Without a way to move, the section shows a single project and reads as if it were the only one that exists.

**Independent Test**: Open `/projects`, confirm no automatic movement occurs while idle, then reach the next project by swipe, by arrow key and by clicking a dot, and confirm each arrives fully snapped.

**Acceptance Scenarios**:

1. **Given** the strip is idle for several seconds, **When** nothing is interacted with, **Then** the visible project does not change on its own
2. **Given** a visitor swipes horizontally on a touch device, **When** the gesture ends, **Then** the strip settles on exactly one card aligned to its start edge
3. **Given** the strip has keyboard focus, **When** the right or left arrow key is pressed, **Then** the strip advances or retreats by exactly one project
4. **Given** a visitor drags with a mouse or trackpad, **When** the drag ends, **Then** the strip settles on a snapped card rather than a partial offset
5. **Given** a visitor scrolls the page vertically from inside the strip, **When** the gesture is vertical, **Then** the page scrolls rather than the strip

---

### User Story 3 - Know how many projects there are and which one is showing (Priority: P1)

A visitor sees one dot per project with the current one marked, so the size of the section is legible at a glance and the strip does not look like it holds a single project. The dots double as navigation.

**Why this priority**: Without a count, a full-screen single-card strip is indistinguishable from a page that has only one project. It is the cheapest fix for the discoverability problem that one-per-screen creates.

**Independent Test**: Open `/projects` and verify the number of dots equals the number of projects, the visible project is the marked one, and clicking any dot brings that project into view.

**Acceptance Scenarios**:

1. **Given** six projects are published, **When** the section renders, **Then** six dots appear and the first is marked as current
2. **Given** a visitor swipes to the third project, **When** the movement settles, **Then** the third dot is marked as current and the others are not
3. **Given** a visitor clicks the fifth dot, **When** the strip moves, **Then** the fifth project fills the screen
4. **Given** each dot is focused by keyboard, **When** it is activated, **Then** it moves the strip and is reachable without a pointer
5. **Given** a visitor reaches the strip with a screen reader, **When** the dots are announced, **Then** each names its position, for example "Proyecto 3 de 6"

---

### User Story 4 - Recognise each app by its icon (Priority: P2)

A visitor recognises each app the way they recognise an app on a phone: a rounded square with a thin outline, rather than a hard-edged square image. Six icons of different origins now read as one family.

**Why this priority**: The icons are the fastest signal of what a project is. Today they are raw square PNGs, one of them completely square, so the set looks accidental rather than designed.

**Independent Test**: Open `/projects` and verify every icon sits in an 88px frame with a 22px radius and a hairline border, and that the fully opaque icon is clipped to the frame rather than showing square corners.

**Acceptance Scenarios**:

1. **Given** any project with an icon, **When** its card is displayed, **Then** the icon sits inside an 88px frame with a 22px radius and a hairline border
2. **Given** a project whose icon is a fully opaque square, **When** its card is displayed, **Then** the frame clips its corners and no square corner is visible
3. **Given** a project whose icon artwork is already partly rounded, **When** its card is displayed, **Then** its silhouette is bounded by the frame and reads as rounded
4. **Given** a project whose icon fails to load, **When** its card is displayed, **Then** the fallback occupies the same frame and the card does not change size or shift

---

### User Story 5 - Filter without landing in empty space (Priority: P3)

A visitor narrows the section by category and the strip lands on a real project, with the dots rebuilt to match the narrowed list.

**Why this priority**: The filter already exists and is tested. What is new is that a strip can be scrolled somewhere that the new list does not reach, which would show blank space.

**Independent Test**: Open `/projects`, apply each category in turn, and verify the first project is visible, the dot count matches the filtered list, and no empty area is shown.

**Acceptance Scenarios**:

1. **Given** the strip has been moved to the last project, **When** a narrower category is applied, **Then** the first project of that category is in view rather than an empty offset
2. **Given** a category leaves three projects, **When** the section renders, **Then** three dots appear
3. **Given** a category leaves no projects, **When** the section renders, **Then** the existing empty explanation is shown and no dots appear
4. **Given** the visitor returns to the full list, **When** the section renders, **Then** every project is reachable again and the first is in view

---

### Edge Cases

- **Short viewport**: a 640px-tall phone minus 160px of section padding, the heading, a filter that wraps to two lines and the dots leaves roughly 310px for the card. The card shrinks rather than overflowing, and the card body scrolls internally if it still cannot fit.
- **Dynamic viewport on mobile**: `dvh` changes when the browser bar collapses, which can make a mandatory snap land between cards. The snap type relaxes to `proximity` on narrow viewports if the browser check reproduces a misaligned landing.
- **Single project**: the section still fills the viewport and a single dot is shown, which must not look like a broken control.
- **Very long project name**: a name that cannot fit the card width wraps rather than pushing the action out of the card or overflowing it.
- **Very long description**: stays clamped to three lines so cards stay the same height and the section keeps filling exactly one screen.
- **Icon load failure**: the fallback must occupy the same 88px frame so no card shifts while images resolve.
- **Reduced motion**: smooth scrolling is disabled, so the strip jumps rather than animates.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The section MUST occupy at least the full viewport height and MUST display exactly one project card at a time on every viewport size.
- **FR-002**: Card height MUST be derived from the space remaining after the heading, the filter and the dots, using flex layout. It MUST NOT be a fixed pixel value or a `calc()` expression tied to viewport units.
- **FR-003**: Desktop cards MUST be 800px wide and centred. Mobile cards MUST fill the available width and MUST bleed to the screen edges.
- **FR-004**: The strip MUST use native horizontal scrolling with `scroll-snap-type: x mandatory` on wide viewports, and MUST NOT advance automatically. No timer, no autoplay and no pause control are required.
- **FR-005**: One dot MUST be rendered per visible project. The dot for the current project MUST be marked as current, MUST be named with its position such as "Proyecto 3 de 6", and MUST move the strip when activated.
- **FR-006**: The strip MUST be labelled as a group, MUST be reachable and operable by keyboard, and the left and right arrow keys MUST move it by exactly one project while it has focus.
- **FR-007**: The strip MUST NOT use `aria-live`, because no content moves without user action.
- **FR-008**: The current project index MUST be derived from the scroll position throttled with `requestAnimationFrame`, and MUST NOT be derived from an `IntersectionObserver` per card.
- **FR-009**: Cards MUST have no border, a 24px radius, 32px of padding and a two-layer shadow that deepens on hover.
- **FR-010**: The section background MUST be `#F5F5F7` and the cards MUST be white, so that shadow alone defines the card edge.
- **FR-011**: Icons MUST sit in an 88px frame with a 22px radius, a hairline border and `overflow: hidden`, with the artwork filling the frame, so that every icon reaches the same silhouette regardless of its source aspect ratio.
- **FR-012**: Changing the category filter MUST return the strip to the first project, and the dots MUST be rebuilt to match the filtered list.
- **FR-013**: Smooth scrolling MUST be disabled under `prefers-reduced-motion`.
- **FR-014**: No new text is added to the card. This feature changes only scale, shadow, frame, background and the addition of the dot indicators.
- **FR-015**: The existing action MUST keep the accessible name "Ver" plus the project name, and MUST keep its visible label in uppercase applied by styling rather than by markup.
- **FR-016**: A failed icon load MUST render the fallback inside the same frame, and the card MUST NOT change size or position.

### Key Entities

- **Project card**: the visual presentation of one project. Carries the icon frame, name, clamped description, category badges and the action. Width is fixed on desktop, height is derived.
- **Strip**: the horizontally scrollable region that holds the visible cards one at a time. Owns the snap, the keyboard behaviour and the scroll position that determines the current project.
- **Dot indicator**: one button per visible project, named by position, acting as both current-state marker and navigation control.
- **Project**: existing entity, unchanged. No data model, schema or field changes are part of this feature.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At rest, exactly one project card is snapped into view at 1440px, 1024px, 768px, 390px and 320px.
- **SC-002**: No horizontal overflow at 320px, and the card never exceeds the viewport width at any tested size.
- **SC-003**: Cumulative layout shift stays below 0.1 when the strip settles, measured because an 88px icon frame resolving late is the most likely source of shift.
- **SC-004**: Largest contentful paint stays below 2.5s.
- **SC-005**: Zero axe WCAG 2.1 AA violations at 1440px, 390px and 320px, covering the strip and the dots.
- **SC-006**: The dot count equals the number of visible projects, and the marked dot matches the visible card, after any swipe, arrow key press or filter change.
- **SC-007**: Every card has no computed border and a computed `box-shadow` that is not `none`.
- **SC-008**: Every icon frame is 88px with a computed radius of 22px, and the fully opaque icon shows no square corner.
- **SC-009**: The card shadow is not clipped by the strip at any tested size, on hover or at rest.
- **SC-010**: The full test suite passes, and any existing test that contradicts the new design is rewritten to assert the new intent rather than deleted.
- **SC-011**: On a 900px-tall desktop viewport the card lands within 560px to 580px tall, confirming the height is derived from the viewport rather than from a hardcoded value.

## Assumptions

- The visitor arrived from a link, so the section starting at the first project is correct; restoring a previous position is out of scope.
- Native horizontal scrolling is well supported on the target browsers, so no pointer-drag or wheel-translation shim is written.
- A full-screen strip is expected to be read by scrolling down to leave it, so the section does not trap vertical scroll.
- Project names and descriptions stay in their current data, including the machine-readable names, so nothing in the data layer changes.
- The project detail page, the category filter behaviour and the existing action link keep their current behaviour; only their presentation changes.
- Snap behaviour on mobile browsers with a collapsing address bar is verified in a real browser rather than assumed, and relaxed if it mislands.