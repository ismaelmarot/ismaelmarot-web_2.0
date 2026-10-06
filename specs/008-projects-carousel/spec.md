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

## Amendment 1 - The Section Is One Screen on a Phone

**Applied**: 2026-10-05, after deployment.

**Request**: "arreglar el desbordamiento del carrusel en movil"

The section measured 855px on a 390x844 phone and 911px on a 320x640 one, so it no longer landed on
one screen. The edge case at the top of this spec already said what should happen at 640px tall. It
had simply not happened, and had not been noticed because no test could have noticed.

### Why the card would not shrink

FR-001 makes the full viewport height a floor, and the section carries `min-height: 100dvh` rather
than `height`. That reads as a careful choice and has a consequence nobody priced: the section's
height is `max(100dvh, natural content)`, and working out the natural content needs the card's
natural height, which is circular. The browser breaks the circle the only way it can, by taking the
card at its natural 455px and letting the section grow past the screen.

Everything else in the chain was already built for this to work. The container and the inner column
carry `flex: 1; min-height: 0`, and so does the strip. With an indefinite parent, `flex: 1` has no
free space to distribute, so none of it engaged. The card's `height: 100%` fell back to `auto`,
because a percentage height against an indefinite container resolves to auto, which is 455px.

### The structural fix, and what it does not fix

Below 1024px the section gets a definite height of one viewport. That alone takes 390x844 from 855
to 844 and 320x640 from 911 to 640, because the flex chain becomes definite: the strip's `flex: 1`
finally has leftover space, the card's `height: 100%` finally resolves, and the card takes what is
left after the heading, the filter and the controls. FR-002 is untouched, since the card's height is
still derived by flex and no viewport arithmetic is introduced for it.

It is not enough, and measuring said so rather than assuming it. With the height pinned, the card
shrank to 288px at 320x640 and its body to 72px, holding one line and a half of description. A card
that fits while its content is squeezed is not the same as one that fits, and shipping the height
change alone would have swapped a visible overflow for an invisible one.

### Where the space came from instead

- **The filter became one horizontally scrollable row below 520px.** Seven options totalling roughly
  549px could never fit 288px, so it wrapped to three rows and 148px. Scrolling horizontally is the
  interaction the strip above it already uses, and it matches the nav-like appearance these same
  categories were given elsewhere. Worth 104px at 320px and 52px at 390px.
- **The icon row stopped growing.** `StyledProjectRowMain` carries `flex: 1` below 520px, so it
  absorbed every pixel of leftover space and the description received none. This was the largest
  single cause and it was invisible in the CSS: shrinking the icon from 120px to 64px changed the
  measured layout by exactly zero, because the row grew into whatever was left over. With
  `flex: 0 0 auto` the leftover goes to the description, which is where it is worth anything.
- **Padding and gaps were reduced below 520px**: section padding 40px to 28px, column gap 24px to
  14px, card padding 32px to 20px, card gap 16px to 12px, action 48px to 44px. Every one of these is
  space nobody sees.
- **The icon frame drops from 120px to 80px below 520px**, with its radius scaled to stay 22% of the
  frame. This qualifies FR-017 of the dark-card spec, which fixed 120px without naming a viewport.
  At 120px on a 320px screen the card is 256px wide inside the gutters, and that spec's own edge case
  already conceded the icon, the name and the action cannot share one line there.

### What was tried and rejected

Forcing the carousel controls onto one row below 520px, by removing `flex-wrap`, was measured before
being written and produced a horizontal overflow at 320px: the play toggle, two arrows and six dots
are 360px of intrinsic width against 288px available. The two rows of controls cost 42px of height and
are kept, because a control scrolled out of reach is worse than a shorter card.

The two-line description clamp below 520px was not a choice so much as a consequence. The body box
was already smaller than three lines at 320px, so the text was being cut through the middle by the
container rather than by the clamp, which reads as a fault rather than as truncation.

### The honest limit

At 320x640 the description is two lines. That is the most that fits once the icon, the name, the
action and the chips are placed, and it is one line short of the three used everywhere else. The
alternative was a taller section, which is the defect being fixed.

### Requirements superseded by this amendment

- **FR-001** is superseded. "At least the full viewport height" is precisely what allowed the section
  to exceed the screen, and it already contradicted this spec's own short-viewport edge case, which
  expects the card to shrink. It becomes exactly one screen.
- The "Short viewport" edge case is superseded on its arithmetic: it budgeted 160px of section
  padding, which has been 80px on a phone since that padding was reduced.

### Requirements added by this amendment

- **FR-017**: Below 1024px the section MUST have a definite height of one viewport, so the flex chain
  resolves and the card takes the space remaining after the heading, the filter and the controls.
- **FR-018**: The card's height MUST continue to be derived by flex. No viewport arithmetic may be
  introduced for it.
- **FR-019**: Below 520px the category filter MUST occupy a single row that scrolls horizontally and
  MUST NOT wrap.
- **FR-020**: Below 520px the icon row MUST NOT grow to absorb leftover space, since that would leave
  the description with none.
- **FR-021**: Below 520px the card MUST use 20px of padding, a 12px gap, an 80px icon frame with a
  proportionally scaled radius, a 44px action and a description clamped to two lines.
- **FR-022**: The carousel controls MUST keep wrapping rather than being forced onto a single row,
  because their intrinsic width does not fit a phone.
- **SC-012**: The section measures exactly the viewport height at 320x640, 360x800, 390x844, 414x896,
  768x1024 and 1440x900, with no card extending past the bottom.
- **SC-013**: No horizontal overflow at 320px, with the controls wrapping.
- **SC-014**: At 320x640 the card body shows two whole lines of description, with no line cut through
  the middle.
- **SC-015**: The icon frame measures 120px and the name 48px at 1440px, unchanged.
- **SC-016**: axe reports zero violations at 1440px, 768px, 390px and 320px.
- **SC-017**: A browser test asserts the section's measured height against the viewport, since every
  existing Projects test asserts a CSS string and not one of them could have caught 271px of
  overflow.
- **SC-018**: The full test suite passes.

FR-002 through FR-016 stand unchanged.

---

## Assumptions

- The visitor arrived from a link, so the section starting at the first project is correct; restoring a previous position is out of scope.
- Native horizontal scrolling is well supported on the target browsers, so no pointer-drag or wheel-translation shim is written.
- A full-screen strip is expected to be read by scrolling down to leave it, so the section does not trap vertical scroll.
- Project names and descriptions stay in their current data, including the machine-readable names, so nothing in the data layer changes.
- The project detail page, the category filter behaviour and the existing action link keep their current behaviour; only their presentation changes.
- Snap behaviour on mobile browsers with a collapsing address bar is verified in a real browser rather than assumed, and relaxed if it mislands.