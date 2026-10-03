# Implementation Plan: Project Detail Page

**Branch**: `006-project-detail` | **Date**: 2026-10-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-project-detail/spec.md`

## Summary

Add a per-project page at its own address, reached from the "Ver proyecto" control in the project list. The page carries everything the list deliberately leaves out: the app icon and name, categories, platform and viewport icons, the full description, up to six screenshots, links to the repository and to the app or its downloads, an information block with categories, language and size, and the version history for the projects that publish formal versions.

## Technical Context

**Language/Version**: TypeScript 5.5, React 18.3

**Primary Dependencies**: styled-components 6.1, react-router-dom 7.18

**Storage**: Static JSON (`src/data/projects.json`, build-time artifact) plus the local curated metadata module added by the previous feature

**Testing**: Vitest (unit), Testing Library (component), Playwright (E2E), axe-core (a11y)

**Target Platform**: Web (static site deployed to GitHub Pages under the `/ismaelmarot-web_2.0` subpath)

**Project Type**: Web application (SPA)

**Performance Goals**: Lighthouse 90+, LCP < 2.5s, CLS < 0.1

**Constraints**: WCAG 2.1 AA, no new dependencies, use existing design tokens, styled-components only, `@/` path alias

**Scale/Scope**: Personal portfolio, 6 published projects, at most 6 screenshots each

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First Architecture | PASS | New page folder plus one new `ProjectDetail` section component; share logic isolated in its own hook |
| II. Type Safety | PASS | `Project` gains `sizeKb`, `appSizeBytes`, `downloadUrl`; platform and viewport icons are added to the closed `IconName` set |
| III. Testing Strategy | PASS | Unit tests for the release-to-size mapping, component tests for every render state of the page |
| IV. Accessibility & Performance | PASS | Landmarks and headings in order, keyboard-reachable controls, share status exposed politely, screenshots lazy-loaded and capped at six |
| V. Design Principles | PASS | Reuses the existing tokens and pill buttons; no new styling infrastructure |
| VI. Simplicity & Maintainability | PASS | No new dependencies; share degrades to clipboard then to a message; no carousel library, the gallery is a plain responsive grid |
| Styling (styled-components) | PASS | All styles in `*.styles.ts` |
| Path Aliases (`@/`) | PASS | All internal imports use `@/` |
| Dependencies | PASS | No new packages; sharing uses the browser platform APIs already available |

**Result**: All gates pass. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/006-project-detail/
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
│   │   ├── ProjectDetail/         # NEW: the detail section
│   │   │   ├── ProjectDetail.tsx
│   │   │   ├── ProjectDetail.styles.ts
│   │   │   ├── useProjectShare.ts
│   │   │   └── ProjectDetail.test.tsx
│   │   ├── ProjectRow/            # Modified: action becomes an internal link
│   │   └── Projects/              # Unchanged
│   └── ui/
│       └── Icon/                  # + mac, pc, desktop, tablet, mobile
├── types/
│   ├── project.ts                 # + sizeKb, appSizeBytes, downloadUrl
│   └── github.ts                  # + GitHubRepo.size, release shapes
├── data/
│   ├── fetch-github.ts            # fetch releases per project
│   ├── profile-readme.ts          # extract screenshots, capped at six
│   └── projects.json              # regenerated build artifact
├── pages/
│   └── ProjectDetail.tsx          # NEW: route target, resolves id
└── router.tsx                     # + projects/:id before the catch-all
```

**Structure Decision**: `src/pages/ProjectDetail.tsx` is the composition root and resolves the project from the imported data by id, mirroring how `src/pages/Projects.tsx` already merges curated metadata. The presentation lives in `src/components/sections/ProjectDetail/` with the share behaviour isolated in `useProjectShare` so the component file stays rendering-only, as the constitution requires. The screenshots are parsed by the existing `profile-readme.ts` and capped there, so no new parsing module is introduced. Five icons are added to the existing `Icon` primitive rather than a second icon source.

## Complexity Tracking

No constitution violations to track. Two deliberate constraints keep this small: the gallery is a responsive grid with no carousel library, and the share control degrades from the native share sheet to the clipboard to a visible message rather than adding any state library.