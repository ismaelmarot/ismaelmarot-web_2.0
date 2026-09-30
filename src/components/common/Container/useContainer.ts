import { useMemo } from 'react';

export function useContainer() {
  const helpers = useMemo(() => ({
    getAsElement: (as?: string) => as || 'div',
  }), []);
  return helpers;
}