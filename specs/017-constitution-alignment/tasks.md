# Tasks: Bringing the Repository into Line with Its Own Constitution

**Input**: Design documents from `specs/017-constitution-alignment/`

**Prerequisites**: plan.md, spec.md

**Tests**: Required for every page and component that lacked one. Written alongside the work, not after.

## Format

`[ID] [P?] [Story] Description` — [P] parallelisable, [Story] maps to US1–US5.

## Phase 1: Specification

- [x] T001 Count the component folders that honour the constitution's five-file pattern: 30 of 30 under
      `src/components`, 0 of 7 under `src/pages`
- [x] T002 Establish that four pages declare a `StyledXPage` their own markup never renders, which makes
      the `.styles.ts` the constitution asks for a file nothing imports
- [x] T003 Find every module with no importers: `common/Grid`, `ui/Button`, `ui/Card` and
      `utils/animations`, none of them referenced by any other file
- [x] T004 Confirm that `useProjects`'s loading and error states have no setter, and that the branches
      they select are complete but unreachable
- [x] T005 Write the specification, including the two proposals against the constitution's own text that
      this feature does not apply

## Phase 2: The pages

- [x] T006 Move each of the seven pages into a folder of its own, with `git mv` so the history follows
- [x] T007 Delete the four `StyledXPage` stylesheets rather than move them, because the components never
      rendered them
- [x] T008 Write the seven barrels, each exporting the page and its props type
- [x] T009 Extract `useProjectDetailPage` from `ProjectDetail`, which is the only page with state
- [x] T010 Give the other six pages no `use*.ts`, and record why an empty hook is worse than none

## Phase 3: The components

- [x] T011 Extract `useScrollToTop` from `ScrollToTop`, which held a `useEffect` inline
- [x] T012 Give `ProjectGalleryViewer` its own folder, with a barrel that also exports `StyledGalleryThumb`,
      which its parent was importing across the folder boundary
- [x] T013 Give `TechnologyPill` its own folder and split its inline styled-components into
      `TechnologyPill.styles.ts`, which the constitution requires and which the file had never done
- [x] T014 Re-export `TechnologyPill` from `TechnologyCard`'s barrel so `TechnologyMarquee` keeps importing
      it from one place

## Phase 4: The dead code

- [x] T015 Delete `common/Grid`, `ui/Button` and `ui/Card` with their tests, having confirmed zero
      importers for each
- [x] T016 Delete `src/utils/animations.ts`, whose keyframes `src/styles/globals.css` already declares
- [x] T017 Remove the loading branch and the error branch from `Projects.tsx`, and their two styled
      declarations from `Projects.styles.ts`
- [x] T018 Drop `isLoading` and `error` from `useProjects`'s return, and write down why there is nothing
      to fetch

## Phase 5: The missing tests

- [x] T019 `Home.test.tsx` exists already; `About`, `Contact`, `Projects`, `Technologies`, `NotFound` and
      `ProjectDetail` did not
- [x] T020 Write the six page tests, and cover the two paths that matter most: the detail page's 404 for
      an unknown id, and the projects page's published order
- [x] T021 Write tests for `Layout`, `SectionSummary`, `ScrollToTop`, `ProjectGalleryViewer` and
      `TechnologyPill`
- [x] T022 Assert the `featuredItems` slot renders unchanged, because `specs/011` FR-012 and `specs/016`
      FR-007 both claim it and it had no test of its own

## Phase 6: Verification

- [x] T023 `npm run typecheck` — fails twice before it passes, and both failures are recorded in
      Amendment 1
- [x] T024 `npm run lint` with `--max-warnings 0` — eleven `testing-library/no-node-access` and
      `no-container` errors, all in the new tests, all rewritten with Testing Library queries
- [x] T025 `npm run test` — 133 unit tests pass
- [x] T026 `npm run test:component` — 411 component tests pass
- [x] T027 `npm run build` — 199 modules, 141.83 kB gzipped
- [x] T028 `npm run test:a11y` — 0 violations at 1440, 768, 390 and 320
- [x] T029 SC-005: `git diff --name-status` over the test directories shows three deletions and one
      rename, and the rename's diff contains no changed assertion

## Verification Results

| Criterion | Result |
|-----------|--------|
| SC-001 seven folders in `src/pages` | Pass: seven directories, zero loose `.tsx` |
| SC-002 zero loose component files | Pass: `ProjectGalleryViewer` and `TechnologyPill` both have folders |
| SC-003 every folder has a barrel | Pass |
| SC-004 every page and component tested | Pass: 6 new page tests, 5 new component tests |
| SC-005 no assertion changed | Pass: the only test diff is `R093` on `Index.test.tsx` → `Home.test.tsx`, eight lines, all of them the symbol's name |
| SC-006 lint, typecheck, build | Pass |
| SC-007 suites pass | Pass: 133 unit and 411 component |
| SC-008 no purposeless module | Pass, except `src/contracts/components.ts`, which FR-014 deliberately keeps |
| SC-009 no loading or error state | Pass: `grep isLoading src/` returns nothing |
| SC-010 axe | Pass: 0 violations at four viewports |

## Notes

**T023 is the honest part of this record.** The first two typecheck failures were not slips in the new
tests. One was a filesystem hazard nobody could have predicted from reading the constitution, and it
forced a rename this specification did not plan. Both are in Amendment 1 rather than quietly fixed.

**T024 says something about this repository's lint configuration.** `testing-library/no-node-access` and
`no-container` are errors, not warnings, and `--max-warnings 0` means there is no way around them. Five of
the eleven new tests were written against the DOM directly, as most tests in most codebases are, and all
five were rewritten. That is the configuration working, not the configuration being inconvenient.

**T025 found three tests asserting things that are false.** The strip shows `Car Expense Tracker`, not
`car-expense-tracker`, and reading `projects.json` directly would have passed against a `formatProjectName`
that did not exist. The viewer addresses its controls by test id because jsdom cannot open a modal. And
`ScrollToTop` does scroll on mount, which the test that stood there said it did not. All three are
recorded here because each is the same failure `specs/015` recorded as Amendment 1, arriving from the
other direction: a test written against what the code was expected to do rather than what it does.

**T029 is the criterion that verifies the whole feature.** Everything else this feature did can be
checked by reading the new files. Only a test suite that passed without being edited can show that
fourteen moved files changed no behaviour, and that is why FR-006 exists.