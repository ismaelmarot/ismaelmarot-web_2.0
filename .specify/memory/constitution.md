<!--
Sync Impact Report
Version change: 2.2.0 → 2.2.1
Modified principles:
  - Architecture & Code Organization: Styling (expanded with explicit prohibitions: CSS Modules, vanilla-extract, Tailwind CSS)
  - Architecture & Code Organization: Component Structure (updated responsibilities to match mandatory rules)
  - Architecture & Code Organization: Shared Styling (new subsection added)
  - Architecture & Code Organization: Dependencies (new subsection added)
  - Project Context: Styling solution (unchanged)
Added sections:
  - Architecture & Code Organization: Shared Styling
  - Architecture & Code Organization: Dependencies
Removed sections: None
Follow-up TODOs: None
-->

# IsmaelMarot Web 2.0 Constitution

## Core Principles

### I. Component-First Architecture
Every feature is built as a reusable, self-contained component. Components must be independently testable, documented with clear props/interface contracts, and have a single responsibility. No feature-specific logic lives outside component boundaries.

### II. Type Safety
All public APIs, component props, and data contracts are defined with TypeScript types. TypeScript strict mode is enabled. Contract testing is not required by default; it is introduced only when integration complexity justifies it.

### III. Testing Strategy
Testing is required for important business logic and critical components. Strict TDD (tests before implementation) is not mandatory. Write tests that provide confidence in correctness—unit tests for logic, component tests for behavior, and E2E tests for critical user flows. Target meaningful coverage over arbitrary thresholds.

### IV. Accessibility & Performance
All components meet WCAG 2.1 AA standards. Semantic HTML, proper ARIA attributes, keyboard navigation, and color contrast are required. Performance budgets: LCP <2.5s, FID <100ms, CLS <0.1. Bundle size monitored per route. Optimize for fast initial load and smooth interactions.

### V. Design Principles
Visual design is inspired by Apple's principles of simplicity, hierarchy, spacing, and animation—without copying Apple's designs. Prioritize clarity, generous whitespace, meaningful motion, and consistent visual hierarchy. Design decisions serve content and usability first.

### VI. Simplicity & Maintainability
Prefer simple, maintainable solutions over clever or prematurely generalized ones. Avoid unnecessary complexity, abstraction layers, and dependencies. Code should be readable by a single developer returning to it after months. YAGNI applies: build what is needed now, not what might be needed later.

## Architecture & Code Organization

### Component Structure
Every React component MUST have its own folder with the following standard structure:

```
ComponentName/
├── ComponentName.tsx           # JSX/rendering only
├── ComponentName.styles.ts     # All component-specific styled-components definitions
├── useComponentName.ts         # Component-specific state, effects, handlers, and logic
├── ComponentName.test.tsx      # Component tests
└── index.ts                    # Public barrel export
```

Responsibilities:
- **ComponentName.tsx**: JSX/rendering only. Receives data and callbacks via props.
- **ComponentName.styles.ts**: All component-specific styled-components definitions.
- **useComponentName.ts**: Component-specific state, effects, handlers, and logic.
- **ComponentName.test.tsx**: Component and behavior tests.
- **index.ts**: Single public export point (`export { ComponentName } from './ComponentName'`).

Do not mix component-specific logic, styles, and rendering in the same file.

### Styling
Use styled-components for component styling.

Do not use CSS Modules, vanilla-extract, Tailwind CSS, or any other styling framework.

Component-specific styles MUST live in the component's dedicated `*.styles.ts` file using styled-components.

### Shared Styling
Global design tokens and global styles may remain in `src/styles/`.

Reusable visual primitives should use styled-components.

### Path Aliases
Internal project imports must use the `@/` path alias.

Avoid `../../` and `../../../` imports for internal project modules.

Examples:
```tsx
import { Header } from '@/components/Header';
import { classNames } from '@/utils/helpers';
import type { HeaderProps } from '@/contracts/components';
```

Relative imports should ONLY be used when technically necessary and there is no appropriate `@/` alias.

### Dependencies
Use the simplest architecture compatible with the project.

Do not introduce vanilla-extract or another styling solution.

The existing simplified architecture, React, TypeScript, Vite, npm, GitHub Pages, build-time GitHub data, and testing strategy should remain unchanged.

### Maintainability
Prefer clear separation of responsibilities over large files.

Do not create unnecessary abstractions, generic components, hooks, or layers.

Keep the architecture simple and appropriate for a small personal portfolio.

### Existing Implementation
These rules apply to ALL new components and MUST also be applied when modifying existing components during implementation.

Do not redesign the overall architecture or add new libraries because of these rules.

## Project Context

**Primary maintainer**: Solo developer
**Data source**: Consumes GitHub repository information (repos, releases, contributors, languages)
**Styling solution**: styled-components (component-scoped, `*.styles.ts` files)
**Package manager**: npm (lockfile committed)

## Technology Standards

**Frontend**: React 18+, TypeScript 5+, Vite
**Testing**: Vitest (unit), Playwright (E2E), Testing Library (component)
**Code Quality**: ESLint (strict), Prettier, TypeScript strict mode
**CI/CD**: GitHub Actions with required status checks
**Deployment**: Static hosting

Dependencies audited periodically. No deprecated packages without migration plan. Peer dependencies explicitly declared.

## Governance

This constitution supersedes all other development practices. It defines principles, not implementation details—technical plans belong in planning documents, not here.

Amendments require:
1. Written proposal with rationale and impact analysis
2. Review by the maintainer
3. Approval and version bump per semantic versioning:
   - MAJOR: Backward-incompatible principle removals or redefinitions
   - MINOR: New principle or materially expanded guidance
   - PATCH: Clarifications, wording, typo fixes

All PRs and reviews must verify constitution compliance. Complexity must be justified. Use `.specify/memory/` guidance files for runtime development decisions.

**Version**: 2.2.1 | **Ratified**: 2026-09-28 | **Last Amended**: 2026-09-29