import { useRef } from 'react';

export interface UseAboutReturn {
  contentRef: React.RefObject<HTMLDivElement>;
}

export function useAbout(): UseAboutReturn {
  const contentRef = useRef<HTMLDivElement>(null!);

  return {
    contentRef,
  };
}