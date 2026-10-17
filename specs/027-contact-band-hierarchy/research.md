# Research: The Contact Band's Hierarchy

**Feature**: `027-contact-band-hierarchy` | **Date**: 2026-10-16

No `NEEDS CLARIFICATION` markers were left in the plan's Technical Context. The decisions below are the
ones the plan rests on, each with the alternative that was considered and rejected.

## R1. Where the visible address lives

**Decision**: add `contactDisplayEmail: string` to `SiteConfig`; keep `email: string` as the mailto
target. `useContactBand` returns both; `ContactBand` takes `displayEmail` alongside `email`.

**Rationale**: the band is the only consumer of `siteConfig.email`. The footer and the `/contact` page
read the `email` entry of `socialLinks`, so a separate field cannot drift from them, and the request is
scoped to the Home contact band. A second value is the smallest change that keeps the visible text and
the destination independent.

**Alternatives considered**:

- *Reuse the `socialLinks` email entry's `value` as the visible text and add a mailto field to it.* This
  would move the footer and the contact page with it, which the request did not ask for, and it would make
  one config entry carry two meanings.
- *Render the display address from a prop only.* The band already takes `email` as an overridable prop for
  tests; adding `displayEmail` the same way keeps the fixture path and the config path symmetric.

## R2. The question's level

**Decision**: the question stays an `h2` and the band keeps exactly one heading.

**Rationale**: the Home page has one `h1` in the Hero and one `h2` per band. Promoting the question to
`h1` would give the page two top-level voices and break the outline the other four bands share. The
request is about size, not about outline level.

**Alternatives considered**:

- *Make the question an `h1`.* It would match the "Sobre mí" heading on the `/about` page, but that page
  has no Hero, so its `h1` is the page's only one. The Home page's `h1` is the name in the Hero.

## R3. The call to action's alignment

**Decision**: left-aligned beneath the sentence, inside the copy block.

**Rationale**: the drawing shows it under the sentence at the left margin, and a left column of question,
sentence and button is more cohesive than a button pinned to the far edge. It is one declaration to
change.

**Alternatives considered**:

- *Keep it right-aligned.* It would balance the email on the right, but it would separate the button from
  the text that introduces it and leave the left column with a large empty run.

## R4. Mobile stacking order

**Decision**: question, sentence, call to action, networks, email — the same reading order as desktop,
stacked.

**Rationale**: the email's scale does not leave room for the networks and the address on one line at 390px
(about 230px of marks against about 299px of address in a 358px column), so they stack. Keeping the DOM
order means no `order` is needed and the two arrangements cannot drift apart.

**Alternatives considered**:

- *Put the email before the networks on mobile.* It would make the primary action first, but it would
  require a second order change and would contradict the desktop reading order.

## R5. Flush-right email

**Decision**: `justify-self: end` on the email grid item, overridden to `start` below 767px.

**Rationale**: the row is `auto 1fr`, so the email owns the right column. Without `justify-self` it sits at
the left of that column, which is not "bien a la derecha". `justify-self` is the one declaration that
places it.

**Alternatives considered**:

- *`text-align: right` on the row.* It would right-align the networks too, which are a list of marks and
  should stay left.
- *`margin-left: auto` on the email.* It works, but it reads as a spacing trick rather than an alignment,
  and the component already prefers `align-self` for the button for the same reason.

## R6. Token reuse

**Decision**: the question reads `--text-display-section` directly; the email keeps
`--text-display-email`, whose ceiling is already `--text-display-project`.

**Rationale**: the question and the "Sobre mí" heading then share one token and cannot differ, and the
email can never outgrow the question. No new token and no change to any other token.

**Alternatives considered**:

- *Give the question its own token.* A second token for the same scale is a second thing to keep in step,
  which the constitution's Maintainability section forbids.

## R7. The `order` removal

**Decision**: delete `order: -1` from the row and let the DOM order be the visual order.

**Rationale**: the request puts the row at the bottom, so the drawing and the reading order agree. The
`order` hack existed only because they disagreed, and deleting it removes a comment that would otherwise
have to explain why the row is last in the DOM but first in the drawing.
