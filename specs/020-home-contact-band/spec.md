# Feature Specification: The Contact Band on the Landing Page

**Feature Branch**: `020-home-contact-band`

**Created**: 2026-10-14

**Status**: Implemented

**Input**: A maintainer request: *"En la seccion de contacto en el Home sea un contenedor... y el
siguiente formato: ¿Tienes algún proyecto? ismaelmarot@hotmail.com ↗ ir → (logos de contacto a mis
facebook, instagram, linkedin) Ismael Marot"*, with three notes: the arrow beside the email points
diagonally up and to the right, that email with its arrow is large and clickable to write to him, and
"Ir →" goes to the contact page.

## The gap this specification fills

The landing page's closing band is the one place a visitor is asked to get in touch, and it says less
than any other band on the page. It has a title ("Contacto"), a sentence, and a small pill reading
"Contactar". The address, which is the only thing the visitor actually needs, is nowhere on it.

The site's own vocabulary for asking is more confident than that. The Hero opens with a name and two
calls to action. The projects band names six applications and gives each a frame. The technologies band
scrolls real brand marks. And the closing band offers a grey pill.

**The address is the call to action**, and it was rendered nowhere on the landing page.

## What this is deliberately not

**It does not repaint the band.** The request asked for the band's colour to match the technologies
section, and the maintainer withdrew it before implementation: *"olvidate del color, no lo vamos a
aplicar ahora"*. The band stays `default`, which on the landing page is already what the technologies
band is. Recorded here so the omission is a decision and not a gap.

**It does not add Facebook or Instagram.** Neither URL exists. A logo whose link resolves to a profile
that may not exist is a broken link, and `specs/007` is the specification that cost most when a control
was built for a destination it could not reach. The component takes its networks from configuration and
renders what is configured, so adding the two later is two lines in `site-config.ts` and no code change.

**It does not change the contact page.** `/contact` keeps its cards, its `ContactMethod` and its
three-method list. This is the landing page's closing band.

**It does not touch the footer.** The footer reads the same `socialLinks` array, so a network added
later appears in both places. That is a consequence of one list feeding three surfaces, and it is
recorded rather than prevented.

## What already constrains this

Three things in the repository already assert what the band must keep, and they were read before the
design rather than after it:

- **`id="contact-summary"`** is asserted by `tests/e2e/homepage.spec.ts`, which checks all five bands
  are visible. The id does not change.
- **The `<h2>` sequence** is asserted by `src/pages/Home/Home.test.tsx`, which reads the page's level-two
  headings in order. This feature changes one of those headings, so that assertion changes too, and the
  change is recorded in the specification rather than made quietly.
- **The band's full-viewport shell** — `padding-block`, `min-height: 100dvh`, `align-content: center` —
  is what gives the page its rhythm. The new band replicates those values rather than inventing its own,
  because a band of a different height reads as a mistake on a page whose bands are all the same.

## The layout

```
┌────────────────────────────────────────────────────────────┐
│  ¿Tienes un proyecto?                                        │
│                                                              │
│  ┌──────────────────────────┐   ismaelmarot@hotmail.com ↗   │
│  │ ir →                     │                                │
│  └──────────────────────────┘                                │
│                                                              │
│  [github]  [linkedin]                        Ismael Marot     │
└────────────────────────────────────────────────────────────┘
```

Two columns above the fold at desktop, one column below it. The address sits on the right at display
size with its arrow; the route to the contact page sits on the left as the band's own call to action; the
networks and the name share the bottom line.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Write to him from the landing page (Priority: P1)

A visitor reads the closing band and writes. The address is the largest thing in it, it carries an arrow
that points out of the band, and it is a single clickable link that opens their mail client with the
address already filled in.

**Why this priority**: This is the request. Everything else in this specification exists to make the
address survive the rendering, and the address is the feature.

**Independent Test**: Load `/`, read the band's heading, and activate the address link. Assert its
`href` is a `mailto:` carrying the configured address, and that it has no `target` attribute, because
opening a mail client in a new tab is not what anyone wants.

**Acceptance Scenarios**:

1. **Given** the landing page, **When** the closing band renders, **Then** it shows the configured address as a link to `mailto:` that address.
2. **Given** the address link, **When** it is read, **Then** it is the largest text in the band.
3. **Given** the address link, **When** it is activated, **Then** the visitor's mail client opens with the address in the To field.
4. **Given** a screen reader, **When** it reaches the address, **Then** the accessible name is the address itself and not "Email" or "contacto".
5. **Given** the address link, **When** it is focused by keyboard, **Then** it has a visible focus indicator and it is reachable in the tab order.

---

### User Story 2 - Reach the contact page if that suits them better (Priority: P1)

A visitor who wants to see every way to write, or who has no mail client, follows the band's own link to
the contact page.

**Why this priority**: It is the band's existing behaviour and it stays. A band that offers only a mail
link is a band that offers nothing to a visitor without a mail client.

**Independent Test**: Load `/`, activate "ir →", and assert the router lands on `/contact`.

**Acceptance Scenarios**:

1. **Given** the landing page, **When** the band's link is activated, **Then** the contact page renders.
2. **Given** the link's label, **When** it is read, **Then** it says where it goes, and the arrow beside it is hidden from assistive technology.
3. **Given** the link, **When** it is focused by keyboard, **Then** it is reachable and visibly focused.

---

### User Story 3 - Recognise the networks without reading (Priority: P1)

A visitor sees the networks that exist as marks, each in its own frame, each named by the network it
opens.

**Why this priority**: A row of unlabelled glyphs is a puzzle. Every mark must say which network it
reaches, and the row must not be announced twice.

**Independent Test**: Load `/`, and for each mark assert both its accessible name and its `href`.

**Acceptance Scenarios**:

1. **Given** the landing page, **When** the closing band renders, **Then** each configured network renders as a mark with an accessible name naming it in Spanish.
2. **Given** the marks, **When** they are read in order, **Then** the row is a list and each mark is one item of it.
3. **Given** a mark, **When** it is activated, **Then** it opens in a new tab with `rel="noopener noreferrer"`.
4. **Given** the band, **When** it is read by a screen reader, **Then** no network is announced twice.

---

### User Story 4 - Know who wrote it (Priority: P2)

The band closes with the name, so the page ends by saying whose page it is.

**Independent Test**: Load `/` and read the band's closing line.

**Acceptance Scenarios**:

1. **Given** the landing page, **When** the closing band renders, **Then** it shows the configured name.
2. **Given** the name, **When** the Hero is read, **Then** the two agree, because both read the same configuration value.

---

### Edge Cases

- **A configured network with no URL.** Renders nothing rather than a mark that goes nowhere. The
  networks are read from configuration, so an entry without a `value` is filtered out.
- **No networks configured at all.** The row does not render. An empty `role="list"` is a landmark with
  nothing in it, which axe reports and which tells a reader nothing.
- **The address is long on a phone.** `ismaelmarot@hotmail.com` is twenty-four characters. At display
  size it cannot fit a 390px viewport at any weight, so the address is fluid and steps down rather than
  wrapping mid-domain or overflowing.
- **The visitor has no mail client.** The `mailto:` link does nothing visible on some browsers. The
  band offers the contact page for exactly this reason, and that is why User Story 2 is P1 and not P2.
- **Reduced motion.** Nothing in this band moves. Recorded so the absence is deliberate.
- **`mailto:` with a pre-filled subject.** None. The link carries the address alone, and a pre-filled
  subject would decide what the visitor writes about before they have written anything.
- **The band on a short desktop viewport.** The shell is `min-height`, so the content can exceed it
  rather than being clipped. The band is not one of the pages `specs/003` measured, and it is not
  measured here either; it is noted as not measured rather than assumed to fit.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The landing page's closing band MUST render the configured email address as a single link
  whose `href` is `mailto:` and that address.
- **FR-002**: The address link MUST NOT carry a `target` attribute.
- **FR-003**: The address link MUST be the largest text in the band, and its size MUST come from a
  token rather than a literal.
- **FR-004**: The address MUST carry a diagonal up-and-right arrow, `aria-hidden`, so the mark is
  decoration and the address is the name.
- **FR-005**: The arrow MUST be a stroke glyph matching the existing arrows' weight, caps and joins.
- **FR-006**: The band MUST keep `id="contact-summary"` and `aria-label="Contacto"`, both of which are
  asserted elsewhere in the repository.
- **FR-007**: The band MUST keep `background="default"`. No colour change is in this feature.
- **FR-008**: The band's shell MUST use the same padding, minimum height and centring as the other three
  bands, so the page's rhythm is unchanged.
- **FR-009**: The band's visible level-two heading MUST be "¿Tienes un proyecto?".
- **FR-010**: The band's own link MUST read "ir →", MUST navigate to `/contact`, and its arrow MUST be
  `aria-hidden`.
- **FR-011**: The networks MUST come from `siteConfig`, filtered to exclude the email, so that a network
  added later appears here, in the footer and on the contact page without a code change.
- **FR-012**: A configured network with no value MUST NOT render.
- **FR-013**: The network row MUST be a list, and each mark MUST be one item of it.
- **FR-014**: Every network mark MUST have an accessible name naming the network in Spanish, and its
  glyph MUST be `aria-hidden`.
- **FR-015**: Every network link MUST open in a new tab with `rel="noopener noreferrer"`.
- **FR-016**: The band MUST render the configured name.
- **FR-017**: The heading order of the page MUST remain hero, projects, technologies, about, contact.
- **FR-018**: No new dependency. `simple-icons` is already installed and this feature does not need it.
- **FR-019**: `ContactType` MUST gain `facebook` and `instagram`, and their helpers MUST map to a glyph
  and an href, so that adding the two networks later is a configuration change and not a code change.
- **FR-020**: No other band, no other page and no footer may change.

### Key Entities

- **Band**: the closing section of the landing page. It was a `SectionSummary` and becomes its own
  component.
- **Address**: the configured email, rendered large and clickable. The band's subject.
- **Networks**: the configured social links, minus the email.
- **Arrow**: the diagonal mark beside the address. Decoration, never a name.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `/` shows an `<a href="mailto:ismaelmarot@hotmail.com">` carrying that address as its text.
- **SC-002**: The address link has no `target` attribute.
- **SC-003**: The address is the largest text in the band at 1440 and at 320.
- **SC-004**: The address's computed `font-size` resolves from `--text-display-email`.
- **SC-005**: `#contact-summary` still exists and is visible, and still carries `aria-label="Contacto"`.
- **SC-006**: The page's level-two headings, in order, are `Proyectos`, `Tecnologías`, `Sobre mí`,
  `¿Tienes un proyecto?`.
- **SC-007**: The band's link resolves to `/contact`.
- **SC-008**: Each network mark is a list item inside a list, with an accessible name naming the
  network.
- **SC-009**: Each network link carries `target="_blank"` and `rel="noopener noreferrer"`.
- **SC-010**: The band shows the configured name, and it matches the Hero's.
- **SC-011**: The page has no horizontal overflow at 1440, 768, 390 and 320, and the address does not
  wrap mid-domain.
- **SC-012**: axe reports zero violations at those four viewports, and specifically no
  `aria-required-parent`.
- **SC-013**: Lint, type checking, the unit tests, the component tests and the build pass, and no
  existing assertion is deleted.
- **SC-014**: The address link and the band's link are both reachable and visibly focusable by keyboard.

### On what is and is not backed by these criteria

**SC-001 through SC-010 and SC-014 are component tests** over a fixture.

**SC-011 and SC-012 are the browser's**, through the repository's own audit, which visits every route
since `specs/018`, and through `tests/e2e/routes.spec.ts`, which asserts on `/` that there is no
horizontal overflow, exactly one `h1`, and nothing logged to the console.

**No visual measurement is taken and no screenshot is compared.** This is a redesign of one band and the
criteria that matter are structural: what is a link, what it says, what it points at, and whether the
address fits. A screenshot would be evidence of a rendering nobody in this repository can compare against
anything.

**The band's height at a short desktop viewport is not measured.** It is noted in the Edge Cases as
unmeasured rather than asserted.

## Assumptions

- **The address is the call to action**, and it is therefore the largest thing in the band. Every other
  element is subordinate to it: the route to the contact page is secondary because it is a fallback for a
  visitor without a mail client.
- **The name closes the band** because the page opens with the Hero's name and this is the last thing a
  reader passes. It is not a heading: the band's single heading is the question.
- **Networks come from configuration and not from a hard-coded list**, because the same array already
  feeds the footer and the contact page, and three surfaces reading one list is the existing arrangement.
- **Facebook and Instagram are absent, not disabled.** A greyed mark advertises a destination that does
  not work yet.
- **Nothing in this band animates.** The page's motion budget is spent on the icon strip and the marquee,
  and a closing band that fades in adds nothing to a visitor reading it.
- **The band's shell is copied, not abstracted.** `SectionSummary`'s shell is ten lines of values already
  used by three bands; extracting a primitive for a fourth is the kind of generalisation the constitution's
  YAGNI principle rules out, and copying it is recorded here rather than left to look like an oversight.

## Amendments

### Amendment 1 - Four things were withdrawn or left open, and each is a decision rather than an omission

**Added by**: during implementation, 2026-10-14.

**The colour was withdrawn by the maintainer before implementation**: *"olvidate del color, no lo vamos a
aplicar ahora"*. FR-007 records the band staying `default`. The band on the landing page is already the
same background the technologies band is, so nothing is lost by the deferral and the request can be picked
up later without re-reading anything.

**Facebook and Instagram were left out because the URLs do not exist.** The maintainer's answer was *"no
las tengo ahora pero las agregaremos luego"*. FR-011 and FR-019 are written so that adding them is a
configuration change: two entries in `siteConfig.socialLinks`, which reach this band, the footer and the
contact page at once.

**GitHub was added at the maintainer's request** — *"agrega tambien el github"* — and it is already in
`socialLinks`, so it needed no data change.

**The layout was confirmed as drawn** in the proposal, with the maintainer's answer *"si, bien por
ahora"*. The "por ahora" is read as being about the layout rather than about the feature: the band ships,
and its arrangement can change without a new specification for the same reason the colour can.

### Amendment 2 - One existing test changes, and it changes because the design does

**Added by**: during implementation, 2026-10-14.

`src/pages/Home/Home.test.tsx` asserts the landing page's level-two headings in order:

```
['Proyectos', 'Tecnologías', 'Sobre mí', 'Contacto']
```

The last of those becomes `'¿Tienes un proyecto?'`, because FR-009 replaces the title with the question
the band actually asks. **The assertion is updated, not deleted**, and the order itself is unchanged, which
is what the test is for: it exists to catch a band being reordered, and a title being rewritten does not
reorder anything.

The alternative was keeping `'Contacto'` as the visible heading and demoting the question to a paragraph,
which would have left the test untouched at the cost of a band whose heading does not say what the band
is for. The band keeps `aria-label="Contacto"` either way, so the section's name is unchanged for anything
navigating by region.
### Amendment 1 - This specification said the address would be the largest thing in the band, and it shipped smaller than the question

**Added by**: `specs/021-contact-band-proportions`, 2026-10-15, after the maintainer reviewed the
deployed band.

**The intent in this document was right and the implementation did not deliver it.** The Assumptions
section says:

> **The address is the call to action**, and it is therefore the largest thing in the band.

Measured on the deployed build: the question rendered at **72px** and the address at **36px**. That is the
inverse of what this specification required, and a reader who opens this file today would reasonably
believe the hierarchy had been settled when it had been inverted.

**Why it happened, because the reason generalises.** The address's size was chosen deliberately and with
numbers: `--text-display-project` starts at 2rem and `ismaelmarot@hotmail.com` is twenty-four
characters, so the token was written to fit a phone. The question's size was left on whatever token it
already had. **Neither value was ever compared against the other**, so a deliberate, measured choice and an
inherited default ended up side by side with the default two times the size of the choice.

`specs/021` fixes it and measures both, and this amendment exists so that the sentence at the top of this
section is not taken as a claim about what shipped. It describes the intent; the intent was not met until
the following day.

### Amendment 2 - What shipped in `specs/021`, so this document is not read as the band's current design

**Added by**: `specs/021`, 2026-10-15.

This document describes the band's structure, its markup and its accessible names, all of which are still
true. Three things about its presentation are superseded and should not be read here:

- **The question's size.** `--text-display-section`, 72px at desktop, became `--text-large-subtitle`,
  28px, because the display in this band is the address.
- **The name and the divider.** This document's layout shows the networks and the owner's name sharing a
  bottom line under a rule. Both are gone. The networks alone remain.
- **The colour.** Withdrawn in Amendment 1 here and not reinstated by `specs/021`.
