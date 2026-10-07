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

## Amendment 1 - Grey gradient surface

**Applied**: 2026-10-03, after implementation and deployment.

**Request**: "las tarjetas que sean en un gris y con un efecto degradado".

The flat near-black surface this feature shipped is replaced by a diagonal grey
gradient. Recorded here rather than in a new specification because it revises one
visual decision this feature already owns, and nothing else about it changes.

- **FR-001** now reads: cards MUST paint a `linear-gradient(135deg, ...)` from
  `#48484A` at the top left to `#2C2C2E` at the bottom right, MUST have no border,
  and MUST keep a shadow that separates them from the `#F5F5F7` section.
- **FR-002** is unchanged in intent but had to move its colour. The muted foreground
  went from `#A1A1A6` to `#BFBFC4`, because a gradient has to be judged on its
  **lightest** stop rather than its average: `#A1A1A6` measured 6.54:1 on the flat
  near-black card but only 3.55:1 on `#48484A`, which fails AA. `#BFBFC4` measures
  4.98:1 there and still sits well below the name's 8.38:1, so the hierarchy between
  the two survives.
- **The icon frame background became translucent white** (`rgba(255, 255, 255, 0.09)`)
  instead of a fixed `#2C2C2E`. A fixed colour behind a gradient looks lighter at one
  end of it than at the other; a translucent white lightens whatever is behind it
  equally at both ends.
- **SC-002** is re-anchored: both text colours must clear 4.5:1 against `#48484A`, not
  against the card's average tone. Measured: name 8.38:1, description 4.98:1.

Measured after the change: gradient present at 135deg on every viewport, no horizontal
overflow, axe clean at 1440, 390 and 320, section still 900 of 900 on desktop.

## Amendment 2 - The Icon Frame Is Sized for the Phone It Is On

**Applied**: 2026-10-05, after deployment.

This is a qualification of one requirement by the carousel spec's Amendment 1, which is where the
reasoning and the measurements live. It is recorded here because FR-017 below is the requirement
being qualified, and a spec should not be silently overridden from another file.

### The qualification

FR-017 fixed the icon frame at 120px without naming a viewport, and it is correct to keep 120px
where there is room for it. It is not correct on a phone. At 320px the card is 256px wide inside the
gutters, and this spec's own edge case already conceded that a 120px icon, the project name and a
48px action cannot share one line there.

Below 520px the frame becomes 80px, with its radius scaled to stay 22% of the frame so the
silhouette is unchanged. Measured at 320x640 with everything else in that amendment in place, the
description then shows two whole lines instead of one and a half cut through the middle.

The name drops to 22px and the description is clamped to two lines at the same breakpoint, for the
same reason: the card has to be the same shape on every phone, which is what the three-line clamp was
doing on larger screens and what its own code comment says it is for.

The 48px action becomes 44px below 520px, which still satisfies FR-004's 44px minimum.

### Requirements superseded by this amendment

- **FR-017** is superseded on mobile only. It now reads: the icon frame MUST measure 120px at 520px
  and above, and 80px below it, with a radius of 22% of the frame at both sizes.

### Requirements added by this amendment

- **FR-021**: Below 520px the project name MUST compute at 22px and the description MUST be clamped to
  two lines, so that every card has the same height on every phone.
- **SC-013**: The icon frame measures 120px at 1440px and 80px at 320px, and its radius is 22% of the
  frame at both sizes.

---

## Amendment 3 - Light Cards, Smaller Cards

**Applied**: 2026-10-06, after implementation and deployment.

**Request**: "en la seccion de proyctos, el carrousel de proyectos, las cards deben ser mas pequenas y de
color gris claro estilo apple"

Amendment 1 replaced the flat near-black card with a dark grey gradient. This amendment inverts it,
which is worth stating plainly rather than presenting as a fresh decision: the same surface is now
light, and the reason is not a change of taste but that the section background is `#F5F5F7` and a
darker card cannot compete with it for attention.

### Why white and not a light grey

Measured against the section, every candidate was evaluated on the same two questions: does it read
as the focus of the page, and does the text on it pass.

| candidate | vs section | separates alone | description `#6E6E73` | accent `#0071E3` |
|-----------|-----------|------------------|---------------------|-----------------|
| `#FFFFFF` | 1.09:1 | no, needs shadow | 5.07:1 | 4.70:1 |
| `#FAFAFC` | 1.04:1 | no | 4.86:1 | 4.51:1 |
| `#F2F2F7` | 1.02:1 | no | 4.54:1 passes | **4.21:1 fails** |
| `#E8E8ED` | 1.12:1 | no | **4.15:1 fails** | **3.85:1 fails** |

`#F2F2F7` is Apple's own system-grey background and it is the wrong choice here. At 1.02:1 against
the section it is the least separable card of the four, and it drops the accent blue to 4.21:1, which
fails AA for small text. That matters because the round action and the brand marks both use `#0071E3`.

Anything darker than white is a hierarchy mistake as much as a contrast one. The card is the content
of this section, the thing a visitor is meant to look at, and against a grey background only white
makes it the brightest element on the page. `#E8E8ED` is nearly indistinguishable from the section and
costs the description its AA compliance at 4.15:1.

**Correction to the above, found by measuring it in a test**: the description on `#F2F2F7` measures
4.54:1 and does pass AA, so it was not what decided the colour. What fails there is the action's blue
at 4.21:1, and only at `#E8E8ED` does the description fail as well. The argument for white stands, but
it rests on the accent and on hierarchy rather than on the description.

### Shadow, not border

A `#D2D2D7` border on a white card measures 1.51:1 against the card, and WCAG holds a non-text
boundary to 3:1, so a subtle border does not qualify and is not added. The shadow does the work: the
existing two layers take the `#F5F5F7` background down to `#D8D8DA`, and the second layer is deepened
to `#D2D2D4` so a smaller card still separates from its surroundings.

### Everything the inversion touches

| element | dark card | light card | measured |
|---------|-----------|------------|----------|
| name | `#F5F5F7` | `#1D1D1F` | 16.83:1 |
| description | `#BFBFC4` | `#6E6E73` | 5.07:1 |
| icon frame | `rgba(255, 255, 255, 0.09)` | `#E8E8ED` | a translucent white on white is invisible |
| category badges | translucent white | `#F2F2F7` fill, `#48484A` text | 8.38:1 |
| action | `#0071E3` | `#0071E3` unchanged | 4.70:1, passes |

The action keeps the accent blue rather than turning dark, because a black plus on a white card would
lose the brand colour and measure no better.

### Smaller

The card goes from 800px wide to 620px, and the icon frame from 120px to 96px on desktop.

Width alone does not shrink the height, and this was measured rather than assumed: at 800, 700, 620
and 560px wide the card stayed at 476px tall, because its height is set by the flex chain and not by
its content. The card is therefore given an explicit maximum height, and the section is re-checked at
every viewport afterwards.

### What this amendment also fixes

The carousel overflowed on short desktop viewports before this change, and it was not caught because
every measurement so far used a 900px-tall viewport:

| viewport | section | overflow |
|----------|---------|----------|
| 1024x768 | 779 of 768 | 11px |
| 1440x760 | 801 of 760 | 41px |
| 1280x720 | 793 of 720 | 73px |
| 1024x700 | 779 of 700 | 79px |

The cause is that the card has a content floor of about 377px, which with the heading, the filter and
the controls does not fit below roughly 790px of viewport height. The smaller card lowers that floor,
and SC-017 makes short viewports part of what is measured so this cannot recur unseen.

### Requirements superseded by this amendment

- **FR-001** is superseded. It read that cards compute a `#1D1D1F` background. They now compute
  `#FFFFFF`, with no border and a deepened shadow.
- **FR-002** is superseded. Text is dark rather than light: the name `#1D1D1F` and the description
  `#6E6E73`, each against `#FFFFFF`.
- **FR-017** is superseded on the frame: it is 96px on desktop and stays 80px below 520px, with a
  `#E8E8ED` background and no translucent light border, which would be invisible on a light card.
- **FR-020** is superseded: badges sit on `#F2F2F7` with `#48484A` text, measured on white.
- **SC-001** is superseded: the card computes `rgb(255, 255, 255)`.
- **SC-002** is re-anchored: both text colours clear 4.5:1 against `#FFFFFF`.
- **SC-008** is superseded: the icon frame measures 96px on desktop, 80px on a phone.
- **SC-011** is superseded: it referenced the frame growing from 88px to 120px, and it now shrinks.

### Requirements added by this amendment

- **FR-022**: Cards MUST compute `#FFFFFF`, MUST have no border, and MUST keep a two-layer shadow that
  takes the `#F5F5F7` section background to `#D2D2D4` or darker, since shadow alone is the separator.
- **FR-023**: Cards MUST be 620px wide at 900px and above, with an explicit maximum height, since the
  card's height is set by the flex chain and not by its width.
- **FR-024**: The icon frame background MUST be `#E8E8ED` at every viewport, since a translucent white
  frame is invisible on a white card.
- **FR-025**: The category badges MUST compute `#F2F2F7` fill with `#48484A` text.
- **FR-026**: The action MUST keep `#0071E3`, which measures 4.70:1 on white and carries the brand
  colour, rather than darkening with the rest of the card.
- **SC-014**: Every text colour on the card clears 4.5:1 against `#FFFFFF`, and the action against the
  card, at every viewport.
- **SC-015**: The card is 620px wide and no taller than 380px at 900px and above.
- **SC-016**: The section fits the viewport at 1280x720, 1024x700, 1440x760 and 1024x768, which it did
  not before this amendment.
- **SC-017**: Short viewports of 760px and 720px of height are part of what is measured, because the
  previous criteria only ever used 900px and missed a real overflow.
- **SC-018**: A test asserts each contrast pair rather than asserting a colour string, so an inversion
  cannot pass without being measured.
- **SC-019**: Zero axe violations at 1440, 1024x768, 768, 390 and 320.
- **SC-020**: The full suite passes.

FR-003 through FR-016, FR-018, FR-019 and FR-021 stand unchanged. The carousel behaviour, the
autoplay, the controls and the accessibility contract are untouched by a change of surface.

---

## Amendment 4 - Every Card Is the Same Height

**Applied**: 2026-10-06, after implementation and deployment.

**Request**: "todas las cards de pryectos deben tener el mismo tamano de ancho y alto entre ellas"

This is not a new requirement. It is one this feature already carried and Amendment 3 broke, and
the carousel spec states it in as many words at its own line 116: a long description "stays clamped
to three lines **so cards stay the same height**".

### What was measured

At 900px and above the six cards came out at four different heights, at every viewport:

| card | size | name lines | description lines |
|------|------|-----------|-------------------|
| trash2treasure | 620x326 | 1 | 1 |
| car-expense-tracker | 620x**336** | **2** | 1 |
| LinkIO | 620x326 | 1 | 1 |
| QEntry | 620x**353** | 1 | **2** |
| NauticAcademy | 620x**381** | 1 | **3** |
| cash-counter | 620x326 | 1 | 1 |

Two separate causes, and only one of them is the description the request named.

**The description** varies because the clamp permits three lines, and a line is 27px. One line gives a
70px body, two give 97, three give 125. `NauticAcademy` at 168 characters falls into the third.

**The name is a second cause, and fixing only the description would have left the defect in place.**
`car-expense-tracker` has a one-line description and is still 10px taller than `trash2treasure`,
because its heading wraps to two lines and the icon row grows with it. Every other heading is one line.

Below 900px the cards were already equal, because they stretch to the height of the strip there.

### The cause is in Amendment 3

Amendment 3 replaced the card's height with `height: auto` alongside `align-self: flex-start`, in
order to stop 184px of section background from showing under a smaller card at 1440x900. Those two
declarations are what let each card measure its own content. Before it, `height: 100%` equalised
every card in the strip as a side effect of the flex chain.

The equal height is restored as a stated requirement rather than as that side effect, because a side
effect is not something to rely on: it held below 900px by accident and broke above it by accident.

### The measure

381px, which is the tallest card measured. Nothing is truncated to reach it: the longest description
still shows all three lines and the longest name still shows both of its lines.

The name reserves two lines rather than one. Truncating it would be cheaper, and it was considered,
but two names in the data wrap and cutting them removes the thing that identifies the project. The
cost of reserving is white space under the shorter names, which is invisible in a carousel because
only one card is centred at a time.

**The clamp is what makes the fixed height safe.** A description of four lines is cut to three by the
existing clamp, so the height cannot grow when the data changes. That is why this amendment fixes the
height without capping the content.

### Requirements superseded by this amendment

- **FR-023** is superseded. It read that cards carry an explicit maximum height so the height is set
  by the flex chain rather than by the width. A maximum height is not a fixed height: it lets a short
  card stop short. Cards are now exactly 381px from 900px up.

### Requirements added by this amendment

- **FR-027**: At 900px and above, every card MUST measure exactly 381px tall and 620px wide,
  independent of its name or description length, since the two vary by up to 55px between the data
  in `projects.json`.
- **FR-028**: The project name MUST reserve the height of two lines at 900px and above, expressed as a
  multiple of its own line height, so that a one-line name does not shorten its card.
- **FR-029**: No project's name or description may be truncated to meet FR-027. The three-line clamp
  remains the only truncation in force, and it applies identically to every card.
- **SC-021**: All six cards measure the same width and the same height at 900x900, 1024x768,
  1280x800 and 1440x900, which is the range where they differed before this amendment.
- **SC-022**: No card's description is cut mid-line at any of those sizes, and the three-line clamp is
  what bounds it rather than the container.
- **SC-023**: Below 900px the cards remain equal, which they already were and which no rule in this
  amendment may disturb.
- **SC-024**: A browser test measures every card at every tested viewport and compares them against
  each other, because this feature passed every one of its own criteria while four of its six cards
  were different heights.

---

## Assumptions

- The site stays light-only, so `#1D1D1F` cards are a designed dark surface rather than a dark theme. No `prefers-color-scheme` work is included.
- The category badges keep their existing variant, becoming light chips on the dark card.
- The dots introduced in the previous feature remain; the request did not ask to remove them.
- Seven seconds is long enough for the descriptions as written, which are clamped to three lines.
- Auto-advance starting by itself is acceptable here because the stop control is present, visible and keyboard reachable, which is what WCAG 2.2.2 requires.