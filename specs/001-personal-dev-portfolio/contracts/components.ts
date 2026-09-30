# Component Contracts

This document defines the TypeScript interfaces for all component props in the portfolio. These are the public APIs that components expose.

---

## Primitive UI Components (components/ui/)

### Button
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}
```

### Icon
```typescript
interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  name: IconName; // Union of available icon identifiers
  size?: number | string; // default: 24
  'aria-label'?: string; // Required if decorative={false}
  decorative?: boolean; // default: true (aria-hidden)
}
```

### Heading
```typescript
interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  asChild?: boolean; // Render as different element via Radix Slot pattern
}
```

### Text
```typescript
interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'body' | 'lead' | 'small' | 'muted' | 'code';
  as?: 'p' | 'span' | 'div' | 'article' | 'section';
}
```

### Badge
```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'subtle' | 'tech';
  size?: 'sm' | 'md';
  dotColor?: string; // For tech badges with colored indicator
}
```

### Image
```typescript
interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string; // Required, no default
  alt: string; // Required for accessibility
  width?: number;
  height?: number;
  priority?: boolean; // Preload, no lazy-loading
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string; // Responsive sizes attribute
}
```

### Card
```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean; // Adds hover elevation transition
  asChild?: boolean;
}
```

---

## Common Components (components/common/)

### Section
```typescript
interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id: string; // Required for anchor navigation
  ariaLabel?: string; // Override default "Section: {id}"
  size?: 'sm' | 'md' | 'lg' | 'xl'; // Vertical padding scale
  background?: 'default' | 'muted' | 'accent' | 'gradient';
  className?: string;
  children: React.ReactNode;
}
```

### Container
```typescript
interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'; // Max-width constraint
  padding?: 'none' | 'sm' | 'md' | 'lg'; // Horizontal padding
  as?: 'div' | 'main' | 'section' | 'article';
}
```

### Grid
```typescript
interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4 | { base: number; md: number; lg: number; xl: number };
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around';
}
```

### Stack
```typescript
interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'vertical' | 'horizontal';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
  divider?: React.ReactNode; // Element between items
}
```

### VisuallyHidden
```typescript
interface VisuallyHiddenProps {
  children: React.ReactNode;
  as?: 'span' | 'div';
}
```

---

## Layout Components (components/layout/)

### Header
```typescript
interface HeaderProps {
  logo?: React.ReactNode; // Default: site name
  navigation: NavItem[];
  cta?: NavItem; // Primary action (e.g., "Contact")
  sticky?: boolean; // default: true
  transparent?: boolean; // default: true (over hero)
}

interface NavItem {
  label: string;
  href: string; // Anchor link (#section) or external URL
  external?: boolean;
  ariaLabel?: string;
}
```

### Footer
```typescript
interface FooterProps {
  copyright: string; // e.g., "© 2026 Ismael Marot"
  socialLinks: ContactMethod[]; // From SiteConfig
  navigation?: NavItem[]; // Optional secondary links
  variant?: 'minimal' | 'full'; // default: 'minimal'
}
```

### Navigation
```typescript
interface NavigationProps {
  items: NavItem[];
  variant?: 'header' | 'mobile' | 'footer';
  activeSection?: string; // Current section ID for highlighting
  onNavigate?: (href: string) => void; // For scroll handling
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  cta?: NavItem;
}
```

### SkipLink
```typescript
interface SkipLinkProps {
  targets: string[]; // Section IDs to skip to
}
```

---

## Section Components (components/sections/)

### Hero
```typescript
interface HeroProps {
  name: string;
  title: string;
  tagline: string;
  cta?: {
    label: string;
    href: string; // Anchor to #projects or #contact
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  background?: 'gradient' | 'pattern' | 'none';
  animationVariant?: 'fade-up' | 'stagger' | 'minimal';
}
```

### About
```typescript
interface AboutProps {
  content: string; // Markdown or plain text
  image?: {
    src: string;
    alt: string;
  };
  stats?: StatItem[];
  layout?: 'text-left' | 'text-right' | 'centered';
}

interface StatItem {
  label: string;
  value: string | number;
  description?: string;
}
```

### Projects
```typescript
interface ProjectsProps {
  projects: Project[];
  featuredProjectIds?: string[]; // IDs to highlight
  viewMode?: 'grid' | 'masonry' | 'carousel';
  showFilters?: boolean; // Filter by technology
  emptyState?: {
    title: string;
    description: string;
    action?: { label: string; onClick: () => void };
  };
  loadingState?: {
    skeletonCount: number; // default: 6
  };
  errorState?: {
    title: string;
    description: string;
    retryAction: { label: string; onClick: () => void };
  };
}

interface ProjectCardProps {
  project: Project;
  variant?: 'default' | 'featured' | 'compact';
  onClick?: (project: Project) => void; // For detail view
  showScreenshot?: boolean;
  maxDescriptionLines?: number; // default: 3
}

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
  onNavigate?: (href: string, external?: boolean) => void;
}
```

### Technologies
```typescript
interface TechnologiesProps {
  technologies: Technology[];
  groupByCategory?: boolean; // default: true
  showProficiency?: boolean; // default: true
  showYearsExperience?: boolean; // default: false
  layout?: 'grid' | 'cloud' | 'list';
  filterable?: boolean; // Allow filtering projects by tech
  onFilterChange?: (techIds: string[]) => void;
}

interface TechnologyCardProps {
  technology: Technology;
  variant?: 'default' | 'compact' | 'detailed';
  isSelected?: boolean;
  onClick?: (tech: Technology) => void;
}

interface TechnologyCategoryProps {
  category: TechnologyCategory;
  technologies: Technology[];
  title?: string; // Override default category label
}
```

### Contact
```typescript
interface ContactProps {
  methods: ContactMethod[];
  introText?: string;
  formEndpoint?: string; // For future form integration (out of scope)
  layout?: 'grid' | 'list' | 'cards';
}

interface ContactMethodProps {
  method: ContactMethod;
  variant?: 'default' | 'icon-only' | 'detailed';
  onClick?: (method: ContactMethod) => void;
}
```

---

## Hook Contracts (hooks/)

### useReducedMotion
```typescript
interface UseReducedMotionReturn {
  prefersReducedMotion: boolean;
  // Usage: const { prefersReducedMotion } = useReducedMotion();
  // Conditionally disable Framer Motion animations
}
```

### useScrollSpy
```typescript
interface UseScrollSpyReturn {
  activeSection: string | null;
  // Usage: const { activeSection } = useScrollSpy(sectionIds);
  // Updates on scroll with IntersectionObserver
}

interface UseScrollSpyOptions {
  rootMargin?: string; // default: '-20% 0px -60% 0px'
  threshold?: number | number[]; // default: [0, 0.1, 0.5, 1]
}
```

### useIntersectionObserver
```typescript
interface UseIntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean; // default: true
  onIntersect?: (entry: IntersectionObserverEntry) => void;
}

interface UseIntersectionObserverReturn {
  ref: React.RefObject<HTMLElement>;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}
```

---

## Utility Contracts (utils/)

### animations.ts
```typescript
// CSS Animation utilities — keyframe definitions and class generators
export const keyframes: {
  fadeInUp: string;
  fadeIn: string;
  slideInLeft: string;
  slideInRight: string;
  scaleIn: string;
  shimmer: string; // For skeleton loaders
};

// CSS class names for animation variants (applied via className)
export const animationClasses: {
  fadeInUp: string;
  staggerContainer: string;
  staggerItem: (index: number) => string; // Delay based on index
  slideInLeft: string;
  slideInRight: string;
  scaleIn: string;
};

// Reduced-motion helper: returns empty string if prefers-reduced-motion
export const getAnimationClass: (className: string) => string;

// IntersectionObserver hook options for scroll-triggered animations
export interface ScrollAnimationOptions {
  rootMargin?: string; // default: '0px 0px -10% 0px'
  threshold?: number;  // default: 0.1
  triggerOnce?: boolean; // default: true
}
```

### helpers.ts
```typescript
export function slugify(text: string): string;
export function truncate(text: string, maxLength: number): string;
export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string;
export function getInitials(name: string): string;
export function classNames(...classes: (string | boolean | undefined | null)[]): string;
export function getTechCategoryColor(category: TechnologyCategory): string;
export function getTechCategoryLabel(category: TechnologyCategory): string;
```

---

## Data Fetching Contracts (scripts/fetch-github.ts)

### GitHubRepo (API Response)
```typescript
interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  disabled: boolean;
  license: { key: string; name: string } | null;
}
```

### FetchConfig
```typescript
interface FetchConfig {
  username: string;
  token?: string; // From GITHUB_TOKEN env
  includeForks?: boolean; // default: false
  includeArchived?: boolean; // default: false
  minStars?: number; // default: 0
  requiredTopics?: string[]; // Filter repos with these topics
  maxRepos?: number; // default: 50
  outputPath: string; // e.g., 'src/data/projects.json'
}
```

### FetchResult
```typescript
interface FetchResult {
  success: boolean;
  projects: Project[];
  errors: string[];
  fetchedAt: string; // ISO 8601
  rateLimitRemaining: number;
}
```

---

## Page Contracts (pages/)

### Index Page
```typescript
interface IndexPageProps {
  // No props - composed from SiteConfig and fetched data
  // All data passed via component composition
}

// Page composition order:
// <Header />
// <main>
//   <Hero />
//   <About />
//   <Projects />
//   <Technologies />
//   <Contact />
// </main>
// <Footer />
```

---

## Global Types (vite-env.d.ts extensions)

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_USERNAME: string;
  readonly VITE_SITE_URL: string;
  readonly VITE_GA_ID?: string; // Future analytics
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Module declarations for assets
declare module '*.svg' {
  import React from 'react';
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.avif' {
  const src: string;
  export default src;
}
```