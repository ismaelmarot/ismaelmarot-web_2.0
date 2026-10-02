# Component Contracts — Navbar/Header redesign

These are the public prop contracts the redesigned layout components must keep/extend. See `src/components/layout/*`.

---

## Header

```typescript
interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  ariaLabel?: string;
}

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  navigation: NavItem[];
  cta?: NavItem;
  sticky?: boolean;      // default true
  transparent?: boolean; // default true
}
```

Behavior:
- Desktop: horizontal brand + links + cta.
- Tablet/mobile: shows hamburger button that toggles MobileMenu.
- `useHeader` exposes `{ isScrolled, menuOpen, setMenuOpen, useCompactNav }`.

## Navigation

```typescript
interface NavigationProps extends React.HTMLAttributes<HTMLElement> {
  items: NavItem[];
  variant?: 'header' | 'mobile' | 'footer';
  activeSection?: string;
  onNavigate?: (href: string) => void; // used to close mobile menu on section select
}
```

- `onNavigate` MUST be invoked for internal anchors so parents can close the menu.
- Active item gets `aria-current="page"` and accent color.

## MobileMenu

```typescript
interface MobileMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  cta?: NavItem;
}
```

- `role="dialog" aria-modal="true"`, focus trap, Escape to close, overlay click to close, body scroll lock (all provided by `useMobileMenu`).
- Selecting a nav item MUST close the menu (via `onClose` wiring in Header through `Navigation.onNavigate`).
