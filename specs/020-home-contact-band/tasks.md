# Tasks: The Contact Band on the Landing Page

**Input**: Design documents from `specs/020-home-contact-band/`

**Prerequisites**: plan.md, spec.md, checklists/requirements.md

**Tests**: Required. Eighteen component tests and four unit tests, one existing test file updated.

## Format

`[ID] [P?] [Story] Description` — [P] parallelisable, [Story] maps to US1–US4.

## Phase 1: Specification

- [x] T001 Read what already asserts this band: `id="contact-summary"` in the browser suite, the
      level-two heading sequence in `Home.test.tsx`, and `SectionSummary`'s shell
- [x] T002 Establish that the band on the landing page is already the technologies band's colour, so the
      withdrawn half of the request was not costing anything
- [x] T003 Confirm `socialLinks` feeds three surfaces — this band, the footer and the contact page — and
      decide to read it rather than to introduce a second list
- [x] T004 Write the specification, with the colour and the two missing networks recorded as deferrals
- [x] T005 Write the requirements checklist, sixteen criteria, and clear it

## Phase 2: The pieces the band needs

- [x] T006 [P] `arrowUpRight` in `useIcon.tsx`, two paths, the same stroke vocabulary as `arrowRight`
      and `externalLink` (FR-004, FR-005)
- [x] T007 [P] `facebook` and `instagram` glyphs, copied from `simple-icons` the way every other glyph
      in the table was, without importing it at run time (FR-018)
- [x] T008 [P] `ContactType` gains both, and `getContactTypeIcon` maps them (FR-019)
- [x] T009 [P] `getContactHref` treats both as websites and `isExternalLink` as true for both
- [x] T010 `ContactMethod.styles.ts` gains a neutral surface for both, because it is a
      `Record<ContactType, RuleSet>` and the compiler caught the omission the moment the type widened
- [x] T011 [P] `--text-display-email: clamp(1.125rem, 3.4vw, 2.25rem)` in `tokens.css` and its mirror in
      `tokens.ts`, each with the reason written (FR-003)

## Phase 3: The component

- [x] T012 `useContactBand.ts` deriving the address, the networks and the name from one configuration
      object, dropping the email and dropping any network with no destination (FR-011, FR-012)
- [x] T013 `ContactBand.styles.ts`, with the shell values repeated from `SectionSummary` and the reason
      for repeating them in a comment (FR-008)
- [x] T014 `ContactBand.tsx`: the question as the only heading, the route to the contact page, the
      address as one `mailto:` with its diagonal arrow, the network row, and the name
- [x] T015 The address carries no `target`; every network carries `target` and `rel` (FR-002, FR-015)
- [x] T016 `overflow-wrap: anywhere` on the address, because a grid item's default `min-width: auto`
      lets an unbreakable string widen its track past the viewport
- [x] T017 `index.ts`, and nothing else exported

## Phase 4: Wiring

- [x] T018 `Home.tsx`: the closing band becomes `<ContactBand />`. The other three bands are untouched
- [x] T019 `Home.test.tsx`: the heading sequence's last entry, with the reason in the spec's Amendment 2
- [x] T020 `Home.test.tsx`: "Ismael Marot" now appears twice, and the count is the assertion
- [x] T021 `Home.test.tsx`: "Contacto" is a region's accessible name rather than text on the page
- [x] T022 `Home.test.tsx`: "Contactar" labels the Hero alone now, and the band says "ir"

## Phase 5: Tests

- [x] T023 Eighteen component tests, one group per user story plus a group for what cannot change
- [x] T024 The address's size asserted from the injected stylesheet rather than from a class name,
      because styled-components emits generated names and a class assertion passes whatever the CSS says
- [x] T025 Four unit tests: both new types have their own glyph, resolve an href, are external, and every
      mapping names a glyph that exists

## Phase 6: Verification

- [x] T026 `npm run lint` and `npm run typecheck`
- [x] T027 `npm run test` — 151 unit
- [x] T028 `npm run test:component` — 439
- [x] T029 `npm run build`, and confirm the diagonal arrow reached the bundle
- [x] T030 Measure in a browser: the address is 36px at 1440 and 18px at 390, the band is 1440x900 and
      390x844, and there is no horizontal overflow at 1440, 390 or 320
- [x] T031 `npm run test:a11y` — zero violations on all seven routes at four viewports
- [x] T032 `tests/e2e` across Chromium, WebKit, Mobile Chrome and Mobile Safari — 404 passed

## Verification Results

| Criterion | Result |
|-----------|--------|
| SC-001 `mailto:` with the address as its text | Pass |
| SC-002 no `target` on the address | Pass |
| SC-003 address is the largest text | Pass: 36px against the heading's smaller step |
| SC-004 size resolves from `--text-display-email` | Pass, asserted from the injected stylesheet |
| SC-005 id and accessible name kept | Pass: `contact-summary` on a region named "Contacto" |
| SC-006 heading order | Pass: Proyectos, Tecnologías, Sobre mí, ¿Tienes un proyecto? |
| SC-007 the link resolves to `/contact` | Pass |
| SC-008 a list of named marks | Pass: `role="list"` with two `listitem` |
| SC-009 `target` and `rel` on every network | Pass |
| SC-010 the name matches the Hero's | Pass |
| SC-011 no overflow at four viewports | Pass, measured: 1440, 390, 320 all `overflow=false` |
| SC-012 axe | Pass: zero on all seven routes |
| SC-013 lint, typecheck, tests, build | Pass: 151 unit, 439 component |
| SC-014 both links focusable | Pass by construction, through the shared focus token |

## Notes

**T010 is the type system earning its place.** Widening `ContactType` broke the build on a
`Record<ContactType, RuleSet<object>>` in `ContactMethod.styles.ts` that had no opinion about the two new
networks. Adding a variant to a union is exactly the kind of change a type is supposed to notice, and it
noticed one in a file three directories away that nothing about the landing page would have suggested was
involved.

**T024 is the same correction `specs/019` made.** The first version of the size test compared a
`className` containing the component's name, which styled-components never emits. The second read the
injected stylesheet, which is what `getCssForElement` exists for and what the other component tests in
this repository already do. A class-name assertion looks like a style assertion and tests nothing.

**Two asserts in `Home.test.tsx` changed for the same reason and one of them changed meaning.** "Ismael
Marot" went from one occurrence to two because the band closes with the name, so `getByText` became
`getAllByText` **with the count asserted** — otherwise the test would keep passing if the band silently
lost its closing line. "Contacto" stopped being text and became a region's accessible name, so it is now
queried as a region, which is stronger than what it replaced: the old assertion could not have told the
difference between a band with a name and a band whose name was deleted.

**T030 measured rather than assumed, and the phone number is the reason the token exists.** The address
is 36px at 1440 and 18px at 390. `--text-display-project`, the nearest existing step, starts at 32px and
`ismaelmarot@hotmail.com` is twenty-four characters: at that size it overflows a 390px viewport. That is
recorded in the token's comment, so the next person who wonders why there is a ninth typographic step
finds the reason in the file rather than in a specification they would have to go looking for.

**The band keeps its shell by copying it, not by sharing it.** Four bands on one page carry ten lines of
values and there is no fifth caller that would justify a primitive. The cost is that a change to the
shell touches four files, which the plan records rather than leaving to look like an oversight.
