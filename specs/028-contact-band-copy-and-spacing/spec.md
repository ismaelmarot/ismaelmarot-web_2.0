# Feature Specification: The Contact Band's Copy and Spacing

**Feature Branch**: `028-contact-band-copy-and-spacing`

**Created**: 2026-10-17

**Status**: Implemented

**Input**: User description: "En la landing > Contacto: haya un mayor espacio vertical entre la sección
que contiene '¿Tienes un proyecto? / Hablemos y pongamonos manos a la obra / (ir)' y la fila de iconos de
social media y el mail. Además: 'Hablmeos y pongamos manos a la obra' debe tener el tamaño de tipografía
que tiene 'Me interesa crear tecnologías que tengan sentido' en Sobre mí; 'pongamonos' va con acento."

## The gap this specification fills

`specs/027-contact-band-hierarchy` settled the band on a hierarchy in which the question is the display
and the sentence reads the body-text scale. Three refinements remain, all of them copy and spacing only:

1. **The reflexive form.** The sentence reads `pongamos`; the request asks for the reflexive
   `pongámonos`, with its accent — "pongámonos manos a la obra" is the idiom, and Spanish writes the
   accent on a stressed final syllable of an imperative nosotros form.
2. **The sentence's scale.** The other bands' descriptions read `--text-large-subtitle`; the band's own
   sentence reads `--text-body`. The request names the "Me interesa…" description of "Sobre mí" and asks
   for that size.
3. **The column's rhythm.** The question, the sentence and the call to action sit one step from the
   networks/email row beneath them. The request asks for more air between the closed block and the row.

Three things change:

1. **The copy.** `contactTagline` reads `Hablemos y pongámonos manos a la obra`.
2. **The scale.** `StyledContactBandDescription` moves from `--text-body` to `--text-large-subtitle`,
   the token the "Sobre mí" description already uses.
3. **The rhythm.** `StyledContactBandInner`'s gap moves from `space[10]` (40px) to `space[12]` (48px),
   the next step on the scale.

## What this specification is not

- It does not change the question's size, position or heading level: `specs/027`'s inversion stands.
- It does not change the networks, their order, the email, its visible text or its destination.
- It does not change the band's height, id, accessible name, or scroll-snap alignment.
- It does not touch the footer or the `/contact` page.
- It does not change the other sections: the "Me interesa…" description keeps its token, and this spec
  moves the band towards it, not it towards nothing.

## The hierarchy after this specification

| Element | Scale | At 1440 | At 768 | At 390 |
|---|---|---|---|---|
| Question | `--text-display-section` | 72px | 40px | 40px |
| Email | `--text-display-email` | 56px | 32px | 23px |
| Sentence | `--text-large-subtitle` | 20px | 20px | 20px |

The sentence stays below both the question and the email at every viewport, so `specs/027`'s acceptance
— the question is the largest text in the band — keeps holding. The email's 18px floor sits under the
sentence's 20px floor at a phone, the same relation "Sobre mí" already lives with, and the E2E asserts
the outcome on the rendered page.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read the reflexive form with its accent (Priority: P1)

A visitor reads `Hablemos y pongámonos manos a la obra`, with the accent the request asks for.

**Why this priority**: It is copy the visitor reads verbatim; a missing accent is a misspelling on the
landing page's closing sentence.

**Independent Test**: Read `siteConfig.contactTagline`, or the rendered tagline, and compare it against
the accented string.

**Acceptance Scenarios**:

1. **Given** the landing page, **When** the band renders, **Then** the tagline reads
   `Hablemos y pongámonos manos a la obra`.
2. **Given** `siteConfig`, **When** its value is read, **Then** it is the accented string — the resting
   place of the copy is configuration, not the component.

---

### User Story 2 - Read the sentence at the other sections' scale (Priority: P1)

A visitor reads the sentence at the same size as the "Me interesa…" description in "Sobre mí", and it
stays the smallest of the band's three texts.

**Why this priority**: The request is explicitly about size, and the hierarchy of `specs/027` keeps the
question above it.

**Independent Test**: Measure the rendered sentence against the rendered "Me interesa…" description, and
against the question, on the real page.

**Acceptance Scenarios**:

1. **Given** the band at 1440, **When** the sentence renders, **Then** its font size equals the
   "Me interesa…" description's.
2. **Given** the band at 390 and 320, **When** the sentence renders, **Then** it stays smaller than the
   question and it does not overflow.
3. **Given** any viewport, **When** the band renders, **Then** the question remains the largest text in
   it.

---

### User Story 3 - See more air between the block and the row (Priority: P2)

A visitor sees a clearly larger vertical gap between the block of question, sentence and call to action,
and the row of networks and email beneath it, than the band carried before.

**Why this priority**: It is the arrangement refinement; the layout itself is already settled, and this
is a step on an existing scale rather than a restructure.

**Independent Test**: Measure the gap between the copy block's last element (the button) and the top of
the row at 1440, and compare it against the previous band's.

**Acceptance Scenarios**:

1. **Given** the band at 1440, **When** it renders, **Then** the gap between the call to action and the
   row is the `space[12]` step (48px), which is greater than the `space[10]` (40px) the band carried.
2. **Given** the band at 390 and 320, **When** it renders, **Then** it still fits one screen without
   horizontal overflow: the wider gap comes out of the band's existing height, which centres its
   content.
3. **Given** any viewport, **When** the band renders, **Then** it keeps `min-height: 100dvh` and its
   scroll-snap alignment.

### Edge Cases

- **A narrower viewport.** The sentence wraps at its new size rather than overflowing; its
  `max-width: 60ch` cap and the band's padding keep it inside the column.
- **A longer sentence.** It is still one line to three short lines at most; the wider gap is a fixed
  step and never a function of the sentence's length.
- **Mobile height.** The band's extra 8px come from the same 100dvh shell, which centres rather than
  scrolls; SC on the snap test exists to catch a height that grows past a viewport.
- **Reduced motion.** Nothing here animates.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `siteConfig.contactTagline` MUST read `Hablemos y pongámonos manos a la obra`, and it
  MUST remain the band's only source for the sentence.
- **FR-002**: The sentence MUST stay a paragraph beneath the question, and the band MUST keep exactly
  one level-two heading.
- **FR-003**: The sentence MUST render at `--text-large-subtitle`, the token the "Me interesa…"
  description in "Sobre mí" uses, and MUST be the same size as that description on the rendered page.
- **FR-004**: The question MUST keep rendering at `--text-display-section` and MUST remain the largest
  text in the band at every viewport.
- **FR-005**: The gap between the copy block (question, sentence, call to action) and the networks/email
  row MUST be `space[12]`, and MUST NOT be carried as a margin on the copy or the row.
- **FR-006**: The band's id, accessible name, height and snap alignment MUST NOT change.
- **FR-007**: No other token, component or page MUST change.

### Key Entities

- **Question**: `specs/027`'s heading, unchanged here; only its distance to the row below it moves.
- **Sentence**: `SiteConfig.contactTagline`, accented, at the shared description scale.
- **Call to action**: the band's only control, unchanged.
- **Row**: the networks and the email, unchanged; only its distance to the copy above it moves.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The rendered tagline is `Hablemos y pongámonos manos a la obra`.
- **SC-002**: At 1440 the rendered sentence's font size equals the rendered "Me interesa…" description's.
- **SC-003**: At every viewport the question is larger than the sentence and the email is smaller than
  the question.
- **SC-004**: At 1440 the vertical gap between the call to action's bottom edge and the row's top edge
  measures the `space[12]` step (48px), greater than the `space[10]` (40px) it measured before.
- **SC-005**: At 320 and 390 the band renders with no horizontal overflow.
- **SC-006**: The band keeps its id, its accessible name, its height and its snap alignment.
- **SC-007**: Lint, type checking, the unit tests, the component tests and the build pass.
- **SC-008**: The accessibility audit reports zero violations.

## Assumptions

- **`Hablmeos` is the maintainer's typo for `Hablemos`.** The code has never carried the misspelling;
  the request's rendering of it (`Hablmeos y pongamonos`) is read over the spec 027's recorded copy.
- **`pongámonos` rather than `pongamos`.** The request writes `pongamonos` and says "va con acento",
  which together describe the reflexive imperative with its accent.
- **`space[12]` is the step.** The maintainer picked it from three options presented; no other spacing
  value is under discussion.
- **The sentence's colour and weight do not change.** Only its size is named, and "Sobre mí"'s
  description shares its `textSecondary` colour already.

## Amendments recorded during implementation

- **The E2E's button-alignment baseline was wrong before this feature touched it.** `botonALaIzquierda`
  measured the button against the section's left edge, which the centred, max-widthed inner sits 80px
  inside of at 1440 — the assertion failed against the committed specification's own code (`main`
  carried it red), not against this feature's changes. It now measures against the question's left
  edge, which is what `align-items: flex-start` promises and the same number at every viewport. Recorded
  here because it changed a `tests/` file this feature did not plan for (see plan's Project Structure).
- **`data-testid="contact-band-inner"` was added to `ContactBand.tsx`.** The component test that holds
  the new gap needs to reach the inner element, and `no-node-access` forbids reaching for a parent
  through a child. The testid mirrors the row's, which already names structural markup for the tests.
