import { useState, useEffect, useCallback, useRef } from 'react';
import type { RefObject } from 'react';

/** Regions that declare the header must go dark while they sit behind it. */
const DARK_REGION_SELECTOR = '[data-header-contrast="dark"]';

export function useHeader(innerRef?: RefObject<HTMLElement | null>) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const darkRegionRef = useRef<HTMLElement | null>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), []);

  useEffect(() => {
    /**
     * The header is dark while a dark region still covers it, which means while that region's
     * bottom edge sits below the header's own bottom edge.
     *
     * Deliberately not a scroll offset. The previous threshold was `scrollY > 20`, which existed when
     * the hero was white; with a 355px band a 20px threshold would turn the header white while the
     * band was still behind it. Measured thresholds are the band height less the header's 52px:
     * 303px at 1440, 248px at 1024, 160px at 390.
     *
     * The region is cached and only looked up again when it is gone, so a scroll listener is not
     * running querySelector on every frame.
     */
    const measure = () => {
      setIsScrolled(window.scrollY > 20);

      const cached = darkRegionRef.current;
      if (cached && !cached.isConnected) {
        darkRegionRef.current = null;
      }
      if (!darkRegionRef.current) {
        darkRegionRef.current = document.querySelector<HTMLElement>(DARK_REGION_SELECTOR);
      }

      const region = darkRegionRef.current;
      if (!region) {
        setOverDark(false);
        return;
      }

      const headerHeight = innerRef?.current?.offsetHeight ?? 0;
      setOverDark(region.getBoundingClientRect().bottom > headerHeight);
    };

    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    measure();

    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [innerRef]);

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

  return {
    isScrolled,
    overDark,
    menuOpen,
    setMenuOpen,
    toggleMenu,
    closeMenu,
    isCompact,
  };
}