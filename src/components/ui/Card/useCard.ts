import { useMemo } from 'react';

export function useCard() {
  const helpers = useMemo(() => ({
    getInteractiveStyles: (isHoverable: boolean) => ({
      cursor: isHoverable ? 'pointer' : 'default',
    }),
  }), []);
  return helpers;
}