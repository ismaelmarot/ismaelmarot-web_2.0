import type React from 'react';
import type { NavItem } from '@/contracts/components';

export interface LayoutProps {
  children: React.ReactNode;
}

export interface PageProps {
  title?: string;
  description?: string;
}

export interface SectionSummaryProps {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  featuredItems?: React.ReactNode;
  background?: 'default' | 'muted';
}

export interface ScrollToTopProps {
  behavior?: 'auto' | 'smooth';
}

export interface NotFoundPageProps {
  message?: string;
  homeHref?: string;
}

export interface NavigationConfig {
  items: NavItem[];
  cta?: NavItem;
}

export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  children?: RouteConfig[];
  index?: boolean;
}
