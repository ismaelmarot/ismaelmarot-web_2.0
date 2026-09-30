import { useMemo } from 'react';

export function useGrid() {
  const helpers = useMemo(() => ({
    getResponsiveColumns: (columns: { base: number; md: number; lg: number; xl: number }) => ({
      '--grid-cols-md': `repeat(${columns.md}, 1fr)`,
      '--grid-cols-lg': `repeat(${columns.lg}, 1fr)`,
      '--grid-cols-xl': `repeat(${columns.xl}, 1fr)`,
    }),
  }), []);
  return helpers;
}