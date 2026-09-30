import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import {
  StyledHeader,
  StyledInner,
  StyledBrand,
  StyledLogo,
  StyledNavWrapper,
  StyledCtaWrapper,
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
    const { isScrolled } = useHeader();

    return (
      <StyledHeader
        ref={ref}
        $sticky={sticky}
        $transparent={transparent}
        $isScrolled={isScrolled}
        className={className}
        {...props}
      >
        <StyledInner>
          <StyledBrand>
            <StyledLogo href="/" aria-label="Go to homepage">
              Ismael Marot
            </StyledLogo>
          </StyledBrand>
          <StyledNavWrapper aria-label="Main navigation">
            <Navigation items={navigation} variant="header" />
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
        </StyledInner>
      </StyledHeader>
    );
  }
);

Header.displayName = 'Header';