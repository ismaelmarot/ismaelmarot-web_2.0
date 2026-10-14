# Feature Specification: The Technology Marquee on the Landing Page

**Feature Branch**: `016-technology-marquee`

**Created**: 2026-10-14

**Status**: Implemented

**Input**: Three maintainer requests, delivered on 2026-10-03 and recorded in the commit subjects rather
than anywhere else: "scroll the technologies on the home page in two opposite rows", "quieten the
technology marquee" and "draw the marquee control as a circle". They are `4e3ae15`, `4968883` and
`432d83f`.

> **Retrospective.** This feature shipped on 2026-10-03, three weeks before this document existed, and it
> has been in production ever since. It is the largest user-visible behaviour in the repository with no
> functional requirement of its own, and it is written here because the record was missing, not because
> the feature was wrong. `tasks.md` in this folder is a record of the work as it was done rather than a
> plan for it, following the pattern of `specs/015`.

## The gap this specification fills

The landing page's Technologies section was a grid of chips that stood still. The maintainer asked for
the opposite: the technologies should scroll, in two rows, in opposite directions. It shipped in
`4e3ae15` at 621 insertions against 136 deletions, then was quietened the same day in `4968883`, then had
its control drawn as a circle in `432d83f`.

Three commits, one afternoon, 15 files touched, and no specification. The component carries a component
test, a pause hook whose comment cites WCAG 2.2.2 by failure number, and a `duration` token — the
markers of a feature that was thought about carefully and written down nowhere.

## Why this is documented now rather than left as it was

Three later specifications cite this component, and **one of them cites it wrongly**.

`specs/011/spec.md` states in its Assumptions: "The technology marquee's pause control is out of scope. It
was discussed and cancelled, and this feature does not depend on it in either direction."
`specs/013/research.md` then reads that sentence as history and records the decision to reuse the control
as: "That control was discussed and cancelled in feature 011, and it belongs to a different component."

**Both are half right, and the half that is wrong is the consequential half.** Nothing was cancelled. The
control shipped with this feature on 2026-10-03, four days before `specs/011` was written, and
`useMarqueePause.ts` has been in the repository ever since. What `specs/011` meant — and what its own
sentence says in its first clause — is that reusing the control was **out of 011's own scope**: 011 would
not build a pause control for the icon strip and would not depend on this one existing either way. The
word "cancelled" carried the scope decision, and a later reader took it for the feature's existence.

So `specs/013` declined to reuse a control that was sitting right there, and the reuse it declined was a
real opportunity. That is the cost of the missing record, and it is stated here rather than left for
someone to rediscover.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read the technology list without it moving (Priority: P1)

A visitor who wants to read the technologies sees two rows moving in opposite directions and can stop
them with one control. The control's accessible name says what it will do, not what state it is in.

**Why this priority**: WCAG 2.2.2 at **level A**, failure **F16**, which is this exact case: content that
moves by itself for more than five seconds with no mechanism to pause it. The animation is 80 seconds
long. Without the control this is a level A failure, and level A is not negotiable.

**Independent Test**: Load `/`, read the control's accessible name, activate it, and assert both rows
hold their position. Then activate it again and assert both resume.

**Acceptance Scenarios**:

1. **Given** the landing page, **When** it renders, **Then** the control's accessible name reads "Pausar el carrusel de tecnologías".
2. **Given** the control is activated, **When** both rows are measured over four seconds, **Then** neither has moved.
3. **Given** the rows are stopped, **When** the control is activated again, **Then** the name reads "Reanudar el carrusel de tecnologías" and both rows resume.
4. **Given** the control is activated, **When** its glyph is read, **Then** the glyph itself is hidden from assistive technology and the name is not duplicated.

---

### User Story 2 - Read the list once, not twice (Priority: P1)

A screen-reader user moving through the Technologies section hears each technology once. The duplication
that makes the scroll loop seamless is present in the DOM and invisible to assistive technology.

**Why this priority**: The loop is built by rendering the whole list twice in each row. Without the
`aria-hidden` half, every technology is announced twice, in two rows, in each of the two copies — eight
announcements of a list of about thirty items, in a section that is not the subject of the page.

**Independent Test**: Load `/`, read the Technology section, and count how many times any one technology
name is announced.

**Acceptance Scenarios**:

1. **Given** the landing page, **When** a screen reader traverses the section, **Then** each technology is announced once per row and not twice.
2. **Given** the duplicate half of a row, **When** it is inspected, **Then** it carries `aria-hidden` and its pills carry no test id, so it is not a second list.
3. **Given** the control, **When** its state changes, **Then** the list itself is untouched — pausing must not change what is announced.

---

### User Story 3 - See a list that never shows a seam (Priority: P1)

A visitor sees technology chips passing continuously in both directions, with no gap where the loop
closes and no moment where the row is empty.

**Why this priority**: This is the feature. The two opposite directions are what the request asked for,
and the seam is the failure mode every hand-rolled marquee has.

**Independent Test**: Load `/`, watch both rows for a full 80-second cycle, and confirm neither shows an
end or a pause.

**Acceptance Scenarios**:

1. **Given** the landing page, **When** the section renders, **Then** two rows are present, the upper travelling left and the lower travelling right.
2. **Given** either row, **When** it is inspected, **Then** it holds the complete category list twice.
3. **Given** either row, **When** the animation runs, **Then** it moves by exactly `-50%` of the track, which is one copy, so the loop closes without a seam.
4. **Given** the two rows, **When** they are compared, **Then** they carry identical content, which is what makes them travel at the same speed.
5. **Given** the rows, **When** they are inspected, **Then** each has an accessible name distinguishing the upper from the lower.

---

### User Story 4 - Not be shown movement that was refused (Priority: P2)

A visitor who has asked their operating system for reduced motion sees the technologies as a static
wrapped list. The pause control is not rendered, because there is nothing to pause.

**Why this priority**: The constitution requires WCAG 2.1 AA and this repository already ships a global
reduced-motion rule. A CSS `animation` is not covered by a rule that zeroes `--transition-normal`, so
this has to be opted into explicitly or it bypasses it.

**Independent Test**: Emulate `prefers-reduced-motion: reduce`, load `/`, and assert the rows have no
animation and the control is absent.

**Acceptance Scenarios**:

1. **Given** reduced motion is enabled, **When** the section renders, **Then** neither row animates.
2. **Given** reduced motion is enabled, **When** the section renders, **Then** the pause control is not rendered, because nothing moves.
3. **Given** reduced motion is disabled, **When** the section renders, **Then** the control is rendered and named for the action it performs.

---

### Edge Cases

- **A category with no technologies.** `getPopulatedCategories` drops it, and a row never renders an
  empty group. A group with nothing in it would be a gap in the loop.
- **No technologies at all.** The component returns `null` rather than rendering an empty band.
- **A technology whose brand mark fails to load.** Handled by `TechnologyPill`, not here; the row's
  geometry does not depend on the image resolving.
- **The track is narrower than the container.** Cannot happen at any viewport, because one copy of the
  list is already wider than the section allows. That is why no measurement is needed to decide the loop
  closes.
- **A very long category name.** The category name is not rendered beside the pills; only the pills are.
  The heading names the section once.
- **The visitor tabs into the row.** The rows are `role="group"`, not focusable content, so nothing inside
  them takes focus. Pausing is a decision the visitor makes with the control, not something focus can
  do.
- **The control is pressed with the keyboard.** It is a `<button>` and takes focus in order, so this needs
  no separate handling.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The landing page's Technologies section MUST render two rows of technology pills, the upper
  travelling left and the lower travelling right.
- **FR-002**: Each row MUST hold the complete category list twice, and MUST hide the second copy from
  assistive technology so the list is announced once per row.
- **FR-003**: The animation MUST translate the track by exactly `-50%`, which is one copy of the list, so
  the loop closes without a seam and without a measurement of the track's width.
- **FR-004**: Both rows MUST carry identical content and the same duration, so they travel at the same
  speed. The second row reverses the keyframes rather than using a different animation.
- **FR-005**: The movement MUST be provided by the shared `marqueeScroll` keyframes in
  `src/styles/globals.css` and driven by the `--duration-marquee` token in `src/styles/tokens.css`. No
  component defines its own keyframes or its own duration literal.
- **FR-006**: The component MUST return nothing when no technology carries a populated category.
- **FR-007**: The component MUST be passed into the landing page through the existing `featuredItems`
  prop of `SectionSummary`, and MUST NOT require a change to that shared component's API.
- **FR-008**: Each row MUST carry an accessible name distinguishing the upper row from the lower.
- **FR-009**: A single control MUST pause and resume both rows, as W3C recommends where a page has more
  than one moving element, rather than one control per row.
- **FR-010**: The control MUST be named for the action it performs — "Pausar…" or "Reanudar…" — and MUST
  NOT use `aria-pressed`, because a toggle whose label changes with its state reads two contradictory
  things at once.
- **FR-011**: The control's glyph MUST be `aria-hidden`, so the accessible name is the name and not the
  name plus a glyph.
- **FR-012**: Pausing MUST stop both rows and MUST NOT change what the rows contain, so nothing is added
  to or removed from the accessibility tree when the state changes.
- **FR-013**: Under `prefers-reduced-motion: reduce` neither row MUST animate, and the control MUST NOT be
  rendered.
- **FR-014**: The rows MUST fade at both edges with a `mask-image` linear gradient, so a chip crossing the
  boundary is masked rather than sliced.
- **FR-015**: The control MUST be a `<button>`, so it is reachable and operable by keyboard without any
  additional handling.
- **FR-016**: The component MUST NOT be focusable inside the rows; nothing in a moving row takes focus.

### Key Entities

- **Marquee**: the two rows and the control above them. The single component of this feature.
- **Row**: one horizontal band, `role="group"`, travelling in one direction. Two exist.
- **Track**: the element the keyframes move, holding two copies of the list.
- **Copy**: one rendering of the category groups. The first is announced; the second is `aria-hidden` and
  exists only to close the loop.
- **Control**: the one button that stops both rows.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Two rows render inside the landing page's Technologies section, the upper carrying
  `data-marquee-direction="forward"` and the lower `"reverse"`.
- **SC-002**: Each row's track holds the complete list twice: four groups for two rows, against two when
  only the announced copies are counted.
- **SC-003**: Every duplicate copy carries `aria-hidden`, and no technology is announced twice per row.
- **SC-004**: The animation resolves to the shared `marqueeScroll` keyframe with
  `--duration-marquee: 80s` and `linear` timing, in both rows.
- **SC-005**: The control's accessible name is "Pausar el carrusel de tecnologías" while the rows move and
  "Reanudar el carrusel de tecnologías" while they are stopped.
- **SC-006**: With the control activated, both rows' computed `transform` is unchanged over four seconds.
- **SC-007**: Under reduced motion neither row carries an animation and no control is rendered.
- **SC-008**: Both rows carry a `mask-image`, and neither cuts a chip at its edge.
- **SC-009**: The landing page's cumulative layout shift stays below 0.1, measured because this feature
  changed the shape of a section that already had one.
- **SC-010**: axe reports zero violations at 1440, 768, 390 and 320, and specifically no `aria-hidden`
  violation for the duplicate copies.
- **SC-011**: Nothing inside a row is focusable.
- **SC-012**: Type checking, linting, the unit tests, the component tests and the production build pass,
  and no existing test is deleted.

### On what is and is not backed by these criteria

**SC-001 through SC-008 and SC-011 are covered by twelve component tests** in
`TechnologyMarquee.test.tsx`, which assert the row count, the doubled content, the `aria-hidden` half, the
shared keyframes and duration, the two directions, the control's name, the hidden glyph, the glyph swap,
that the control stops both rows, that it resumes them, and the empty case.

**SC-009 and SC-010 were not verified against this feature specifically.** Layout shift and axe are
measured by the repository's own tooling on every commit — `tests/e2e/` and `scripts/audit-a11y.mjs` — but
neither run was performed as part of writing this document, and neither names this feature. The honest
statement is that they are covered by the pipeline in general and unverified for this feature in
particular.

**No browser test covers the loop closing.** SC-003's visual consequence — that a visitor cannot see the
seam — is the property of the whole feature and no assertion anywhere reaches it. Reading `-50%` in a
stylesheet is not the same as watching a chip cross the boundary for eighty seconds, and this document
does not claim to have done the latter.

## Assumptions

- **Two directions is the request.** "Two opposite rows" is the maintainer's own phrasing and it is what
  `4e3ae15` built. A single row was not considered and is not proposed here.
- **80 seconds is deliberate.** It is slow enough that the movement reads as ambient rather than as a
  carousel. It also puts this feature unambiguously inside WCAG 2.2.2's five-second threshold, which is
  why FR-009 exists rather than being a nicety.
- **One control, not two.** W3C's guidance for several moving elements is one control for all of them.
  Two controls would double the tab stops for one decision.
- **The duplicate copy stays in the DOM.** The alternative — duplicating with a pseudo-element or a
  transform — cannot be hidden from assistive technology reliably, and an announced list twice is a worse
  failure than a redundant node.
- **Reduced motion removes the control rather than disabling it.** A rendered button that pauses nothing
  is a control that lies about what it does.
- **The chips are decoration of the section, not its content.** The section's heading and its call to
  action carry the message; the row shows the vocabulary at a glance. That is why no category name is
  rendered beside the pills and why nothing in the row is focusable.
- **This stays on the landing page.** The `/technologies` page keeps its own presentation, set out by
  `specs/010`, and this feature does not touch it.

## Amendments

### Amendment 1 - What it cost to have this undocumented, and the two sentences that caused it

**Added by**: record audit, 2026-10-14, writing the specification 11 days after the last of its commits.

**`specs/013` declined a reuse that was available.** Its research records the decision to not reuse this
component's pause control, on the grounds that the control "was discussed and cancelled in feature 011".
That is a misreading of `specs/011`'s own sentence, which scoped the reuse out of 011 rather than
reporting that the control did not exist. The control existed, was tested, cited WCAG 2.2.2 by number in
its own JSDoc, and shipped four days before 011 was written. `specs/013` therefore built its own pause
logic — `useIconRotation` carries its own four pause conditions — when it could have reused a component
that was sitting in the repository, tested, doing the same job.

**The corrected reading is recorded in `specs/011`'s Amendment 6**, and `specs/013`'s research table is
left as it was written, because a research document is a record of what was decided at the time and
rewriting it would be a worse lie than leaving it.

**What generalises.** "Cancelled", "dropped", "out of scope" and "never built" are four different things
and this repository's specifications used the first when it meant the fourth. The three specifications
that record a control as cancelled — 011's assumption, 013's research row, and the pair that quotes it —
would each have been one sentence of truth if a specification had existed at the time.

**`specs/011`'s amendment numbering has a gap.** Its Amendments section opens at Amendment 4. Amendments 1
through 3 are not in that file and appear nowhere in it. Whether they were superseded and removed or
never existed is not recoverable from the repository, and this document records the fact rather than
guessing which.