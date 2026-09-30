import { useMemo } from 'react';

export function useSection() {
  const helpers = useMemo(() => ({
    getId: (baseId: string) => baseId,
    getAriaLabel: (id: string, customLabel?: string) => customLabel || `Section: ${id}`,
  }), []);
  return helpers;
}