# Feature Specification: Project Icon Strip on the Landing Page

**Feature Branch**: `011-project-icon-strip`

**Created**: 2026-10-06

**Status**: Implemented

**Input**: "En la seccion Home > Proyectos: Utilizando practicas profecionales de diseno estilo Apple, poner
iconos de las app de los proyectos que estemos mostrando en la seccion de Proyectos. Dandole algun
efecto dinamico de movimiento y presentacion"

## The gap this specification fills

The landing page's Projects section renders no images at all. Measured on production at 1440x900 and
at 390x844: zero images inside `#projects-summary`, and the `featured` slot absent entirely. The six
project icons exist only on `/projects`, inside the carousel.

The landing page is the first thing a visitor sees and it has a project section that says "a selection
of projects" and then shows none. The icons are the fastest available evidence of that claim.

**This is not the carousel.** The `/projects` page shows one large card at a time and that card is the
subject. This strip is a preview, and the distinction is recorded deliberately below because it is the
reason the two use the same 96px frame and do not share a single line of code.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Recognise the work at a glance (Priority: P1)

A visitor scrolling the landing page sees the actual apps they were built, not only a sentence claiming
that projects exist.

**Why this priority**: This is the request. The section's copy promises work and the layout delivers
nothing to look at.

**Independent Test**: Open `/` and verify six app icons appear between the description and the bottom of
the Projects section.

**Acceptance Scenarios**:

1. **Given** the Projects section on the landing page, **When** it scrolls into view, **Then** six app icons are visible in a row
2. **Given** the six projects in `projects.json`, **When** the strip renders, **Then** every one of them is present, each in its own frame
3. **Given** a visitor who does not recognise the app names, **When** they look at the strip, **Then** each icon is visually distinct enough to be told apart from the other five

---

### User Story 2 - Arrive at the section without everything already in place (Priority: P1)

The icons assemble when the section comes into view, not before, so a visitor who scrolls quickly still
sees them and one who never scrolls is not shown an animation they did not watch.

**Why this priority**: Without this the strip is a row of images that was already fully drawn while the
visitor was reading the hero. The motion is the presentation, and presentation that happened off-screen
is not presentation.

**Independent Test**: Load `/` and confirm the icons start hidden, then become visible as the Projects
section reaches the viewport.

**Acceptance Scenarios**:

1. **Given** a visitor loading the page and never scrolling, **When** three seconds pass, **Then** the icons have not animated
2. **Given** the Projects section scrolling into view, **When** it crosses the viewport, **Then** the six icons fade and scale in one after another
3. **Given** the section is already on screen at load, **When** the page paints, **Then** the icons are already visible rather than waiting for a scroll that will not happen
4. **Given** the section has been seen once, **When** the visitor scrolls back to it, **Then** the icons do not replay

---

### User Story 3 - Use the site without being shown movement (Priority: P1)

A visitor who has asked the operating system for reduced motion sees the strip at its final state, with
no stagger, no scaling and no hover response.

**Why this priority**: WCAG 2.3.3 at level AAA, and more importantly the site already has a global rule
that zeroes its transitions; a component that animates through transforms and keyframes can bypass it
unless the component opts in explicitly.

**Independent Test**: Emulate `prefers-reduced-motion: reduce` and verify the six icons are visible with
no transform and no transition on hover.

**Acceptance Scenarios**:

1. **Given** reduced motion is enabled, **When** the strip renders, **Then** all six icons are visible immediately with no stagger
2. **Given** reduced motion is enabled, **When** an icon is hovered, **Then** it does not scale
3. **Given** reduced motion is enabled, **When** the section enters the viewport, **Then** no observer-driven animation runs

---

### User Story 4 - Get the same on a phone as on a desktop (Priority: P2)

A visitor on a phone can reach every icon, and the row reads as continuing rather than as cut off.

**Why this priority**: Six 96px frames are 656px and a phone is 390px. Leaving them clipped would hide
three of the six projects on the device most likely to be used to read them.

**Independent Test**: Open `/` at 390px and verify the row scrolls horizontally, that the cut edge fades
rather than ending abruptly, and that scrolling reveals the remaining icons.

**Acceptance Scenarios**:

1. **Given** a viewport narrower than 656px, **When** the strip renders, **Then** the row scrolls horizontally and all six icons are reachable
2. **Given** the row is scrolled, **When** the cut edge is inspected, **Then** it fades to transparent rather than being sliced
3. **Given** the row scrolls, **When** any frame is inspected, **Then** no horizontal scrollbar is visible
4. **Given** a viewport wide enough for 656px, **When** the strip renders, **Then** no scrolling is required

---

### Edge Cases

- **A failed icon load**: the frame keeps its size so the row does not reflow, and the project is named in
  the alternative text so nothing is lost.
- **Transparent corners in the artwork**: all six PNGs carry an alpha channel, so the frame's background
  is what the artwork sits on. Without it a transparent corner reads as a badly cut square.
- **Artwork that is not square**: `QEntry` is 379x366 against 192x192 for the smallest of the others, and
  one is 1024px wide. The image is fitted to the frame rather than stretched, so no icon is distorted.
- **A project with no icon**: the frame renders empty and keeps its place, rather than collapsing and
  shifting the six across.
- **The section summary slot is shared**: the same `featuredItems` prop carries the technology marquee,
  so this strip must not require a change to that shared component.
- **No `IntersectionObserver`**: the icons must be visible rather than permanently hidden where the API
  is unavailable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The landing page's Projects section MUST render one icon per project in `projects.json`,
  which is currently six, and MUST NOT add a project that is not in the data.
- **FR-002**: Each icon MUST sit in a 96px square frame with a border-radius of 22% of the frame width and
  a `#E8E8ED` background, matching the carousel's frame so the two are recognisably the same asset.
- **FR-003**: The artwork MUST be fitted to the frame with `object-fit: cover` and centred, since the
  sources are not square and one is 379x366. No icon may be stretched.
- **FR-004**: The frame MUST clip its artwork with `overflow: hidden`, since every source PNG has
  transparent corners.
- **FR-005**: Each icon MUST have alternative text naming its project, and MUST NOT be a link, since this is
  a preview and the section already carries one call to action.
- **FR-006**: The icons MUST become visible when the section reaches the viewport, driven by
  `useIntersectionObserver` with its `triggerOnce` behaviour, so the sequence never replays on a return
  scroll.
- **FR-007**: The entrance MUST be a fade from `opacity: 0` and a scale from `0.9`, over 500ms with a 60ms
  stagger per icon and a `cubic-bezier(0.25, 0.46, 0.45, 0.94)` curve.
- **FR-008**: Hovering an icon MUST scale it to `1.06` and deepen its shadow over 200ms.
- **FR-009**: Under `prefers-reduced-motion: reduce` the icons MUST be visible with no stagger, no scale on
  hover and no transition, and no observer-driven animation may run.
- **FR-010**: Below 700px the row MUST scroll horizontally with `scroll-snap-align` on each frame, a hidden
  scrollbar, and a left-to-right mask that fades the cut edge.
- **FR-011**: Where `IntersectionObserver` is unavailable, the icons MUST render visible rather than
  remaining hidden.
- **FR-012**: The strip MUST be passed through the existing `featuredItems` prop of `SectionSummary`, and
  MUST NOT require a change to that shared component.
- **FR-013**: The strip MUST NOT affect `/projects`. That page's carousel is a separate component and is
  out of scope.
- **FR-014**: The strip MUST render nothing when the project list is empty, rather than an empty frame.

### Key Entities

- **Strip**: the row of frames, which is the single component of this feature.
- **Frame**: one 96px square holding one project's artwork, its radius and background, and the subject of
  both animations.
- **Project**: an entry of `projects.json`, the source of the count and of every alternative text.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Six frames render inside `#projects-summary` at 1440x900, 768x1024 and 390x844.
- **SC-002**: Every frame measures 96x96 with a computed radius of 21px, which is 22% of the width.
- **SC-003**: Every frame's image is `object-fit: cover` and is not stretched: its rendered box is square
  and its natural width-to-height ratio is not preserved at the box's expense.
- **SC-004**: No frame has a visible border and none has a computed `border-width` above zero.
- **SC-005**: The entrance runs once, with the last icon's delay 300ms after the first, which is 60ms five
  times over.
- **SC-006**: Under reduced motion every frame is visible with `transform: none` and no transition.
- **SC-007**: At 390px the row's `scrollWidth` exceeds its `clientWidth` and every frame is reachable by
  scrolling, and the masked edge is transparent rather than a hard cut.
- **SC-008**: At 1440px the row does not scroll: `scrollWidth` equals `clientWidth`.
- **SC-009**: No image in the strip is missing an `alt` attribute, and none has an empty one.
- **SC-010**: axe reports zero violations at 1440, 768, 390 and 320.
- **SC-011**: The page's total layout shift stays below 0.1 on load, measured because six images are added
  where there were none.
- **SC-012**: The suite passes, and no existing test that contradicts this feature is deleted rather than
  rewritten.

## Assumptions

- The strip is a preview, not a second carousel. It shares the carousel's 96px frame so the two are
  recognisably the same asset, and shares none of its behaviour: no autoplay, no index, no dots, no
  keyboard navigation, because none of that is meaningful for a row of six static images.
- Only the icon is shown. The project name is already in the carousel, and six names under six icons
  would repeat the section's own copy.
- Nothing is clickable. The section's existing "Ver proyectos" call to action is the one route onward.
- The artwork is served from `raw.githubusercontent.com`, as it already is on `/projects`. This adds six
  requests to the landing page, which is accepted: the same six are already fetched for anyone who
  follows the call to action, and they are small PNGs.
- `object-fit: cover` crops roughly 4% of `QEntry`, which is 379x366 and therefore not square. This is
  the same trade the carousel already makes and is accepted rather than solved by a per-icon adjustment.
- The technology marquee's pause control is out of scope. It was discussed and cancelled, and this feature
  does not depend on it in either direction.

## Amendments

### Amendment 4 - "No autoplay" is superseded; the rest of the assumption stands

**Added by**: `specs/013-project-icon-rotation`, 2026-10-08.

This specification's Assumptions say:

> The strip is a preview, not a second carousel. It shares the carousel's 96px frame so the two are
> recognisably the same asset, and shares none of its behaviour: **no autoplay**, no index, no dots, no
> keyboard navigation, because none of that is meaningful for a row of six static images.

**"No autoplay" no longer holds.** The strip now changes the apps it shows on a four-second interval,
with the four pause conditions and the reduced-motion opt-out that `specs/013` specifies.

The rest of the assumption is untouched and remains true:

- **It is still not a carousel.** There is no index, no dots, no previous or next control, and nothing is
  clickable. The section's existing "Ver proyectos" call to action remains the only route onward.
- **It still shares only the frame with the carousel on `/projects`.** Nothing else is borrowed.
- **It still shares none of the carousel's navigation behaviour.** There is no keyboard navigation,
  because there is nothing to navigate: the slots are fixed positions and the apps move through them, so
  there is no current slide to advance from.

**What is also unchanged, and matters more than it looks:**

The six slots do not reorder. Only the app in each slot changes. That is the reason this amendment is
small: the row's own geometry, its DOM order, its entrance stagger keyed by slot index, its
`object-fit: cover`, its 22% radius, its 96px frame, its entrance animation running once, its
`role="list"` with `role="listitem"` frames, and its horizontal scrolling row with a masked edge on a
phone are all untouched by the rotation.

**Every success criterion in this specification continues to hold**, with two exceptions that
`specs/013` adds its own criteria for: SC-006 gains the requirement that the row's computed transition
duration stays at `0s` under reduced motion, which is where the rotation's fade would otherwise appear;
and SC-011 gains that the layout shift stays below 0.1 across rotations, not only on load.

**Verified against**: `tests/e2e/project-icon-strip.spec.ts`, unchanged. No assertion of this
specification was deleted to make room for `specs/013`.

### Amendment 5 - On a phone the row is one icon that rotates, not a carousel of six

**Added by**: `specs/013-project-icon-rotation`, 2026-10-08.

This specification made the row a horizontally scrolling carousel below 700px, and two of its success
criteria describe that behaviour. Both are superseded.

**SC-001 is narrowed.** It said:

> Six frames render inside `#projects-summary` at 1440x900, 768x1024 and 390x844.

It now reads: six frames render at 1440x900 and 768x1024, and **one** frame renders at 390x844. The
count of frames is a function of the viewport, which the original criterion did not contemplate.

**SC-007 is withdrawn.** It said:

> At 390px the row's `scrollWidth` exceeds its `clientWidth` and every frame is reachable by scrolling,
> and the masked edge is transparent rather than a hard cut.

There is no scroller any more, so there is no `scrollWidth`, no reachability by scrolling, and no edge to
mask. Its replacement is SC-014 below. The three techniques it required — `overflow-x: auto`,
`scroll-snap-type` and the linear-gradient `mask-image` — are all removed rather than left in place,
because a rule that cannot be reached has no effect and a `mask-image` with nothing to fade is dead
weight in a stylesheet shipped to every visitor.

**Why the carousel is being dropped rather than kept.** It was built because six 96px frames are 656px
and a phone is 390px, and a clipped row hides half the work. Solving that by scrolling introduced a
second problem that the original specification did not anticipate: a horizontal scroller inside a vertical
page competes with the page's own scroll, and `scroll-snap-type: x proximity` makes that competition
feel like a bug rather than like a choice. Showing one icon at a time removes the horizontal scroller
entirely, and the rotation from `specs/013` now does the work of surfacing the other five apps.

**What is unchanged.** The 96px frame, the 22% radius, `object-fit: cover`, the transparent-corner
handling, the entrance animation with its 60ms stagger, `role="list"` with `role="listitem"`, and the
desktop row's non-scrolling geometry. SC-002, SC-003, SC-004, SC-006, SC-008, SC-009 and SC-010 all stand
as written, and SC-006's `transition-duration: 0s` under reduced motion is now more load-bearing than it
was, because the rotation's fade is a transition on the same property.

**SC-014 (new)**: At 390px the row renders exactly one frame, centred, that shows a different app after
each interval, and the row does not scroll horizontally.

**SC-015 (new)**: The row changes between the six-frame and one-frame layouts only at the 700px
breakpoint it already used, so there is no viewport range in which the carousel styles apply while six
frames are still in the document.
