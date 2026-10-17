# Research: The Contact Band's Copy and Spacing

**Feature**: `028-contact-band-copy-and-spacing` | **Date**: 2026-10-17

No `NEEDS CLARIFICATION` markers were left in the plan's Technical Context — the maintainer picked the
spacing step and the exact sentence from the options presented. The decisions below are the ones the plan
rests on, each with the alternative that was considered and rejected.

## R1. The token the sentence adopts

**Decision**: `StyledContactBandDescription` reads `var(--text-large-subtitle)` directly.

**Rationale**: the request names the "Me interesa…" description in "Sobre mí", whose stylesheet reads
`tokens.fontSizes.lg`. The alias table resolves `lg` to `var(--text-large-subtitle)`. Reading the token
the *target* itself reads — rather than the alias it goes through — means the band's sentence and that
description are the same size by construction, which is what the E2E measures, and it matches how the
band's question already reads `--text-display-section`, the section-title token, directly.

**Alternatives considered**:

- *Read `tokens.fontSizes.lg` in `ContactBand.styles.ts`.* It would render identically, but the alias is
  a backward-compatibility table for older call sites; a new line of styles in a component that already
  reads two display tokens directly would be the first reader of the alias table in the band.
- *Introduce a new token* such as `--text-display-body`. A token needs two readers to exist; this change
  is the first attempt at the sentence's scale, and YAGNI applies.

## R2. The hierarchy consequence of the 20px floor

**Decision**: keep `--text-large-subtitle` as the sentence's token although its floor (20px at a phone)
is above the email's (18px).

**Rationale**: `specs/027` rejected this token for the *question* — as a display, a 20px floor would have
beaten the address's 18px floor and reversed the hierarchy it was writing. The sentence is not the
display. Its job, both before and after this change, is to be the smallest voice in the band, and moving
it from a 16px floor to a 20px one does not unseat it: the question's floor is 40px and the address's is
18px on a phone. The relation "Sobre mí" already lives with — a 20px description under a section-scale
heading — is the relation the band adopts.

**Alternatives considered**:

- *Keep `--text-body`.* It was the size the request asked to move away from; the sentence would stay
  smaller than the "Me interesa…" text it is asked to match.

## R3. Where the extra air lives

**Decision**: `StyledContactBandInner`'s gap moves to `tokens.space[12]`; no margin joins either child.

**Rationale**: the stylesheet's comment on `StyledContactBandCopy` already records that "the band's own
spacing between this block and the row below lives on the parent's gap". A gap is the arrangement's
decision; a margin on one child would be a child's exception, and the next reader would have to discover
which of the four bands' copies made it meaningful. `space[12]` (48px) is the next step up the scale from
40px — a real change at a glance that stays inside the scale.

**Alternatives considered**:

- *`margin-top` on `StyledContactBandRow`.* It would animate no differently and read the same number, but
  it would split one spacing decision over two declarations.
- *`margin-bottom` on `StyledContactBandCta`.* The button is the copy block's last child; a margin on it
  would shut the gap down the button's right edge too, which a column `gap` does not do.
- *`space[16]` or `space[20]`.* The maintainer chose `space[12]` from the presented options; larger steps
  would have eaten into the copy block's centring on a phone for no named reason.

## R4. The accent on `pongámonos`

**Decision**: `contactTagline` reads `Hablemos y pongámonos manos a la obra`.

**Rationale**: "pongámonos manos a la obra" is the idiom the band's copy has been reaching for since
`specs/025` first recorded it (there as `pongamos`, without the reflexive pronoun and so without the
accent). "Va con acento" is precisely the marking of the reflexive imperative nosotros form: stressed
final syllable, first-person plural. The verb after "Hablemos y" is naturally reflexive — one puts oneself
to work, one does not put to work.

**Alternatives considered**:

- *`pongámos` without the pronoun.* It is not a word; `pongamos` (unstressed, no accent) is, and it is
  what the code carries today — but the request says the word "va con acento", and an unaccented
  `pongamos` contradicts it.
- *Fix only the accent and leave the misspelling `Hablmeos`.* The code has never carried it; the request
  is a transcription, and its rendering of "Hablemos" is a typo of the same hand that wrote `mayot` for
  `mayor` and `imail` for `email`.

## R5. What the E2E measures, and what it refuses to

**Decision**: measure the rendered distance between the button's bottom edge and the row's top edge, and
assert it is both 48px (within sub-pixel slack) and greater than the previous band's 40px.

**Rationale**: this repository's rule, repeated across four specs, is that a stylesheet assertion passes
on a value that overflows. The 38px between the button's `margin-top: space[2]` and its own box, the 12px
inside `StyledContactBandCopy`, and the 48px below it are three separate claims about three different
pairs of elements; the button-to-row distance is the one the request describes and the one that changes.
Measuring it directly means a margin smuggled in elsewhere, or a gap declared but never rendered, both
better be caught.

**Alternatives considered**:

- *Assert the gap declaration only.* It is what the component tests already do; the E2E repeats it by
  measuring the consequence, which is what a stylesheet assertion cannot.
- *Measure the tagline-to-row distance instead.* It would include the sentence's line-height, which grows
  by 2.5px with the new token and muddies the measurement that has to stay a plain spacing step.
