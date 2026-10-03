---

description: "Task list template for feature implementation"
---

# Tasks: Project Detail Page

**Input**: Design documents from `/specs/006-project-detail/`

**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Test tasks are included because this page introduces a new render surface with several distinct states and the project list already follows a tested component-per-folder convention.

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

**Purpose**: Verify the surface this feature builds on

- [X] T001 Verify the list row's action in `src/components/sections/ProjectRow/ProjectRow.tsx`, which is the entry point this feature converts from an outbound link into an internal route
- [X] T002 [P] Verify the project fields available today in `src/data/projects.json` against what the page needs, confirming `sizeKb`, `appSizeBytes`, `downloadUrl` and `screenshotUrls` are the gaps
- [X] T003 [P] Verify the existing icons in `src/components/ui/Icon/useIcon.tsx` and confirm `globe` covers the web platform while mac, pc, desktop, tablet and mobile are missing

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Data and assets that MUST be complete before any user story work begins

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Add `size` to `GitHubRepo` and the release and release-asset shapes to `src/types/github.ts`
- [X] T005 Add `sizeKb`, `appSizeBytes` and `downloadUrl` to `Project` in `src/types/project.ts`
- [X] T006 [P] Add the `mac`, `pc`, `desktop`, `tablet` and `mobile` icons to `src/components/ui/Icon/useIcon.tsx`, reusing `globe` for web and following the existing 24x24 stroke style
- [X] T007 Extract the screenshots from the project's README in `src/data/profile-readme.ts` and cap the result at the first six, writing them into `screenshotUrls` in `src/types/github.ts`
- [X] T008 Fetch each project's releases in `src/data/fetch-github.ts` and derive, per project, the repository size, the newest downloadable file's size and the link to the list of downloads, leaving both download fields empty when the project publishes none
- [X] T009 Regenerate `src/data/projects.json` with `npm run fetch:github` and confirm the six projects carry the new fields
- [X] T010 Add unit tests in `tests/unit/` covering the release-to-size mapping, the cap at six screenshots, and the case of a project publishing no releases

**Checkpoint**: Data ready - the page can be built against real values

---

## Phase 3: User Story 1 - Understand what an app is before leaving the portfolio (Priority: P1) 🎯 MVP

**Goal**: A page at its own address showing icon, name, categories, platforms, description and both outbound links

**Independent Test**: Open a project's page and verify the name, icon, categories, platform icons, description, repository link and app-or-download link all match the project

### Tests for User Story 1

- [X] T011 [P] [US1] Create `src/components/sections/ProjectDetail/ProjectDetail.test.tsx` asserting the icon, name, categories, platform icons, full description, repository link, app-or-download link, and the back control

### Implementation for User Story 1

- [X] T012 [P] [US1] Create `src/components/sections/ProjectDetail/ProjectDetail.styles.ts` with the action bar, the header block, the platform-and-description band and the outbound links
- [X] T013 [US1] Create `src/components/sections/ProjectDetail/ProjectDetail.tsx` rendering the back control, the icon, the name, the categories, the platform icons, the description, the repository link and the app-or-download link, omitting the app link when the project offers neither an app nor published versions
- [X] T014 [P] [US1] Create `src/components/sections/ProjectDetail/index.ts` as the single public export
- [X] T015 [US1] Add the route in `src/router.tsx` as `projects/:id`, declared before the catch-all so a real project is not swallowed by it
- [X] T016 [US1] Create `src/pages/ProjectDetail.tsx` resolving the project from the imported data by id and rendering the not-found page when the id matches nothing
- [X] T017 [US1] Convert the row's action in `src/components/sections/ProjectRow/ProjectRow.tsx` from an outbound repository link into an internal link to the project page, and correct its accessible name so it no longer announces a new tab

**Checkpoint**: A project page is reachable and complete

---

## Phase 4: User Story 2 - Judge fit before downloading (Priority: P2)

**Goal**: Up to six screenshots and the supported viewports, so fit is known before committing

**Independent Test**: Open a project with screenshots and one without, and verify at most six load in the first case and no gallery in the second, with viewports always stated

### Tests for User Story 2

- [X] T018 [P] [US2] Add cases to `src/components/sections/ProjectDetail/ProjectDetail.test.tsx` asserting the gallery shows at most six images, is absent when there are none, and that viewport icons match the project's viewports

### Implementation for User Story 2

- [X] T019 [US2] Add the screenshot gallery to `src/components/sections/ProjectDetail/ProjectDetail.styles.ts` as a responsive grid that never loads more than six images
- [X] T020 [US2] Render the gallery and the viewport icons in `src/components/sections/ProjectDetail/ProjectDetail.tsx`, rendering each image lazily and with a text alternative describing the project
- [X] T021 [US2] Verify in the browser that a project's page loads no screenshot beyond the sixth and that none of the loaded images is eager

**Checkpoint**: Fit can be judged from the page alone

---

## Phase 5: User Story 3 - Find the facts and get back out (Priority: P3)

**Goal**: Information block, share control and version history

**Independent Test**: Open a project that publishes versions and one that does not, verify the information block on both, verify sharing, and verify going back

### Tests for User Story 3

- [X] T022 [P] [US3] Add cases to `src/components/sections/ProjectDetail/ProjectDetail.test.tsx` asserting the information block contents, the size label distinguishing app size from repository size, the version list for a project that publishes versions, the empty state for one that does not, and the share control falling back to copying

### Implementation for User Story 3

- [X] T023 [US3] Create `src/components/sections/ProjectDetail/useProjectShare.ts` offering the page address to the visitor's own sharing tools when available, copying it when not, and reporting the outcome so the visitor is told what happened
- [X] T024 [US3] Add the share control in `src/components/sections/ProjectDetail/ProjectDetail.tsx` with its outcome exposed to assistive technology rather than conveyed by colour alone
- [X] T025 [US3] Add the information block to `src/components/sections/ProjectDetail/ProjectDetail.styles.ts` and render categories, language and size in `src/components/sections/ProjectDetail/ProjectDetail.tsx`, omitting the language when there is none and labelling the size according to whether it came from the downloadable app or the repository
- [X] T026 [US3] Render the version history in `src/components/sections/ProjectDetail/ProjectDetail.tsx`, newest first with date and link, and an explicit statement that there are none for projects that publish none

**Checkpoint**: The page is complete on its own

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validation and quality assurance across the whole feature

- [X] T027 [P] Run `npm run lint` and fix issues in the files touched by this feature
- [X] T028 [P] Run `npm run typecheck` and fix type errors
- [X] T029 Run `npm run test` and ensure unit tests pass
- [X] T030 Run `npm run test:component` and ensure the ProjectDetail and ProjectRow tests pass
- [X] T031 Run `npm run build` and verify the production build succeeds
- [X] T032 [P] Run an axe-core audit against a project page and confirm zero violations
- [X] T033 Verify in the browser that the page opens from the list, that an unknown id shows the not-found page, that back returns to the list, that sharing works or copies, and that the page has no horizontal scrolling at 320px, 768px and 1024px
- [X] T034 Verify the page is reachable by its own address and survives a reload, since the specification requires it

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - US1 first because it creates the page everything else renders into
  - US2 and US3 add sections to that same page
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Adds sections to the US1 page
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Adds sections to the US1 page

### Within Each User Story

- Tests written and failing before implementation
- Styles in parallel with component logic
- Route and page before the row is converted to link to it

### Parallel Opportunities

- T002, T003 can run in parallel with T001
- T006 can run in parallel with T004, T005, T007
- T011 can run in parallel with T012, T014
- T018, T022 can run in parallel with T019, T023
- T027, T028, T032 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch the new component's style, barrel and test files together:
Task: "Create ProjectDetail.styles.ts with the action bar and header"
Task: "Create ProjectDetail/index.ts as the single public export"
Task: "Create ProjectDetail.test.tsx"

# Then the component, the route and the page:
Task: "Create ProjectDetail.tsx"
Task: "Add the route projects/:id"
Task: "Create pages/ProjectDetail.tsx"
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

1. Complete Setup + Foundational → Data ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

---

## Implementation Notes

- Completed in a single pass. All 34 tasks are done and verified in a browser.
- Screenshots are located by the collapsible block that contains them rather than by guessing from file names, because the owner names them inconsistently (`screenshot-01.png`, `capture_01.png`, `mob-v2-01.png`, `cap_01.PNG`). A first attempt filtered by keywords and silently dropped the whole `car-expense-tracker` set.
- The cap of six is applied twice on purpose: in the parser, so no more than six ever reach the browser, and in the page, so the guarantee holds whatever the data source.
- `formatDate` now merges the caller options over the defaults instead of replacing them. Passing only a timezone had silently dropped the year, month and day and rendered `5/3/2026` instead of `May 3, 2026`.
- Release dates are formatted in UTC so every visitor sees the same day rather than a day that depends on where they are.
- The app size is taken from the newest release that ships a file, not the largest file across all releases, so it matches the version a visitor would download today.
- The page uses `--color-text-secondary` for its small labels. Using `--color-text-tertiary` introduced 18 colour-contrast violations; using the compliant token removed them.

## Global Fixes Applied After Validation

Both issues that were flagged as pre-existing have been fixed, so the accessibility and responsive criteria of this feature now hold site-wide.

- `--color-fg-subtle` moved from `#86868B` to `#6E6E73`. The old value was 3.62:1 on white and 3.33:1 on `--color-bg-muted`, below AA for small text, and it was the cause of the six violations in the header logo, the navigation and the footer. The new value is 5.07:1 on white and 4.66:1 on muted. It is deliberately the same tone as `--color-fg-muted`, because there is no lighter tone that reaches 4.5:1 on the muted background; the secondary/tertiary hierarchy now rests on font size and weight rather than on colour alone, which is the accessible way to carry it.
- Added `--color-accent-text` (`#0062C4`) and `--color-accent-text-hover` (`#0059B0`) for accent-coloured text. `--color-accent` is 4.31:1 on `--color-bg-muted` and fails AA as small text, which affected the header CTA on `/about` and `/technologies` because the transparent header sits over the muted page background. The CTA hover was also `opacity: 0.7`, which lightened the text and pushed it further below AA, so it now changes colour instead.
- The horizontal overflow at 320px was not the header: `useHeader` already collapses the navigation into the hamburger below 768px. The culprit was the footer navigation, which rendered its five links on a single `nowrap` row measuring 381px. Both `StyledNavWrapper` in the footer and the `footer` variant of `StyledNav` now wrap and centre, with a tighter gap below 480px.

## Navigation Current-Section Fix

The navigation never highlighted the section you were on. Root cause was not what it looked like: `NavLink` was already adding the `active` class and `aria-current="page"` correctly, and `useLocation()` already strips the basename, so `item.href === pathname` matched. Nothing ever styled that class, and the `$active` prop on `StyledNavItem` was dead code because no caller passed it.

- `StyledNavItem` now styles `.active` and `.active:hover` with `--color-accent-text`, and the dead `$active` prop was removed. Styling the class React Router already sets keeps the current section in sync with the router instead of duplicating route matching in this component.
- Nav items now get `end` for `/`. Without it `NavLink` partial-matches, so Home was a candidate for every route.
- The footer was the real outlier: it did not use `Navigation` at all and rendered its own `<a>` list. That is why it had no current state, why each click was a full document reload instead of client-side navigation, and why it needed its own colour rules. It now renders the shared `Navigation` with `variant="footer"`, and the duplicated `StyledNavWrapper` was deleted. Footer and header now stay in sync by construction.

## Contact Section Fixes Found While Auditing

`/contact` had never been audited, and it had two defects of its own.

- `Contact.tsx` wrapped every method in a `role="listitem"` element while `ContactMethod.tsx` declared `role="listitem"` again on its own root, nesting a list item inside a list item. `role="listitem"` requires a `list` parent, so axe reported 3 `aria-required-parent` violations. The redundant declaration in `ContactMethod` was removed.
- The contact rows overflowed a 320px viewport by 10px. Three separate causes had to be fixed in order, and the first two attempts made it worse before it worked: the nowrap value needed `min-width: 0` so it could shrink at all; the wrapper is a flex item and needed `min-width: 0` too, otherwise it stayed at its min-content width of 330px; and the link is an `inline-flex` box, whose `width: auto` resolves via shrink-to-fit and never goes below min-content, so it needed `max-width: 100%`. With all three the value truncates with an ellipsis at 320px and shows in full at 375px.

## Label and Value Consistency Pass

The five label/value pairs of the detail page were spaced by three different mechanisms, so they did not line up. Measured before the change: Available on 8px, Categories 8px, Language 8px, Size 8px, Supported viewports 0px.

- The label typography existed twice as a copy, `StyledDetailPlatformsLabel` and `StyledInfoTerm`. Both now come from one `labelCss` snippet, kept as two components so the description list retains its `dt`/`dd` semantics.
- `StyledInfoGroup` became the single owner of the label to value distance, `gap: var(--space-2)`. Available on joined it after moving out of the header area into the information grid, and Supported viewports joined it after dropping a plain wrapper div and a `style={{ margin: 0 }}` that left it with no distance at all.
- Value typography was unified to 16px primary, and the three value lists share one gap, so Available on and Supported viewports no longer render smaller and greyer than the other three.
- The information grid moved from `repeat(3, 1fr)` to `repeat(auto-fit, minmax(180px, 1fr))`. With up to four pairs a fixed count left a hole in the last row whenever a project had no size or no language; the tracks now adapt. Verified at 1440 and 1024 (four columns, one row), 768 (three columns, two rows) and 375/320 (one column).
- Wrapping the Supported viewports list in a `dd` produced five definitions where the list sits outside the `dl`. A `dd` without a `dl` parent is invalid markup and breaks the term and definition relationship, so the pair uses the shared label plus the list directly. Caught by asserting the term and definition counts rather than by looking at the page.

## Language, Built With and Icon Spacing

- `LANGUAGE` no longer shows the GitHub repository language. It now lists the interface languages the app ships with, as `EN`, `ES` or `EN, ES`. GitHub has no way to report this, so the values come from the editorial metadata and a project that declares none falls back to `DEFAULT_APP_LANGUAGES` (bilingual). The default lives in one constant that both `withEditorialMetadata` and the component reference, so the two layers cannot disagree.
- The values are validated against the closed set `PROJECT_LANGUAGES` with the same `keepValid` filter the categories, viewports and platforms already use, so a retired value degrades to the default instead of rendering an unknown tag.
- The GitHub language was not lost: a new `Built with` pair renders `technologies`, which held the same value and was not displayed anywhere. `primaryLanguage` stays in the data as fetched from GitHub but is no longer rendered.
- Categories in the information grid became a comma separated sentence, matching the line under the project title, and the two list components they used were removed.
- Every icon to label pair now sits at `--space-2` (8px). The platforms gap was declared as `gap: var(--space-1]};`, an invalid value that styled-components emitted verbatim and the browser then dropped, so the effective gap was zero and the icon touched its label. A regression test now asserts the gap on both icon lists against the raw rule text, which is what a silently dropped declaration needs.

## Information Layout, Icon Spacing and Controls

- The information grid is laid out as a row of four followed by a row of two: Available on, Categories, Language, Size, then Supported viewports and Built with. This needed a fixed column count again. `auto-fit` sizes its tracks from the available width rather than from the number of items, so with six pairs it had squeezed all six onto a single line on a wide screen. It now steps 1 / 2 / 4 columns at the 640px and 1024px breakpoints, verified to give two rows at 1440 and 1024, three at 768 and one at 375 and 320, with no label wrapping and no horizontal overflow.
- Supported viewports moved into the description list as a pair with its own term, so it could share the second row. It previously had to live outside the `dl`, which is why it could not be a `dd` and needed a separate label component that has now been removed.
- The gap between an icon and its label dropped from 8px to 4px in Available on and Supported viewports. The wider value read as two separate items at these glyph sizes. The other icon pairs on the page keep their own spacing.
- Back to projects is now the `<` control alone, in a 36x36 circle, and Share uses a share glyph instead of a chain, which read as a permalink. The back control is icon only, so its name moved to `aria-label`. It extends the text button rather than repeating it, so the border, radius, hover and focus treatment stay defined once; without equal padding the pill would have come out as a 48x32 lozenge around one glyph.

## Row Gap and Back Control Fill

- The information grid now separates rows from columns: `row-gap` is 32px from the 640px breakpoint while `column-gap` stays at 20px, so the two rows of pairs read as two groups. Below 640px there are no rows to separate, only six stacked pairs, where the wider gap would have added scrolling without any layout to speak of.
- The back control is filled with `--color-text-secondary` so the chevron can invert to white. The glyph paints with `currentColor`, so a single `color` declaration turns the arrow. White on that grey is 5.07:1, clearing AA for its size and the 3:1 that WCAG 1.4.11 asks of a graphical object. Hover darkens it and the focus ring is drawn outside the button, so it stays visible against the fill.

## Removing Hover and Focus From Three Controls

The back control and the two carousel controls no longer change on hover or on keyboard focus, at the owner's request. The back control keeps its grey fill and white chevron.

- `StyledDetailIconButton` inherits its hover and focus from `StyledDetailTextButton`, and CSS cannot withdraw an inherited rule, so both are restated with the resting values. This is why the block exists rather than simply being deleted.
- `StyledGalleryControl` lost its hover rule and, with it, the transition that only animated that colour change.
- The carousel focus suppression had to go inside `:focus-visible` rather than on the base rule. `globals.css` declares `button:focus-visible { outline: 2px solid ... }`, which is more specific than a single class, so an `outline: none` on the base rule loses the cascade and the ring reappears. Only the browser check caught this: a jsdom assertion on the emitted CSS would have passed.
- `cursor: pointer` was kept on all three, since it is not a visual change to the element and without it the controls read as disabled.

**Known accessibility cost.** These three controls no longer meet WCAG 2.4.7 Focus Visible (AA): a keyboard user gets no indication of where they are. This was accepted explicitly after being flagged. No automated rule in axe covers a missing focus indicator, so the suite stays green and the cost is invisible to CI; it will only surface in a manual audit or with assistive technology. The other controls on the page, Share included, keep their ring.

## Full Screen Screenshot Viewer

Clicking any screenshot in the carousel opens it full screen, with the whole set navigable from there.

- It is built on the native `dialog` element opened with `showModal()`, so the focus trap, the Escape key and the inert background come from the platform. `tests/setup.ts` already stubbed `showModal` and `close`. The React state still closes on Escape explicitly, because a native close would move the DOM without telling React about it.
- The thumbnails became buttons instead of clickable images. An image carrying the action cannot also be the accessible name, so the name moved to the button ("View ... screenshot 3 full screen") and the image is decorative. The two tests that asserted the image alt text were rewritten against the button.
- `showModal()` does not stop the page behind from scrolling, so the body overflow is locked while open and restored on close.
- The viewer wraps at both ends, unlike the inline carousel which disables a control at its ends. A full screen viewer is a browsing context, and a control that goes dead at the last image reads as broken. The counter is `aria-live` so the change is announced.

### The backdrop bug worth remembering

Clicking outside did nothing. The dialog fills the viewport, and so do the frame and the top bar inside it, so those clicks landed on the frame, never on the dialog that the handler was checking for. Checking the frame as well fixed the empty areas but not the bar. The actual fix is `pointer-events: none` on the frame, with the image, the arrows and the close button opting back in: every unclaimed click then reaches the dialog. Unit tests passed throughout this, because the jsdom click dispatched on the dialog behaves exactly like the fixed case.

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No `research.md`, `data-model.md`, `contracts/` or `quickstart.md` exist for this feature; the task list is derived from `spec.md` and `plan.md`
- T007 caps the screenshots at the parser rather than at the page, so no more than six ever reach the browser
- T017 completes the swap that the previous feature left provisional, when the row's action pointed at the repository as an interim destination