import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { Icon } from '@/components/ui/Icon';
import {
  StyledFooter,
  StyledInner,
  StyledCopyright,
  StyledSocialLinks,
  StyledNavWrapper,
} from './Footer.styles';
import { useFooter } from './useFooter';
import type { ContactMethod } from '@/types/contact';
import type { IconName } from '@/components/ui/Icon/useIcon';

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  copyright?: string;
  socialLinks: ContactMethod[];
  navigation?: { label: string; href: string }[];
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

          <StyledSocialLinks role="list" aria-label="Social links">
            {socialLinksProp.map((link) => (
              <a
                key={link.id}
                href={link.type === 'email' ? `mailto:${link.value}` : link.value}
                target={link.type !== 'email' ? '_blank' : undefined}
                rel={link.type !== 'email' ? 'noopener noreferrer' : undefined}
                aria-label={link.label}
                role="listitem"
              >
                <Icon name={link.iconName as IconName} size="md" decorative />
              </a>
            ))}
          </StyledSocialLinks>

          {navigation && navigation.length > 0 && (
            <StyledNavWrapper aria-label="Footer navigation">
              {navigation.map((item) => (
                <a key={item.href} href={item.href}>{item.label}</a>
              ))}
            </StyledNavWrapper>
          )}
        </StyledInner>
      </StyledFooter>
    );
  }
);

Footer.displayName = 'Footer';