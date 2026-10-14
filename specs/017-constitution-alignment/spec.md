# Feature Specification: Bringing the Repository into Line with Its Own Constitution

**Feature Branch**: `017-constitution-alignment`

**Created**: 2026-10-14

**Status**: Implemented

**Input**: A maintainer request: *"Hace todo. que quede todo con spec."*, given after an audit that found
the constitution's component-structure rule unmet in one directory, five components without the files the
rule requires, roughly four hundred lines of code nothing imports, and two requirements in
`specs/001` that are implemented as complete markup and can never be reached.

## The gap this specification fills

`.specify/memory/constitution.md` says, under **Architecture & Code Organization → Component Structure**:

> Every React component MUST have its own folder with the following standard structure

and lists five files. Thirty of the thirty component folders under `src/components/` honour it. **The
seven pages under `src/pages/` honour none of it**: they are loose `.tsx` files with no folder, no
`index.ts`, no hook and, in six cases, no test. Four of the seven also carry a `.styles.ts` file whose only
export is a styled `div` that no page renders.

The constitution also says, under **Maintainability**:

> Do not create unnecessary abstractions, generic components, hooks, or layers.

Three components under `src/components/` have that shape today. `src/contracts/components.ts` holds 333
lines of prop interfaces that nothing imports, because every component declares its own props and
re-exports them.

This specification closes all of it, and it exists as a specification rather than as a cleanup because the
constitution's own governance section requires written proposals and impact analysis for changes of this
kind. It is the proposal, and the implementation follows it.

## What this is deliberately not

**It is not a redesign.** No page changes what it renders. No component changes what it does. No CSS value
moves. The diff is file moves, barrels, extracted hooks, four deletions of code nothing uses, and the tests
that were missing.

**It is not a constitution amendment.** The constitution is amended through its own governance process,
which requires the maintainer's approval and a version bump. Two of the findings here touch the
constitution text rather than the code, and they are raised as proposals at the end rather than applied.

**It does not touch the `/technologies` page's presentation or any feature's specified behaviour.** Where
a component is moved into its own folder, its content is byte-identical.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A visitor sees the same site (Priority: P1)

Every page renders exactly what it rendered before this change. The About page still shows three stats, the
Projects page still shows six projects in published order, the project detail page still resolves its
project by id and still returns the 404 page for an id that does not exist, and `/` still shows all five
sections.

**Why this priority**: This is the risk in a change that touches fourteen files and moves eleven. A visitor
must not be able to tell that anything happened.

**Independent Test**: Run the full existing suite and confirm that not one assertion was modified, deleted
or loosened. A refactor that has to change a test to pass has changed behaviour.

**Acceptance Scenarios**:

1. **Given** any route, **When** it renders before and after this change, **Then** its rendered output is identical.
2. **Given** the whole test suite, **When** it runs, **Then** every assertion that existed before this change still passes unchanged.
3. **Given** `/projects/unknown-id`, **When** it renders, **Then** it still returns the 404 page.

---

### User Story 2 - Find any component by its name (Priority: P1)

A developer opening `src/pages` sees seven folders named after the seven pages. A developer opening
`src/components/sections/TechnologyCard` sees a folder for the pill as well as for the card.

**Why this priority**: The constitution's rule exists so that a component and its styles, its state and its
test are found in one place. Fourteen loose files defeat it.

**Independent Test**: `ls src/pages` returns seven directories and no files.

**Acceptance Scenarios**:

1. **Given** the `src/pages` directory, **When** it is listed, **Then** it contains seven folders and no loose `.tsx`.
2. **Given** any of the seven, **When** its barrel is read, **Then** it exports the page and its props type.
3. **Given** a component that holds state, **When** its folder is listed, **Then** its state lives in a `use*.ts` file and not in the `.tsx`.

---

### User Story 3 - Have a page's behaviour covered by a test (Priority: P1)

A change to a page that breaks it fails a test. Today, six of the seven pages have no test of their own and
would fail silently.

**Why this priority**: Constitution principle III requires component tests for behaviour. Six untested
pages is the largest untested surface in the repository, and the pages are what the router wires to every
URL.

**Independent Test**: Delete the body of any page and confirm at least one test fails.

**Acceptance Scenarios**:

1. **Given** each of the seven pages, **When** it is rendered in a test, **Then** at least one test asserts something about it.
2. **Given** the About page, **When** its stats change, **Then** a test fails.
3. **Given** the project detail page with an unknown id, **When** it renders, **Then** a test asserts it renders the 404 page.

---

### User Story 4 - Inherit no dead weight (Priority: P2)

The repository carries no code that nothing uses. Three unused components and one unused utility are
removed rather than kept for a future that has not been asked for.

**Why this priority**: Constitution principle VI, YAGNI. It is lower priority than correctness because
deleting unused code cannot break a visitor — only a developer who expected it to be there.

**Independent Test**: Every remaining file under `src/` is imported by at least one other file, or is an
entry point, or is a stylesheet, or is a type declaration with no runtime.

**Acceptance Scenarios**:

1. **Given** the repository after this change, **When** every import is traced, **Then** no module is left with zero importers and no purpose.
2. **Given** the removed components, **When** the build runs, **Then** nothing that used to compile fails to compile.

---

### User Story 5 - Not be asked to satisfy a requirement that cannot happen (Priority: P2)

A reader of `specs/001` is not told that the site shows a loading skeleton and an error state. Neither can
render, because there is no request to be loading or to fail.

**Why this priority**: A specification that claims a behaviour nobody can observe is worse than one that
admits its absence, because the next feature will build on the claim.

**Independent Test**: `grep isLoading src/` returns no setter, and `specs/001` no longer lists FR-015 or
FR-016 as requirements.

**Acceptance Scenarios**:

1. **Given** `specs/001`, **When** its functional requirements are read, **Then** neither FR-015 nor FR-016 is listed among them.
2. **Given** the amendment recording their removal, **When** it is read, **Then** it states that the branches existed, that they were unreachable, and why.

---

### Edge Cases

- **A page with no styles.** `About`, `Contact`, `Projects` and `Technologies` each declared a
  `StyledXPage` that none of them rendered. Their folders therefore carry no `.styles.ts` at all, because
  the file the constitution asks for would be a file nothing imports. This is recorded rather than
  papered over with an empty `styled.div`.
- **A page with no state.** Five of the seven pages have no state, no effect and no handler. They get no
  `use*.ts` file, because an empty hook is the unnecessary abstraction the constitution forbids. Only
  `ProjectDetail`, which reads a route param and holds a share URL, gets one.
- **`ProjectDetail` importing the 404 page.** It does today, from `@/pages/NotFound`. After the move it
  imports the barrel, and the two folders do not depend on each other's internals.
- **`Index.test.tsx` importing its page.** It imports `./Index`. After the move it lives inside the folder
  and imports `./Index`, so this one import does not change.
- **A barrel that could create a cycle.** `ProjectDetail` renders `NotFoundPage` and `NotFound` renders
  nothing else. No cycle exists, and the barrels do not introduce one.
- **`Grid` being used by a test only.** `common/Grid/` has a test that renders the component directly. That
  test goes with it, so the removal is not a deletion of coverage but of a subject.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every component under `src/pages/` and under `src/components/` MUST live in a folder named
  after it.
- **FR-002**: Every such folder MUST contain an `index.ts` that is the only entry point, and no component
  may be imported from outside its folder by file path.
- **FR-003**: A component's own styles MUST live in `X.styles.ts` in its folder, and no page may import a
  stylesheet whose exports it does not render.
- **FR-004**: Component-specific state, effects and handlers MUST live in a `useX.ts` in the component's
  folder, and MUST NOT be inline in the `.tsx`.
- **FR-005**: Every component under `src/pages/` and `src/components/` MUST have a component test in its
  own folder.
- **FR-006**: No existing test assertion may be modified, deleted or loosened by this change. A refactor
  that requires it has changed behaviour.
- **FR-007**: `src/components/common/Grid/`, `src/components/ui/Button/` and
  `src/components/ui/Card/` MUST be removed, with their tests, having no importers.
- **FR-008**: `src/utils/animations.ts` MUST be removed, having no importers and duplicating keyframes
  that `src/styles/globals.css` already declares.
- **FR-009**: The loading skeleton and the error state in `sections/Projects` MUST be removed, and
  `useProjects` MUST stop returning the two states.
- **FR-010**: The empty state MUST be kept, because it is reachable: `hasNoProjectsAtAll` is derived from
  the projects array rather than from a request.
- **FR-011**: No page may change what it renders. This includes the About page's three stats, the Projects
  page's ordering, and the detail page's 404 for an unknown id.
- **FR-012**: No URL, route, id, CSS value or design token may change.
- **FR-013**: `package.json` MUST NOT change. No dependency is added and none is removed.
- **FR-014**: `src/contracts/components.ts` MUST NOT be deleted by this feature. Its removal is a
  constitution question, recorded as a proposal rather than applied here.
- **FR-015**: The constitution's version and text MUST NOT change by this feature.

### Key Entities

- **Page**: one route's component. Seven exist, and this feature turns each from a loose file into a
  folder.
- **Folder**: the constitution's five-file unit. `.tsx` for JSX, `.styles.ts` for styles, `use*.ts` for
  state, `.test.tsx` for tests, `index.ts` for the barrel.
- **Barrel**: the `index.ts` that is the only sanctioned way to import a component. Seven new ones here.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `src/pages` contains seven directories and zero `.tsx` files.
- **SC-002**: `src/components` contains zero loose `.tsx` files, and `ProjectGalleryViewer` and
  `TechnologyPill` each have their own folder.
- **SC-003**: Every folder under `src/pages` and `src/components` that contains a `.tsx` also contains an
  `index.ts`.
- **SC-004**: The repository's seven pages and thirty-seven components each have a test file.
- **SC-005**: `git diff --stat` on the test directories shows no modification and no deletion, except the
  three test files removed together with the components they tested.
- **SC-006**: `npm run lint` passes with `--max-warnings 0`, `npm run typecheck` passes, and
  `npm run build` succeeds.
- **SC-007**: The unit and component suites pass, with the count before the change equal to the count
  after it plus the tests added for the previously untested pages and components.
- **SC-008**: No module in `src/` has zero importers and no purpose as an entry point.
- **SC-009**: `useProjects` returns neither `isLoading` nor `error`, and no skeleton or error branch
  remains in `Projects.tsx`.
- **SC-010**: `scripts/audit-a11y.mjs` reports zero violations, since removing a branch from the projects
  section must not change the accessibility tree.

### On what is and is not backed by these criteria

**SC-001 through SC-005 and SC-008 through SC-010 are checkable by running the commands named**, and every
one of them was run.

**SC-006 and SC-007's counts are the only measurements this feature claims**, and they are the suite's own
output rather than anything asserted here.

**No browser test was added and no measurement was taken in a browser.** This feature changes no rendered
output, which is the condition that makes that acceptable, and it is stated rather than implied: a
visitor-visible change would not be allowed to skip that step, as `specs/015` records about itself.

## Assumptions

- **File moves are the safest kind of change.** Nothing is rewritten, so nothing can change meaning. This
  assumption is what makes SC-005 the important criterion: the whole feature is verified by asserting
  that the tests did not have to move.
- **A folder without a `.styles.ts` still honours the constitution**, because the rule is about where
  styles live when a component has styles. Inventing an empty styled wrapper to satisfy a file listing
  would be the "unnecessary abstraction" the same constitution forbids two sections earlier.
- **A folder without a `use*.ts` still honours it**, for the same reason and with the same reasoning. Five
  of the seven pages are a component and a return statement.
- **Deleting `Grid`, `Button` and `Card` is reversible** and therefore low-risk. They are in git history,
  they are small, and this document records exactly which three they were.
- **`src/contracts/components.ts` stays** even though nothing imports it, because the constitution's own
  Path Aliases section cites `@/contracts/components` as an example. Deleting the file would leave the
  constitution pointing at nothing, and amending the constitution is a different process with the
  maintainer's approval in it. It is raised as a proposal below instead.
- **`--duration-marquee`, every token and every CSS value stay exactly as they are.** This feature moves
  files; it does not restyle the site.

## Amendments

### Amendment 1 - Two proposals against the constitution itself, which this feature does not apply

**Added by**: record audit, 2026-10-14, during implementation.

The constitution's governance section requires a written proposal, the maintainer's review, approval and a
semantic version bump before its text changes. Neither proposal below has been approved, so neither has
been applied, and both are recorded here for that review.

**Proposal A — remove `src/contracts/components.ts`, and amend the example that cites it.** The file holds
333 lines of prop interfaces and **has no importers**. Every component in the repository declares its own
props in its own `.tsx` and re-exports the type from its barrel, so the file is a second, unreconciled
copy of an interface that already exists elsewhere. The constitution's Path Aliases section cites it as
the example of a contract import, which means the file cannot simply be deleted without leaving the
constitution pointing at a path that no longer resolves. The proposal is to delete the file and change
that one example to `@/types/project`, which is where contracts actually live. **Version: MINOR**, since
it removes a pattern the constitution names.

**Proposal B — name the rule for components with no styles and no state.** The constitution says every
component folder contains five files. Thirty of thirty folders under `src/components/` already omit a
`useX.ts` when the component has no state, and this feature keeps seven page folders with no `.styles.ts`
when the page has no styles. That is the right call under YAGNI, and it is currently the right call
*against* the letter of the rule. The proposal is to amend Component Structure to say the hook and the
stylesheet are required when the component has state and styles respectively, so that the convention
matches the text instead of being an unwritten exception every developer has to rediscover. **Version:
MINOR**, since it materially expands guidance rather than merely clarifying it.

**What was not proposed.** Nothing here argues for Tailwind, for CSS Modules, for dropping TypeScript
strict mode or for weakening WCAG. The constitution's substance is sound; what it lacked was three
exceptions' worth of precision, and Proposal B is those exceptions written down.
### Amendment 2 - The landing page had to be renamed, and the constitution did not anticipate it

**Added by**: during implementation, 2026-10-14.

Applying FR-001 to the landing page required a folder called `Index/` containing `Index.tsx` and
`index.ts`. **That cannot exist on macOS or Windows.** Both filesystems are case-insensitive, so
`Index.ts` and `index.ts` are the same path to them, and `tsc` fails with TS1149: *"File name 'Index.ts'
differs from already included file name 'index.ts' only in casing."*

Every other folder in the repository gets away with it because the component's name and the word "index"
differ — `Container/Container.tsx` alongside `Container/index.ts`. The landing page is the one component
whose name **is** `Index`, so it is the one folder where the pattern breaks.

**The page was renamed rather than the rule bent.** `src/pages/Index/` is now `src/pages/Home/`, the
component is `HomePage`, and the styled wrapper is `StyledHomePage`. Three files changed: the component,
its stylesheet, and `src/router.tsx`. Nothing rendered changes, no route changes, and the name is more
accurate than what it replaced — the site calls this page "the home page" everywhere it speaks about
itself, `specs/003` titles the feature "Landing Home Page", and `Index` was only ever the router's word
for it.

**The cost, stated exactly.** `src/pages/Index.test.tsx` moved to `src/pages/Home/Home.test.tsx` and its
diff is eight lines, every one of them the symbol's name: the import, the `describe` label, and five JSX
openings. **No assertion changed**, which is what FR-006 requires and what `git diff` shows. The rename
is also the only reason `router.tsx` is touched at all.

**What this says about the constitution.** Its component pattern assumes a case-sensitive filesystem, and
almost every developer's machine is not one. That is a third gap between the constitution's letter and
practice, after the stylesheet and the hook in Proposal B, and it belongs in the same amendment: either
the barrel should be exempted from the naming collision, or the rule should say that a component whose
name is `Index` cannot follow it. This feature does not apply that change either. FR-015 stands.

### Amendment 3 - Both proposals were approved and applied; the constitution is now v2.3.0

**Added by**: record audit, 2026-10-14, after the maintainer's review.

Amendment 1 recorded two proposals and applied neither. **Both have now been approved by the maintainer and
applied**, which satisfies the governance section's three requirements: a written proposal with rationale and
impact analysis (Amendment 1), review by the maintainer, and a semantic version bump.

**The version moved 2.2.1 → 2.3.0, MINOR**, because both changes materially expand guidance rather than
merely clarifying wording. No principle was removed or redefined, so MAJOR does not apply, and no change
was a typo fix, so PATCH does not apply.

**Proposal A is applied.** `src/contracts/components.ts` is deleted — 333 lines, 41 exports, zero importers,
confirmed by grep across `src`, `tests`, `specs` and the constitution itself. The Path Aliases section's
example changed from `import type { HeaderProps } from '@/contracts/components'` to
`import type { Project } from '@/types/project'`, so the constitution no longer points at a path that does
not resolve. The section now also says, in one sentence, that props are declared in the component's own file
and re-exported from its barrel, and why they are not collected elsewhere.

**Proposal B is applied, together with the case-insensitivity finding from Amendment 2.** Component Structure
now states that three of the five files are conditional — the stylesheet when the component has
component-specific styles, the hook when it has state, effects or handlers — and that **the test is not
conditional**. A new subsection, *Naming and the barrel*, records that a component named `Index` cannot hold
both `Index.tsx` and `index.ts`, that `tsc` fails with TS1149 on a case-insensitive filesystem, and that such
a component MUST be renamed. It also records that barrels export the component, its props type and its styled
components, and that cross-folder imports go through the barrel.

**What the two amendments changed between them.** Amendment 2 named the case-insensitivity problem and said
FR-015 stopped it from being fixed. Amendment 1's Proposal B covered the stylesheet and the hook. The three
together are now one amendment, because a constitution that fixes two of the three gaps in this document and
leaves the third open would be the same kind of half-record this feature exists to remove.

**What did not change.** No principle was weakened. Tailwind, CSS Modules and vanilla-extract remain
prohibited. TypeScript strict mode, WCAG 2.1 AA, the performance budgets, the testing strategy and the
package manager are all untouched. `package.json` is unchanged. The only files this amendment modifies are
`.specify/memory/constitution.md` and, with Proposal A, one deleted module.
