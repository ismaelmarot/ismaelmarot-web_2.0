import { useRef } from 'react';

export interface UseContactMethodReturn {
  methodRef: React.RefObject<HTMLDivElement>;
}

export function useContactMethod(): UseContactMethodReturn {
  const methodRef = useRef<HTMLDivElement>(null!);

  return {
    methodRef,
  };
}