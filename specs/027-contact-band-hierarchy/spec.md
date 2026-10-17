# Feature Specification: The Contact Band's Hierarchy

**Feature Branch**: `027-contact-band-hierarchy`

**Created**: 2026-10-16

**Status**: Draft

**Input**: User description: "En la sección Home > Contacto debe tener esta estructura en desktop:
¿Tienes un proyecto? / Hablemos y pongamos manos a la obra / (ir→) / (iconos) ismaelmarot@hotmail.com.
La frase 'tienes un proyecto?' debe tener el mismo tamaño que SOBRE MI en la sección Sobre mí y estar
arriba a la izquierda. 'Hablemos y pongamonos...' debe tener el tamaño de los textos de las otras
secciones. Mi mail visible debe ser ismaelmarot@contacto.com y al hacer click debe enviar a
ismaelmarot@hotmail.com; debe estar bien a la derecha. Los iconos a la izquierda. Consistencia visual,
estilo profesional, sin miedo a tamaños más grandes. En móvil, elegir la organización más profesional."

## The gap this specification fills

`specs/025-contact-band-composition` settled the band on an arrangement where the **email address is the
subject**: it is the largest element, it carries a diagonal arrow, and the question is a small caption
beneath it. The maintainer now wants the **question to be the subject**: it must read at the same scale
as the section titles ("Sobre mí"), sit at the top-left, and the email must become a large but subordinate
element at the right of a row whose left side holds the networks.

Three things change:

1. **The hierarchy.** The question moves up to the section-title scale, and the email moves down to one
   display step below it.
2. **The order.** The band becomes a vertical stack — question, sentence, call to action, then the
   networks/email row at the bottom — instead of the current arrangement where the row is raised to the
   top.
3. **The address.** The visible text and the destination separate: the band shows
   `ismaelmarot@contacto.com` and the link points at `mailto:ismaelmarot@hotmail.com`.

## What this specification is not

- It does not change the networks, their order, or where they point.
- It does not change the band's height, id, accessible name, or scroll-snap alignment.
- It does not touch the footer or the `/contact` page: the visible-address split is scoped to this band.
- It does not make the question a level-one heading. The band keeps exactly one level-two heading, and
  the Home page keeps one level-one heading in the Hero.

## The hierarchy

| Element | Scale | At 1440 | At 768 |
|---|---|---|---|
| Question | section-title scale | 72px | 40px |
| Email | one display step below the question | 56px | 32px |
| Sentence | body text | 16px | 16px |

The question is the largest text in the band and the only element at the section-title scale. The email
is large enough to read as a call to action and small enough to be clearly subordinate. The sentence is the
body text the other sections already use.

## The order

Desktop, top to bottom:

1. The question, top-left.
2. The sentence.
3. The call to action, left-aligned beneath the sentence.
4. A row: the networks at the left, the email flush right.

Mobile: a single column in the same reading order, with the networks and the email stacked because the
email's scale does not leave room for both on one line.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read the question as the section's subject (Priority: P1)

A visitor reaches the bottom of the landing page. The question reads at the same scale as the "Sobre mí"
section title, so the band opens with a heading rather than a caption.

**Why this priority**: It is the request, and it is the change that reverses the band's hierarchy.

**Independent Test**: Measure the rendered question at 1440 and compare it to the rendered "Sobre mí"
section title.

**Acceptance Scenarios**:

1. **Given** the band at 1440, **When** the question renders, **Then** it is the same size as the "Sobre mí" section title.
2. **Given** the band at 768, **When** the question renders, **Then** it is the same size as that title and fits without overflowing.
3. **Given** any viewport, **When** the question renders, **Then** it is the largest text in the band.

---

### User Story 2 - See the band in the requested order (Priority: P1)

A visitor sees the question at the top-left, the sentence and the call to action beneath it, and the
networks and the email on the bottom row, the networks at the left and the email at the right.

**Why this priority**: The second half of the request.

**Independent Test**: Load `/` and compare the rendered arrangement against the specified one.

**Acceptance Scenarios**:

1. **Given** the band above 768px, **When** it renders, **Then** the question is above the sentence, the sentence is above the call to action, and the call to action is above the networks/email row.
2. **Given** the band above 768px, **When** it renders, **Then** the networks are at the left and the email is flush right on the same row.
3. **Given** the band at 320 or 390, **When** it renders, **Then** the elements stack in one column and nothing overlaps or overflows horizontally.

---

### User Story 3 - Write to the address the band shows (Priority: P1)

A visitor reads `ismaelmarot@contacto.com` and, when they press it, their mail client opens addressed to
`ismaelmarot@hotmail.com`.

**Why this priority**: The visible text and the destination are now two different values, and the band is
the only place that shows the visible one.

**Acceptance Scenarios**:

1. **Given** the band, **When** the email link is rendered, **Then** its visible text is `ismaelmarot@contacto.com`.
2. **Given** the band, **When** the email link is rendered, **Then** its destination is `mailto:ismaelmarot@hotmail.com`.
3. **Given** the band, **When** the email link is rendered, **Then** it has no `target` and its arrow is `aria-hidden`.

---

### User Story 4 - Keep the band's identity and its outline (Priority: P2)

A visitor using a screen reader reaches the band and hears the question before the networks and the email.

**Why this priority**: The visual arrangement and the reading order are in conflict, and resolving it in
favour of the drawing alone would cost the page its outline.

**Acceptance Scenarios**:

1. **Given** the band, **When** its heading is queried, **Then** it is the question and it is the band's only level-two heading.
2. **Given** the band in the DOM, **When** elements are read in order, **Then** the heading precedes the networks and the email.
3. **Given** the band, **When** it renders, **Then** it keeps its id, its accessible name, its height and its snap alignment.

---

### Edge Cases

- **A narrower viewport.** The question wraps rather than overflowing; the email steps down through its own scale.
- **A longer email.** The email's scale is a clamp, so a longer address steps down rather than overflowing.
- **No networks.** The row renders the email alone.
- **Facebook and Instagram with no destination.** `useContactBand` already drops them.
- **Reduced motion.** Transitions are removed.
- **A platform with classic scrollbars.** The available width differs from the viewport, and the layout must not overflow.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The question MUST render at the section-title scale, the same scale the "Sobre mí" heading uses, and MUST be the largest text in the band.
- **FR-002**: The question MUST be positioned at the top-left of the band.
- **FR-003**: The sentence MUST render at the body-text scale, the same scale the other sections' body text uses.
- **FR-004**: The email MUST render one display step below the question: large enough to read as a call to action, subordinate to the question.
- **FR-005**: The visible email text MUST be `ismaelmarot@contacto.com` and the link MUST point at `mailto:ismaelmarot@hotmail.com`. The visible text and the destination MUST be independent values.
- **FR-006**: The email MUST be flush right within its row and the networks MUST be at the left of the same row.
- **FR-007**: Above 768px the band MUST be a vertical stack: question, sentence, call to action, then the networks/email row.
- **FR-008**: The call to action MUST remain a link to `/contact` carrying an arrow, and MUST be left-aligned beneath the sentence.
- **FR-009**: At or below 768px the band MUST stack in a single column in the same reading order, and MUST NOT overflow horizontally at 320px or 390px.
- **FR-010**: The question MUST remain the band's only level-two heading.
- **FR-011**: The band's id, accessible name, height and snap alignment MUST NOT change.
- **FR-012**: The networks MUST remain a list with list items, each an external link carrying `target="_blank"` and `rel="noopener noreferrer"`.
- **FR-013**: The email MUST remain a single `mailto:` link with no `target`, and its arrow MUST remain `aria-hidden`.
- **FR-014**: No new dependency and no new component.
- **FR-015**: The other typographic tokens MUST NOT change.

### Key Entities

- **Question**: the band's single heading, at the section-title scale, first in the DOM.
- **Sentence**: `SiteConfig.contactTagline`, at the body-text scale, beneath the question.
- **Call to action**: the band's only control, a link to `/contact`.
- **Networks**: the social links, a list at the left of the bottom row.
- **Email**: the band's address, a single `mailto:` link at the right of the bottom row, whose visible text and destination are independent.
- **Row**: the networks and the email side by side.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At 1440 the rendered question's font size equals the rendered "Sobre mí" section title's.
- **SC-002**: The question is the largest text in the band at every viewport.
- **SC-003**: The rendered email's font size is one display step below the question's at 1440 and at 768.
- **SC-004**: The email link's visible text is `ismaelmarot@contacto.com` and its destination is `mailto:ismaelmarot@hotmail.com`.
- **SC-005**: At 1440 the networks' right edge is left of the email's left edge, and the email's right edge is at the row's right edge.
- **SC-006**: Above 768px the vertical order is question, sentence, call to action, networks/email row.
- **SC-007**: At 320 and 390 the band renders in one column with no horizontal overflow.
- **SC-008**: The band keeps its id, its accessible name, its height and its snap alignment.
- **SC-009**: The band has exactly one level-two heading, and it is the question.
- **SC-010**: Lint, type checking, the unit tests, the component tests and the build pass.
- **SC-011**: The accessibility audit reports zero violations on every route at every viewport.
- **SC-012**: The other typographic tokens are unchanged.

## Design references

For traceability into the plan phase, the scales above map to the project's existing design tokens:

| Scale in this specification | Design token | Value |
|---|---|---|
| section-title scale | `--text-display-section` | `clamp(2.5rem, 5vw, 4.5rem)` |
| one display step below the question | `--text-display-project` | `clamp(2rem, 4vw, 3.5rem)` |
| body text | `--text-body` | `1rem` |

The email keeps the `--text-display-email` token as its single source of size, whose ceiling is
`--text-display-project`, so it can never outgrow the question. The question reads `--text-display-section`
directly, which is the token the "Sobre mí" heading already uses.

## Assumptions

- **The question stays a level-two heading.** The Home page keeps its single level-one heading in the Hero, and the band keeps one voice.
- **The call to action is left-aligned beneath the sentence.** The drawing shows it there; it is one declaration to change.
- **Mobile stacks in reading order: question, sentence, call to action, networks, email.** The email's scale does not leave room for the networks and the email on one line at 390px, so they stack.
- **The visible-address split is scoped to this band.** The footer and the `/contact` page keep the current address; the request names the Home contact section.
- **The sentence is the body-text scale.** "The size of the texts in the other sections" is read as the body text those sections use.
