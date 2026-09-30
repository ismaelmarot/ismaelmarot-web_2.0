import { useMemo } from 'react';

export function useFooter() {
  const helpers = useMemo(() => ({
    getCurrentYear: () => new Date().getFullYear(),
  }), []);
  return helpers;
}