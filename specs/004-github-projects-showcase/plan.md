# Implementation Plan: GitHub Projects Showcase

**Branch**: `004-github-projects-showcase` | **Date**: 2026-10-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-github-projects-showcase/spec.md`

## Summary

Enhance the existing Projects section to display GitHub projects from https://github.com/ismaelmarot with Apple-style design. Each project card shows name, description, icon, "Go Live" / "Go Live App" button, and "Github Repo" button. The section uses the existing build-time data fetching pipeline and design token system.

## Technical Context

**Language/Version**: TypeScript 5.5, React 18.3

**Primary Dependencies**: styled-components 6.1, react-router-dom 7.18

**Storage**: Static JSON file (`src/data/projects.json`) generated at build time

**Testing**: Vitest (unit), Testing Library (component), Playwright (E2E), axe-core (a11y)

**Target Platform**: Web (static site deployed to GitHub Pages)

**Project Type**: Web application (SPA)

**Performance Goals**: Lighthouse 90+, LCP < 2.5s, CLS < 0.1

**Constraints**: WCAG 2.1 AA, no new dependencies, use existing design tokens

**Scale/Scope**: Personal portfolio, ~10-20 projects, single developer

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First Architecture | PASS | ProjectCard and Projects are self-contained components with standard folder structure |
| II. Type Safety | PASS | All props and data contracts defined in TypeScript |
| III. Testing Strategy | PASS | Existing test infrastructure (Vitest, Testing Library, Playwright) will be used |
| IV. Accessibility & Performance | PASS | WCAG 2.1 AA compliance required; performance budgets already defined in tokens |
| V. Design Principles | PASS | Apple-inspired design using existing token system |
| VI. Simplicity & Maintainability | PASS | No new abstractions or dependencies; leverages existing patterns |
| Styling (styled-components) | PASS | All styles in `*.styles.ts` files |
| Path Aliases (`@/`) | PASS | All internal imports use `@/` alias |
| Dependencies | PASS | No new packages needed |

**Result**: All gates pass. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/004-github-projects-showcase/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── project-card.contract.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── sections/
│   │   ├── Projects/           # Projects section container
│   │   │   ├── Projects.tsx
│   │   │   ├── Projects.styles.ts
│   │   │   ├── useProjects.ts
│   │   │   ├── Projects.test.tsx
│   │   │   └── index.ts
│   │   └── ProjectCard/        # Individual project card
│   │       ├── ProjectCard.tsx
│   │       ├── ProjectCard.styles.ts
│   │       ├── useProjectCard.ts
│   │       ├── ProjectCard.test.tsx
│   │       └── index.ts
│   └── ui/
│       ├── Button/           # Reusable button (existing)
│       ├── Icon/               # Reusable icon (existing)
│       ├── Badge/              # Reusable badge (existing)
│       └── Card/               # Reusable card (existing)
├── types/
│   ├── project.ts              # Project entity types
│   └── github.ts               # GitHub API types + transform
├── data/
│   ├── fetch-github.ts         # Build-time data fetcher
│   └── projects.json           # Generated project data
├── styles/
│   ├── tokens.ts               # Design tokens
│   ├── tokens.css              # CSS custom properties
│   └── globals.css             # Global styles
├── contracts/
│   └── components.ts           # Shared component contracts
├── utils/
│   ├── helpers.ts              # Utility functions
│   └── animations.ts           # Animation utilities
├── App.tsx
└── main.tsx
```

**Structure Decision**: Single-page application with component-based architecture. The Projects section and ProjectCard component already exist and will be enhanced. No new directories or structural changes needed.

## Complexity Tracking

No constitution violations to track. The feature enhances existing components without introducing new architectural patterns or dependencies.
