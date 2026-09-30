import { useRef } from 'react';

export interface UseTechnologiesReturn {
  categoriesRef: React.RefObject<HTMLDivElement>;
}

export function useTechnologies(): UseTechnologiesReturn {
  const categoriesRef = useRef<HTMLDivElement>(null!);

  return {
    categoriesRef,
  };
}