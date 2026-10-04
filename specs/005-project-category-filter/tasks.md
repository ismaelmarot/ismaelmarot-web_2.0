---

description: "Task list template for feature implementation"
---

# Tasks: Projects List with Category Filtering

**Input**: Design documents from `/specs/005-project-category-filter/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), constitution.md

**Tests**: Test tasks are included. The Projects section already ships with component tests, and changing the card into a row invalidates them, so the assertions must be rewritten alongside the implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single project

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify the existing surface this feature replaces

- [X] T001 Verify what the current Projects section and ProjectCard render in `src/components/sections/Projects/Projects.tsx` and `src/components/sections/ProjectCard/`, since the card is replaced by a row
- [X] T002 [P] Verify design tokens in `src/styles/tokens.ts` and `src/styles/tokens.css` cover what the filter and row need: `radii.full` for the pill filter options, border and background colours, and spacing
- [X] T003 [P] Verify the merge point in `src/pages/Projects.tsx`, which already imports `src/data/projects.json` and `sortProjectsByDisplayOrder`, and confirm it is where curated metadata attaches

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Types and curated metadata that MUST be complete before any user story work begins

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Add the closed value sets to `src/types/project.ts`: `ProjectCategory` with exactly `Social`, `Navigation`, `Finances`, `Tools`, `Work`, `Education`; `ProjectViewport` with exactly `desktop`, `tablet`, `mobile`; `ProjectPlatform` with exactly `web`, `mac`, `pc`
- [X] T005 Add a `ProjectEditorialMetadata` type in `src/types/project.ts` holding the owner's `categories`, `viewports` and `platforms`, and add those three fields to the `Project` interface as optional
- [X] T006 Create `src/data/project-metadata.ts` holding the owner's curated metadata keyed by repository, with the six published projects: `trash2treasure` (Social, Navigation / desktop, tablet, mobile / web), `car-expense-tracker` (Finances, Tools, Work / desktop / mac, pc), `LinkIO` (Tools, Work / desktop / mac, pc), `QEntry` (Tools, Work / desktop / mac, pc), `NauticAcademy` (Education / desktop, tablet, mobile / web), `cash-counter` (Tools, Work / desktop, tablet, mobile / web)
- [X] T007 Add a resolver in `src/data/project-metadata.ts` that attaches curated metadata to a project by repository name, matching case-insensitively so `LinkIO` and `QEntry` resolve, and returns the project unchanged when no metadata exists
- [X] T008 Merge curated metadata onto the projects in `src/pages/Projects.tsx` so each project reaching the section carries its categories, viewports and platforms
- [X] T009 Remove the featured treatment: delete `featuredProjectIds` from `SiteConfig` and `src/data/site-config.ts`, and drop `isFeatured` handling, because the spec states "The portfolio MUST NOT treat any project as featured, and MUST NOT present a different layout or ordering for a subset of projects" (FR-024)

**Checkpoint**: Foundation ready - types, curated metadata and merge point in place

---

## Phase 3: User Story 1 - Browse the projects as a compact list (Priority: P1) 🎯 MVP

**Goal**: Projects shown as single-column rows with icon, name, one action to open the project, and categories beneath

**Independent Test**: Load the Projects section and verify one row per project, each with icon, name, categories and a working action, in published order

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T010 [P] [US1] Rewrite the card assertions in `src/components/sections/ProjectCard/ProjectCard.test.tsx` as row assertions in `src/components/sections/ProjectRow/ProjectRow.test.tsx`: icon, name, categories, the open action, the icon placeholder, and no featured layout
- [X] T011 [US1] Update `src/components/sections/Projects/Projects.test.tsx` to assert one row per project, the published order, and the absence of the featured two-column treatment

### Implementation for User Story 1

- [X] T012 [P] [US1] Create `src/components/sections/ProjectRow/ProjectRow.styles.ts` with the row layout: icon, name, action aligned on the first line, categories on the second
- [X] T013 [US1] Create `src/components/sections/ProjectRow/ProjectRow.tsx` rendering the icon, the name, a single action that opens the project, and the category labels beneath the name
- [X] T014 [P] [US1] Create `src/components/sections/ProjectRow/index.ts` as the single public export
- [X] T015 [US1] Replace the card with the row in `src/components/sections/Projects/Projects.tsx` and drop the `isFeatured` prop and the featured/regular split
- [X] T016 [US1] Change the container in `src/components/sections/Projects/Projects.styles.ts` from a responsive three-column grid to a single-column list, and keep the existing line clamp, hover and reduced-motion rules
- [X] T017 [US1] Delete `src/components/sections/ProjectCard/` now that the row replaces it
- [X] T018 [US1] Reuse the existing icon markup in `src/components/sections/ProjectRow/ProjectRow.tsx` so the uniform 48x48 slot and placeholder alignment verified in the previous feature are preserved

**Checkpoint**: The list renders one row per project in published order

---

## Phase 4: User Story 2 - Narrow the list to a category (Priority: P1)

**Goal**: A category selector above the list that filters without reloading the page

**Independent Test**: Select a category and verify only matching projects remain, that "All" restores the full list, and that the page never reloads

### Tests for User Story 2

- [X] T019 [P] [US2] Create `src/components/sections/ProjectCategoryFilter/ProjectCategoryFilter.test.tsx` asserting one option per category plus "All", the active option being programmatically identifiable, keyboard operation, and that "All" is not stored as a category

### Implementation for User Story 2

- [X] T020 [P] [US2] Create `src/components/sections/ProjectCategoryFilter/ProjectCategoryFilter.styles.ts` with pill options that match the `radii.full` button shape used by every other button, plus a visible active state
- [X] T021 [US2] Create `src/components/sections/ProjectCategoryFilter/ProjectCategoryFilter.tsx` rendering "All" followed by the six categories in English, operable with the keyboard, where the active option is exposed as active for assistive technologies
- [X] T022 [P] [US2] Create `src/components/sections/ProjectCategoryFilter/index.ts` as the single public export
- [X] T023 [US2] Hold the active category in `src/components/sections/Projects/useProjects.ts`, defaulting to "All", expose the derived filtered list, and keep the list order identical to the complete list because the spec requires "No project appears in a different position depending on the selected category" (SC-009)
- [X] T024 [US2] Define the category display order and English labels in `src/types/project.ts` so the control cannot drift from the closed value set
- [X] T025 [US2] Render the category selector above the list in `src/components/sections/Projects/Projects.tsx`, and confirm changing the selection does not reload the page

**Checkpoint**: Filtering works end to end and the active category is announced

---

## Phase 5: User Story 3 - Keep the list usable when metadata is missing (Priority: P3)

**Goal**: Uncategorized projects still listed, and an empty category explains itself

**Independent Test**: Display an uncategorised project and select a category with no projects, and verify the section stays usable

### Tests for User Story 3

- [X] T026 [P] [US3] Add cases to `src/components/sections/Projects/Projects.test.tsx` asserting an uncategorised project is listed under "All", is absent when a specific category is selected, and that a category with no projects shows an explanatory message

### Implementation for User Story 3

- [X] T027 [US3] Render the row without category labels when a project has none in `src/components/sections/ProjectRow/ProjectRow.tsx`, keeping the row height and icon alignment stable
- [X] T028 [US3] Show the existing explanatory message when a selected category matches no project in `src/components/sections/Projects/Projects.tsx`, keeping the message distinct from the "no projects at all" empty state
- [X] T029 [US3] Make the resolver in `src/data/project-metadata.ts` tolerate absent or unreadable metadata so "a missing or unreadable metadata never removes a project from the complete list" (FR-019)
- [X] T030 [US3] Report during `npm run fetch:github` which published projects have no curated metadata and which metadata entries no longer match a published project, so the owner can keep `src/data/project-metadata.ts` in sync
- [X] T031 [US3] Make a project carrying a retired category behave as uncategorised in `src/data/project-metadata.ts`, rather than disappearing from the list

**Checkpoint**: All stories are independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validation and quality assurance across the whole feature

- [X] T032 [P] Run `npm run lint` and fix issues in the files touched by this feature
- [X] T033 [P] Run `npm run typecheck` and fix type errors
- [X] T034 Run `npm run test` and ensure unit tests pass
- [X] T035 Run `npm run test:component` and ensure Projects, ProjectRow and ProjectCategoryFilter tests pass
- [X] T036 Run `npm run build` and verify the production build succeeds
- [X] T037 [P] Run an axe-core audit against the Projects section and confirm zero violations
- [X] T038 Verify in the browser that filtering does not reload the page, that the list order is identical across categories, that the filter is fully keyboard operable, and that the row is legible at 320px, 768px and 1024px

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - US1 first because the filter filters rows
  - US2 second, on top of the row
  - US3 third, hardening both
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Consumes the row from US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Covers both US1 and US2 states

### Within Each User Story

- Tests written and failing before implementation
- Styles in parallel with component logic
- Core rendering before edge case handling

### Parallel Opportunities

- T002, T003 can run in parallel with T001
- T007 can run in parallel with T004, T005, T006
- T010 can run in parallel with T012, T014
- T019 can run in parallel with T020, T022
- T026 can run in parallel with T027
- T032, T033, T037 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch the new component's style and barrel files together:
Task: "Create ProjectRow.styles.ts with the row layout"
Task: "Create ProjectRow/index.ts as the single public export"

# Then the component and the section swap:
Task: "Create ProjectRow.tsx rendering icon, name, action and categories"
Task: "Replace the card with the row in Projects.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

---

## Implementation Notes

- Completed in a single pass. All 38 tasks are done and verified.
- `ProjectCard/` was deleted and replaced by `ProjectRow/`; `featuredProjectIds` and `isFeatured` were removed from `SiteConfig`, `project.ts`, `site-config.ts` and `contracts/components.ts`.
- The row's action links to the project repository, as the spec's assumptions state, until the project detail feature ships; it carries a comment marking that single swap point.
- `@testing-library/user-event` is not installed and the constitution forbids new dependencies, so the keyboard test asserts native button semantics (`type="button"`, focusable, no negative tabindex) and uses `fireEvent` instead.
- Two layout defects found in browser verification and fixed: a full-width action inside a non-wrapping flex row caused horizontal scroll at 320px, and `overflow-wrap: anywhere` split project names mid-word at that width.
- A regression was caught in browser verification and fixed: the LinkIO icon in the profile README pointed at a 543-byte solid black placeholder; the README now points at the real 256px icon and all six icons were re-verified by pixel analysis, not only by dimensions.

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- T007 is marked parallel because the resolver only needs the value sets, not the metadata file contents
- No `research.md`, `data-model.md`, `contracts/` or `quickstart.md` exist for this feature; the task list is derived from `spec.md` and `plan.md`
- The interim destination of the row action is the project repository until the project detail feature ships; changing it later is confined to that one navigation target
---

## Amendment 1: Borderless Category Options

Added 2026-10-03 after implementation and deployment. See the "Amendment 1" section of `spec.md`
for FR-026 through FR-030 and SC-011 through SC-014.

- [X] A001 [P] Decode the border behaviour and confirm the active option was rendering the user-agent default `2px outset`, since only `border-color` was declared there while the base declared no `border` at all
- [X] A002 Measure the inactive option against the `#F5F5F7` section and confirm the white fill measured 1.09:1, so the 1px border was the only thing drawing its silhouette
- [X] A003 Measure the focus ring against the active fill and confirm the shared accent token gave 1:1, making the indicator invisible exactly where it was needed
- [X] A004 Declare `border: 0` on the base button in `src/components/sections/ProjectCategoryFilter/ProjectCategoryFilter.styles.ts`, so no state branch can reintroduce the default border (FR-026)
- [X] A005 Drop `border-color` from the active branch and set the inactive fill to `transparent`, removing the hover tint (FR-027, FR-028, FR-029)
- [X] A006 Give the active option a focus ring of `0 0 0 3px var(--color-fg)`, which measures 3.58:1 against its own fill and 15.46:1 against the section, while the inactive option keeps the shared token (FR-030)
- [X] A007 [P] Add tests in `src/components/sections/ProjectCategoryFilter/ProjectCategoryFilter.test.tsx` asserting the base declares no border, that exactly one border declaration exists in either state, that the active fill is the accent with no border, that the inactive fill is transparent with no hover, that every box shadow belongs to a focus indicator, and that the active ring is the dark one
- [X] A008 [P] Verify each option keeps its own width when its state changes, using a real pointer click rather than a scripted one (SC-011)
- [X] A009 [P] Verify the focus ring with a real Tab keypress, because `:focus-visible` does not match a programmatic `.focus()` (SC-013)
- [X] A010 Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:component` and `npm run build`
- [X] A011 Confirm axe reports no violations, and commit, push and deploy, then confirm the same computed styles on production

### Notes on this amendment

- **A004 writes `border: 0`, not `border: none`.** cssstyle, the CSS parser jsdom uses, cannot
  represent the keyword and silently rewrites it to the initial `border: medium`, which would make
  the regression untestable. Both spellings are identical to a browser.
- **A007 asserts a count rather than an absence.** Asserting that the CSS does not contain the
  substring `border:` would also match `border-radius`, and asserting `not.toContain('border:')`
  cannot distinguish "the base declares none" from "no branch declares any". Counting the
  declarations answers the question actually being asked.
- **A009 exists because the first attempt to verify SC-013 proved nothing.** Focusing with
  `element.focus()` does not make `:focus-visible` match in Chromium, so the ring read as `none` on
  both states and the check would have passed for the wrong reason.
- **A008 compares an option against its earlier width, not against the other options.** The labels
  have different lengths, so "All" is 47px and "Navigation" is 93px regardless of state; comparing
  across options would report a difference that is only the text.
