# Quickstart Validation: Landing Home Page

**Feature**: 003-landing-home-page
**Date**: 2026-10-02

## Prerequisites

- Node.js >= 20.0.0
- npm >= 10.8.0
- Existing project dependencies installed (`npm install`)

## Setup

```bash
# Install new dependency
npm install react-router-dom

# Run development server
npm run dev
```

## Validation Scenarios

### 1. Landing Page Loads with Section Summaries

**Steps**:
1. Navigate to `http://localhost:5173/`
2. Verify the Hero section displays with name, title, and tagline
3. Scroll down and verify section summaries appear for:
   - About (Sobre mí)
   - Projects (Proyectos)
   - Technologies (Tecnologías)
   - Contact (Contacto)
4. Verify each summary has a CTA button

**Expected**: All section summaries are visible with correct titles, descriptions, and CTA buttons.

### 2. CTA Navigation to Sub-Pages

**Steps**:
1. On the landing page, click the "Conocé más" CTA in the About summary
2. Verify the URL changes to `/about` and the About page loads
3. Click the browser back button
4. Verify the landing page loads again
5. Repeat for Projects, Technologies, and Contact CTAs

**Expected**: Each CTA navigates to the correct page with the correct URL. Back button returns to landing page.

### 3. Navbar Navigation Between Pages

**Steps**:
1. On any page, click each navbar link: Home, Sobre mí, Proyectos, Tecnologías, Contacto
2. Verify the correct page loads for each
3. Click the logo/brand name
4. Verify the landing page loads
5. Click the GitHub CTA
5. Verify it opens `https://github.com/ismaelmarot` in a new tab

**Expected**: All navbar links navigate to correct pages. Logo returns to home. GitHub opens externally.

### 4. Deep Linking Support

**Steps**:
1. Navigate directly to `http://localhost:5173/about` in the browser
2. Verify the About page loads correctly
3. Repeat for `/projects`, `/technologies`, `/contact`
4. Navigate to an unknown route like `http://localhost:5173/unknown`
5. Verify a 404/Not Found page displays

**Expected**: Direct URL navigation works for all routes. Unknown routes show a 404 page.

### 5. Responsive Layout

**Steps**:
1. Open browser DevTools and toggle device toolbar
2. Test at mobile (375px), tablet (768px), and desktop (1440px) widths
3. Verify the landing page section summaries stack vertically on mobile
4. Verify the navbar collapses to a hamburger menu on mobile
5. Verify all pages are readable and usable at each breakpoint

**Expected**: Layout adapts appropriately at each breakpoint. No horizontal scrolling or overlapping elements.

### 6. Accessibility Validation

**Steps**:
1. Run `npm run test:a11y` to execute axe-core accessibility scan
2. Verify zero critical violations
3. Tab through all interactive elements on each page
4. Verify focus indicators are visible
5. Verify all images have alt text
6. Verify semantic HTML structure (h1, h2, nav, main, footer)

**Expected**: Zero critical accessibility violations. All interactive elements reachable via keyboard.

### 7. Reduced Motion Support

**Steps**:
1. Enable "Reduce Motion" in your OS settings
2. Navigate through all pages
3. Verify animations are disabled or reduced
4. Verify page transitions are instant or minimal

**Expected**: No animations play when reduced motion is preferred.

## Build and Deploy Validation

```bash
# Run type check
npm run typecheck

# Run linter
npm run lint

# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Build for production
npm run build

# Preview production build
npm run preview
```

**Expected**: All checks pass with zero errors. Production build completes successfully.

## GitHub Pages Deployment

1. Build the project: `npm run build`
2. Copy `index.html` to `dist/404.html` (for SPA fallback)
3. Deploy `dist/` to GitHub Pages
4. Verify all routes work when accessed directly

**Expected**: All pages accessible via direct URLs on GitHub Pages.
