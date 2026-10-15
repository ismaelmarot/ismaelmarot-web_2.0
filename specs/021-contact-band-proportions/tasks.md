# Tasks: The Contact Band's Proportions

**Input**: Design documents from `specs/021-contact-band-proportions/`

**Prerequisites**: plan.md, spec.md, checklists/requirements.md

**Tests**: Required. Six component tests added and three rewritten, and the criteria that are about
width measured in a browser rather than asserted from jsdom.

## Format

`[ID] [P?] [Story] Description` — [P] parallelisable, [Story] maps to US1–US4.

## Phase 1: Specification

- [x] T001 Measure what shipped: the question at 72px against the address at 36px, and the band at
      1082px against the footer's 182
- [x] T002 Measure the footer across five widths, finding 182px from 390 up and 208px at 320, where its
      navigation wraps from 18px to 44px
- [x] T003 Establish that the 50% split is arithmetic: (1232 - 40) / 2 = 596px per column
- [x] T004 Write the specification, with the withdrawn requirement recorded in Amendment 1
- [x] T005 Write the requirements checklist, twenty criteria, and clear it

## Phase 2: The token

- [x] T006 `--text-display-email`'s ceiling from 2.25rem to 2.5rem, with the arithmetic in the comment
- [x] T007 **Re-measure and correct that comment.** The figures written before implementing — 526px of
      text and 30px to spare — were wrong: the rendered link carries a letter-spacing the estimate did
      not, so the real figures are 508px of text and 48px to spare. The conclusion held; the numbers did not

## Phase 3: The layout

- [x] T008 The question out of `--text-display-section` and into `--text-body`, so the address is the
      largest text at every viewport (FR-001, FR-003)
- [x] T009 `grid-template-columns: 1fr 1fr`, with `StyledContactBandActions` as the left column
- [x] T010 Move the `<h2>` inside the row, so the question and the button share a column and the address
      owns the other. It stays the band's only heading and stays first in document order
- [x] T011 The button black with white text and white arrow, `hover` by opacity and lift rather than by a
      shadow that a black surface cannot show
- [x] T012 **The button's focus state is a white outline, not `--shadow-focus`.** The inherited token is
      drawn in the page's own colour, which on a black button is the background

## Phase 4: The deletions

- [x] T013 Remove `StyledContactBandName`, its element, the `nombre` prop and the branch in
      `useContactBand` (FR-009)
- [x] T014 Remove the `border-top` and the `padding-top` above the network row (FR-010)

## Phase 5: The two missing marks

- [x] T015 `siteConfig.socialLinks` gains Facebook and Instagram pointing at the platforms' own landing
      pages, `displayOrder` 4 and 5, with no path after the host (FR-012)

## Phase 6: Tests

- [x] T016 Six component tests for the button's colours, its focus state, the row's grid, the four marks,
      the absence of the name and the absence of the divider
- [x] T017 Rewrite the heading test, which asserted `--text-display-section` and then
      `--text-large-subtitle`, and now asserts `--text-body` **and the absence of the two tokens that
      were wrong**
- [x] T018 Rewrite the network-count test, which matched two names and now matches four and counts
      against the configuration
- [x] T019 `Home.test.tsx`: the name goes from two occurrences back to one, and `getByText` is right
      again

## Phase 7: Verification

- [x] T020 `npm run lint` and `npm run typecheck`
- [x] T021 `npm run test` — 151 unit
- [x] T022 `npm run test:component` — 445
- [x] T023 `npm run build`
- [x] T024 **Measure the four widths in a browser**: column widths, the address's text width, the arrow,
      whether it fits and whether the hierarchy holds. This found the inversion recorded in Amendment 2
- [x] T025 `npm run test:a11y` — zero violations on all seven routes, including `/` and `/contact` at
      1440, 768, 390 and 320
- [x] T026 `tests/e2e` across four browsers — 404 passed
- [x] T027 `/contact` renders the two new marks at the platforms' landing pages, with no overflow

## Verification Results

| Criterion | Result |
|-----------|--------|
| SC-001 address 40px, question 28px | **Superseded**: the question is 16px, not 28. See below |
| SC-002 address larger at 1440, 768, 390 and 320 | Pass, after the correction in Amendment 2 |
| SC-003 two equal columns at 1440 | Pass: 596 and 596 |
| SC-004 the address fits its column | Pass: 48px free at 1440, 7px at 768, 89px at 390, 19px at 320 |
| SC-005 no wrap, no overflow | Pass at all four widths |
| SC-006 the button is black, its text white | Pass: `rgb(0,0,0)` and `rgb(255,255,255)` read in a browser |
| SC-007 the focus state differs from rest | Pass, asserted on the stylesheet |
| SC-008 four named marks | Pass |
| SC-009 Facebook's `href` has no path | Pass: `https://www.facebook.com` |
| SC-010 Instagram's `href` has no path | Pass: `https://www.instagram.com` |
| SC-011 no owner name in the band | Pass, measured `false` in a browser |
| SC-012 no divider above the networks | Pass, asserted on the injected stylesheet |
| SC-013 no horizontal overflow | Pass at all four widths |
| SC-014 axe on `/` and `/contact` | Pass: zero violations at four viewports |
| SC-015 lint, typecheck, tests, build | Pass: 151 unit, 445 component |

## Notes

**T024 is the task that found the defect, and it is the second time this feature has been caught by
measuring at more than one width.** The first token chosen for the question was
`--text-large-subtitle`, whose 20px floor sits above the address's 18px floor. At 1440 and 768 it was
correct; at 390 and 320 the question was still the larger text, which is the inversion
`specs/020` shipped and which this specification exists to remove. **A component test would not have
caught it**, because the assertion would have been about a token rather than about a relationship
between two rendered sizes, and the relationship only exists at a width the test would have to render.

**T007 is the correction to the correction.** The arithmetic in the specification and in the token
comment gave 526px of text at 40px and 30px to spare. Measured on the rendered link it is 508px and
48px, because the link carries `letter-spacing: -0.01em` that the estimate ignored. **The conclusion
was right and the figures were wrong**, and it was also the tightest case that was not desktop: at 768px
only 7px remain. Both facts are now in the token's comment, and both are things a reader would otherwise
have had to rediscover by resizing a browser.

**T012 is one declaration and it is worth its own task.** The button inherited `--shadow-focus`, which
is drawn in the page's own colour. On a black surface that colour is the background, so the band's only
control would have had no visible focus indicator — a WCAG 2.4.7 failure that no amount of contrast
checking on the text would have surfaced.

**T015's consequence is measured rather than engineered away.** `/contact` now renders two more cards
pointing at the platforms' landing pages, and the footer two more marks. That is what one network list
feeding three surfaces means, and `specs/020` chose that arrangement over a second list deliberately.
The alternative was a filter in `/contact` that would have to be removed the day real profiles arrive,
since those are `https://` too.
