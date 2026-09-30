# Research: Personal Developer Portfolio

## Decisions Needed

### 1. Styling Solution
**Decision**: CSS Modules + CSS Variables (Custom Properties)
**Rationale**:
- Aligns with project preference for component-level styles with separate style files (`.module.css` co-located with components)
- Zero runtime overhead — compiled to standard CSS by Vite
- Design tokens via CSS custom properties (`:root { --color-primary: ... }`) — single source of truth, theming-ready
- Scoped styles prevent leakage, no naming conflicts
- Native browser support, no build-time dependency beyond Vite's built-in CSS Modules
- Simpler than Tailwind: no configuration file, no utility class learning curve, no purge/setup complexity
- More maintainable than plain CSS: token system ensures consistency, component-scoped files are easy to find/edit
- Works seamlessly with TypeScript (Vite generates `.d.ts` for CSS Modules)

**Alternatives Considered**:
- Tailwind CSS: Adds config, utility class mental model, purge setup. Overkill for a solo portfolio with design tokens.
- Styled Components: Runtime overhead (~12KB), larger bundle, not needed for static site.
- Plain CSS + Custom Properties: More boilerplate, harder to maintain consistency across components without discipline.
- UnoCSS: Similar to Tailwind but less mature ecosystem, fewer resources.

### 2. Animation Library
**Decision**: CSS Animations + IntersectionObserver (no Framer Motion)
**Rationale**:
- Framer Motion adds ~12KB gzipped and API complexity for needs covered by CSS
- Scroll-reveal animations: IntersectionObserver + CSS keyframes (`opacity` + `transform`)
- Hover/tap transitions: CSS `transition` on `transform`/`opacity`
- Reduced-motion: Native `@media (prefers-reduced-motion: reduce)` disables non-essential animations
- Page transitions: Not needed for single-page portfolio
- Layout animations: Not needed (no shared element transitions)
- Tree-shaking Framer Motion still leaves significant bundle for simple use cases
- CSS-first approach aligns with simplicity principle

**Alternatives Considered**:
- Framer Motion: Overkill for this scope. Declarative API nice but not worth 12KB + learning curve for basic scroll/hover animations.
- GSAP: Overkill, licensing concerns for commercial use.
- React Spring: More complex API, less intuitive for scroll animations.

### 3. GitHub Data Fetching Strategy
**Decision**: Build-time fetch via Node script + GitHub REST API (native `fetch()`), cached to `src/data/projects.json`
**Rationale**:
- Static deployment requirement (no runtime API calls)
- Avoids client-side API key exposure
- Respects GitHub rate limits (fetch once at build)
- Works with GitHub Actions CI/CD
- Can run locally during development
- Generates typed JSON for TypeScript consumption
- Native `fetch()` in Node 18+ — no Octokit dependency needed

**Implementation**:
```bash
# scripts/fetch-github.ts
# Runs at build time (prebuild script in package.json)
# Fetches repos for user 'ismaelmarot'
# Filters for portfolio-worthy repos (has description, not fork, etc.)
# Outputs typed JSON to src/data/projects.json
```

**Alternatives Considered**:
- GitHub GraphQL API: More complex setup, REST sufficient for repo metadata.
- Runtime fetch with SWR/React Query: Violates static deployment, rate limit issues.
- Octokit: Adds ~15KB for a simple GET request. Native fetch is sufficient.
- Manual curation: Doesn't scale, spec requires GitHub-sourced data.

### 4. Image Optimization
**Decision**: Vite `imagemin` plugin + WebP/AVIF generation + `loading="lazy"` + `srcset`
**Rationale**:
- Build-time optimization (no runtime cost)
- Modern formats with fallbacks
- Native lazy loading for performance
- Responsive images via srcset for different viewports
- Screenshots stored in `public/images/projects/`

**Alternatives Considered**:
- Cloudinary/Imgix: External dependency, cost, overkill.
- Runtime optimization: Not possible for static deployment.

### 5. Deployment Configuration
**Decision**: GitHub Actions → GitHub Pages (custom domain ready)
**Rationale**:
- Native GitHub integration
- Free for public repos
- Custom domain support
- Automatic HTTPS
- Build + deploy in single workflow

**Workflow**:
1. `npm ci` → `npm run build` → `npm run test`
2. Upload `dist/` as artifact
3. Deploy to `gh-pages` branch / Pages

### 6. Component Architecture Details
**Decision**: Atomic design inspired structure
- `components/ui/` - Atoms (Button, Icon, Badge, Heading, Text) — each with `.tsx` + `.module.css`
- `components/common/` - Molecules (Card, Section, Container, Grid)
- `components/layout/` - Organisms (Header, Footer, Navigation)
- `components/sections/` - Pages/Sections (Hero, About, Projects, Technologies, Contact)
- `pages/` - Route-level composition (Index.tsx only for SPA)

### 7. State Management
**Decision**: No global state library (React Context only for theme/reduced-motion)
**Rationale**:
- Static site with minimal interactivity
- No user sessions, auth, or complex client state
- Project data loaded at build → static props
- Theme/reduced-motion: simple Context providers

### 8. Testing Strategy
**Decision**: Focused testing on high-value areas
- **Unit (Vitest)**: Utility functions (`helpers.ts`, `animations.ts`), data transformation logic, type guards
- **Component (Testing Library)**: Critical interactive components — `ProjectCard`, `Navigation`, `MobileMenu`, `ContactMethod`
- **E2E (Playwright)**: Key user flows — homepage load, navigation, project detail view, contact links, keyboard navigation, reduced-motion
- **Accessibility**: axe-core in CI on built site
- No arbitrary coverage thresholds — test what matters for confidence

## Consolidated Technical Stack

| Category | Choice | Version |
|----------|--------|---------|
| Framework | React | 18.3+ |
| Language | TypeScript | 5.5+ |
| Build Tool | Vite | 5.4+ |
| Styling | CSS Modules + CSS Variables | Native |
| Animation | CSS Animations + IntersectionObserver | Native |
| Testing (Unit) | Vitest | 2.0+ |
| Testing (Component) | Testing Library | 16+ |
| Testing (E2E) | Playwright | 1.45+ |
| Linting | ESLint | 9+ |
| Formatting | Prettier | 3+ |
| GitHub API | Native fetch() | Node 18+ |
| Image Opt | vite-plugin-imagemin | 0.6+ |
| Deploy | GitHub Actions | - |

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| GitHub API rate limit (60/hr unauth) | Use `GITHUB_TOKEN` in CI, cache results, fallback to committed `projects.json` |
| Large bundle size | CSS Modules (no unused CSS), no animation library, code-split if needed |
| Animation performance | `transform`/`opacity` only, `will-change` hints, respect reduced-motion |
| Accessibility regressions | axe-core in CI, manual keyboard testing, semantic HTML enforcement |
| Mobile navigation complexity | Simple hamburger menu with Focus Trap, ARIA attributes |
| CSS maintenance | Design tokens in `tokens.css`, component-scoped modules, consistent naming |

## Next Steps

All NEEDS CLARIFICATION resolved. Proceed to Phase 1:
1. Generate `data-model.md` with Project, Technology, ContactMethod entities
2. Generate `contracts/` for component props interfaces
3. Generate `quickstart.md` for validation scenarios