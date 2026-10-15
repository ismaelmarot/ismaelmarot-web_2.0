# Tasks: The Navigation's Hover

**Input**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md)
**Status**: Complete

## Phase 1 — The declaration

- [x] T001 `Navigation.styles.ts` — hover `color: var(--color-accent)`
- [x] T002 `Navigation.styles.ts` — drop `text-decoration: var(--link-hover-decoration, none)` and its comment
- [x] T003 `Navigation.styles.ts` — the comment records why the underline existed and why it does not need to
- [x] T004 `Navigation.styles.ts` — drop the now-unused `text-underline-offset`

## Phase 2 — The dark theme

- [x] T005 `Header.styles.ts` — remove `--link-hover-decoration: underline`
- [x] T006 `Header.styles.ts` — add `--color-accent: #0a84ff` to the `$overDark` block
- [x] T007 `Header.styles.ts` — rewrite the block comment: what the underline was for, and why the accent is overridden
- [x] T008 leave the four existing accent tokens alone (FR-005)

## Phase 3 — Tests

- [x] T009 `Navigation.test.tsx` — hover carries the accent and no decoration
- [x] T010 `Navigation.test.tsx` — `--link-hover-decoration` appears nowhere in `src` (SC-007)
- [x] T011 `Navigation.test.tsx` — the hover reads a token, not a hex, so the dark theme can reach it
- [x] T012 `Navigation.test.tsx` — the resting link is unchanged (SC-008)
- [x] T013 `Header.test.tsx` — assert `--color-accent: #0a84ff` where the underline variable was asserted
- [x] T014 `Header.test.tsx` — light theme asserts it does *not* override the accent
- [x] T015 `navigation-hover.spec.ts` — hovered colour over the black band is `rgb(10, 132, 255)` (SC-003)
- [x] T016 `navigation-hover.spec.ts` — hovered colour over a white section is `rgb(0, 113, 227)` (SC-004)
- [x] T017 `navigation-hover.spec.ts` — `text-decoration-line` is `none` in both (SC-001, SC-002)
- [x] T018 `navigation-hover.spec.ts` — both contrasts ≥ 4.5:1, recomputed (SC-005, SC-006)
- [x] T019 `navigation-hover.spec.ts` — the pointer leaves, the colour returns
- [x] T020 `navigation-hover.spec.ts` — the focus ring survives, since the underline no longer is one

## Phase 4 — Verification

- [x] T021 lint, typecheck, 151 unit, 465 component, build
- [x] T022 E2E: 116 passed in Chromium, including the 5 new ones
- [x] T023 a11y: 0 violations across 7 routes at 4 viewports

## Notes

- T004 caught a leftover: `text-underline-offset: 4px` remained after the underline it offset was gone.
- T010 initially failed against itself — the scan found its own assertion string. Excluded `.test.` files
  so the scan looks for a declaration, not for the check that the declaration is absent.
- T018's contrast helper was written wrong the first time and `tsc` rejected it before it ever ran. Worth
  remembering that the type check is a real gate and not a formality.
- T015 and T016 both failed on the first run against a stale build, because a `tsc` failure had aborted
  `npm run build` and the `&&` chain had swallowed it. The failures looked like product bugs.