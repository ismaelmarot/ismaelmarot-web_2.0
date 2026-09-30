import { useRef, useState, useEffect } from 'react';

export interface UseProjectsReturn {
  gridRef: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
  error: string | null;
}

export function useProjects(): UseProjectsReturn {
  const gridRef = useRef<HTMLDivElement>(null!);
  const [isLoading, setIsLoading] = useState(false);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return {
    gridRef,
    isLoading,
    error,
  };
}