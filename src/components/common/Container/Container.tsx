import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { StyledContainer } from './Container.styles';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = 'lg', padding = 'md', className, children, ...props }, ref) => {
    return (
      <StyledContainer
        ref={ref}
        $size={size}
        $padding={padding}
        className={className}
        {...props}
      >
        {children}
      </StyledContainer>
    );
  }
);

Container.displayName = 'Container';