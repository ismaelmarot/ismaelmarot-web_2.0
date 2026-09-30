import { useRef } from 'react';

export interface UseHeroReturn {
  ctaRef: React.RefObject<HTMLAnchorElement>;
  secondaryCtaRef: React.RefObject<HTMLAnchorElement>;
}

export function useHero(): UseHeroReturn {
  const ctaRef = useRef<HTMLAnchorElement>(null!);
  const secondaryCtaRef = useRef<HTMLAnchorElement>(null!);

  return {
    ctaRef,
    secondaryCtaRef,
  };
}