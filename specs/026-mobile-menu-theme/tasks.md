# Tasks: The Mobile Menu Takes the Header's Theme

**Input**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md)
**Status**: Draft

## Phase 1 — Write

- [x] T001 `spec.md` — the gap, with the portaled subtree and the two numbers that already resolve wrongly
- [x] T002 `spec.md` — why `:hover`, `:active` and `:focus-visible` all carry the accent, and why `:focus-visible` alone cannot
- [x] T003 `spec.md` — what the feature deliberately is not, including the broken focus trap it does not fix
- [x] T004 `plan.md` — the shared fragment, the one prop, and why the portal forces a boolean across
- [x] T005 `plan.md` — the entrance animation losing its white veil, recorded as a change and not a preservation
- [x] T006 `tasks.md` and `checklists/requirements.md`
  <!-- Marked 2026-10-16. The four artifacts exist, were reviewed for requirements quality, and the
       reviewer approved the phase. Two rounds of corrections came out of that review before the
       approval: SC-006 named its exclusions, SC-005 was corrected because `Navigation.styles.ts`
       declares no focus outline at all, and FR-010 was widened to cover the token files and the
       Playwright configuration. Checklists/requirements.md stays entirely unmarked — its markers are
       the reviewer's, and no review of it has been signed. -->

## Phase 2 — The shared theme

**Approved scope**: T007, T008 and T009 only. The implementer confirmed on 2026-10-16 that this phase
is the one described as "Phase 1" in the instruction, which is this Phase 2 in this file. Phase 3 and
later wait on a separate approval.

- [x] T007 Create `src/styles/theme.ts` with the nine overrides `Header.styles.ts:49-57` declares, plus `--color-background: #000000`
  <!-- Done 2026-10-16. `src/styles/theme.ts` exports one `css` fragment, `darkSurface`, carrying the
       nine in their original order and `--color-background: #000000` tenth. The contrast arithmetic for
       the accent moved with the values it explains; the header-specific measurements stayed behind. -->
- [x] T008 Point `Header.styles.ts` at the fragment instead of its inline `css` block, leaving `background-color: #000000`, `backdrop-filter` and `border-bottom` where they are
  <!-- Done 2026-10-16. Header.styles.ts imports darkSurface and interpolates it; the three layout
       declarations stay in the header's own block, and it now declares none of the nine. One error was
       made and fixed here: the rewritten comment named darkSurface and src/styles/theme.ts in
       backticks, inside the styled.header template literal, which closed the string and stopped the
       whole Header test file from transforming. The first run of the four dark tests failed to compile,
       not to assert. -->
- [x] T008a **Mandatory, and it does not touch the tests.** Capture the nine declarations from
  `Header.styles.ts:49-57` verbatim *before* T008 edits the file, write them into `src/styles/theme.ts`
  in the same order, and diff the two. Identical or the phase does not pass. This exists because the
  four dark-header tests assert only **three** of the nine — `--color-fg`, `--color-text-secondary` and
  `--color-accent` at `Header.test.tsx:171,172,176`. The other six, `--color-fg-muted`,
  `--color-text-primary`, `--color-accent-text`, `--color-accent-text-hover`, `--color-bg-muted` and
  `--color-border`, are asserted by nobody, so a dropped declaration would leave all four tests green.
  <!-- Done 2026-10-16. The nine were captured from `Header.styles.ts:49-57` before any edit and
       compared against the fragment's first nine. Byte-identical: both `fcb81898…`. The comparison
       first reported a difference, which was the tenth declaration and not a ninth that changed --
       `--color-background` is the addition T007 asks for. The check was corrected to exclude it, and
       the nine were then identical, in the same order. `Header.styles.ts` now declares none of them. -->
- [x] T009 `Header.test.tsx:160-212` — the four dark-header tests pass unmodified. This is the gate that the extraction changed nothing, and T008a is the gate that the *unasserted* six survived
  <!-- Done 2026-10-16. `Header.test.tsx` was not edited: `git diff` against it is empty. 11 passed,
       including all four under "Header over a dark region" — goes black with white text and no border,
       stays dark whatever the scroll offset, returns to the light treatment, and is transparent at the
       top of a page with no dark region. -->

## Phase 3 — The menu takes the theme

*T010 and T013 are one unit. The prop and the call site that supplies it cannot land in separate
commits without an intermediate state in which `tsc --noEmit` fails, so the phase ships whole.*

- [x] T010 `MobileMenuProps` gains `overDark: boolean` and `MobileMenu.test.tsx`'s nine `<MobileMenu>` call sites pass it — a required prop fails `tsc --noEmit` on all nine today. `MobileMenu` passes it as `$overDark` to `StyledMobileMenu`
- [x] T011 `MobileMenu.styles.ts` — apply the shared fragment when `$overDark`, so `StyledMobileMenu`'s existing `background-color: ${tokens.colors.background}` resolves to black without being edited
- [x] T012 `MobileMenu.styles.ts` — `menuSolidify`'s `from` becomes `background-color: transparent`, keeping `backdrop-filter: blur(18px)` (FR-007)
- [x] T013 `Header.tsx:89-94` — pass `overDark` to the portaled `MobileMenu`
- [x] T014 `MobileMenu.styles.ts:74,119` — confirm the focus ring follows each theme's accent, since `tokens.colors.focus` is `var(--color-accent)` (`tokens.ts:63`) and the dark surface therefore turns it `rgb(10, 132, 255)` (SC-005). The barrel needs no change: `index.ts:2` already exports `MobileMenuProps` and `overDark` is a member of it, so do not touch it

## Phase 4 — The interaction states

- [x] T015 `Navigation.styles.ts:92-93` — the mobile variant's `:hover` becomes `:hover, :active, :focus-visible`
- [x] T016 `MobileMenu.styles.ts:114-116` — `StyledNavItem`, the call to action, gets the same three states
- [x] T017 Confirm `Navigation.styles.ts:106` `&.active:hover` still wins over the new selector list, so the current section keeps its own treatment (FR-004, scenario 3)

## Phase 5 — Tests

- [x] T018 `MobileMenu.test.tsx` — the panel's rule carries the fragment when `$overDark` and none when it does not
- [x] T019 `MobileMenu.test.tsx` — the call to action and the navigation variant declare the same three interaction states
- [x] T020 `MobileMenu.test.tsx` — the entrance animation's first keyframe sets `background-color` to `transparent` or to the panel's own surface, read from the emitted stylesheet rather than watched frame by frame (SC-010)
- [x] T021 `MobileMenu.test.tsx` — a source scan proving each of the nine dark-theme override declarations appears exactly once in non-test source under `src/`, excluding test files and `tokens.css`, whose same-named declarations carry the light theme's values (SC-006), following `Navigation.test.tsx:222`
- [ ] T022 New `tests/e2e/mobile-menu-theme.spec.ts` — open the menu at 375×667 on `/` at scroll 0 and measure the panel plus the resting colour of a navigation item, the call to action and the close button (SC-001)
- [ ] T023 The same file — open it on `/about` scrolled past the threshold, and measure the panel plus the resting colour of a navigation item, the call to action and the close button (SC-002)
- [ ] T024 The same file — measure the interaction colour in both themes and recompute both contrasts with the full WCAG formula (SC-003, SC-004), using the `colorCerca` tolerance of `navigation-hover.spec.ts:30-38`
- [ ] T025 The same file — tab from the close button through every item in order, and read the focus indication of each: the close button's and the call to action's outline in both themes, and the navigation items' colour, which is where their indication lives (SC-005, SC-003, SC-004)

## Preservation and scope, recorded so they are not assumed

- **The header must come out of this feature unchanged.** Its four dark-theme tests at
  `Header.test.tsx:160-212` are the only evidence, and they pass *without being edited*. If one of them
  needs a change to go green, the extraction changed the header and the feature is wrong.
- **Nothing outside the file list in `plan.md` changes.** No token file, no `tokens.css`, no Playwright
  configuration, no new dependency and no new component. This is FR-010, and it is verified by what the
  commits do not contain rather than by a measurement.
- **The focus ring's colour changes with the theme**, because `tokens.colors.focus` is
  `var(--color-accent)`. That is the existing token doing its job, recorded here so nobody reads the
  change as an accident when they see it.
- **The navigation items have no focus outline and this feature does not add one.**
  `Navigation.styles.ts` declares no `:focus-visible` and no `outline`; only `MobileMenu.styles.ts:74,119`
  draw a ring. Adding outlines would change behaviour rather than colour, so it stays out, and the items
  are indicated by the `:focus-visible` colour change T015 adds. T025 measures that colour where the ring
  is not there.

## Phase 6 — Verify

- [x] T026 `npm run lint` and `npm run typecheck` (SC-007)
- [x] T027 `npm run test` and `npm run test:component` (SC-007)
- [x] T028 `npm run build` (SC-007)
- [ ] T029 The new E2E file green in Chromium, WebKit, Mobile Chrome and Mobile Safari
- [x] T030 The full E2E suite green in those same four projects, so this feature is shown not to have broken another (SC-009)
- [x] T031 `npm run test:a11y` — zero violations across the routes at the viewports (SC-008)
- [x] T032 Firefox cannot launch on the authoring machine, as `specs/022` T025 already records; covered by CI instead

## Notes

- **The nine values are not being chosen, only moved.** `#0A84FF` on black at 5.76:1 and `#0071E3` on
  white at 4.70:1 come from `specs/022`. If either contrast stops holding, the specification is wrong and
  the amendment belongs here rather than a new value in a stylesheet.
- **WebKit returns colours already passed through the display profile.** `#0a84ff` arrives as
  `rgb(21, 137, 255)`. The tolerance in T024 is not slack; it is what comparing in that engine requires.
- **T009 and T017 are the two that would catch a mistake this feature is most likely to make**: the first
  catches an extraction that changed the header, the second catches an interaction rule that swallowed
  the current-section treatment.
- **The menu is not opened by scrolling in the E2E.** `useMobileMenu.ts:14` locks the body with
  `overflow: hidden`, so both header states are produced by preparing the page before opening it.
- **A backtick inside a CSS template literal breaks the file, and this phase hit it.** T008's rewritten
  comment named `darkSurface` and `src/styles/theme.ts` in backticks. Both sat inside the
  `styled.header` template literal, so the first one closed the string and esbuild failed with
  "Expected ; but found darkSurface" — the whole Header test file failed to transform, not one test.
  The fix was to write them without backticks, which is what the original comment did. Worth knowing
  because the failure looked like a syntax error in a stylesheet and was neither.
- **The bundle changed size and the stylesheet did not.** The JS went from 455.77 kB to 455.31 kB because
  the fragment is now interpolated from another module, and the emitted CSS kept the hash
  `index-Bq1sVwzK.css`, which is the same hash the previous builds carried — `tokens.css` and
  `globals.css` are untouched and the header's rendered colours live in the runtime stylesheet, not there.
- **T022 to T025 and T029 are the open work.** The E2E file that measures the panel, the resting
  colours, the interaction contrasts and the focus walk does not exist yet, so the feature is verified
  by component tests and by the existing E2E suite rather than by its own measurements in a real
  browser. Everything a component test can reach is green; what it cannot reach is the rendered colour
  after the entrance animation has settled, which is exactly what T022 and T023 would read.
- **Four of the five new tests were mutation-checked, and each mutation failed exactly one of them.**
  Removing the fragment from the panel failed T018 alone, restoring the white veil failed T020 alone,
  dropping `:active` failed T019 alone, and duplicating a declaration in a different file failed T021
  alone and named that file. Without this a passing test would have been evidence of nothing, since a
  test asserting the wrong value passes just as quietly.
- **Firefox cannot launch, as T032 records.** It is the same environment defect `specs/025` diagnosed and
  not a consequence of this feature: the other four projects passed 556 tests in the same run.
