import { useRef, useCallback } from 'react';

export interface UseProjectCardReturn {
  cardRef: React.RefObject<HTMLDivElement>;
  handleKeyDown: (event: React.KeyboardEvent) => void;
}

export function useProjectCard(): UseProjectCardReturn {
  const cardRef = useRef<HTMLDivElement>(null!);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const link = cardRef.current?.querySelector('a[href]') as HTMLAnchorElement | null;
      if (link) {
        link.click();
      }
    }
  }, []);

  return {
    cardRef,
    handleKeyDown,
  };
}