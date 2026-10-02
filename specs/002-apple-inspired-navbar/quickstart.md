# Quickstart Validation Guide

## Prerequisites

- Node.js 20+, npm 10+
- Dependencies installed: `npm ci`

## Setup

```bash
cd ismaelmarot-web_2.0
npm ci
npm run dev   # http://localhost:5173
```

## Validation Scenarios

### 1. Desktop (≥1024px)

1. Open the site with viewport ≥1024px wide.
2. Expect: horizontal navbar, brand left, links with wide gaps, GitHub CTA, compact height (~48–56px), no heavy borders/shadows.
3. Hover a link → subtle color change. Active section link shows accent color + `aria-current="page"`.
4. Scroll → header background becomes blurred/solid with subtle separation.

### 2. Tablet (768–1024px)

1. Resize viewport through 1024→768px.
2. Expect: link gaps shrink progressively; before any link is clipped, the nav switches to the hamburger button.
3. Open hamburger → compact menu appears (same MobileMenu component).

### 3. Mobile (<768px)

1. Resize to <768px (e.g. 390px).
2. Expect: brand + hamburger only; horizontal links hidden.
3. Tap hamburger → menu slides in with subtle transition (≤300ms), background scroll locked.
4. Tap a section → menu closes and page smooth-scrolls.
5. Reopen, press Escape → menu closes. Reopen, tap overlay → menu closes.
6. Keyboard: Tab to hamburger, Enter opens menu, Tab cycles focus inside, Escape closes, focus returns to hamburger.

### 4. Reduced motion

1. Enable `prefers-reduced-motion` in OS/browser.
2. Open/close the menu → transitions ~0ms.

### 5. Breakpoint change with menu open

1. Open the menu on mobile.
2. Resize past 768px → menu closes.

## Automated Checks

```bash
npm run typecheck
npm run lint
npm run test          # Header/Navigation/MobileMenu tests must pass
npm run test:e2e      # if e2e covers nav
```
