import { useMemo } from 'react';

export function useBadge() {
  const styles = useMemo(() => ({
    getDotStyle: (color?: string) => (color ? { '--badge-dot-color': color } : {}),
  }), []);
  return styles;
}