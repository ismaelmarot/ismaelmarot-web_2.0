# Implementation Plan: The Contact Band on the Landing Page

**Branch**: `020-home-contact-band` | **Date**: 2026-10-14 | **Spec**: [spec.md](./spec.md)

## Summary

One band on the landing page stops being a title, a sentence and a grey pill, and becomes a card whose
subject is the address. A diagonal arrow, one display-size link, one route to the contact page, a row of
networks and a name.

The work that took the thought was not the layout. It was reading what already asserts this band before
drawing anything, because three things in the repository would otherwise have broken silently.

## Technical Context

**Language/Version**: TypeScript 5.5, React 18.3
**Primary Dependencies**: styled-components 6.1. **No additions** — `simple-icons` is already installed
and this feature does not need it (FR-018)
**Storage**: `src/data/site-config.ts`, read only. No data change ships with this feature
**Testing**: Vitest (unit and component), Playwright (E2E and the axe audit)
**Target Platform**: Static site, GitHub Pages
**Performance Goals**: No layout shift beyond what the band already caused; no new network request
**Constraints**: The band keeps its id and its accessible name (FR-006), its background (FR-007) and the
page's rhythm (FR-008); nothing else on the site changes (FR-020)

## Constitution Check

*GATE: passed.*

| Principle | Compliance |
|---|---|
| I. Component-First | One component in its own folder with the five required files. It is the band, not a fragment of a generic one. |
| II. Type Safety | Props typed; the networks come back as `ContactMethod[]` and the address as `string`. |
| III. Testing | A new component test per user story, and one existing assertion updated with the reason recorded in the spec's Amendment 2. |
| IV. A11y & Performance | `role="list"` with `listitem` children, which this repository has now got wrong twice and been caught twice. The address is a real link with a real name. axe at four viewports. |
| V. Design Principles | One idea per band and one dominant element. The address is the subject and everything else is subordinate. |
| VI. YAGNI | No animation, no new dependency, no abstraction of the shared shell, and no Facebook or Instagram until their URLs exist. |
| Styling | All of it in `ContactBand.styles.ts`. The address's size is a token, not a literal (FR-003). |
| Path Aliases | `@/data/site-config`, `@/components/ui/Icon`, `@/types/contact`. No relative import leaves the folder. |
| Dependencies | `package.json` untouched. |

## Project Structure

### Documentation (this feature)

```text
specs/020-home-contact-band/
├── plan.md
├── spec.md
├── tasks.md
└── checklists/
    └── requirements.md
```

No `research.md`, `data-model.md`, `contracts/` or `quickstart.md`. Correct: the feature introduces no
entity, changes no schema, defines no interface between systems, and needs no validation guide. The
`contracts/` directory would be the place for a prop interface, and there is none that is not already
declared by the component.

### Source Code

```text
src/components/sections/ContactBand/
├── ContactBand.tsx
├── ContactBand.styles.ts
├── useContactBand.ts
├── ContactBand.test.tsx
└── index.ts
```

Changed outside that folder:

```text
src/components/ui/Icon/useIcon.tsx              # the diagonal arrow
src/components/ui/Icon/Icon.test.tsx             # its assertion
src/types/contact.ts                             # facebook, instagram
tests/unit/contact-domain.test.ts                # their helpers
src/styles/tokens.css                            # --text-display-email
src/styles/tokens.ts                             # the same value in TypeScript
src/pages/Home/Home.tsx                          # which component the band is
src/pages/Home/Home.test.tsx                     # the one heading that changes
```

**Structure Decision**: the constitution's five-file pattern. `useContactBand.ts` is not decoration: it
derives the address and the networks out of one configuration object, and that derivation is where the
filtering and the Spanish names live, which is logic the component should not carry.

## The four decisions the rest followed from

### The shell is copied, not extracted

`SectionSummary`'s shell is `padding-block: space[16]`, `min-height: 100vh` with a `100dvh` fallback,
`display: grid`, `align-content: center`. Ten lines, already used by three bands on one page.

Extracting it into a shared primitive for a fourth user is the generalisation the constitution's YAGNI
principle rules out, and it would also couple this feature to changes in three bands it has nothing to do
with. **The values are repeated**, with a comment saying they are repeated and why. That is the smaller
cost, and it is stated in the specification rather than left to look like an oversight.

### The address gets its own token, and the token carries the reason

`tokens.css` has a heading that says `Typographic Scale - Exact Spec Values`, and below it two additions
that came with a written justification: `--text-card-title` and `--text-card-body`, added because a
project card is a full-screen surface rather than a list row.

**The address is the same case.** `--text-display-project` is `clamp(2rem, 4vw, 3.5rem)`, and
`ismaelmarot@hotmail.com` is twenty-four characters. At 32px it cannot fit a 390px phone. Reusing a token
that does not fit and overriding it in the component is worse than adding one that fits, because the
override is invisible at the call site and the reason would be lost.

So: `--text-display-email: clamp(1.125rem, 3.4vw, 2.25rem)`, with the same style of comment
`--text-card-title` carries, and mirrored into `tokens.ts` which already mirrors the whole scale.

### The networks are read from configuration, filtered by type

`siteConfig.socialLinks` already holds email, GitHub and LinkedIn, and already feeds three surfaces: this
band, the footer and the contact page. Reading it and dropping the email entry means that when Facebook
and Instagram arrive there are two lines of configuration and no code anywhere. Hard-coding a list of two
marks here would mean a second source of truth that drifts from the first.

**A network with no value does not render**, which is what keeps a half-added entry from producing a
mark that goes nowhere, and what makes the Facebook and Instagram question a data question rather than a
design one.

### The heading asks the question

The band's heading becomes "¿Tienes un proyecto?" and its accessible name stays "Contacto". A band whose
heading says "Contacto" and whose body says "¿Tienes un proyecto?" is a band that says its category and
then asks its question; the other order says the question and is named by its category for anything
navigating by region. Both survive, and only one of them is what a visitor reads.

## Accessibility, decided before the markup

- **The address** is `<a href="mailto:...">` whose accessible name is the address itself. Not "Email",
  not "Contacto": the visible text is the name.
- **The arrow** is `aria-hidden`. It is decoration and the address beside it is already the name, which
  is the pattern `specs/009` established for its own toggle and `specs/016` for the marquee.
- **The networks** are `role="list"` with `role="listitem"` children, each an `<a>` with an `aria-label`
  naming the network in Spanish and an `aria-hidden` glyph. This repository has declared a role inside a
  list item twice and axe has caught it twice; the structure is asserted by test rather than by comment.
- **The band's link** is a `Link` with the arrow hidden, so its accessible name is "ir →" and not
  "ir flecha".
- **Focus** is visible on both links, from the existing focus token, and both are in the tab order with
  nothing trapped between them.

## Testing, and what it does not reach

**Component** — one test per user story: the `mailto:` and its absence of `target`, the arrow beside it,
the heading, the band keeps its id and its accessible name, the link resolves to `/contact`, the networks
are a list of named marks with `target` and `rel`, a network with no value does not render, an empty
configuration renders no list, and the name matches the Hero's.

**Unit** — `facebook` and `instagram` on `getContactTypeIcon`, `getContactHref` and `isExternalLink`,
with a glyph each, so that adding them later cannot be a code change.

**Existing** — `Home.test.tsx`'s heading order, updated because the design changed it and the reason is
in the specification's Amendment 2. `tests/e2e/homepage.spec.ts` needs no change, because the band keeps
its id.

**Browser** — the repository's axe audit visits `/` since `specs/018`, and `tests/e2e/routes.spec.ts`
asserts on `/` that nothing overflows horizontally and that one `h1` exists. Those two cover the criteria
that a component test cannot.

**Not measured**: the band's height at a short desktop viewport, and any visual comparison against what
the band looked like before. The specification says so rather than implying coverage it does not have.

## What this plan does not do

**It does not colour the band.** FR-007 keeps it `default`, because the maintainer withdrew that part
before implementation and because on the landing page it already is the technologies band's colour.

**It does not add Facebook or Instagram.** FR-011 and FR-019 are written so that adding them is two lines
of configuration.

**It does not touch the footer or the contact page**, and it does not try to make the three surfaces look
alike. One list feeding three places is the arrangement that already exists; this feature reads it rather
than replacing it.