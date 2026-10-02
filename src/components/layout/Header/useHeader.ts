import { useState, useEffect, useCallback } from 'react';
import type { RefObject } from 'react';

export function useHeader(innerRef?: RefObject<HTMLElement | null>) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 767px)');

    const measure = () => {
      const el = innerRef?.current;
      const overflow = el ? el.scrollWidth > el.clientWidth + 1 : false;
      setIsCompact(mobile.matches || overflow);
    };

    const handleMediaChange = () => measure();
    mobile.addEventListener('change', handleMediaChange);
    window.addEventListener('resize', measure);
    measure();

    return () => {
      mobile.removeEventListener('change', handleMediaChange);
      window.removeEventListener('resize', measure);
    };
  }, [innerRef]);

  useEffect(() => {
    if (!isCompact) {
      setMenuOpen(false);
    }
  }, [isCompact]);

  return { isScrolled, menuOpen, setMenuOpen, toggleMenu, closeMenu, isCompact };
}
