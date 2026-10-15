# Feature Specification: The Contact Band's Proportions

**Feature Branch**: `021-contact-band-proportions`

**Created**: 2026-10-15

**Status**: Implemented

**Input**: A maintainer review of `specs/020`, returned as corrections rather than as a new request:
*"¿Tiene un proyecto? debe ser más pequeño. Es mi mail lo que debe ser más grande. Para tener una
relación de aspecto en desktop, mi mail debe ocupar el 50% del espacio disponible en la línea horizontal.
En el otro 50 % debe estar la frase 'Tienes un proyecto' y el botón de ir. El cual debe ser negro con
las letras y flecha en blanco. La sección de Contacto + el footer ocuparán el 100% del alto. Quita mi
nombre y apellido que pusiste al mismo nivel que los iconos. Faltan los iconos de facebook e
instagram."*

## What this specification fills

`specs/020` stated the right hierarchy and did not deliver it. It wrote that the address is the band’s
subject and therefore its largest element, and it shipped a band whose question was **72px** and whose
address was **36px** — the exact inverse of what it specified.

Measured against the production build before this change:

| | desktop 1440 | tablet 768 | phone 390 |
|---|---|---|---|
| Question `<h2>` | **72px** | 40px | 40px |
| **Address** | **36px** | 26px | 18px |
| Band height | 900 | 1024 | 844 |
| Footer height | 182 | 182 | 182 |
| **Band + footer** | **1082 = 1.20 screens** | 1206 = 1.18 | 1026 = 1.22 |

Two things were wrong and one of them was a contradiction inside a shipped document. The hierarchy was
inverted, and the band plus the footer did not share one screen.

## What this is deliberately not

**It does not make the band and the footer share one screen.** That requirement is withdrawn below. It
could only be met by measuring the footer at run time, which means a new hook and a change to `Layout`,
and the maintainer declined both: *"no modifiques eso entonces"* and then *"dejarlo como está"*. The band
therefore still runs to a full screen and the footer sits below it, and that section of the page is
about one screen and a fifth. Recorded as a withdrawal rather than as an omission.

**It does not change the contact page, the footer, or the other three bands.** The footer does gain two
marks, because it reads the same network list the band does — a consequence of one list feeding three
surfaces, recorded rather than prevented.

**It does not invent Facebook or Instagram profiles.** Neither URL exists. The two marks go to the
platforms’ own landing pages and to nothing else: *"Los iconos deben llevar a la landing de esas páginas
y nada más."*

## The measurements that fix the sizes

The 50% split determines the address’s maximum size, and it is not a guess. At desktop the band’s row is
**1232px** wide inside a 1280px container, and with the existing 40px gap each column is:

```
(1232 - 40) / 2 = 596px
```

The address is its text plus a 28px arrow plus a 12px gap, and its text measures:

| Size | Text | + arrow + gap | Fits in 596? |
|---|---|---|---|
| 32px/600 | 414 | 454 | yes, loose |
| 36px/600 | 466 | 506 | yes |
| **40px/600** | **526** | **566** | **yes, 30px to spare** |
| 44px/700 | 579 | 619 | **no, over by 23** |

**40px is the ceiling and 44px does not fit.** The token moves from a 2.25rem ceiling to 2.5rem, and its
comment carries these numbers so that the next person who wants it bigger finds the reason in the file.

The question moves the other way, from `--text-display-section` to `--text-large-subtitle`: 28px against
the address’s 40px, a ratio of 0.7. It is the band’s only heading and it is deliberately not a display
size any more, because the display is the address.

## The layout

```
┌────────────────────────────┬──────────────────────────────────┐
│                            │                                  │
│  ¿Tienes un proyecto?      │   ismaelmarot@hotmail.com  ↗     │
│                            │                                  │
│  ┌────────────┐            │                                  │
│  │ ir      →  │            │                                  │
│  └────────────┘            │                                  │
│                            │                                  │
├────────────────────────────┴──────────────────────────────────┤
│  [github]  [linkedin]  [facebook]  [instagram]                 │
└───────────────────────────────────────────────────────────────┘
```

Two columns at desktop, one below it with the address first because it is the subject. The name and the
divider are gone.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See the address as the subject (Priority: P1)

A visitor lands on the closing band and the address is the first thing their eye lands on, because it is
the largest thing in the band. The question is present and readable, and is clearly the band’s subtitle
rather than its headline.

**Why this priority**: This is what `specs/020` specified and did not ship. Nothing else here matters if
the hierarchy is still inverted.

**Independent Test**: Load `/` at 1440 and read both sizes from the injected stylesheet. Assert the
address is larger than the question.

**Acceptance Scenarios**:

1. **Given** the landing page at 1440, **When** the closing band renders, **Then** the address is 40px and the question is 28px.
2. **Given** a screen-reader user, **When** they reach the band, **Then** the question is still the level-two heading, whatever size it is drawn at.
3. **Given** the address, **When** the band narrows, **Then** it steps down rather than wrapping mid-domain.

---

### User Story 2 - Read two balanced halves (Priority: P1)

At desktop the address has half the width to itself and the question and the button have the other half,
neither crowding the other.

**Why this priority**: The request names the proportion explicitly, and a proportion that is not measured
is a proportion that is not delivered.

**Independent Test**: Load `/` at 1440 and compare the bounding boxes of both columns.

**Acceptance Scenarios**:

1. **Given** a viewport of 1440, **When** the band renders, **Then** the two columns measure the same width to within a pixel.
2. **Given** the address's column, **When** it is measured, **Then** the address and its arrow fit inside it without overflowing.
3. **Given** a viewport of 768 or narrower, **When** the band renders, **Then** the columns stack, with the address first.
4. **Given** the stacked layout, **When** it renders, **Then** neither column overflows the viewport.

---

### User Story 3 - Press a button that looks pressable (Priority: P1)

The band’s route to the contact page is a black button with white text and a white arrow. It reads as the
one thing in the band that is a control, which is what it is.

**Why this priority**: It is a stated requirement and it is one declaration. The contrast is 21:1 and
needs no measuring to justify.

**Independent Test**: Load `/` and read the button’s background and its text and arrow colours from the
injected stylesheet.

**Acceptance Scenarios**:

1. **Given** the band, **When** the button renders, **Then** its background is black and its text and arrow are white.
2. **Given** the button, **When** it is focused, **Then** it is visibly focused, which on a black surface means the focus ring has to be lighter than the page’s usual.
3. **Given** the button, **When** the band renders, **Then** its accessible name is still "ir" and the arrow is not named.

---

### User Story 4 - Reach the networks, including the two that were missing (Priority: P1)

The band shows four marks. The two that are placeholders go to the platforms’ landing pages rather than to
a profile that may not exist.

**Why this priority**: Two of the four were requested and are absent.

**Independent Test**: Load `/` and read each mark’s `href`.

**Acceptance Scenarios**:

1. **Given** the landing page, **When** the band renders, **Then** it shows four marks: GitHub, LinkedIn, Facebook and Instagram.
2. **Given** the Facebook mark, **When** it is activated, **Then** it opens Facebook’s landing page in a new tab.
3. **Given** the Instagram mark, **When** it is activated, **Then** it opens Instagram’s landing page in a new tab.
4. **Given** the two placeholder marks, **When** a visitor arrives at either, **Then** they reach a real page rather than a 404 or a profile that may not exist.
5. **Given** the marks, **When** the band is read, **Then** the row is still a list and each mark is named.

---

### Edge Cases

- **The address at exactly 596px.** The widest it can be at desktop is 566px, which leaves 30px. That
  margin is the reason 40px is the ceiling and 44 is not, and it is recorded rather than rounded away.
- **A longer address.** `ismaelmarot@hotmail.com` is twenty-four characters. A future address of, say,
  thirty characters would reach 660px at 40px and overflow. The clamp's ceiling is therefore a property
  of this address, not of the component, and the comment says so.
- **The focus ring on a black button.** `--shadow-focus` is drawn in the page's own colour, which on a
  black surface is invisible. The button's focus state has to differ from the link's.
- **The two placeholder marks in the footer.** They will open the platforms' landing pages from the
  footer too. That is a consequence of one list feeding three surfaces and it is recorded.
- **The two placeholder marks in `/contact`.** They render as cards with the neutral violet surface,
  alongside GitHub and LinkedIn, pointing at the platforms' landing pages. `specs/020` added the two types
  for exactly this and chose the neutral surface until a real brand gradient is warranted.
- **A viewport narrower than 320px.** The footer grows to 208px there because its navigation wraps. This
  feature does not measure the footer, so nothing about the band changes.
- **Reduced motion.** Nothing in this band moves.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The address MUST be the largest text in the band at every viewport.
- **FR-002**: The address's size MUST come from `--text-display-email`, whose ceiling MUST be 2.5rem.
- **FR-003**: The question's size MUST come from `--text-body`, whose floor is below the address's at
  every viewport, and MUST NOT use any display size. `--text-large-subtitle` is prohibited because its
  20px floor is above the address's 18px floor and it inverts the hierarchy on a phone — see
  Amendment 2.
- **FR-004**: At 768px and above the band MUST use two equal columns.
- **FR-005**: The address, its arrow included, MUST fit inside its column without overflowing.
- **FR-006**: Below 768px the columns MUST stack with the address first.
- **FR-007**: The button MUST have a black background with white text and a white arrow.
- **FR-008**: The button's focus state MUST be visible against a black surface.
- **FR-009**: The band MUST NOT render the owner's name.
- **FR-010**: The band MUST NOT render a divider above the network row.
- **FR-011**: The network row MUST render every configured network, which after this feature is four.
- **FR-012**: Facebook and Instagram MUST point at `https://www.facebook.com` and
  `https://www.instagram.com`, and MUST NOT contain a profile path.
- **FR-013**: The band MUST keep `id="contact-summary"` and `aria-label="Contacto"`.
- **FR-014**: The question MUST remain the band's only level-two heading.
- **FR-015**: The address MUST keep no `target`; every network mark MUST open in a new tab with
  `rel="noopener noreferrer"`.
- **FR-016**: The page MUST have no horizontal overflow at 1440, 768, 390 and 320.
- **FR-017**: No new dependency, no new hook, and no change to `Layout`.
- **FR-018**: No other band, and no page other than the three surfaces one network list already feeds.

### Key Entities

- **Address**: the band's subject. Largest element, one column to itself.
- **Question**: the band's only heading, and now visually subordinate to the address.
- **Button**: the band's route to the contact page, and the only control-looking thing in it.
- **Networks**: four marks, two of which are placeholders pointing at a platform rather than a person.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At 1440 the address computes to 40px and the question to 28px.
- **SC-002**: The address's computed font-size is greater than the question's at 1440, 768, 390 **and
  320**.
- **SC-003**: At 1440 the two columns measure the same width within one pixel.
- **SC-004**: The address and its arrow fit inside the address's column at 1440, 768, 390 and 320, and at
  1440 at least 24px remain.
- **SC-005**: The address's text does not wrap and does not overflow at 1440, 768, 390 or 320.
- **SC-006**: The button's background resolves to black and its colour to white.
- **SC-007**: The button's focus state differs from its resting state.
- **SC-008**: The band shows four network marks with the accessible names GitHub, LinkedIn, Facebook and
  Instagram.
- **SC-009**: The Facebook mark's `href` is `https://www.facebook.com` with no path after the host.
- **SC-010**: The Instagram mark's `href` is `https://www.instagram.com` with no path after the host.
- **SC-011**: The band renders no element carrying the owner's name.
- **SC-012**: The band renders no horizontal rule above the network row.
- **SC-013**: The page has no horizontal overflow at 1440, 768, 390 and 320.
- **SC-014**: axe reports zero violations on `/` and on `/contact` at four viewports, and `/contact` now
  renders five cards without overflow.
- **SC-015**: Lint, type checking, the unit tests, the component tests and the build pass, and no
  existing assertion is deleted.

### On what is and is not backed by these criteria

**SC-001 through SC-005 and SC-013 are measured in a browser**, not asserted from the stylesheet, because
the whole feature is a question about how much room things take. The column widths, the text width and
the overflow are three numbers only a rendered page has.

**SC-006 and SC-007 are read from the injected stylesheet**, which is what `getCssForElement` exists for
and what `specs/019` and `specs/020` both used after getting it wrong once each.

**SC-008 through SC-012 are component tests.**

**SC-014 and SC-015 are the repository's own audit and its own suites.**

## Assumptions

- **40px is the address's size, not 44px**, because 44 does not fit in the half column. The margin at 40
  is 30px, which is the tolerance for a slightly longer address and nothing more.
- **28px is the question's size**, which is a step the token scale already carries. Inventing a
  twenty-second typographic step for one heading would be a worse trade than a token that exists.
- **The address comes first in the stacked layout**, because it is the subject and because a visitor who
  scrolls to the bottom of the page should meet the address before the route to it.
- **A platform landing page is a better placeholder than no mark.** It is a real page, it costs nothing,
  and it is replaced by a profile in one line whenever the profile exists.
- **The band's height is unchanged.** Nothing here alters `min-height: 100dvh`, and the consequence for
  the page's total length is recorded rather than fixed.

## Amendments

### Amendment 1 - Two requirements the maintainer asked for and then declined, and they are recorded as withdrawn

**Added by**: during implementation, 2026-10-15.

**"La sección de Contacto + el footer ocuparán el 100% del alto" is withdrawn.** Measured before this
change, the band is 900px and the footer 182px at 1440x900, so that part of the page is 1082px: one
screen and a fifth. Meeting it needs the footer's height at run time, because it is 182px from 390px
upward and 208px at 320px, where the footer's navigation wraps from 18px to 44px. That needs a
`ResizeObserver` and a change to `Layout`. The maintainer declined both — *"no modifiques eso entonces"* —
and then chose the alternative outright: *"dejarlo como está"*.

**So the number stands as it is and no layout is measured.** This is recorded rather than left silent
because a withdrawn requirement and a forgotten one look identical from the outside, and this one was
asked for in writing.

**The colour, withdrawn in `specs/020`, remains withdrawn.** Nothing here reintroduces it.

### Amendment 2 - The first token chosen for the question inverted the hierarchy on a phone, and the numbers written before measuring were wrong

**Added by**: during implementation, 2026-10-15.

**FR-003 named `--text-large-subtitle`, and it was the wrong token.** Its clamp is
`clamp(1.25rem, 2vw, 1.75rem)`, so its floor is **20px**, and the address's floor is **18px**. Measured
on the rendered band at the first attempt:

| viewport | address | question | inverted? |
|---|---|---|---|
| 1440 | 40px | 28px | no |
| 768 | 26px | 20px | no |
| 390 | 18px | 20px | **yes** |
| 320 | 18px | 20px | **yes** |

The band passed its own desktop measurement and still shipped the defect, on exactly the two widths a
phone actually is. `specs/020` failed this same way and for the same reason: a value was chosen for one
viewport and never compared at another.

**The token is now `--text-body`**, 16px, whose floor is below the address's at every viewport. The
ratio is 0.4 at desktop and 0.89 at 320px, and **the 0.89 is not a defect being tolerated for
convenience**: at 288px of column there is no room for a visible difference between two pieces of text,
and manufacturing one would mean a heading too small to read.

**The figures this specification gave for the address's width were wrong, and the corrected ones are
below.** The original wrote 526px of text at 40px and "30px to spare". Measured on the rendered link,
which carries `letter-spacing: -0.01em` that the earlier estimate did not:

```
1440:  column 596,  text 508,  arrow 28,  used 548,  free 48
 768:  column 340,  text 293,  arrow 28,  used 333,  free  7
 390:  column 358,  text 229,  arrow 28,  used 269,  free 89
 320:  column 288,  text 229,  arrow 28,  used 269,  free 19
```

**The conclusion survives the correction.** 40px is still the ceiling and 44px still does not fit — at 44
the link would use 599px of a 596px column, over by 3. But the margin at 40px is 48px rather than 30, and
**the tightest case is not desktop**: at 768px only 7px remain. That is why the address is fluid and why
the ceiling only governs the widest viewport, and both facts are now in the token's comment where the
next person who wants it bigger will find them.

**Three requirements and one checklist item were corrected as a result**: FR-003, SC-002, SC-004, and
CHK020 of the requirements checklist, which had claimed that no new typographic step was added for the
heading. None was added; the heading moved further down an existing scale than the first attempt
proposed, which is the same kind of correction and needed the same record.
