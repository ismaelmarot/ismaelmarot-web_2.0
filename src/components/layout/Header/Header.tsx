import type { HTMLAttributes } from 'react';
import { forwardRef, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Navigation } from '@/components/layout/Navigation';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Icon } from '@/components/ui/Icon';
import {
  StyledHeader,
  StyledInner,
  StyledBrand,
  StyledLogo,
  StyledNavWrapper,
  StyledCtaWrapper,
  StyledMenuButton,
} from './Header.styles';
import { useHeader } from './useHeader';

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  ariaLabel?: string;
}

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  navigation: NavItem[];
  cta?: NavItem;
  sticky?: boolean;
  transparent?: boolean;
}

export const Header = forwardRef<HTMLElement, HeaderProps>(
  ({ navigation, cta, sticky = true, transparent = true, className, ...props }, ref) => {
    const innerRef = useRef<HTMLDivElement>(null);
    const { isScrolled, menuOpen, toggleMenu, closeMenu, isCompact } =
      useHeader(innerRef);

    return (
      <StyledHeader
        ref={ref}
        $sticky={sticky}
        $transparent={transparent}
        $isScrolled={isScrolled}
        className={className}
        {...props}
      >
        <StyledInner ref={innerRef}>
          <StyledBrand>
            <StyledLogo href="/" aria-label="Go to homepage">
              Ismael Marot
            </StyledLogo>
          </StyledBrand>
          {!isCompact ? (
            <StyledNavWrapper>
              <Navigation
                items={navigation}
                variant="header"
                onNavigate={closeMenu}
              />
              {cta && (
                <StyledCtaWrapper>
                  <a
                    href={cta.href}
                    className={cta.external ? 'external' : ''}
                    target={cta.external ? '_blank' : undefined}
                    rel={cta.external ? 'noopener noreferrer' : undefined}
                    aria-label={cta.ariaLabel}
                  >
                    {cta.label}
                  </a>
                </StyledCtaWrapper>
              )}
            </StyledNavWrapper>
          ) : (
            <StyledMenuButton
              type="button"
              onClick={toggleMenu}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <Icon name={menuOpen ? 'x' : 'menu'} size="md" decorative />
            </StyledMenuButton>
          )}
        </StyledInner>
        {createPortal(
          <MobileMenu
            isOpen={menuOpen}
            onClose={closeMenu}
            items={navigation}
            cta={cta}
          />,
          document.body
        )}
      </StyledHeader>
    );
  }
);

Header.displayName = 'Header';
