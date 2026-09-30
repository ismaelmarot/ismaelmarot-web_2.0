import { useRef } from 'react';

export interface UseTechnologyCardReturn {
  cardRef: React.RefObject<HTMLDivElement>;
}

export function useTechnologyCard(): UseTechnologyCardReturn {
  const cardRef = useRef<HTMLDivElement>(null!);

  return {
    cardRef,
  };
}