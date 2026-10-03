# Implementation Plan: Projects List with Category Filtering

**Branch**: `005-project-category-filter` | **Date**: 2026-10-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-project-category-filter/spec.md`

**Note**: This file is the technical plan for the feature described in `spec.md`.

## Summary

Replace the Projects card grid with a single-column list of rows (icon, name, one action to open the project, categories beneath) and add a category selector above it. Curated editorial metadata (categories, viewports, platforms) is authored by the portfolio owner in one local typed file, keyed by repository, and merged with the GitHub-sourced data at the page level. The featured-project treatment is removed entirely, so every row has identical structure.

## Technical Context

**Language/Version**: TypeScript 5.5, React 18.3

**Primary Dependencies**: styled-components 6.1, react-router-dom 7.18

**Storage**: Static JSON (`src/data/projects.json`, build-time artifact from the profile README) plus a local typed metadata module (`src/data/project-metadata.ts`) authored by the owner

**Testing**: Vitest (unit), Testing Library (component), Playwright (E2E), axe-core (a11y)

**Target Platform**: Web (static site deployed to GitHub Pages under the `/ismaelmarot-web_2.0` subpath)

**Project Type**: Web application (SPA)

**Performance Goals**: Lighthouse 90+, LCP < 2.5s, CLS < 0.1

**Constraints**: WCAG 2.1 AA, no new dependencies, use existing design tokens, styled-components only, `@/` path alias

**Scale/Scope**: Personal portfolio, 6 published projects, 6 categories, single maintainer

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First Architecture | PASS | `Projects` keeps the section role; new `ProjectRow` and `ProjectCategoryFilter` are self-contained folders with the standard layout |
| II. Type Safety | PASS | `ProjectCategory`, `ProjectViewport`, `ProjectPlatform` added as string unions; curated metadata typed so an invalid value fails the build |
| III. Testing Strategy | PASS | Unit test for the metadata resolver, component tests for the row, the filter and the empty/uncategorised cases |
| IV. Accessibility & Performance | PASS | Filter is a keyboard-operable group with `aria-pressed`; filter state held in the existing `useProjects` hook; no new runtime cost (6 rows) |
| V. Design Principles | PASS | Apple-inspired: pill filter options, existing tokens, no new styling infrastructure |
| VI. Simplicity & Maintainability | PASS | One metadata file, no new abstraction layer; the featured logic is deleted rather than replaced |
| Styling (styled-components) | PASS | All styles in `*.styles.ts` |
| Path Aliases (`@/`) | PASS | All internal imports use `@/` |
| Dependencies | PASS | No new packages; filter options reuse the existing `Button`/pill styling approach |

**Result**: All gates pass. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/005-project-category-filter/
├── spec.md              # Feature specification
├── plan.md              # This file
├── checklists/
│   └── requirements.md  # Specification quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── sections/
│   │   ├── Projects/                # Section container (existing, modified)
│   │   │   ├── Projects.tsx         # Section + category selector + list
│   │   │   ├── Projects.styles.ts
│   │   │   ├── useProjects.ts       # Active category + filtered list
│   │   │   └── Projects.test.tsx
│   │   ├── ProjectCategoryFilter/   # NEW: category selector
│   │   │   ├── ProjectCategoryFilter.tsx
│   │   │   ├── ProjectCategoryFilter.styles.ts
│   │   │   ├── useProjectCategoryFilter.ts
│   │   │   └── ProjectCategoryFilter.test.tsx
│   │   └── ProjectRow/              # NEW: one project row
│   │       ├── ProjectRow.tsx
│   │       ├── ProjectRow.styles.ts
│   │       └── ProjectRow.test.tsx
│   └── ui/
│       ├── Icon/                     # Existing primitive (icon only)
│       └── Button/                   # Existing primitive
├── types/
│   └── project.ts                    # + ProjectCategory, ProjectViewport, ProjectPlatform, ProjectMetadata
├── data/
│   ├── projects.json                 # Build-time artifact (unchanged by this feature)
│   ├── project-metadata.ts           # NEW: curated metadata authored by the owner
│   └── site-config.ts                # featuredProjectIds removed
├── pages/
│   └── Projects.tsx                  # Composition root: merges metadata into projects
└── utils/
    └── helpers.ts
```

**Structure Decision**: The three existing folders (`Projects`, `ProjectCard`) are restructured as follows. `ProjectRow` replaces `ProjectCard` because the row is a different unit with a different purpose (it shows a name, an icon, one action and categories; it no longer shows description, technologies, screenshot or a second button). `ProjectCategoryFilter` is new. The curated metadata lives in `src/data/project-metadata.ts` next to the other data modules, typed so a typo is a compile error. `src/pages/Projects.tsx` stays the composition root and is where the curated metadata is merged onto the GitHub-sourced projects, mirroring how `projects.json` is already injected. `featuredProjectIds` is deleted from `siteConfig` along with `Project.isFeatured` handling, since no project is featured any more.

## Complexity Tracking

No constitution violations to track. The feature replaces a presentation rather than layering onto one, and the curated metadata is a single flat file with no lookup abstraction beyond a case-insensitive key match.