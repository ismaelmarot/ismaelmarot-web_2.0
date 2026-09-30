import { useMemo } from 'react';

export function useVisuallyHidden() {
  const helpers = useMemo(() => ({}), []);
  return helpers;
}