import { useMemo } from 'react';

export function useNavigation() {
  const helpers = useMemo(() => ({
    handleSmoothScroll: (href: string) => {
      if (href.startsWith('#')) {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
  }), []);
  return helpers;
}