# Feature Specification: GitHub Contributions Heatmap

**Feature Branch**: `010-github-contributions-heatmap`

**Created**: 2026-10-04

**Status**: Implemented

**Input**: "En la seccion de Tecnologias. En Contribuciones en GitHub no se ve que se hayan hecho pusheos hoy"

This specification exists to document a feature that shipped without one. The heatmap was built as
part of the landing page work and no specification ever claimed it: `003-landing-home-page` requires
only that the Technologies page group technologies by category (FR-010), and no specification under
`specs/` mentions a contribution calendar at all. The original request arrived as a report that today's
pushes were not visible, and investigating it turned up a real defect plus this documentation gap.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See what was worked on recently (Priority: P1)

A visitor opens the Technologies page and lands on the most recent weeks of the contribution calendar,
not on the oldest, so the first thing they see is current activity rather than a year-old March.

**Why this priority**: This is the reported defect. The data was always correct and already contained today; the strip simply started 416px to the left of it, so on a phone today's cell was off-screen and the heatmap read as a dormant year.

**Independent Test**: Open `/technologies` at 390px and verify the strip is scrolled to its end and the most recent day is inside the visible area without any interaction.

**Acceptance Scenarios**:

1. **Given** a viewport narrower than the full year, **When** the calendar first renders, **Then** the strip is scrolled to its rightmost end, showing the most recent weeks
2. **Given** a viewport wide enough for the whole year, **When** the calendar renders, **Then** no scrolling is applied and the whole year is visible
3. **Given** the strip has been scrolled to its end, **When** the most recent day is inspected, **Then** it lies within the visible area of the strip
4. **Given** the calendar renders, **When** it appears on screen, **Then** the jump to the end happens before the first paint rather than after it

---

### User Story 2 - Tell today apart from every other day (Priority: P1)

A visitor can see which cell is today without reading every cell, including when today has few or no contributions, where the cell colour alone says nothing.

**Why this priority**: A cell's colour encodes how much was done, never which day it is. On a day with two contributions the cell is the same purple as any other day with two, so "today" was indistinguishable even once it was on screen.

**Independent Test**: Open `/technologies` and verify the most recent cell is outlined and that no other cell carries that outline.

**Acceptance Scenarios**:

1. **Given** today has any number of contributions, **When** the calendar renders, **Then** today's cell is outlined
2. **Given** today is not in the fetched data, **When** the calendar renders, **Then** no cell is outlined, rather than the last available day being presented as today
3. **Given** a visitor reads the calendar with a screen reader, **When** they reach today's cell, **Then** its description states that the day is today

---

### User Story 3 - Read the year's shape without guessing (Priority: P2)

A visitor reads the legend, the period and the four figures to understand the calendar as a whole: how much was contributed, how many days were active, the longest run and the weekly average.

**Why this priority**: The heatmap alone is a texture. These four numbers and the legend are what turn it into information, and they were already built and are unaffected by this feature's defect.

**Independent Test**: Open `/technologies` and verify the period, the five-step legend and the four figures all render.

**Acceptance Scenarios**:

1. **Given** the calendar renders, **When** the figures are read, **Then** the total, active days, longest streak and weekly average are shown
2. **Given** the calendar renders, **When** the legend is read, **Then** five levels are shown from no activity to the highest
3. **Given** a cell is inspected with a pointer or a screen reader, **When** its description is read, **Then** it states the date and the number of contributions

---

### Edge Cases

- **No overflow to scroll to**: on a wide viewport `scrollWidth` equals `clientWidth`, and assigning `scrollLeft` is a no-op rather than an error.
- **Stale build data**: if the calendar's last day is yesterday, no cell is outlined. Marking the last available day would present a stale day as today.
- **Clock skew around midnight**: the "today" comparison uses the same UTC basis as the stored dates. A visitor in a timezone whose local date has already rolled over sees today's UTC cell, not a cell for a day that has not been fetched.
- **Today with zero contributions**: the cell is still outlined, because the outline marks the day and not the activity. An empty cell is the most in need of the marker.
- **Keyboard user tabbing into the strip**: the browser scrolls the focused element into view, so tabbing moves the strip back towards the start. That is the browser behaving correctly and must not be fought by re-running the effect.
- **A cell at the right edge**: today is the last cell, so any outline drawn outwards would be clipped by the scroll container. The outline has to be drawn inwards.
- **Reduced motion**: the scroll is an instant jump, not an animation, so it is not motion and remains correct under `prefers-reduced-motion`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: On mount, the calendar MUST set its scroll position to the maximum, so the most recent weeks are the ones visible. This MUST happen before the first paint, and MUST be a single instant assignment rather than a smooth scroll.
- **FR-002**: The scroll MUST be applied once per mount. It MUST NOT re-apply on re-render or resize, because that would fight a visitor who has scrolled the strip themselves.
- **FR-003**: Today's cell MUST be marked with a two-tone outline: a light hairline and a dark hairline, so that at least one of the two contrasts with the cell beneath it.
- **FR-004**: The outline MUST be drawn inside the cell's own bounds, so that a cell at the edge of the grid cannot have its outline clipped by the scroll container.
- **FR-005**: Today's cell MUST be identified by comparing each cell's stored date against the current UTC date. The last cell in the data MUST NOT be assumed to be today.
- **FR-006**: Today's cell description MUST state that the day is today, for assistive technology. No other cell's description may claim to be today.
- **FR-007**: The feature MUST degrade gracefully when the build could not fetch a calendar, by rendering nothing, so that an empty grid is never read as a year without work.
- **FR-008**: The calendar data MUST be fetched at build time through the GraphQL API, written to a data file, and the component MUST read that file rather than fetching at runtime.
- **FR-009**: Contribution counts MUST map to five levels, and every cell MUST be reachable by assistive technology with its date and count.
- **FR-010**: The horizontal scroller MUST be reachable by keyboard and MUST NOT trap vertical page scrolling.

## Key Entities

- **Contribution day**: one calendar day with an ISO date, a contribution count and a weekday. The only unit of the heatmap.
- **Contribution calendar**: 53 weeks of days, plus the year's total. The unit the strip scrolls over.
- **Level**: one of five buckets a count falls into, from no activity to the highest, painted in a purple ramp.

## Amendment 1 - The Cell Is Not Marked; The Grid Is Labelled

**Applied**: 2026-10-04, after implementation and deployment.

**Request**: "En Tecnologias > Contribucuiones en GitHub, la nueva contribucion se ve extrana en su diseno o bordes. por que puede ser?"

The two-tone outline was reported as looking wrong, and it was. Four measured reasons, all of them
consequences of the outline rather than of the data or the scroll:

1. **The outline rendered three different things depending on the level.** Its premise was that no
   single colour clears 3:1 across the purple ramp, so guaranteeing that *at least one* of two tones
   contrasts would cover every case. That guarantees a minimum but says nothing about the case where
   *both* are visible. At level 1 white measures 3.4 and ink 4.9, so both pass and the cell gets a
   white inner line plus a dark outer line: a bevel. At level 0 the white is invisible at 1.3 and only
   the ink shows; at levels 2 to 4 the ink is invisible at 2.7, 1.7 and 1.1 and only the white shows.
   One marker, three appearances.
2. **Today's cell is level 3, where the white is what shows, and white does not read as an outline.**
   It measures 9.9:1 against the cell but 1.09:1 against the `#F5F5F7` section, so it was never an
   edge of the tile; it was a bright frame drawn inside it. On a grid of solid purple tiles, one tile
   with a white inner frame reads as a hole.
3. **The outline consumed the cell.** Two pixels of inset on a 10px cell leaves 6x6 of actual colour,
   so the marked tile stopped matching its neighbours and, being inset, read as recessed.
4. **The geometry was invalid.** The cell's radius is 2px. A 2px inset outline follows the same 2px arc
   offset inward, so its inner edge degenerates to radius 0: a square inner corner inside a rounded
   outer one. At 1px and 2px widths the corners collapse and anti-alias unevenly. This was the "odd
   borders" as a rendering artefact rather than a matter of taste.

The outline is removed. Today is now labelled with text under the grid instead, which is the more
honest signal anyway: a cell's colour encodes how much was done and never which day it is.

### Requirements superseded by this amendment

- **FR-003** is superseded. Its premise was right and its solution was wrong: covering every level with
  at least one of two tones permits the case where both show, and that is the bevel.
- **FR-004** is superseded. Inset was genuinely necessary, since the scroll container clips an outward
  outline, but it loses its reason to exist along with the marker.

FR-001, FR-002 and FR-005 through FR-010 stand unchanged.

### Requirements added by this amendment

- **FR-011**: No cell may carry any box shadow. Every cell MUST compute identically, so that no day is
  distinguished by the tile itself.
- **FR-012**: Today's count MUST be stated in words under the grid, reading "Hoy · N contribuciones", or
  "Hoy · sin contribuciones" when the count is zero, and MUST NOT repeat the date.
- **FR-013**: The label MUST sit inside the horizontal scroll container, in a wrapper sized to the grid's
  own content width, and MUST be aligned to its right edge. The grid is a fixed 686px at every viewport
  while the scroll container is not, so aligning to the container would place the label 420px away from
  today's column at 1440px and 164px away at 1024px.
- **FR-014**: The label MUST NOT be announced, because it repeats the accessible description the cell
  already carries. The cell's description remains the single authoritative statement that the day is
  today.
- **FR-015**: No label may be rendered when the calendar does not reach today, matching FR-005.
- **SC-009**: The label's right edge is within 2px of the right edge of today's column, at 320, 390, 768,
  1024 and 1440.
- **SC-010**: All 365 cells compute the same box shadow, which is `none`.
- **SC-011**: Exactly one label is rendered, and it is absent when the calendar does not reach today.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At 390px the strip's `scrollLeft` is greater than zero on load, and at 1440px it is zero because there is nothing to scroll.
- **SC-002**: Today's cell is inside the visible area of the strip at 320, 390, 768, 1024 and 1440 without any interaction.
- **SC-003**: Exactly one of the 365 cells carries today's outline, and it is the most recent cell.
- **SC-004**: The most recent cell is outlined even when its count is zero.
- **SC-005**: Today's accessible description contains today's marker and no other cell's does.
- **SC-006**: No horizontal overflow of the page at 320px, and the outline of the rightmost cell is fully drawn.
- **SC-007**: axe reports zero violations, and the component still renders nothing when given no calendar.
- **SC-008**: The full test suite passes.

## Assumptions

- The calendar is a static artefact of the build, so a mount-time scroll cannot race with the data arriving.
- The stored dates are UTC midnight, so today's comparison uses the same basis.
- GitHub's contribution calendar includes the current day when queried without an explicit range, which was verified against the API rather than assumed; both the ranged and unranged queries returned the current day.
- No month labels are added to the grid, so the initial view shows the recent weeks without a per-column date reference. The section's period text states the range. This is a known limitation, accepted rather than overlooked.
- The heatmap stays on the Technologies page; no page moves are part of this feature.