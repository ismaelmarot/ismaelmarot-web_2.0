# Feature Specification: Section-by-Section Scrolling on the Landing Page

**Feature Branch**: `023-home-scroll-snap`

**Created**: 2026-10-15

**Status**: Implemented

**Input**: A maintainer report on the landing page: *"scrolling down should move section by section."*

## The gap this specification fills

The landing page is five full-viewport bands stacked under a 52px fixed header. Scrolling through it
today is one continuous 5000px of document with no markers between the sections: the wheel carries the
visitor past three of them at a time, and nothing marks that a section was crossed.

The repository already uses scroll snapping twice — `specs/006` on the projects carousel and
`specs/011` on the project detail strips — both as `scroll-snap-type: x mandatory` on a scroller inside
a page. The landing page has no vertical equivalent.

## What this specification is, and is not about

**It is about rhythm, not about navigation.** The bands are already individually addressable and the
header already links to them by hash. Nothing here makes a section reachable that was not.

**It does not change a single band.** No `min-height`, no `padding`, no content, no order. The page is
the same length after this feature as before it, and the existing tests that measure band heights are
untouched and must keep passing.

## The decision that shapes everything: `proximity`, and only on `/`

**`proximity` over `mandatory`.** Both stop the scroll at a section. They differ entirely in whether the
visitor can refuse.

|  | `proximity` | `mandatory` |
|---|---|---|
| Stop near a band, let go | settles there | settles there |
| Flick three bands at once | goes where you threw it | forced back to one |
| "Find on this page" | browser can still land mid-page | fights the snap container |
| `#about-summary` anchor | jumps, then settles | jumps, then snaps back |
| A band shorter than the viewport | reachable | may be unreachable |
| Content added above the last band | fine | the last band becomes a trap |

The landing page has a concrete instance of the second-to-last row: **the footer is 182px, less than a
third of a 667px viewport.** Under `mandatory` it is not a snap point, and a visitor who scrolls into it
can be pulled back out to the last band with no way to settle. `proximity` has no such failure, which is
why the report's phrase — "de sección en sección" — is satisfied by it.

**Scoped to `/`.** `scroll-snap-type` is a property of the scroll container, and the scroll container is
`<html>`. Set globally it would reach every route, including `/projects`, whose carousel is already
`x mandatory` and whose vertical rhythm nobody asked to change. So the type is behind an attribute that
only exists while the landing page is mounted.

## What this specification is not

**It is not a table of contents.** The header's links already jump to the bands and keep doing so.

**It does not animate anything new.** `scroll-behavior: smooth` already exists in `globals.css` and this
feature does not change it.

**It does not affect horizontal snapping.** The landing page has horizontal scrollers inside its bands —
the technology marquee and the contributions strip. Snapping is per-axis; the vertical type on `<html>`
does not touch a horizontal scroller's own container.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Stop at a section instead of flying past three (Priority: P1)

A visitor scrolls down the landing page. When they stop near a section, the page settles on that
section's top edge rather than leaving them somewhere in the middle of the next one.

**Why this priority**: This is the request, stated as a rhythm rather than as a rule.

**Independent Test**: Load `/`, scroll so that a band's top edge is a short distance from the viewport's
top, stop, and measure where the page came to rest.

**Acceptance Scenarios**:

1. **Given** the visitor has scrolled to within the snapping distance of a band, **When** scrolling stops, **Then** the page settles with that band's top at the viewport's top edge.
2. **Given** the visitor is far from any band boundary, **When** scrolling stops, **Then** the page stays where it was thrown.
3. **Given** a band, **When** it comes to rest, **Then** the fixed header is above it and does not cover its heading.
4. **Given** the last band, **When** the visitor scrolls past its content into the footer, **Then** the page stays in the footer and does not pull back.

---

### User Story 2 - Skip freely when that is what is wanted (Priority: P1)

A visitor who wants to reach the bottom now, or the middle of a band rather than its top, or whatever is
at a particular point on the page, can. The snapping offers a resting place; it does not take away the
others.

**Why this priority**: This is what `proximity` buys over `mandatory`, and it is the property most likely
to be lost by accident if the type is later tightened to `mandatory`.

**Independent Test**: Flick the page hard enough to cross several bands in one gesture and confirm the
page comes to rest where the gesture ended rather than at the nearest boundary.

**Acceptance Scenarios**:

1. **Given** the visitor flicks across several bands, **When** scrolling stops, **Then** the page rests wherever the gesture ended.
2. **Given** a visitor uses the browser's find-on-page, **Then** the page can rest with a band partly scrolled past.
3. **Given** a visitor activates a header link that points at a band by hash, **Then** the page settles at that band.

---

### User Story 3 - Other pages are untouched (Priority: P2)

A visitor on `/projects`, `/about` or any other route scrolls normally. Nothing snapped before this
feature outside the landing page, and nothing snaps now.

**Why this priority**: The property is on `<html>`, so the absence of scoping would be a site-wide
regression rather than a landing page quirk, and it is the most likely way for this feature to cause
damage elsewhere.

**Independent Test**: Load each route and read the computed `scroll-snap-type` on `<html>`.

**Acceptance Scenarios**:

1. **Given** any route other than `/`, **When** the page loads, **Then** the computed `scroll-snap-type` on `<html>` is `none`.
2. **Given** the `/projects` carousel, **When** it scrolls horizontally, **Then** its own snapping behaves exactly as before, because its container is not `<html>`.

---

### User Story 4 - No movement for a visitor who asked for none (Priority: P2)

A visitor whose system requests reduced motion gets a landing page with no snapping, because snapping
moves the viewport without being asked for.

**Why this priority**: Not asked for. Decided rather than skipped, and recorded here so that a later
reader knows it was a choice and can reverse it.

**Acceptance Scenarios**:

1. **Given** `prefers-reduced-motion: reduce`, **When** the landing page loads, **Then** the computed `scroll-snap-type` on `<html>` is `none`.
2. **Given** any other preference setting, **Then** snapping is active on `/`.

---

### Edge Cases

- **The fixed header is 52px and `scroll-padding-top` is 64px.** `scroll-padding-top` is what keeps a
  snapped band below the header, and it already exists. Nothing here sets `scroll-margin-top` on the
  bands, because doing so as well would apply the offset twice.
- **The footer is 182px, shorter than any viewport tested.** It is not a snap point, which under
  `proximity` is the correct outcome: `scroll-snap-align: start` is not declared on it, so the document
  ends there without a target to be pulled back to.
- **A viewport shorter than a band.** No viewport in the matrix is shorter than the smallest band, but the
  feature does not depend on band height being full or tall. `scroll-snap-align: start` works regardless.
- **Navigating from `/` to another route and back.** The attribute is removed on unmount and set again on
  mount. The landing page's own scroll position is the browser's business and is not managed here.
- **Deep-linking to `#contact-summary`.** The browser scrolls before React mounts; the attribute is set on
  mount, so a snap container appears after the jump. Nothing re-snaps the page, because nothing scrolls
  it — but this is recorded because it is the one ordering this feature introduces.
- **The technology marquee and contributions strip** scroll horizontally inside their bands. They set their
  own snap on their own container and are unaffected by a vertical type on `<html>`.
- **A browser without scroll snapping.** The attribute is inert and the page scrolls normally. No
  feature detection, because there is nothing to fall back to.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `<html>` MUST have `scroll-snap-type: y proximity` while the landing page is mounted.
- **FR-002**: `<html>` MUST NOT have any `scroll-snap-type` on any other route.
- **FR-003**: The snap type MUST be applied through an attribute on the scroll container, not through a
  class on a band, because the scroll container is `<html>` and the bands are its descendants.
- **FR-004**: The five bands — hero, projects, technologies, about and contact — MUST declare
  `scroll-snap-align: start`.
- **FR-005**: The footer MUST NOT declare `scroll-snap-align`.
- **FR-006**: No band's size, padding, content or order may change.
- **FR-007**: `scroll-behavior` MUST NOT change.
- **FR-008**: With `prefers-reduced-motion: reduce`, `<html>` MUST NOT have a vertical snap type.
- **FR-009**: The attribute MUST be removed when the landing page unmounts, including on navigation to
  another route.
- **FR-010**: No band may gain a `scroll-margin-top`. `scroll-padding-top: 64px` already exists on
  `<html>` and declaring both would apply the header offset twice.
- **FR-011**: No existing horizontal snapping may change.
- **FR-012**: The hook MUST live in `src/hooks/`, alongside `useReducedMotion` and
  `useIntersectionObserver`, because it operates on the document rather than on a component.
- **FR-013**: No new dependency.

### Key Entities

- **Band**: one of the five full-viewport sections of the landing page, each with an id and each a snap
  target. The footer is not a band.
- **Snap type**: a property of `<html>`, present on the landing page and absent elsewhere.
- **Snap point**: a band with `scroll-snap-align: start`, where the viewport can come to rest.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The computed `scroll-snap-type` on `<html>` is `y proximity` on `/`.
- **SC-002**: It is `none` on `/projects`, `/about`, `/technologies`, `/contact`, `/blog` and
  `/blogging`.
- **SC-003**: All five bands have computed `scroll-snap-align: start`.
- **SC-004**: The footer has none.
- **SC-005**: With `prefers-reduced-motion: reduce`, the computed type on `/` is `none`.
- **SC-006**: Navigating from `/` to `/projects` leaves the computed type as `none`.
- **SC-007**: After a slow scroll that ends within the snapping distance of a band, that band's `top` is
  within 2px of the viewport's top plus `scroll-padding-top`.
- **SC-008**: After a fast flick across several bands, the resting position is more than one band height
  from where a `proximity` snap would have placed it — that is, the gesture is not overridden.
- **SC-009**: A band scrolled to rest is not covered by the fixed header. Measured as the band's heading
  being fully below the header's bottom edge.
- **SC-010**: No band's height differs from its value before this feature, at any viewport in the matrix.
- **SC-011**: Lint, type checking, the unit tests, the component tests and the build pass, and no
  existing assertion is deleted.
- **SC-012**: axe reports zero violations on every route.

### On what is and is not backed by these criteria

**SC-001 to SC-006 are computed styles**, read from a rendered page, because the point is which route the
attribute is on and whether the rule actually resolved.

**SC-007 and SC-008 are measured by scrolling and measuring where the page came to rest**, in a real
browser. `proximity` has no exposed state — there is nothing to assert about except the result — so the
result is the only thing available, and a test that asserted the CSS string would have been satisfied by a
rule the browser then ignored.

**SC-010 exists because a snap feature can silently resize a page.** It is measured against the values the
existing `hero-band` tests already assert, so a regression there fails a test that already exists.

## Assumptions

- **"De sección en sección" describes a rhythm, not an obligation.** If it was meant as "every scroll must
  land on a section", then `mandatory` is the correct value and this specification's central decision is
  wrong. The maintainer chose `proximity` when offered the choice, with the footer and find-on-page as
  the reasons.
- **The five bands are already full-viewport and stay that way.** Snap works on any element height, so the
  feature does not depend on it, but the bands' sizes predate this and were not revisited.
- **`scroll-padding-top: 64px` against a 52px header leaves 12px of breathing room** rather than the band
  flush to the header. That is the existing arrangement from `specs/003` and this feature keeps it.
- **Reduced motion disables the snap.** Decided here rather than asked about, because a visitor who
  requests reduced motion has asked not to be moved. Stated so it can be reversed.

## Amendments

### Amendment 1 - Reduced motion was not asked for and was decided anyway

**Added by**: during implementation, 2026-10-15.

The report asked for section-by-section scrolling and said nothing about motion preferences. Snapping
moves the viewport, which is movement, so `prefers-reduced-motion: reduce` disables it.

**Recorded rather than done silently**, because it is a behaviour a maintainer may not want and cannot
see: the landing page will look different to a visitor with the preference set, and that is a deliberate
difference. One declaration in `globals.css` reverses it.

### Amendment 2 - The attribute is set on mount, which is after the browser's own anchor jump

**Added by**: during implementation, 2026-10-15.

`scroll-snap-type` is declared on `<html>` behind an attribute that a hook sets when the landing page
mounts. On a deep link to `#contact-summary`, the browser scrolls before React mounts, so the snap
container appears after the jump.

**Nothing re-snaps the page** — the browser does not scroll, so there is nothing for the container to
correct — but the ordering is introduced by this feature and is worth knowing. Recorded rather than
solved, because solving it would mean managing scroll restoration on the landing page, which is a
different feature and was not requested.