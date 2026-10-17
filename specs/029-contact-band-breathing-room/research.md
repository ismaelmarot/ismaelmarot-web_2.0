# Research: The Contact Band's Breathing Room

**Feature**: `029-contact-band-breathing-room` | **Date**: 2026-10-17

No `NEEDS CLARIFICATION` markers were left in the plan's Technical Context — the maintainer picked the
step from three presented options. The decisions below are the ones the plan rests on, each with the
alternative that was considered and rejected.

## R1. Which value carries the wider air

**Decision**: `StyledContactBandInner`'s gap reads `tokens.space[16]` (64px).

**Rationale**: the maintainer chose `space[16]` from the three steps above 48px that the scale offers,
and the token is already spent by `StyledContactBand`'s own `padding-block`. Inner air and outer air
becoming the same value is the closest thing a spacing scale has to a rhyme.

**Alternatives considered**:

- *`space[20]` (80px) or `space[24]` (96px)*. They were offered and the maintainer did not take them;
  the first eats the copy block's centring on short phones, the second halves the leftover at 640px
  tall.
- *A clamp or a second value under a media query*. A step on the scale carries across viewports; a
  responsive gap is a second claim that needs a second measurement this request did not ask for.

## R2. The assertion's two thresholds

**Decision**: the E2E asserts the distance is greater than 40px **and** equal to 64px within 1px.

**Rationale**: greater-than-40 alone would green-light the current band unchanged. Equal-to-64 alone
would pass a build that fakes the distance with a coincidental sum of margins. The two together hold
FR-002: the distance is owned by the gap, because the measured distance is what any margin arises from,
and no one- or two-margin sum hits 48 → 64 exactly without the gap being the 64.

**Alternatives considered**:

- *Assert the gap declaration only* in the E2E. The component test already does that; the E2E repeats
  the claim by measuring its consequence, which is this repository's rule for everything that is a size.
- *Assert only "greater than 48"*. Fragile in the other direction: it would pass a biome of tweaks that
  drifted the gap by 1px on the scale.

## R3. Why the height cannot grow

**Decision**: rely on the shell — `min-height: 100dvh`, `align-content: center`, `padding-block:
space[16]` — and let the existing height assertion hold it.

**Rationale**: the content's total height at 1440 is roughly 380px against a 900px viewport; the wider
gap costs 16px of the ~600px leftover. The shortest viewport the suite covers, 320×640, spends 96px on
the shell's mobile padding and still leaves ~164px for the centring to split. The height-local assertion
(`la banda sigue siendo del alto de una pantalla`) is the same one specs/023 relies on, and it fails
before the band scrolls out of a full-screen snap target.

**Alternatives considered**:

- *Shrink the gap on mobile with a media query*. It would answer a layout question nobody raised; the
  measured band already fits with 64px.
- *Centring with `margin-block: auto` instead*. A rewrite of the shell to absorb 16px, when the centring
  already absorbs it.

## R4. What "estilo Apple" changed here

**Decision**: treat it as a reference for the *amount*, not a spec for a *design*. Generous whitespace
between groups is the practice the band already follows at the scale's own steps.

**Rationale**: the project's constitution reads the same way — "clarity, generous whitespace,
consistent visual hierarchy" — through tokens. Introducing Apple-specific values (e.g. a golden-ratio
gap, an 8pt-only jump to 80px) would be a sixth spacing opinion on one page.

**Alternatives considered**:

- *Take the request as license for a redesign* (bigger question, airier row, different padding). It
  would bleed past FR-004 and reopen `specs/027`'s settled claims.
