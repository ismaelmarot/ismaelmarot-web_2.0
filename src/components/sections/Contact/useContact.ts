import { useRef } from 'react';

export interface UseContactReturn {
  methodsRef: React.RefObject<HTMLDivElement>;
}

export function useContact(): UseContactReturn {
  const methodsRef = useRef<HTMLDivElement>(null!);

  return {
    methodsRef,
  };
}