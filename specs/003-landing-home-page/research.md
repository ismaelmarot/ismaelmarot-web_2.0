# Research: Landing Home Page

**Feature**: 003-landing-home-page
**Date**: 2026-10-02

## R-001: Routing Solution for React + Vite SPA

**Decision**: Use `react-router-dom` v6+ with `createBrowserRouter` and `<RouterProvider>`.

**Rationale**:
- Industry standard for React SPAs with excellent TypeScript support
- Supports nested routes with layouts (shared Header/Footer via `<Outlet />`)
- Built-in code-splitting via `React.lazy()` and `Suspense`
- Scroll restoration support
- Works seamlessly with Vite (no special plugin needed for basic SPA routing)
- Compatible with React 18 concurrent features
- Supports `NavLink` for active route styling in navbar

**Alternatives Considered**:
- **Custom routing with useState/useEffect**: Rejected — would require manual history management, no code-splitting, no scroll restoration, error-prone
- **React Router v7 framework mode (Vite plugin)**: Rejected — adds complexity (SSR config, route modules, entry.client.tsx) unnecessary for a static SPA; v6 data router is sufficient
- **Hash-based routing**: Rejected — produces uglier URLs (`/#/about`); BrowserRouter with clean URLs is preferred since we control the deployment (can configure SPA fallback)
- **TanStack Router**: Rejected — newer, less ecosystem support, overkill for 5 static pages

**Deployment Note**: GitHub Pages requires SPA fallback (all routes serve `index.html`). This can be handled via a `404.html` redirect trick or by using HashRouter if server config is not possible. Decision: Use BrowserRouter with a `404.html` copy of `index.html` for GitHub Pages compatibility.

---

## R-002: Layout Component Pattern

**Decision**: Create a `Layout` component that wraps all routes and renders Header, `<Outlet />`, and Footer.

**Rationale**:
- Follows React Router's layout route pattern
- Single source of truth for Header/Footer across all pages
- Header receives navigation items and GitHub CTA as props (or from a config)
- SkipLink targets are page-aware (only relevant on pages with those sections)

**Alternatives Considered**:
- **Repeat Header/Footer in each page**: Rejected — violates DRY, harder to maintain
- **Higher-order component (HOC)**: Rejected — less idiomatic in React Router v6 compared to layout routes

---

## R-003: Landing Page Section Summary Components

**Decision**: Create lightweight summary components (`SectionSummary`) that display a title, brief description, and CTA link. These are distinct from the full section components.

**Rationale**:
- Landing page needs concise previews, not full content
- Summary components can reuse existing design tokens and CTA patterns
- Featured projects preview can reuse `ProjectCard` in a compact grid
- Technologies preview can show a curated subset using existing `TechnologyCard`

**Alternatives Considered**:
- **Reuse full section components with a "preview" prop**: Rejected — would require conditional logic inside each section component, violating single responsibility
- **Inline summary markup directly in Index page**: Rejected — would make Index.tsx too large and harder to test

---

## R-004: Navigation Configuration

**Decision**: Centralize navigation config in `site-config.ts` or a dedicated `navigation.ts` file. Navbar links use `NavLink` for active state styling.

**Rationale**:
- Single source of truth for navigation items
- Easy to update labels, routes, and order
- `NavLink` provides automatic `aria-current="page"` for accessibility
- GitHub CTA remains an external link (not a route)

**Alternatives Considered**:
- **Hardcode navigation in Header component**: Rejected — harder to reuse in MobileMenu and Footer
- **Derive navigation from route config**: Rejected — couples navigation UI to routing implementation details

---

## R-005: Deep Linking and 404 Handling

**Decision**: Use BrowserRouter with a catch-all route (`path: "*"`) rendering a NotFound page. For GitHub Pages, add a `404.html` that redirects to `index.html`.

**Rationale**:
- Clean URLs (`/about`, `/projects`) are more professional and SEO-friendly
- Catch-all route handles unknown paths gracefully
- GitHub Pages `404.html` trick enables SPA fallback without server config

**Alternatives Considered**:
- **HashRouter**: Rejected — URLs like `/#/about` are less clean and professional
- **BrowserRouter without 404 handling**: Rejected — direct navigation to `/about` would 404 on GitHub Pages

---

## R-006: Page Transition and Scroll Behavior

**Decision**: Implement scroll-to-top on route change using a `ScrollToTop` component. Use CSS transitions for subtle page fade-in.

**Rationale**:
- Scroll-to-top is expected behavior for multi-page navigation
- Subtle fade-in provides polish without violating reduced-motion preferences
- React Router's `useLocation` hook enables scroll restoration on back/forward

**Alternatives Considered**:
- **React Router's built-in ScrollRestoration**: Rejected — requires data router configuration, adds complexity for a simple use case
- **No scroll handling**: Rejected — poor UX when navigating between pages
