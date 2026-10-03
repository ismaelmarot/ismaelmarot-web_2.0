import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { StyledNav, StyledNavItem } from './Navigation.styles';

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  ariaLabel?: string;
  /**
   * Require the whole URL to match. Defaults to true for "/" so the home item is not
   * reported as current on every route, which is what NavLink does without it.
   */
  end?: boolean;
}

export interface NavigationProps extends HTMLAttributes<HTMLElement> {
  items: NavItem[];
  variant?: 'header' | 'mobile' | 'footer';
  onNavigate?: () => void;
}

export const Navigation = forwardRef<HTMLElement, NavigationProps>(
  ({ items, variant = 'header', onNavigate, className, ...props }, ref) => {
    const { pathname } = useLocation();

    const handleItemClick = (item: NavItem) => {
      onNavigate?.();

      // Clicking the link of the route you are already on does not change the
      // pathname, so ScrollToTop never fires. Scroll back up manually.
      if (!item.external && item.href === pathname) {
        window.scrollTo(0, 0);
      }
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
            as={item.external ? 'a' : NavLink}
            to={item.external ? undefined : item.href}
            href={item.external ? item.href : undefined}
            $variant={variant}
            end={item.external ? undefined : (item.end ?? item.href === '/')}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            aria-label={item.ariaLabel}
            onClick={() => handleItemClick(item)}
          >
            {item.label}
          </StyledNavItem>
        ))}
      </StyledNav>
    );
  }
);

Navigation.displayName = 'Navigation';
