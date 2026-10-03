import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { Icon } from '@/components/ui/Icon';
import {
  StyledFooter,
  StyledInner,
  StyledCopyright,
  StyledSocialLinks,
} from './Footer.styles';
import { Navigation } from '@/components/layout/Navigation';
import type { NavItem } from '@/components/layout/Navigation';
import { useFooter } from './useFooter';
import type { ContactMethod } from '@/types/contact';
import type { IconName } from '@/components/ui/Icon/useIcon';

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  copyright?: string;
  socialLinks: ContactMethod[];
  navigation?: NavItem[];
  variant?: 'minimal' | 'full';
}

export const Footer = forwardRef<HTMLElement, FooterProps>(
  ({ copyright: copyrightText, socialLinks: socialLinksProp, navigation, variant = 'minimal', className, ...props }, ref) => {
    const { getCurrentYear } = useFooter();

    return (
      <StyledFooter
        ref={ref}
        $variant={variant}
        className={className}
        {...props}
      >
        <StyledInner>
          <StyledCopyright>
            © {getCurrentYear()} {copyrightText || 'Ismael Marot'}
          </StyledCopyright>

          <StyledSocialLinks aria-label="Social links">
            {socialLinksProp.map((link) => (
              <li key={link.id}>
                <a
                  href={link.type === 'email' ? `mailto:${link.value}` : link.value}
                  target={link.type !== 'email' ? '_blank' : undefined}
                  rel={link.type !== 'email' ? 'noopener noreferrer' : undefined}
                  aria-label={link.label}
                >
                  <Icon name={link.iconName as IconName} size="md" decorative />
                </a>
              </li>
            ))}
          </StyledSocialLinks>

          {navigation && navigation.length > 0 && (
            <Navigation items={navigation} variant="footer" />
          )}
        </StyledInner>
      </StyledFooter>
    );
  }
);

Footer.displayName = 'Footer';