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
  /** The header's dark treatment. The menu is portaled to document.body, so it cannot inherit the
   * header's custom properties and has to be told which theme it is under. */
  overDark: boolean;
}

export const MobileMenu = forwardRef<HTMLDivElement, MobileMenuProps>(
  ({ isOpen, onClose, items, cta, overDark, className, ...props }, ref) => {
    useMobileMenu(isOpen, onClose);
    const hasCta = Boolean(cta);

    if (!isOpen) return null;

    return (
      <>
        <StyledOverlay $visible={isOpen} onClick={onClose} data-testid="overlay" aria-hidden="true" />
        <StyledMobileMenu
          ref={ref}
          $open={isOpen}
          $overDark={overDark}
          id="mobile-menu"
          className={className}
          data-open={isOpen.toString()}
role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
            /* specs/026, SC-005. Sin esto, useMobileMenu.ts:15 llama focus() sobre el panel y no hace
               nada: un elemento sin tabindex no es enfocable por script. El foco se quedaba en el
               botón del header, que queda detrás del overlay, y el primer Tab se salía del menú en
               lugar de entrar por el botón de cerrar. -1 lo hace enfocable por script sin agregarlo al
               orden de tabulación, que es exactamente lo que un contenedor de diálogo necesita. */
            tabIndex={-1}
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