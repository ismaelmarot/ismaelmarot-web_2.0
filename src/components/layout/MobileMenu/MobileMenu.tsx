import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Navigation } from '@/components/layout/Navigation';
import {
  StyledOverlay,
  StyledMobileMenu,
  StyledHeader,
  StyledCloseButton,
  StyledContent,
  StyledNav,
  StyledNavItem,
} from './MobileMenu.styles';
import { useMobileMenu } from './useMobileMenu';

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  ariaLabel?: string;
}

export interface MobileMenuProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  cta?: NavItem;
}

export const MobileMenu = forwardRef<HTMLDivElement, MobileMenuProps>(
  ({ isOpen, onClose, items, cta, className, ...props }, ref) => {
    useMobileMenu(isOpen, onClose);
    const hasCta = Boolean(cta);

    if (!isOpen) return null;

    return (
      <>
        <StyledOverlay $visible={isOpen} onClick={onClose} data-testid="overlay" aria-hidden="true" />
        <StyledMobileMenu
          ref={ref}
          $open={isOpen}
          id="mobile-menu"
          className={className}
          data-open={isOpen.toString()}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
          {...props}
        >
          <StyledHeader>
            <StyledCloseButton onClick={onClose} aria-label="Close menu" type="button">
              <Icon name="x" size="md" decorative />
            </StyledCloseButton>
          </StyledHeader>
          <StyledContent>
            <StyledNav aria-label="Mobile navigation">
              <Navigation items={items} variant="mobile" onNavigate={onClose} />
            </StyledNav>
            {hasCta && cta && (
              <StyledNavItem as={cta.external ? 'a' : 'a'} href={cta.href} onClick={onClose} target={cta.external ? '_blank' : undefined} rel={cta.external ? 'noopener noreferrer' : undefined} aria-label={cta.ariaLabel}>
                {cta.label}
              </StyledNavItem>
            )}
          </StyledContent>
        </StyledMobileMenu>
      </>
    );
  }
);

MobileMenu.displayName = 'MobileMenu';