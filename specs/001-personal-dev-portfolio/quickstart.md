# Quickstart Validation Guide

This guide provides runnable validation scenarios to prove the portfolio feature works end-to-end. Use this to verify implementation correctness at each milestone.

---

## Prerequisites

- Node.js 20+ (LTS)
- npm 10+
- GitHub account (for API token)
- GitHub CLI (`gh`) authenticated, or personal access token

```bash
# Verify environment
node --version  # >= 20.0.0
npm --version   # >= 10.0.0
```

---

## Setup Commands

```bash
# 1. Clone repository (if not already)
git clone https://github.com/ismaelmarot/ismaelmarot-web_2.0.git
cd ismaelmarot-web_2.0

# 2. Install dependencies
npm ci

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with:
# VITE_GITHUB_USERNAME=ismaelmarot
# VITE_SITE_URL=https://ismaelmarot.com
# GITHUB_TOKEN=ghp_xxxxxxxxxxxx  # For build-time fetching (CI only)

# 4. Fetch GitHub project data (build-time)
npm run fetch:github
# Output: src/data/projects.json generated

# 5. Start development server
npm run dev
# Opens http://localhost:5173
```

---

## Validation Scenarios

### Scenario 1: Homepage Loads with All Sections (P1)

**Prerequisites**: Dev server running (`npm run dev`)

**Steps**:
1. Open http://localhost:5173 in browser
2. Verify page loads without console errors
3. Check all 5 sections present in DOM order:
   - Hero (`#hero`)
   - About (`#about`)
   - Projects (`#projects`)
   - Technologies (`#technologies`)
   - Contact (`#contact`)

**Expected Outcomes**:
- ✅ Hero displays name "Ismael Marot" and title "Web Developer"
- ✅ About section shows personal introduction text
- ✅ Projects section displays ≥3 project cards with name, description, technologies
- ✅ Technologies section shows grouped tech by category
- ✅ Contact section shows email, GitHub, LinkedIn links
- ✅ Navigation header links scroll to correct sections
- ✅ No horizontal scrolling at any viewport

**Automated Test**:
```bash
npm run test:e2e -- --grep "homepage loads"
```

---

### Scenario 2: Project Data Loads from GitHub (P1)

**Prerequisites**: `npm run fetch:github` completed successfully

**Steps**:
1. Check `src/data/projects.json` exists and is valid JSON
2. Verify structure matches `Project` interface
3. Confirm ≥3 projects with required fields populated

**Expected Outcomes**:
- ✅ `projects.json` contains array of Project objects
- ✅ Each project has: `id`, `name`, `description`, `technologies`, `githubUrl`, `lastUpdated`
- ✅ Technologies array non-empty for each project
- ✅ GitHub URLs valid and accessible
- ✅ `lastUpdated` is valid ISO 8601 date

**Validation Script**:
```bash
node -e "
const data = require('./src/data/projects.json');
console.log('Project count:', data.length);
data.forEach(p => {
  const required = ['id','name','description','technologies','githubUrl','lastUpdated'];
  const missing = required.filter(f => !p[f]);
  if (missing.length) console.error('MISSING:', p.name, missing);
});
console.log('All projects valid:', data.every(p => ['id','name','description','technologies','githubUrl','lastUpdated'].every(f => p[f])));
"
```

---

### Scenario 3: Responsive Behavior Across Breakpoints (P1)

**Prerequisites**: Dev server running, browser DevTools

**Steps**:
Test at each breakpoint using Device Toolbar:

| Breakpoint | Width | Test |
|------------|-------|------|
| Mobile | 375px | Hamburger menu visible, stacks single-column |
| Tablet | 768px | Two-column grids, navigation condensed |
| Desktop | 1440px | Full layout, multi-column grids, hover states |

**Mobile Checks**:
- ✅ Hamburger menu opens/closes with keyboard (Enter/Space)
- ✅ Focus trapped in menu when open
- ✅ Touch targets ≥44×44px
- ✅ Text readable without zoom (base 16px)
- ✅ No horizontal overflow

**Tablet Checks**:
- ✅ Two-column project grid
- ✅ Navigation inline (no hamburger)
- ✅ Side-by-side About layout

**Desktop Checks**:
- ✅ Three+ column project grid
- ✅ Hover animations on cards/buttons
- ✅ Sticky header with backdrop blur
- ✅ Smooth scroll navigation

**Automated Test**:
```bash
npm run test:e2e -- --project=chromium --grep "responsive"
```

---

### Scenario 4: Keyboard Navigation & Accessibility (P1)

**Prerequisites**: Dev server running, no mouse

**Steps**:
1. Press `Tab` repeatedly from page load
2. Verify focus order: Skip link → Header nav → Hero CTA → About → Projects → Technologies → Contact → Footer
3. Press `Enter`/`Space` on each interactive element
4. Test "Skip to main content" link
5. Test mobile menu with keyboard only

**Expected Outcomes**:
- ✅ Visible focus ring on all interactive elements (2px offset, high contrast)
- ✅ Skip link appears on first Tab, jumps to `<main>`
- ✅ All buttons/links activate with Enter/Space
- ✅ Mobile menu: Tab cycles within menu, Escape closes
- ✅ No focus traps outside modals/menu
- ✅ ARIA labels on icon-only buttons
- ✅ Semantic heading hierarchy (h1 → h2 → h3)

**Automated Test**:
```bash
npm run test:e2e -- --grep "keyboard"
npm run test:a11y  # axe-core scan
```

---

### Scenario 5: Reduced Motion Preference Respected (P2)

**Prerequisites**: Dev server running

**Steps**:
1. Enable "Reduce Motion" in OS settings:
   - macOS: System Settings → Accessibility → Display → Reduce motion
   - Windows: Settings → Accessibility → Visual effects → Animation effects → Off
   - Browser: DevTools → Rendering → Emulate CSS `prefers-reduced-motion: reduce`
2. Reload page
3. Scroll through sections
4. Hover over interactive elements
5. Open/close mobile menu

**Expected Outcomes**:
- ✅ No auto-playing animations on scroll entry
- ✅ Hover transitions instant (no 200ms easing)
- ✅ Mobile menu opens/closes instantly
- ✅ Framer Motion `animate` props disabled
- ✅ CSS `@media (prefers-reduced-motion: reduce)` honored

**Automated Test**:
```bash
npm run test:e2e -- --grep "reduced-motion"
```

---

### Scenario 6: Loading, Empty, Error States (P2)

**Prerequisites**: Modify `src/data/projects.json` temporarily

**Test Loading State**:
1. Rename `projects.json` → `projects.json.bak`
2. Add artificial delay in fetch (dev only)
3. Reload page
4. Verify skeleton loaders in Projects section

**Test Empty State**:
1. Edit `projects.json` → `[]`
2. Reload page
3. Verify friendly empty message with illustration

**Test Error State**:
1. Corrupt `projects.json` (invalid JSON)
2. Reload page
3. Verify error message with "Retry" button
4. Click Retry → restores data

**Expected Outcomes**:
- ✅ Loading: 6 skeleton cards animate (shimmer)
- ✅ Empty: "No projects yet" with friendly icon
- ✅ Error: "Failed to load projects" + Retry button
- ✅ Retry button re-fetches and restores UI

---

### Scenario 7: Contact Links Functional (P2)

**Prerequisites**: Dev server running

**Steps**:
1. Navigate to Contact section
2. Click email link → verify `mailto:` opens default client
3. Click GitHub link → opens `github.com/ismaelmarot` in new tab
4. Click LinkedIn link → opens profile in new tab
5. Verify `rel="noopener noreferrer"` on external links

**Expected Outcomes**:
- ✅ Email: `mailto:ismael@marot.dev` (or configured address)
- ✅ GitHub: `https://github.com/ismaelmarot`
- ✅ LinkedIn: `https://linkedin.com/in/ismaelmarot`
- ✅ External links: `target="_blank" rel="noopener noreferrer"`
- ✅ Icons have accessible labels

---

### Scenario 8: Performance Budgets Met (P1)

**Prerequisites**: Production build (`npm run build`), serve with `npm run preview`

**Steps**:
1. Run `npm run build`
2. Run `npm run preview`
3. Open http://localhost:4173 in Chrome incognito
4. Open DevTools → Lighthouse → Run audit (Desktop + Mobile)

**Expected Outcomes**:
| Metric | Target | Mobile | Desktop |
|--------|--------|--------|---------|
| Performance | ≥90 | ✅ | ✅ |
| Accessibility | ≥95 | ✅ | ✅ |
| Best Practices | ≥90 | ✅ | ✅ |
| SEO | ≥90 | ✅ | ✅ |
| LCP | <2.5s | ✅ | ✅ |
| FID | <100ms | ✅ | ✅ |
| CLS | <0.1 | ✅ | ✅ |

**Bundle Size Check**:
```bash
npm run build
npx vite-bundle-analyzer dist
# Verify: Total JS < 150KB gzipped, CSS < 30KB gzipped
```

---

### Scenario 9: GitHub Pages Deployment (P1)

**Prerequisites**: Repository pushed to GitHub with Actions enabled

**Steps**:
1. Push to `main` branch
2. Watch GitHub Actions workflow
3. Verify `deploy` job completes
4. Visit deployed URL (`https://ismaelmarot.github.io` or custom domain)

**Expected Outcomes**:
- ✅ Workflow: `lint` → `typecheck` → `test` → `build` → `deploy` all pass
- ✅ Site accessible at Pages URL
- ✅ All scenarios 1-7 work on deployed site
- ✅ HTTPS enforced
- ✅ Custom domain works (if configured)

---

### Scenario 10: Animation Performance (P2)

**Prerequisites**: Dev server running, mid-range device or CPU throttling

**Steps**:
1. Open DevTools → Performance
2. Start recording
3. Scroll full page length
4. Hover over 5+ project cards
5. Open/close mobile menu 3x
6. Stop recording

**Expected Outcomes**:
- ✅ 60fps maintained (no red frames)
- ✅ No layout shift during animations
- ✅ `transform`/`opacity` only (no layout-triggering props)
- ✅ `will-change` used appropriately
- ✅ Total animation work < 50ms per interaction

---

## Test Commands Summary

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run fetch:github` | Fetch project data from GitHub |
| `npm run test` | Run Vitest unit tests |
| `npm run test:component` | Run Testing Library component tests |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:a11y` | Run axe-core accessibility scan |
| `npm run lint` | ESLint + Prettier check |
| `npm run typecheck` | TypeScript strict check |
| `npm run format` | Prettier write |

---

## CI/CD Validation (GitHub Actions)

```yaml
# .github/workflows/ci.yml triggers on push/PR
jobs:
  lint:        # ESLint + Prettier
  typecheck:   # tsc --noEmit
  test:        # Vitest (unit + component)
  test-e2e:    # Playwright (chromium, firefox, webkit)
  test-a11y:   # axe-core on built site
  build:       # Vite production build
  deploy:      # GitHub Pages (main branch only)
```

**Required Status Checks** (branch protection):
- `lint`
- `typecheck`
- `test`
- `test-e2e`
- `test-a11y`
- `build`

---

## Troubleshooting

| Issue | Resolution |
|-------|------------|
| GitHub API 403 | Check `GITHUB_TOKEN` has `public_repo` scope |
| Rate limited | Wait 1hr or use authenticated requests |
| Projects not showing | Verify `projects.json` structure matches `Project` type |
| Styles not applying | Check CSS Modules import paths, token references in `tokens.css` |
| Animations janky | Reduce `will-change`, use `transform`/`opacity` only |
| A11y failures | Run `npm run test:a11y`, fix reported violations |
| Build fails on CI | Match Node version (`.nvmrc` / `engines` in package.json) |

---

## Definition of Done

All scenarios ✅ passing:
- [ ] Scenario 1: Homepage loads with all sections
- [ ] Scenario 2: Project data from GitHub
- [ ] Scenario 3: Responsive at all breakpoints
- [ ] Scenario 4: Keyboard navigation + a11y
- [ ] Scenario 5: Reduced motion respected
- [ ] Scenario 6: Loading/empty/error states
- [ ] Scenario 7: Contact links functional
- [ ] Scenario 8: Performance budgets met
- [ ] Scenario 9: GitHub Pages deployment
- [ ] Scenario 10: Animation performance

Plus CI gates:
- [ ] `lint` passes
- [ ] `typecheck` passes
- [ ] `test` passes
- [ ] `test-e2e` passes
- [ ] `test-a11y` passes (0 critical, 0 serious)
- [ ] `build` succeeds