# Tasks: The Contact Band's Composition

**Input**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md)
**Status**: Complete

## Phase 1 — Measure before deciding

- [x] T001 Read `ContactBand.tsx` and `ContactBand.styles.ts` as they were after `specs/021`
- [x] T002 Find the Hero's "Web Developer" token: `--text-display-project`, `clamp(2rem, 4vw, 3.5rem)`
- [x] T003 Confirm `--text-display-email` has exactly one consumer
- [x] T004 Measure the address at ten sizes on the rendered page
- [x] T005 Measure the available column at five viewports

## Phase 2 — Write

- [x] T006 `spec.md` — the arrangement is what made the size possible, and the arithmetic that follows
- [x] T007 `spec.md` — why the question stayed at 16px
- [x] T008 `spec.md` — the reading-order conflict and `order` as the resolution
- [x] T009 `plan.md` — what replaces the token's comment and what that costs
- [x] T010 `tasks.md` and `checklists/requirements.md`

## Phase 3 — Content

- [x] T011 `SiteConfig.contactTagline`
- [x] T012 the string in `site-config.ts`
- [x] T013 `useContactBand` returns it, overridable by prop

## Phase 4 — The token

- [x] T014 `--text-display-email: var(--text-display-project)`
- [x] T015 The mobile override, with the measured ceilings
- [x] T016 The old comment replaced — its arithmetic described a column that no longer exists

## Phase 5 — The band

- [x] T017 `StyledContactBandRow` → `auto 1fr`, `order: -1`
- [x] T018 `StyledContactBandCopy` and `StyledContactBandDescription`
- [x] T019 `StyledContactBandInner` → flex column, because `align-self` does nothing in a block
- [x] T020 `StyledContactBandCta` aligned right, left on mobile
- [x] T021 `StyledContactBandFooter` removed; the networks moved into the row
- [x] T022 DOM reordered: the question first, the row second, the row raised by `order`

## Phase 6 — Tests

- [x] T023 `ContactBand.test.tsx` — the networks row's `data-testid` is gone, the assertion moved to the list
- [x] T024 `ContactBand.test.tsx` — `1fr 1fr` → `auto 1fr`, with the reason it is load-bearing
- [x] T025 `ContactBand.test.tsx` — the token assertion's reason updated; the assertion itself untouched
- [x] T026 Five new component tests
- [x] T027 `contact-band-layout.spec.ts` — 23 tests that measure, across five viewports
- [x] T028 lint, typecheck, 151 unit, 470 component, build
- [x] T029 E2E: 278 in Chromium and WebKit, 278 in both mobile projects
- [x] T030 a11y: 0 violations across 7 routes at 4 viewports

## Notes

- **The first measurement was wrong and it was wrong in a way that looked right.** It measured the address
  text alone and produced a table saying 26px fits 390 with 28px to spare. The link also holds a 28px
  arrow and a 12px gap, so the real ceiling at 390 is 25px and at 320 is 19.5px. The rendered page
  wrapped the address on two lines at both mobile viewports and the E2E caught it.
- **The fix was to binary-search the rendered band for the largest size that does not wrap**, rather than
  to compute it from a probe. Five measurements came back — 19.5, 22.7, 25, 28.2 — and the ramp that
  respects all four is `clamp(1.125rem, 5.9vw, 1.5rem)`. The probe had been the thing producing the
  wrong numbers, so it was the thing to remove.
- **`align-self` did nothing until `StyledContactBandInner` became a flex column.** The button was
  rendered at the left in the first build while the component test and the stylesheet both said it was
  right. A unit test on the declaration would have passed; only measuring where the button actually
  landed found it.
- **The DOM came out backwards.** The row was written first, which made the networks the first thing in
  the band — the opposite of the decision. `order: -1` on the row is what puts it on top while the
  heading stays first.
- **The component assertion for DOM order was removed rather than worked around.** `no-node-access`
  forbids reaching for siblings, and the E2E already measures it on the real page. The component keeps
  the part it can say cleanly — the links' order — and the comment says where the rest went.
- **`tokens.fontWeights.regular` does not exist.** It is `normal`. A `tsc` error, not a guess.
- **The token assertion survived the whole feature untouched.** It reads `var(--text-display-email)`
  rather than a literal, so raising what that resolves to changed no test. That is the abstraction
  working, and it is why only the assertion's *reason* needed rewriting.
- **One component test left the file.** `la pregunta es el primer elemento de la banda en el DOM` became
  an E2E measurement, because the E2E can measure order on a real page and the component test could
  only approximate it.