# Data Model: Landing Home Page

**Feature**: 003-landing-home-page
**Date**: 2026-10-02

## Overview

This feature introduces a multi-page architecture. The data model is minimal since the site is a static portfolio with no backend. The primary entities are configuration-driven and already exist in the codebase.

## Entities

### Page

Represents a distinct route/view in the application.

| Field | Type | Description |
|-------|------|-------------|
| `path` | `string` | URL path (e.g., `/`, `/about`, `/projects`) |
| `title` | `string` | Page title for document head |
| `element` | `React.ComponentType` | The page component to render |

**Routes**:

| Path | Page Component | Description |
|------|----------------|-------------|
| `/` | `IndexPage` | Landing page with section summaries |
| `/about` | `AboutPage` | Full About content |
| `/projects` | `ProjectsPage` | Full project gallery |
| `/technologies` | `TechnologiesPage` | All technologies grouped by category |
| `/contact` | `ContactPage` | All contact methods |
| `*` | `NotFoundPage` | 404 catch-all |

### NavigationItem

Represents a link in the navbar.

| Field | Type | Description |
|-------|------|-------------|
| `label` | `string` | Display text |
| `href` | `string` | Route path or external URL |
| `external` | `boolean` | Whether the link opens in a new tab |
| `ariaLabel` | `string` | Accessible label (optional) |

**Default Navigation Items**:

| Label | Href | External |
|-------|------|----------|
| Home | `/` | false |
| Sobre mí | `/about` | false |
| Proyectos | `/projects` | false |
| Tecnologías | `/technologies` | false |
| Contacto | `/contact` | false |
| GitHub | `https://github.com/ismaelmarot` | true |

### SectionSummary

Represents a preview card on the landing page.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `title` | `string` | Section title |
| `description` | `string` | Brief description |
| `ctaLabel` | `string` | CTA button text |
| `ctaHref` | `string` | Target route |
| `featuredItems` | `T[]` | Optional preview items (projects, technologies) |

### SiteConfig (existing, extended)

The existing `SiteConfig` type in `src/types/site.ts` will be extended with:

| Field | Type | Description |
|-------|------|-------------|
| `navigation` | `NavigationItem[]` | Centralized navigation config |
| `featuredTechnologies` | `string[]` | IDs of technologies to show in landing preview |

### Project (existing)

No changes. Reuses existing `Project` type from `src/types/project.ts`.

### Technology (existing)

No changes. Reuses existing `Technology` type from `src/types/project.ts`.

### ContactMethod (existing)

No changes. Reuses existing `ContactMethod` type from `src/types/contact.ts`.

## State Management

No global state management is needed. Each page manages its own local state:
- Projects page: loading/error/empty states for GitHub data
- Header: mobile menu open/closed, scroll position
- Navigation: active route (managed by React Router)

## Data Flow

```text
site-config.ts ──► NavigationItem[] ──► Header / MobileMenu
                                        │
                                        ▼
                              React Router (NavLink)
                                        │
                                        ▼
                              Active route styling

site-config.ts ──► SectionSummary[] ──► IndexPage (Landing)
                                        │
                                        ▼
                              CTA links to routes

projects.json ──► ProjectsPage ──► ProjectCard[]

site-config.ts ──► ContactMethod[] ──► ContactPage
```

## Validation Rules

- All internal navigation hrefs must start with `/`
- External links must have `external: true` and open in new tab
- Section summary CTAs must point to valid routes
- Featured project IDs must exist in `projects.json`
