import type { HTMLAttributes, CSSProperties } from 'react';
import { forwardRef } from 'react';
import { StyledBadge, StyledDot } from './Badge.styles';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'subtle' | 'tech';
  size?: 'sm' | 'md';
  dotColor?: string;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      dotColor,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <StyledBadge
        ref={ref}
        $variant={variant}
        $size={size}
        className={className}
        style={dotColor ? { '--badge-dot-color': dotColor } as CSSProperties : undefined}
        {...props}
      >
        {dotColor && <StyledDot aria-hidden="true" />}
        {children}
      </StyledBadge>
    );
  }
);

Badge.displayName = 'Badge';