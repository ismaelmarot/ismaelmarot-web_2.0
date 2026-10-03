import type React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  'aria-label'?: string;
  decorative?: boolean;
}

export type IconName =
  | 'mail'
  | 'github'
  | 'linkedin'
  | 'twitter'
  | 'globe'
  | 'link'
  | 'sun'
  | 'moon'
  | 'menu'
  | 'x'
  | 'chevronDown'
  | 'chevronRight'
  | 'externalLink'
  | 'arrowRight'
  | 'code'
  | 'check'
  | 'star'
  | 'folder'
  | 'file';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  asChild?: boolean;
}

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'body' | 'lead' | 'small' | 'muted' | 'code';
  as?: 'p' | 'span' | 'div' | 'article' | 'section';
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'subtle' | 'tech';
  size?: 'sm' | 'md';
  dotColor?: string;
}

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  asChild?: boolean;
}

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  ariaLabel?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'default' | 'muted' | 'accent' | 'gradient';
}

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: 'div' | 'main' | 'section' | 'article';
}

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4 | { base: number; md: number; lg: number; xl: number };
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around';
}

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'vertical' | 'horizontal';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
  divider?: React.ReactNode;
}

export interface VisuallyHiddenProps {
  children: React.ReactNode;
  as?: 'span' | 'div';
}

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  ariaLabel?: string;
}

export interface HeaderProps {
  logo?: React.ReactNode;
  navigation: NavItem[];
  cta?: NavItem;
  sticky?: boolean;
  transparent?: boolean;
}

export interface FooterProps {
  copyright: string;
  socialLinks: ContactMethod[];
  navigation?: NavItem[];
  variant?: 'minimal' | 'full';
}

export interface NavigationProps {
  items: NavItem[];
  variant?: 'header' | 'mobile' | 'footer';
  activeSection?: string;
  onNavigate?: (href: string) => void;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  cta?: NavItem;
}

export interface SkipLinkProps {
  targets: string[];
}

export interface HeroProps {
  name: string;
  title: string;
  tagline: string;
  cta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  background?: 'gradient' | 'pattern' | 'none';
  animationVariant?: 'fade-up' | 'stagger' | 'minimal';
}

export interface AboutProps {
  content: string;
  image?: {
    src: string;
    alt: string;
  };
  stats?: StatItem[];
  layout?: 'text-left' | 'text-right' | 'centered';
}

export interface StatItem {
  label: string;
  value: string | number;
  description?: string;
}

export interface ProjectsProps {
  projects: Project[];
  viewMode?: 'grid' | 'masonry' | 'carousel';
  showFilters?: boolean;
  emptyState?: {
    title: string;
    description: string;
    action?: { label: string; onClick: () => void };
  };
  loadingState?: {
    skeletonCount: number;
  };
  errorState?: {
    title: string;
    description: string;
    retryAction: { label: string; onClick: () => void };
  };
}

export interface ProjectCardProps {
  project: Project;
  variant?: 'default' | 'featured' | 'compact';
  onClick?: (project: Project) => void;
  showScreenshot?: boolean;
  maxDescriptionLines?: number;
}

export interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
  onNavigate?: (href: string, external?: boolean) => void;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  primaryLanguage?: string;
  technologies: string[];
  githubUrl: string;
  demoUrl?: string;
  screenshotUrls: string[];
  stars?: number;
  forks?: number;
  lastUpdated: string;
  displayOrder?: number;
  languages?: ('EN' | 'ES')[];
}

export interface TechnologiesProps {
  technologies: Technology[];
  groupByCategory?: boolean;
  showProficiency?: boolean;
  showYearsExperience?: boolean;
  layout?: 'grid' | 'cloud' | 'list';
  filterable?: boolean;
  onFilterChange?: (techIds: string[]) => void;
}

export interface TechnologyCardProps {
  technology: Technology;
  variant?: 'default' | 'compact' | 'detailed';
  isSelected?: boolean;
  onClick?: (tech: Technology) => void;
}

export interface TechnologyCategoryProps {
  category: TechnologyCategory;
  technologies: Technology[];
  title?: string;
}

export interface Technology {
  id: string;
  name: string;
  category: TechnologyCategory;
  proficiency?: ProficiencyLevel;
  yearsExperience?: number;
  iconName?: string;
  color?: string;
  displayOrder?: number;
}

export type TechnologyCategory =
  | 'language'
  | 'framework'
  | 'tool'
  | 'database'
  | 'cloud'
  | 'testing'
  | 'other';

export type ProficiencyLevel = 'expert' | 'advanced' | 'intermediate' | 'learning';

export interface ContactProps {
  methods: ContactMethod[];
  introText?: string;
  formEndpoint?: string;
  layout?: 'grid' | 'list' | 'cards';
}

export interface ContactMethodProps {
  method: ContactMethod;
  variant?: 'default' | 'icon-only' | 'detailed';
  onClick?: (method: ContactMethod) => void;
}

export interface ContactMethod {
  id: string;
  type: ContactType;
  label: string;
  value: string;
  iconName: string;
  displayOrder?: number;
  isPrimary?: boolean;
}

export type ContactType =
  | 'email'
  | 'github'
  | 'linkedin'
  | 'twitter'
  | 'website'
  | 'other';

export interface UseReducedMotionReturn {
  prefersReducedMotion: boolean;
}

export interface UseScrollSpyReturn {
  activeSection: string | null;
}

export interface UseScrollSpyOptions {
  rootMargin?: string;
  threshold?: number | number[];
}

export interface UseIntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean;
  onIntersect?: (entry: IntersectionObserverEntry) => void;
}

export interface UseIntersectionObserverReturn {
  ref: React.RefObject<HTMLElement>;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}