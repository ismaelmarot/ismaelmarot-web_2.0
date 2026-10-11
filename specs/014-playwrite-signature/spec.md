# Feature Specification: The footer signature in Playwrite US Modern

**Feature Branch**: `014-playwrite-signature`

**Created**: 2026-10-11

**Status**: Draft

**Input**: User description: "quiero utlizar en una parte de mi web, la siguiente pitografia:
https://fonts.google.com/share?selection.family=Playwrite+US+Modern:wght@100..400". Followed by a
decision, when asked where it should go, to apply it to "un detalle personal" rather than to the hero,
to the project titles or to the whole site.

## The gap this specification fills

The footer closes the page with a copyright line that is the most anonymous element in it: `© 2026
Ismael Marot`, set in the same Inter at the same size and the same muted grey as every other line of
body copy. It is the one place where the page could sign its own work, and it signs it in the
smallest available voice.

Playwrite US Modern is a handwriting typeface, and a signature is what a handwriting typeface is for.
Setting the name in it turns the footer from a legal line into a closing mark, and it does so without
touching a single other element of the page.

## What this is deliberately not

**It is not the site's typeface.** Inter remains the only typeface in `body`, in every heading, in every
card and in every label. This is one element.

**It is not applied to a heading.** This is the decision the typeface forces, and it is worth stating
plainly. Playwrite US Modern is a variable font with a single `wght` axis running from **100 to 400**.
It has no bold. The hero is set at weight 700, the section headings at 700 and the project titles at
600, so asking Playwrite for those weights returns 400 and the browser silently synthesises a heavier
face that Playwrite was not drawn with. Applying it there would have quietly changed the weight of every
title on the site. It is not applied to any of them.

**It does not rewrite the copyright.** The `©`, the year and the name stay in the same order, in the same
element, with the same text. Only the typeface of the name changes. A visitor reading the footer with a
screen reader hears exactly what they heard before.

**It is not a second heading.** The copyright remains the `<p>` it has always been. No `<h2>`, no new
section, no landmark in the accessibility tree.

## What the typeface is, and what that costs

Playwrite US Modern is by TypeTogether (Veronika Burian, José Scaglione), released under the SIL Open
Font License 1.1, which is the same licence Inter ships under and the same terms this site already
accepts by shipping Inter from Google's CDN. It is served from that same CDN, so no dependency, no
bundled binary and no new licence obligation are introduced.

Two properties of the typeface drive the requirements below:

1. **Its line box is taller than Inter's.** A handwriting face needs more vertical room, so the copyright
   line grows taller when the font arrives. The footer row also holds the social links, so a taller line
   would push them. The layout must not move, which is what SC-002 measures.
2. **It is visibly a different typeface, not a variant of the same one.** With `font-display: swap` the
   visitor reads the name in Inter first and then sees it redraw as handwriting. The swap is a change of
   style rather than of weight, so it is more noticeable than a swap between two sans faces. It must
   still not move anything, and the text must be readable throughout.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See the page sign itself (Priority: P1)

A visitor scrolls to the bottom. The copyright reads `© 2026 Ismael Marot`, and the name is written by
hand. The rest of the page is unchanged and still set in Inter. The last thing on the page is a signature
rather than a legal notice.

**Why this priority**: It is the feature. Everything else in this specification exists to make this
survive contact with a slow connection and a small screen.

**Independent Test**: Load `/` at 1440x900, wait for the font, and assert that the name element's
computed `font-family` names Playwrite US Modern and its computed `font-weight` is 400.

**Acceptance Scenarios**:

1. **Given** the font has loaded, **When** the footer is viewed, **Then** the name renders in Playwrite
   US Modern at weight 400.
2. **Given** the footer is viewed, **When** it is read as text, **Then** it reads `© 2026 Ismael Marot`,
   unchanged from before this feature.
3. **Given** any other part of the page, **When** it is compared against the same part before this
   feature, **Then** nothing about it has changed, including the typeface, the weights and the sizes.

---

### User Story 2 - Read the footer even if the font never arrives (Priority: P1)

A visitor on a slow connection, on a metered connection or with a blocked font CDN sees the name in Inter
until the font arrives or for the whole visit if it never does. The name is never invisible, never
blank, and never half-drawn. The social links beside it do not move when the font arrives, and the page
does not jump.

**Why this priority**: It is the failure mode of adding a web font, and the constitution requires
WCAG 2.1 AA with a CLS budget below 0.1. A page that rearranges itself after it has finished loading is
a page that fails both.

**Independent Test**: Block the font request, load `/`, assert the name is present, visible and legible in
a fallback face; then load `/` normally, capture the footer's geometry before and after the font loads,
and assert it is identical.

**Acceptance Scenarios**:

1. **Given** the font request fails, **When** the footer renders, **Then** the name is still shown, in a
   fallback typeface, and is still readable.
2. **Given** the font request is blocked, **When** the page loads, **Then** the copyright text is present
   in the accessibility tree exactly as it is with the font.
3. **Given** the font arrives after first paint, **When** it applies, **Then** the height of the footer,
   the position of the copyright and the position of the social links do not change.
4. **Given** the font never arrives, **When** the visitor uses the page, **Then** nothing else on the page
   is affected.

---

### User Story 3 - Read it on a phone (Priority: P2)

A visitor on a phone reaches the footer and the signature is legible, does not collide with the social
links, and does not wrap into something unrecognisable at 320px.

**Why this priority**: The footer row is `display: flex` and the signature is the element most likely to
be pushed to a second line, because a handwriting face sets wider than Inter at the same size.

**Independent Test**: Load `/` at 320x640 and at 390x844, assert the social links remain visible and
horizontally aligned with the copyright, and that nothing overflows.

**Acceptance Scenarios**:

1. **Given** the footer at 320px, **When** it renders, **Then** the name and the social links are both
   fully visible and neither overlaps the other.
2. **Given** the footer at 320px, **When** it renders, **Then** no element overflows the viewport
   horizontally.
3. **Given** the footer at any supported viewport, **When** the font loads, **Then** nothing reflows.

---

### Edge Cases

- **The font is blocked, throttled or 404s.** Handled by `font-display: swap` and by declaring the
  fallback in the stack rather than relying on the browser's default. FR-003, FR-004.
- **The name is longer or shorter than `Ismael Marot`.** The copyright prop is already configurable and
  `Layout.tsx` passes `siteConfig.name`. A longer name must still not push the social links off the row
  at 320px. FR-008.
- **`copyright` prop is not provided.** The footer falls back to the literal `'Ismael Marot'`, which is
  today's behaviour and must keep working.
- **A browser without variable font support.** The Google Fonts stylesheet serves a static 400 in that
  case, which is the weight this element uses anyway, so the rendering is unchanged.
- **`prefers-reduced-motion`.** Not applicable: no motion is introduced. Recorded so its absence is
  deliberate rather than forgotten.
- **The visitor has forced a system font** (`font-family` overridden in their own user stylesheet). No
  rule in this specification prevents that, and none is added to prevent it.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The name in the footer copyright MUST render in Playwrite US Modern at weight 400.
- **FR-002**: The name MUST declare its weight explicitly as 400. Playwrite has no bold, and an
  inherited or default weight above 400 would cause the browser to synthesise a heavier face the
  typeface was never drawn with.
- **FR-003**: The font MUST be declared with a fallback of the site's existing sans stack, so that if the
  CDN is unreachable the name renders in Inter rather than in the browser's default face.
- **FR-004**: The font MUST load with `font-display: swap`, so text is never invisible while the font is
  in flight.
- **FR-005**: The `©` symbol and the year MUST keep the site's existing typeface and their existing size,
  weight and colour.
- **FR-006**: The copyright's text content, its order and its element type MUST be unchanged by this
  feature. Only the typeface of the name portion changes.
- **FR-007**: The footer's geometry MUST NOT change when the font loads or fails. The copyright line
  reserves the height the handwriting face needs, so the social links beside it never move.
- **FR-008**: At 320px the copyright and the social links MUST both remain fully visible, and the
  signature MUST NOT wrap or overlap.
- **FR-009**: No other element of the page MUST change typeface, weight or size. Inter remains the
  typeface of `body` and of every heading.
- **FR-010**: The name MUST continue to come from the `copyright` prop and therefore from
  `siteConfig.name`. No name may be hardcoded into the component, and the literal default that already
  exists stays as it is.
- **FR-011**: The font MUST be loaded from a `<link>` in `index.html`, not from an `@import` in
  `globals.css`, so that it does not serialise behind the existing Inter request in a render-blocking
  stylesheet.
- **FR-012**: No new dependency and no bundled font binary. The font is served from the same CDN that
  already serves Inter.

### Key Entities

- **Signature**: the name inside the copyright line. One per page, at the foot. This feature changes its
  typeface and nothing else.
- **Copyright line**: the whole `<p>`, symbol, year and name. It existed before this feature and keeps
  its element, text and semantics.
- **Fallback stack**: `--font-hand`, a single token carrying Playwrite followed by `--font-sans`. It is
  a token rather than a literal so that no component needs to know about the CDN, and so that the name
  has exactly one definition of its typeface.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: With the font loaded, the name's computed `font-family` names Playwrite US Modern and its
  computed `font-weight` is `400`, measured in a real browser rather than asserted against the CSS
  source.
- **SC-002**: The footer's height, and the bounding boxes of the copyright and of the social links, are
  identical before and after the font loads, measured at 320, 768, 390 and 1440.
- **SC-003**: Cumulative layout shift over the page load stays below 0.1 with the font enabled, measured
  rather than assumed.
- **SC-004**: With the font request blocked, the name is still visible, non-empty and within the
  accessibility tree, and its computed `font-family` resolves to the fallback rather than to the browser
  default.
- **SC-005**: The footer's text content is byte-identical before and after this feature, asserted in a
  component test rather than by reading the page.
- **SC-006**: `body` still computes to Inter and no heading's computed `font-weight` changes. This is
  what FR-009 means, and it is measured rather than assumed.
- **SC-007**: axe reports zero violations at 1440, 768, 390 and 320. A handwriting face at the same size
  sets a different apparent weight, so contrast is re-measured rather than inherited from Inter's.
- **SC-008**: Type checking, linting, the unit tests, the component tests and the production build all
  pass, and no existing Footer or Layout test is deleted.
- **SC-009**: The runtime bundle grows by no more than 5kB, since the font is a network resource and not
  a JavaScript one.
- **SC-010**: The rendered markup gains no heading and no landmark.

## Assumptions

- **The footer is where this belongs.** It was chosen deliberately over the hero, the project titles and
  the site at large. The hero and the section headings are set at weights this typeface does not have,
  and the copyright is the one piece of text on the page that is a person's name and nothing else.
- **One weight is enough.** The typeface is variable from 100 to 400, but a signature has one weight,
  and the static 400 instance is a smaller download than the full range for no loss here.
- **The swap is acceptable.** Playwrite and Inter are not the same typeface, so the visitor will see the
  name redraw. That is the intended effect rather than a defect, and it is bounded by the text staying
  readable in both faces and by nothing moving.
- **The colour does not change.** The name keeps `--color-text-tertiary`. A muted grey at 14px is
  legible in a handwriting face, and SC-007 re-measures it rather than assuming it.
- **The name keeps coming from configuration.** Nothing about this feature hardcodes `Ismael Marot` into
  a component; `siteConfig.name` continues to be the single source.
- **Inter remains.** This feature adds one element to one line. Nothing in it argues for replacing the
  site's typeface, and the constitution's YAGNI principle argues against it.

### Amendment 1 - What implementing this actually cost, measured rather than assumed

Three things the specification did not predict, recorded because the specification's own numbers would
have been wrong without them.

**The line grows by exactly one pixel, and it moves the social links.** The handwriting face sets a 25px
inline box against Inter's 17px at the same 14px. The copyright line went from 21px to 22px and the
social link row went down with it by 1px, at both 320px and 1440px. One pixel is small enough to look
like nothing and large enough to move a row, which is why FR-007 exists and why SC-002 is measured
rather than asserted. The fix is a reserved `height: 21px` on the copyright paragraph. It is
deliberately **not** a `line-height`: pinning that to 22px measured 23px, because the inline box
overflows it either way.

**Splitting the name into its own element breaks every text matcher that spans the line.** The
footer's existing test, `renders copyright with current year`, failed the moment the name became a
child of its own `<span>`, because `getByText(/© 2026 Test Name/)` no longer finds a single element
carrying that text. FR-008 forbids deleting an existing test to make room for this one, so the fix was a
matcher over the paragraph's `textContent`, which preserves the assertion's intent and lets it keep
reading the line the way a visitor does. The cost of this feature was one test rewrite that a smaller
scope would have hidden.

**The weight declaration on the name is not redundant, and only one test can prove it.** The parent
paragraph is already 400, so removing the declaration from the name changes nothing observable *today*,
and the browser test cannot tell the difference. What it does change is the future: with the parent
raised to 700 and the declaration removed, the name computed to 700, and Playwrite would have
synthesised a bold it was never drawn with. So the declaration is guarded by a component test that
checks it is present, and the browser test checks the value that actually renders. Neither test alone
would be worth having; the second one proves the name is drawn at 400 today and the first one keeps it
that way.

### Amendment 2 - Two pre-existing failures in this environment, neither caused by this feature

Recorded so a later reader does not attribute them to the signature.

**Firefox cannot run at all.** Its Nightly build fails to launch on this machine with `Could not find
profile folder`. Confirmed by stashing every change of this feature and running it again: identical
failure on the previous commit, and `playwright install firefox` does not repair it. Every criterion
below the browser line is therefore verified in chromium and webkit, not in three browsers.

**One webkit test fails intermittently under load, and it is not always the same one.** Running the
webkit suite produces one failure that moves between `hero-band` and `project-icon-strip`, both from
earlier features. Each passes three times out of three when run alone, and the same single failure
appears on the previous commit with this feature fully stashed. The pattern is a test that waits on a
CSS state reached by an animation, losing the race when the machine is busy. This feature's own twelve
tests passed on every run, in both browsers.

### Amendment 3 - Withdrawn by the maintainer after it shipped

**Status**: the code of this feature is no longer in the site. Every requirement above, every success
criterion and every test written for it was met, verified and deployed, and the feature was then removed
at the maintainer's request. Nothing in this document describes the site's current state.

**What was reverted.** The commit `c52b716`, by `git revert`, which is why the history still shows the
feature having existed rather than the rewrite that would have hidden it. The reverted files were:

- `index.html` — the `preconnect` and the Playwrite stylesheet link
- `src/styles/tokens.css` — `--font-hand`
- `src/components/layout/Footer/Footer.tsx` — `StyledSignature` around the name
- `src/components/layout/Footer/Footer.styles.ts` — the signature style and the reserved `height: 21px`
- `src/components/layout/Footer/Footer.test.tsx` — the signature tests and the `copyrightOf` matcher
- `tests/e2e/footer-signature.spec.ts` — the twelve browser tests, in full

This document and its `plan.md` and `tasks.md` are kept deliberately. The measurement that motivated
the reserved height is the reason the idea is worth returning to rather than a dead end, and the reason
the typeface was kept off the headings is a property of the typeface, not a decision about this site.

**What the site is now.** The copyright reads `© 2026 Ismael Marot`, in Inter, at 14px, in
`--color-text-tertiary`, in a `<p>` with no reserved height, exactly as it did before this feature.

**If it is ever brought back**, Amendment 1 is the part to read first. The reserved `height: 21px` is
not optional and is not a `line-height`, and the reason the name needs its own declared weight is that
the parent paragraph may one day be set above 400. The one thing that would have to be reconsidered
rather than reused is the typeface itself: Playwrite US Modern sets a connected script, which is a
larger visual commitment than the spec's "one deliberate moment at the end of the page" was written to
justify, and that judgement is the maintainer's to make rather than this document's.