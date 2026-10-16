# Feature Specification: The Contact Band's Composition

**Feature Branch**: `025-contact-band-composition`

**Created**: 2026-10-16

**Status**: Implemented

**Input**: A maintainer report on the landing page's closing band: *"mi email debe tener un tamaño como el
de la fase 'web developer' del comienzo. y este formato: (iconos media) ismaelmarot@hotmail.com > /
¿Tienes un proyecto? / Hablemos y pongamos manos a la obra / (ir ->)"*

## The gap this specification fills

`specs/021-contact-band-proportions` settled the band's proportions on a different arrangement and
measured its way there. Three things in it are now wrong for a different arrangement, and this feature
replaces them.

**The address is the wrong size.** It renders at `--text-display-email`, capped at 40px, while the Hero's
"Web Developer" — the phase the request names as the reference — renders at `--text-display-project`,
which reaches 56px. The band has two display elements and they are two steps apart, which is not what
the request describes.

**The arrangement is different.** The networks are in a row beneath everything, and the question and the
button share the left half while the address owns the right. The requested arrangement puts the networks
and the address on one row at the top, and the question, a line of copy and the button beneath it.

**The band has no supporting sentence.** It asks a question and offers a button; nothing says what
happens next.

## What this specification is not

**It does not change the address, the networks, or where they point.** The same five entries in
`siteConfig.socialLinks` render in the same order, and the address is still one `mailto:` link.

**It does not make the address a heading.** It is a link, so the band keeps exactly one level-two
heading and the page's outline does not gain a second voice.

**It does not let the address wrap.** Every arithmetic decision below exists to keep it on one line.

## The arithmetic, and why the ceiling moved rather than the column

The address is a fixed, known string: twenty-four characters. Measured on the rendered page in Inter at
weight 600 with the `-0.01em` tracking this link carries:

| px | 20 | 22 | 24 | 26 | 28 | 32 | 40 | 56 |
|---|---|---|---|---|---|---|---|---|
| width | 254 | 279 | 305 | 330 | 356 | **406** | 508 | **711** |

**`--text-display-project` is `clamp(2rem, 4vw, 3.5rem)`: 56px at 1440, 31px at 768, and a floor of 32px
below that.** Applying it unchanged fails at every viewport the band is tested at:

| viewport | available | size | needs | |
|---|---|---|---|---|
| 1440 | ~960 | 56 | 711 | fits |
| 768 | ~498 | 31 | 393 | fits |
| 390 | 358 | 32 | 406 | **over by 48** |
| 320 | 288 | 32 | 406 | **over by 118** |

**The fix was the column, not the ceiling.** The old arrangement gave the address half of a row —596px at
desktop — because it shared with the question. The requested arrangement puts the networks beside it, and
the networks are four 44px marks that need about 230px, so `auto 1fr` leaves the address roughly 960px.
That is enough for 56px with room to spare, and it is why the requested layout makes the request
possible at all.

**Below 768px the column is the full width and the size has to step down**, because there is no column
to widen. The step is `clamp(1.375rem, 6.6vw, 1.625rem)`:

| viewport | available | size | needs | |
|---|---|---|---|---|
| 390 | 358 | 25.7 | 326 | fits, 32 spare |
| 320 | 288 | 22 | 279 | fits, 9 spare |

**A fixed 26px was the first answer and it was wrong**: it fits 390 with 28px to spare and overflows 320
by 42px. The step is fluid because the two viewports have different room and the address has one length.

## What the hierarchy is, and why it got smaller rather than larger

**The question is `--text-body` (16px) and the new sentence is `--text-secondary` (14px).**

`specs/021` moved the question down to `--text-body` on the argument that the display in this band is an
email address, not a heading. Raising the address from 40px to 56px makes that argument stronger, not
weaker: the gap between subject and subordinate text widens from 2.5× to 3.5×.

**The cost is honest and worth stating**: a 16px question beneath a 56px address is a large visual
step, and on a 1440 screen the question reads as a caption rather than as a heading. That is the trade
the maintainer chose, and it is the same trade `specs/021` made.

## The order question, answered by `order`

The requested drawing puts the networks and the address at the top and the question beneath them. **The
DOM puts the question first** and moves the networks up with `order`.

A screen reader announces the band starting with its heading, which is what makes the page's outline
readable. Putting four social links first would announce a list of platforms before anything said what
the section was. `order` gives the drawing its arrangement without moving the heading out of first
position, and using one copy of the markup rather than two arrangements means the desktop and mobile
layouts cannot disagree.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read the address at the size of the opening (Priority: P1)

A visitor reaches the bottom of the landing page. The address is set at the same scale as the "Web
Developer" line at the top of the page, so the band reads as an ending that matches its beginning.

**Why this priority**: It is the request, and it is the one that needed arithmetic.

**Independent Test**: Measure the rendered address at 1440 and compare it to the rendered "Web Developer"
line.

**Acceptance Scenarios**:

1. **Given** the band at 1440, **When** the address renders, **Then** it is the same size as the Hero's "Web Developer" line.
2. **Given** the band at 768, **When** the address renders, **Then** it is the same size as that line and fits without wrapping.
3. **Given** the band at 390 or 320, **When** the address renders, **Then** it is one step smaller and still fits on one line.
4. **Given** any viewport, **When** the address renders, **Then** it does not wrap and does not overflow its column.

---

### User Story 2 - See the band in the order the request describes (Priority: P1)

A visitor sees the networks and the address together on one row across the top, and beneath them the
question, a sentence about what happens next, and the route to the contact page.

**Why this priority**: The second half of the request.

**Independent Test**: Load `/` and compare the rendered arrangement against the specified one.

**Acceptance Scenarios**:

1. **Given** the band above 768px, **When** it renders, **Then** the networks are at the left and the address at the right of the same row.
2. **Given** the band above 768px, **When** it renders, **Then** the question and the sentence are beneath that row, and the button is aligned to the right.
3. **Given** the band at 320 or 390, **When** it renders, **Then** the row stacks and nothing overlaps.

---

### User Story 3 - Know the section before its links (Priority: P1)

A visitor using a screen reader reaches the contact band and hears "¿Tienes un proyecto?" before hearing
GitHub, LinkedIn, Instagram and the email address.

**Why this priority**: The visual arrangement and the reading order are in conflict, and resolving it in
favour of the drawing alone would cost the page its outline.

**Acceptance Scenarios**:

1. **Given** the band, **When** its heading is queried, **Then** it is the question and it is the band only level-two heading.
2. **Given** the band in the DOM, **When** elements are read in order, **Then** the heading precedes the networks and the address.
3. **Given** the band visually, **When** it renders, **Then** the networks and the address are above the question.

---

### User Story 4 - Change the sentence without touching a component (Priority: P2)

A maintainer wants different copy under the question.

**Why this priority**: Not asked for directly; decided so the sentence is content rather than markup.

**Independent Test**: Change the value in `site-config.ts` and the band follows.

**Acceptance Scenarios**:

1. **Given** a different `contactTagline`, **When** the band renders, **Then** the sentence changes and no component is edited.
2. **Given** the band, **When** the sentence renders, **Then** it is a paragraph and not a heading, so the band's outline keeps one voice.

---

### Edge Cases

- **A longer address.** The ceiling is arithmetic for `ismaelmarot@hotmail.com` specifically. A longer
  address needs a smaller ceiling, not a wider column, and nothing detects the change.
- **A sixth network.** The row is `auto 1fr`, so the networks take what they need and the address takes
  the rest. At six networks the address loses roughly 52px, which at 1440 leaves 250px of slack and at
  768 leaves a margin of about 52px.
- **Facebook and Instagram with no destination.** `useContactBand` already drops them; the row reflows
  to two marks.
- **The band's `aria-label` stays "Contacto".** The arrangement changed; the section's name did not.
- **No networks at all.** The row renders the address alone and `auto 1fr` gives it everything.
- **The band's own height.** Unchanged at `100dvh`; this feature moves things within it, and the E2E
  test that asserts band heights is untouched.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The address MUST render at `--text-display-project` from 768px up, the same token the
  Hero's "Web Developer" line uses.
- **FR-002**: Below 768px the address MUST render at `clamp(1.375rem, 6.6vw, 1.625rem)`.
- **FR-003**: `--text-display-email` MUST be the only size the address reads, so the component does not
  carry a media query of its own.
- **FR-004**: The address MUST NOT wrap and MUST NOT overflow its column at 1440, 1024, 768, 390 or 320.
- **FR-005**: The networks and the address MUST share one row above 768px, networks first and the address
  second.
- **FR-006**: The question and a new sentence MUST appear beneath that row, the question first.
- **FR-007**: The button MUST be aligned to the right beneath the sentence.
- **FR-008**: The question MUST remain the band's only level-two heading.
- **FR-009**: The question MUST be the first element in the band's DOM, with the networks and the address
  raised into the top row by `order` rather than by moving markup.
- **FR-010**: The new sentence MUST come from `SiteConfig` and MUST NOT be written in a component.
- **FR-011**: The address MUST remain a single `mailto:` link with no `target`, and its arrow MUST remain
  `aria-hidden`.
- **FR-012**: The networks MUST remain a `ul` with `li` children, each an external link carrying
  `target="_blank"` and `rel="noopener noreferrer"`.
- **FR-013**: The band's height, `aria-label`, id and snap alignment MUST NOT change.
- **FR-014**: The four other tokens `--text-display-hero`, `--text-display-section`,
  `--text-display-project` and `--text-large-subtitle` MUST NOT change.
- **FR-015**: The comment recording why the address's ceiling was 40px MUST be replaced, because its
  arithmetic no longer describes the token.
- **FR-016**: No new dependency and no new component.

### Key Entities

- **Address**: the band's subject, one `mailto:` link with a diagonal arrow. It is the largest thing in
  the band and the only element sized against another component's token.
- **Top row**: the networks and the address side by side, `auto 1fr`.
- **Question**: the band's single heading, `--text-body`, first in the DOM.
- **Sentence**: `SiteConfig.contactTagline`, `--text-secondary`, beneath the question.
- **Button**: the band's only control, aligned right.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The rendered address's font size equals the rendered "Web Developer" line's at 1440 and at
  768. Measured, not asserted from the stylesheet.
- **SC-002**: The address's bounding box is within its column at 1440, 1024, 768, 390 and 320 — no
  horizontal overflow at any of them.
- **SC-003**: The address renders on a single line at all five viewports.
- **SC-004**: The address's computed font size at 320 is at most 23px and at 390 at most 26px, which is
  what keeps it inside 288px and 358px respectively.
- **SC-005**: At 1440 the networks' right edge is left of the address's left edge, and both are above the
  question's top edge.
- **SC-006**: The question is the band's first focusable-region element in DOM order and its only
  `h2`.
- **SC-007**: The sentence's text equals `siteConfig.contactTagline`.
- **SC-008**: `--text-display-email` is not referenced by any file other than `tokens.ts`,
  `ContactBand.styles.ts` and `ContactBand.test.tsx`.
- **SC-009**: `--text-display-project`, `--text-display-section`, `--text-display-hero` and
  `--text-large-subtitle` are byte-identical to their values before this feature.
- **SC-010**: The band's rendered height is unchanged at every viewport, which the existing
  `home-scroll-snap` assertion already covers.
- **SC-011**: Lint, type checking, the unit tests, the component tests and the build pass.
- **SC-012**: axe reports zero violations on every route at every viewport in the audit matrix.

### On what is and is not backed by these criteria

**SC-001 to SC-005 are measurements on a rendered page.** The whole feature is a claim about widths, and
widths are not observable from a stylesheet. A test asserting `font-size: clamp(...)` would pass on a
value that overflows.

**SC-002 and SC-003 are the criteria that replace `specs/021`'s table.** That specification recorded a
measured table and then a comment. This one records a test that fails when the number is wrong, which is
the part that survives.

**SC-009 is checked by reading the diff of `tokens.css`**, not by a test, and the reason is in Amendment 2.

## Assumptions

- **"El mismo tamaño que la fase web developer" means the same token, not the same pixels.** Both read
  `--text-display-project` above 768px. Below that the token's own 32px floor does not fit, and the step
  down is the only way to keep the promise the rest of the time.
- **The button is aligned right because the drawing shows it indented.** It is the most ambiguous mark in
  the drawing and one declaration to change.
- **The sentence is content, not markup.** `siteConfig` already holds the name, the title, the tagline,
  the about text and the address.
- **The heading keeps its place at 16px.** `specs/021` chose that and a bigger subject does not argue
  against it.

## Amendments

### Amendment 1 - A fixed 26px was the first answer and it was wrong at 320

**Added by**: during implementation, 2026-10-16.

The mobile step was first planned as a flat 26px, on the reasoning that it fits 390 with 28px to spare.

**It overflows 320 by 42px**: the address measures 330 at 26px against 288 available. The two viewports
have different room and the address has one length, so the step has to be fluid:
`clamp(1.375rem, 6.6vw, 1.625rem)` gives 22px at 320 and 25.7px at 390, and both fit.

Recorded because the failure mode is invisible on a phone-sized preview and because "it fit at 390" is
exactly the reasoning that produced it.

### Amendment 2 - The old ceiling's table is replaced, and the replacement is a test

**Added by**: during implementation, 2026-10-16.

`tokens.css` carried twenty-seven lines explaining why the address's ceiling was 40px, with a measured
table: 36px → 490 used of 596, 40px → 548, 44px → 599 and over by 3. That arithmetic described the old
two-column arrangement and is wrong for the new one.

**The reasoning is kept in its new form and the form changes.** A comment explaining a number is a record
of one measurement on one day. The E2E test that asserts the address does not overflow at five viewports
is the same knowledge with something that fails when the number is wrong.

**This is a genuine loss as well as a gain**: the specific measurement of 44px overflowing by 3px is gone.
It is kept here so the number is not lost with the comment.

### Amendment 3 - The 16px question was measured before it was accepted

**Added by**: during implementation, 2026-10-16.

The maintainer was offered three size pairs for the question and the new sentence — 16/14, 28/16 and
20/16 — with the consequence stated: a 16px question beneath a 56px address is a 3.5× gap.

**16/14 was chosen.** The alternative worth recording is 28/16, which would match the title-and-description
hierarchy the three bands above already use. The reason not to take it is `specs/021`'s: the display in
this band is an email address, and a 28px question beside a 56px address makes two things compete for
the same role.