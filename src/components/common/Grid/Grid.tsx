import type { HTMLAttributes, CSSProperties } from 'react';
import { forwardRef } from 'react';
import { StyledGrid } from './Grid.styles';
import { useGrid } from './useGrid';

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4 | { base: number; md: number; lg: number; xl: number };
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around';
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ columns = 1, gap = 'md', alignItems: alignItemsProp = 'stretch', justifyContent: justifyContentProp = 'start', className, children, ...props }, ref) => {
    const { getResponsiveColumns } = useGrid();

    const style = typeof columns === 'object'
      ? getResponsiveColumns(columns) as CSSProperties
      : undefined;

    return (
      <StyledGrid
        ref={ref}
        $columns={columns}
        $gap={gap}
        $alignItems={alignItemsProp}
        $justifyContent={justifyContentProp}
        className={className}
        style={style}
        {...props}
      >
        {children}
      </StyledGrid>
    );
  }
);

Grid.displayName = 'Grid';