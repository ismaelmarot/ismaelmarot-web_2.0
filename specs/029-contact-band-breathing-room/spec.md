# Feature Specification: The Contact Band's Breathing Room

**Feature Branch**: `029-contact-band-breathing-room`

**Created**: 2026-10-17

**Status**: Implemented

**Input**: User description: "En el Home > Contacto que los 'bloques' ¿Tienes un proyecto? / Hablemos y
pongámonos manos a la obra / (ir) y el bloque [iconos de social media] [mi mail] tengan un mayor
espaciado vertical. Hazlo usando buenas prácticas estilo Apple. Recuerda utilizar metodología SDD."

## The gap this specification fills

`specs/028-contact-band-copy-and-spacing` gave the copy block one step of air, `space[10]` → `space[12]`
(40px → 48px), and measured it. The maintainer now asks for more: the two blocks must separate by a
**greater** vertical space, and the reference given is Apple's practice — generous whitespace between
groups of content, rhythm rather than tightness.

One step remains the smallest honest change under a scale that already exists: **`space[12]` (48px) →
`space[16]` (64px)**, the step the maintainer chose from the options presented. It doubles the space
specs/028 gained and it is the same token the other bands spend on their own block padding (`padding-block:
space[16]`), so the band's inner air and its outer air agree.

## What this specification is not

- It does not change the copy, the question's scale, the sentence's scale, the email, the networks, the
  row or the shell — `specs/027`'s hierarchy and `specs/028`'s sizes stand untouched.
- It does not change the band's height, id, accessible name, or scroll-snap alignment. The band is
  `min-height: 100dvh` with its content centred; the wider gap is absorbed inside that height, the same
  way 48px was.
- It does not touch the footer or the `/contact` page.
- It does not add a token, a breakpoint, a component or a dependency. The air lives on one declaration.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See the two blocks separate by a full breath (Priority: P1)

A visitor reads the band and sees a clearly larger vertical gap between the block of question, sentence
and call to action, and the row of networks and email beneath it — a gap the eye can feel, the way
Apple's layouts separate groups rather than sandwich them.

**Why this priority**: It is the entire request; the band's composition is already correct, and only the
distance changes.

**Independent Test**: Measure the rendered distance between the call-to-action's bottom edge and the
row's top edge at 1440 and at 390, and compare it against the `space[12]` (48px) the band carried when
specs/028 shipped.

**Acceptance Scenarios**:

1. **Given** the band at 1440, **When** it renders, **Then** the button-to-row distance measures the
   `space[16]` step (64px), greater than the 48px `space[12]` measured before.
2. **Given** the band at 390 and 320, **When** it renders, **Then** the distance holds the same step
   and the band still fits one screen with no horizontal overflow.
3. **Given** any viewport, **When** the band renders, **Then** it keeps `min-height: 100dvh`, its snap
   alignment, its id and its accessible name.

### Edge Cases

- **A narrower viewport.** The gap is a fixed step and never a function of the content's length or the
  viewport's width; the sentence wraps above it rather than overflowing.
- **A longer sentence or a taller phone.** The band centres its content inside a full screen; the extra
  air comes out of the leftover, and the height assertion catches a band that grows past its viewport.
- **Reduced motion.** Nothing here animates.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The vertical gap between the copy block (question, sentence, call to action) and the
  networks/email row MUST measure the `space[16]` step (64px) on the rendered page, and MUST be greater
  than the 48px the band measured before.
- **FR-002**: The air MUST be owned by `StyledContactBandInner`'s gap — the single declaration this
  feature exists for — and MUST NOT be realized as a margin on the copy block, on the button or on the
  row.
- **FR-003**: The band's id, accessible name, height and snap alignment MUST NOT change.
- **FR-004**: No other token, section, page, component or dependency MUST change.

### Key Entities

- **Copy block**: question, sentence and call to action — `specs/027`'s left column, unchanged.
- **Row**: the networks and the email — `specs/025`'s bottom row, unchanged.
- **Gap**: the air between the two blocks. `space[16]` after this feature; owned by the one declaration
  `StyledContactBandInner` already uses to separate them.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At 1440 the rendered button-to-row distance measures 64px (with sub-pixel slack), and is
  greater than the 48px recorded when specs/028 shipped.
- **SC-002**: At 320 and 390 the distance is the same step and the band renders with no horizontal
  overflow.
- **SC-003**: The band keeps its id, its accessible name, its height and its snap alignment at every
  viewport.
- **SC-004**: Lint, type checking, the unit tests, the component tests and the build pass.
- **SC-005**: The accessibility audit reports zero violations.

## Assumptions

- **`space[16]` is the step.** The maintainer chose it from three presented options (`space[16]` 64px,
  `space[20]` 80px, `space[24]` 96px); no other value is under discussion.
- **"Buenas prácticas estilo Apple" is read as generous whitespace between groups**, not as a redesign:
  the request is a spacing change, and the scale the project already owns carries the value. No new
  visual language is introduced.
- **The gap stays responsive-neutral.** A fixed step on the scale need not shrink on a phone; the band
  is a full-screen snap target with room to carry it.
