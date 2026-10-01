import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { StyledSection } from './Section.styles';
import { useSection } from './useSection';

export type SectionComposition = 'default' | 'hero' | 'about' | 'projects' | 'technologies' | 'contact' | 'centered';
export type SectionBackground = 'default' | 'muted' | 'accent';
export type SectionVerticalAlign = 'top' | 'center' | 'bottom' | 'space-between';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  id: string;
  ariaLabel?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  background?: SectionBackground;
  fullViewport?: boolean;
  composition?: SectionComposition;
  verticalAlign?: SectionVerticalAlign;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({
    id,
    ariaLabel,
    size = 'lg',
    background = 'default',
    fullViewport = true,
    composition = 'default',
    verticalAlign = 'center',
    className,
    children,
    ...props
  }, ref) => {
    const { getAriaLabel } = useSection();

    return (
      <StyledSection
        ref={ref}
        id={id}
        aria-label={getAriaLabel(id, ariaLabel)}
        $size={size}
        $background={background}
        $fullViewport={fullViewport}
        $composition={composition}
        $verticalAlign={verticalAlign}
        className={className}
        {...props}
      >
        {children}
      </StyledSection>
    );
  }
);

Section.displayName = 'Section';