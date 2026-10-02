import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { StyledNav, StyledNavItem } from './Navigation.styles';
import { useNavigation } from './useNavigation';

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  ariaLabel?: string;
}

export interface NavigationProps extends HTMLAttributes<HTMLElement> {
  items: NavItem[];
  variant?: 'header' | 'mobile' | 'footer';
  activeSection?: string;
  onNavigate?: (href: string) => void;
}

export const Navigation = forwardRef<HTMLElement, NavigationProps>(
  ({ items, variant = 'header', activeSection, onNavigate, className, ...props }, ref) => {
    const { handleSmoothScroll } = useNavigation();

    const handleClick = (href: string, external?: boolean) => {
      if (!external && href.startsWith('#')) {
        handleSmoothScroll(href);
      }
      onNavigate?.(href);
    };

    return (
      <StyledNav
        ref={ref}
        $variant={variant}
        className={className}
        aria-label={variant === 'header' ? 'Main navigation' : variant === 'mobile' ? 'Mobile navigation' : 'Footer navigation'}
        {...props}
      >
        {items.map((item) => (
          <StyledNavItem
            key={item.href}
            href={item.href}
            $variant={variant}
            $active={item.href === activeSection}
            aria-current={item.href === activeSection ? 'page' : undefined}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            aria-label={item.ariaLabel}
            onClick={(e) => {
              if (!item.external && item.href.startsWith('#')) {
                e.preventDefault();
                handleClick(item.href, item.external);
              }
            }}
          >
            {item.label}
          </StyledNavItem>
        ))}
      </StyledNav>
    );
  }
);

Navigation.displayName = 'Navigation';