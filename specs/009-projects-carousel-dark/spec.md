# Feature Specification: Dark Project Cards with Auto-Advance

**Feature Branch**: `009-projects-carousel-dark`

**Created**: 2026-10-03

**Status**: Implemented

**Input**: User description: "A las cards: Quítales el efecto hover. El botón de ver, cámbialo por botón (+) redondo. Que el carrousel vaya moviéndose, y que tenga botón de play (que cambie a stop), también botones de < y > pero sin efecto hover. Que los iconos y títulos sean más grandes. Las cards que sean en negro."

Decisions taken while inspecting the implementation, each answering an ambiguity the request left open:

- The card is `#1D1D1F`, Apple's near-black rather than pure black, and the section stays `#F5F5F7`. Two near-blacks against each other would fuse, which would mean putting an edge back that this feature is removing.
- Auto-advance runs every 7 seconds, which is long enough to read a name and three lines of description.
- The carousel starts playing rather than paused, which is what the request asks for.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read a project on a dark card (Priority: P1)

A visitor sees each project as a dark card on a light section, with a large icon and a large name. The contrast between the dark card and the light page is what separates them, so the card needs no border to read as a distinct object.

**Why this priority**: This is the visual change the request is built around. Everything else is control, and controls over an unreadable card are pointless.

**Independent Test**: Open `/projects` and verify the card computes `#1D1D1F`, has no border, carries a light name and a muted light description, and shows a 120px icon frame.

**Acceptance Scenarios**:

1. **Given** a visitor opens `/projects`, **When** a card is displayed, **Then** it computes a near-black background of `#1D1D1F`
2. **Given** a card is displayed, **When** its name and description are read, **Then** the name is near-white and the description a muted light grey, both legible against the dark card
3. **Given** a card is displayed, **When** it is measured, **Then** it has no border and its shadow still separates it from the `#F5F5F7` section
4. **Given** a visitor moves a pointer over a card, **When** the card is measured, **Then** it neither moves nor changes its shadow
5. **Given** a project icon fails to load, **When** its card is displayed, **Then** the fallback sits in the same 120px dark frame and the card does not shift

---

### User Story 2 - Open a project with one tap on a round button (Priority: P1)

A visitor opens a project's page from a single round button marked with a plus, rather than a wide labelled pill. On a card this dark and this large, the pill competed with the project name for attention.

**Why this priority**: The action is the only way deeper into the work, and the request replaces the control outright.

**Independent Test**: Open `/projects` and verify the action is round, carries a plus, keeps the accessible name "Ver" plus the project name, and still navigates to the project page.

**Acceptance Scenarios**:

1. **Given** a project card, **When** it is displayed, **Then** its action is a circle of at least 44px containing a plus glyph
2. **Given** a project card, **When** its action is announced by assistive technology, **Then** it is named "Ver" plus the project name, not the bare symbol
3. **Given** a visitor activates the round button, **When** the project page opens, **Then** the destination is unchanged from the previous pill
4. **Given** a visitor presses Tab, **When** focus reaches the round button, **Then** it shows a visible focus ring
5. **Given** a project card, **When** it is displayed, **Then** the action carries no visible text label

---

### User Story 3 - Let the carousel move, and stop it (Priority: P1)

The carousel advances by itself so a visitor who lands on the page sees more than one project, and a single button stops it. Arrow controls let a visitor choose the next project themselves, and none of these controls change appearance under the pointer.

**Why this priority**: Auto-advance is the request, and because the content moves without being asked for, WCAG 2.2.2 requires a way to stop it. The stop button is not a convenience here, it is the obligation.

**Independent Test**: Open `/projects`, confirm the card changes without any interaction, confirm the toggle stops and restarts it, and confirm the arrows move exactly one project.

**Acceptance Scenarios**:

1. **Given** the section is loaded, **When** seven seconds pass, **Then** the strip advances to the next project by itself
2. **Given** the strip has reached the last project, **When** the next seven seconds pass, **Then** it returns to the first project
3. **Given** the carousel is moving, **When** a visitor activates the toggle, **Then** it stops and the control changes to a play glyph
4. **Given** the carousel is stopped, **When** a visitor activates the toggle, **Then** it moves again and the control shows a stop glyph
5. **Given** a visitor activates the left or right control, **When** the strip settles, **Then** exactly one project has been added or removed, and the matching dot is marked current
6. **Given** a visitor moves a pointer over any control, **When** it is measured, **Then** it does not change colour, size or shadow
7. **Given** keyboard focus is inside the section, **When** the auto-advance timer elapses, **Then** the carousel does not move until focus leaves
8. **Given** the browser tab is hidden, **When** the timer elapses, **Then** the carousel does not move, and it does not jump when the tab returns

---

### User Story 4 - Take in the icon and the name at a glance (Priority: P2)

A visitor identifies a project by its icon and its name from across the screen, because both are large enough to read before reading anything else.

**Why this priority**: On a full-screen card the icon and name are the only two things visible at first glance, so their scale is what makes the card scannable.

**Independent Test**: Open `/projects` and verify the icon frame measures 120px and the name computes at 48px on a wide viewport.

**Acceptance Scenarios**:

1. **Given** a project card, **When** it is displayed, **Then** its icon frame measures 120px with a proportionally larger radius
2. **Given** a wide viewport, **When** the name is measured, **Then** it computes at 48px
3. **Given** a 320px viewport, **When** the card is displayed, **Then** the name still fits, the action stays inside the card, and there is no horizontal overflow

---

### Edge Cases

- **A 120px icon on a 320px screen**: the card is 256px wide inside the gutters, so the icon, the name and a 48px round action cannot share one line. The header has to wrap deliberately rather than letting the action drop somewhere arbitrary.
- **Dark card, dark badge**: the category badges were built for a white surface. On a dark card they become light chips, which is legible, but they are the brightest thing on the card and pull attention from the name.
- **Icon artwork with light corners**: three of the six icons are square PNGs with almost transparent corners. A dark frame turns those corners invisible, which is correct, but an icon whose own artwork is mostly white will read as a bright square inside a dark frame.
- **Auto-advance during reading**: a visitor part-way through a description loses it when the card moves. Pausing while focus is inside the section covers the keyboard case; a pointer visitor gets the stop button.
- **Rapid toggle**: pressing play and stop quickly must not leave two timers running. Only one timer may exist at a time.
- **Tab restored from background**: a timer that kept running while hidden would jump the strip several projects on return.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Cards MUST compute a `#1D1D1F` background, MUST have no border, and MUST keep a shadow that separates them from the `#F5F5F7` section.
- **FR-002**: Text inside a card MUST be light: the name near-white and the description a muted light grey, each meeting 4.5:1 against `#1D1D1F`.
- **FR-003**: Cards MUST NOT translate, change shadow, or otherwise react to hover. `prefers-reduced-motion` MUST keep this true rather than merely removing the transition.
- **FR-004**: The action MUST be a circle of at least 44px containing a plus glyph, with no visible text label.
- **FR-005**: The action's accessible name MUST remain "Ver" plus the project name, so the symbol does not become the only name.
- **FR-006**: The action MUST keep a visible focus ring and MUST keep navigating to the existing project route.
- **FR-007**: The carousel MUST advance by itself every 7 seconds, starting on load, wrapping from the last project to the first.
- **FR-008**: A single toggle MUST stop and restart the auto-advance, and MUST show a play glyph when stopped and a stop glyph when moving.
- **FR-009**: The toggle MUST be named for the action it performs, not by `aria-pressed`, matching the existing marquee control's approach.
- **FR-010**: Left and right controls MUST move exactly one project and MUST be operable by keyboard.
- **FR-011**: No carousel control may change appearance on hover. Focus styling is not hover styling and MUST remain.
- **FR-012**: Under `prefers-reduced-motion: reduce`, the carousel MUST NOT auto-advance at all, and the toggle MUST report that it is stopped.
- **FR-013**: Auto-advance MUST pause while keyboard focus is anywhere inside the section, and MUST resume when focus leaves.
- **FR-014**: Auto-advance MUST pause while the document is hidden and MUST NOT jump when the document becomes visible again.
- **FR-015**: At most one auto-advance timer may exist at any time.
- **FR-016**: Auto-advance MUST be silent. No `aria-live` region may announce the rotation.
- **FR-017**: The icon frame MUST measure 120px with a radius of 22% of its width, a hairline translucent light border and a dark background, so transparent artwork corners resolve against the frame rather than the page.
- **FR-018**: The project name MUST scale to 48px on wide viewports and MUST remain fluid below that.
- **FR-019**: The card MUST NOT emit text labels for the action, and the plus glyph MUST be hidden from assistive technology.
- **FR-020**: Category badges MUST remain legible on the dark card.

### Key Entities

- **Project card**: unchanged in data, changed in presentation. Near-black surface, light text, 120px icon frame, round action.
- **Auto-advance controller**: the playing state and the single timer that advances the strip every 7 seconds. Pauses on focus, on document hide and under reduced motion.
- **Carousel controls**: the play/stop toggle, the previous and next controls, and the existing dots. All keyboard reachable, none with hover styling.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The card computes `rgb(29, 29, 31)` with a computed border of `none` at 1440, 390 and 320.
- **SC-002**: The project name and description measure at least 4.5:1 contrast against `#1D1D1F`.
- **SC-003**: Hovering a card leaves its transform at `none` and its `box-shadow` unchanged.
- **SC-004**: The action computes a square bounding box with a border-radius of at least half its width, and contains no text node.
- **SC-005**: The strip advances on its own within 8 seconds of load with no interaction.
- **SC-006**: After the toggle is pressed, the strip does not move for at least 10 seconds; after a second press it resumes.
- **SC-007**: Each arrow press changes the marked dot by exactly one, and pressing the next control on the last project marks the first.
- **SC-008**: The icon frame measures 120px and the name computes 48px at 1440.
- **SC-009**: No horizontal overflow at 320, and the action stays within the card bounds.
- **SC-010**: Zero axe WCAG 2.1 AA violations at 1440, 390 and 320.
- **SC-011**: Cumulative layout shift stays below 0.1 on load, measured because the icon frame grew from 88px to 120px.
- **SC-012**: The full test suite passes, and existing carousel tests keep passing unchanged where they do not contradict this feature.

## Assumptions

- The site stays light-only, so `#1D1D1F` cards are a designed dark surface rather than a dark theme. No `prefers-color-scheme` work is included.
- The category badges keep their existing variant, becoming light chips on the dark card.
- The dots introduced in the previous feature remain; the request did not ask to remove them.
- Seven seconds is long enough for the descriptions as written, which are clamped to three lines.
- Auto-advance starting by itself is acceptable here because the stop control is present, visible and keyboard reachable, which is what WCAG 2.2.2 requires.