import type { HTMLAttributes, ElementType } from 'react';
import { forwardRef } from 'react';
import { StyledCard } from './Card.styles';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  asChild?: ElementType;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hoverable = false,
      asChild,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <StyledCard
        ref={ref}
        as={asChild}
        $variant={variant}
        $padding={padding}
        $hoverable={hoverable}
        className={className}
        {...props}
      >
        {children}
      </StyledCard>
    );
  }
);

Card.displayName = 'Card';