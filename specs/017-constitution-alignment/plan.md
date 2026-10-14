# Implementation Plan: Bringing the Repository into Line with Its Own Constitution

**Branch**: `017-constitution-alignment` | **Date**: 2026-10-14 | **Spec**: [spec.md](./spec.md)

## Summary

Fourteen loose `.tsx` files become fourteen folders, four dead stylesheets are deleted, three unused
components and one unused utility are removed, the two unreachable branches in the projects section are
withdrawn, and eleven missing test files are written.

The whole feature is moves, deletions and tests. The risk is not that it breaks the site — it cannot,
because nothing is rewritten — but that it breaks a test suite by moving a file a test points at.

## Technical Context

**Language/Version**: TypeScript 5.5, React 18.3
**Primary Dependencies**: styled-components 6.1. No additions, and `package.json` is not touched (FR-013)
**Testing**: Vitest (unit + component) and Playwright (E2E, untouched). `scripts/audit-a11y.mjs` at the end
**Target Platform**: Unchanged. This feature changes no rendered output
**Performance Goals**: Unchanged. No code path added, removed or altered at runtime
**Constraints**: No existing assertion modified, deleted or loosened (FR-006); no page changes what it
renders (FR-011); no CSS value moves (FR-012); the constitution's text is not amended here (FR-015)

## Constitution Check

*GATE: passed, and this feature is the constitution's own enforcement.*

| Principle | Compliance |
|---|---|
| I. Component-First | **This is the feature.** 30/30 component folders already comply; 0/7 page folders did. Now 37/37 and 7/7. |
| II. Type Safety | One new hook, `useProjectDetailPage`, typed `(id: string \| undefined) => UseProjectDetailPageReturn`. The state it extracts was already typed. |
| III. Testing | Eleven new test files, one per previously untested page or component. No existing test is modified, deleted or loosened — that is SC-005 and it is the criterion that verifies the whole feature. |
| IV. A11y & Performance | No rendered change, so the accessibility tree is identical. Verified by running the axe audit rather than assumed. |
| V. Design Principles | Nothing moves visually. |
| VI. YAGNI | Three unused components and one unused utility deleted rather than kept for a hypothetical future. Two requests that can never happen withdrawn from `specs/001` rather than wired to a state that does not exist. |
| Styling | Four `.styles.ts` files deleted because the components never rendered them. Two real ones — `Index` and `NotFound` — move with their pages. No CSS value changes. |
| Path Aliases | Every import between folders goes through the barrel, `@/pages/X`, never `@/pages/X/X`. |
| Dependencies | `package.json` untouched. |

## Project Structure

### Documentation (this feature)

```text
specs/017-constitution-alignment/
├── plan.md    # This file
├── spec.md    # Written before the work
└── tasks.md   # Written before the work, with its verification table filled in
```

No `research.md`, `data-model.md`, `contracts/`, `quickstart.md` or `checklists/`. Correct: this feature
introduces no entity, changes no schema, defines no contract between systems and needs no validation
guide. It moves files.

### Source Code

```text
src/pages/
├── About/           About.tsx, About.test.tsx, index.ts
├── Contact/         Contact.tsx, Contact.test.tsx, index.ts
├── Index/           Index.tsx, Index.styles.ts, Index.test.tsx, index.ts
├── NotFound/        NotFound.tsx, NotFound.styles.ts, NotFound.test.tsx, index.ts
├── ProjectDetail/   ProjectDetail.tsx, useProjectDetailPage.ts, ProjectDetail.test.tsx, index.ts
├── Projects/        Projects.tsx, Projects.test.tsx, index.ts
└── Technologies/    Technologies.tsx, Technologies.test.tsx, index.ts
```

**Structure Decision**: the constitution's five-file pattern, with the two absences the spec records
explicitly. Five pages carry no `.styles.ts` because they render no page-level element, and six carry no
`use*.ts` because they hold no state. Only `ProjectDetail` has state — a route parameter and a share URL —
so it is the only page that gets a hook.

Two components were also promoted to their own folder, because each was already a component inside
another's folder:

```text
src/components/sections/ProjectDetail/ProjectGalleryViewer/
├── ProjectGalleryViewer.tsx
├── ProjectGalleryViewer.styles.ts
├── ProjectGalleryViewer.test.tsx
└── index.ts
```

`TechnologyPill` moves the same way, out of `TechnologyCard/`. This is the deviation `specs/016`'s T020
recorded and left open, and this is the feature that closes it.

## The three decisions the rest followed from

**A folder with no `.styles.ts` is correct, not incomplete.** Four pages declared a `StyledXPage` that
none of them rendered. The honest fix is to delete the file. Creating an empty `styled.div` to satisfy a
file listing would be the unnecessary abstraction the constitution's own Maintainability section forbids,
two sections before the one that asks for it.

**A folder with no `use*.ts` is correct, not incomplete.** Five pages are a component and a return
statement. An empty hook is worse than no hook: it is a file whose only content is a signature, and the
next developer has to open it to learn that.

**`Grid` being tested does not make it used.** `common/Grid/` has a test that renders it directly. That
test is the component's only importer. Deleting the test with the component is not a loss of coverage —
it is the removal of a subject, which is what YAGNI means when applied consistently.

## What this feature deliberately does not do

**It does not delete `src/contracts/components.ts`**, though nothing imports it. The constitution's Path
Aliases section cites `@/contracts/components` as its example of a contract import, so deleting the file
would leave the constitution pointing at a path that does not resolve, and amending the constitution needs
the maintainer's approval. It is raised as Proposal A in the spec's Amendment 1 and applied only once
approved.

**It does not amend the constitution.** Proposal B in the same amendment would make Component Structure say
that the hook and the stylesheet are required when the component has state and styles respectively, which
is what the thirty existing component folders already do. Not applied, because the governance section
requires approval and a version bump and neither is mine to give.

**It does not touch any specification's requirements except `specs/001`'s**, and that one is a withdrawal
recorded as an amendment rather than an edit to the requirement list.

## Testing, and what it does not reach

**Eleven new test files** — six pages that had none, plus `Layout`, `SectionSummary`, `ScrollToTop`,
`ProjectGalleryViewer` and `TechnologyPill`. Each asserts the smallest thing that would fail if the
component broke: that the About page renders its three stats, that the detail page renders the 404 page
for an unknown id, that the scroll hook moves the window on a path change.

**The verification that matters is SC-005**: `git diff --stat` over the test directories must show no
modification and no deletion except the three tests that went with their components. Every existing
assertion passed without being edited. That is what proves FR-011, that no page changed what it renders —
a claim no new test can establish, because a new test tests the new code.

**No browser measurement was taken**, and no E2E file was added. This is acceptable only because the
change produces no rendered difference at all, which SC-005 is the evidence for. `specs/015` records the
opposite situation, where the criteria describe what a browser renders and were measured by hand, and it
says so in its own text rather than implying coverage it does not have. This plan says the same.