import { useMemo } from 'react';

export function useSkipLink() {
  const helpers = useMemo(() => ({
    scrollToSection: (targetId: string) => {
      const element = document.getElementById(targetId);
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },
  }), []);
  return helpers;
}