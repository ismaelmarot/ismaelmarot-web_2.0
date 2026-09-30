import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { StyledVisuallyHidden } from './VisuallyHidden.styles';

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ children, ...props }, ref) => {
    return (
      <StyledVisuallyHidden
        ref={ref}
        {...props}
      >
        {children}
      </StyledVisuallyHidden>
    );
  }
);

VisuallyHidden.displayName = 'VisuallyHidden';