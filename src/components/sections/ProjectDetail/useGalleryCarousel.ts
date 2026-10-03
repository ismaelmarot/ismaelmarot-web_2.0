import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Drives the horizontal screenshot carousel.
 *
 * A scroll container hides its scroll position, so the controls cannot know whether they
 * have anywhere left to go. This watches the scroll offset and the element size, which is
 * what lets each button disable itself at its end instead of scrolling into a dead stop.
 */
export function useGalleryCarousel(itemCount: number) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // The 1px tolerance absorbs sub-pixel scroll offsets so a control does not stay
    // enabled while the track is already parked at its end.
    const max = el.scrollWidth - el.clientWidth;
    setCanScrollPrev(el.scrollLeft > 1);
    setCanScrollNext(el.scrollLeft < max - 1);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    sync();
    el.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);

    return () => {
      el.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [sync, itemCount]);

  const scrollByItem = useCallback((direction: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;

    // Stepping by one screenshot rather than by most of a viewport: on a wide screen a
    // viewport sized jump overshoots the few hundred pixels that are actually left and
    // lands on the last screenshot, and it would skip over images without showing them.
    const first = el.firstElementChild;
    const itemWidth = first instanceof HTMLElement ? first.getBoundingClientRect().width : 0;
    const gap = Number.parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = itemWidth + gap > 0 ? itemWidth + gap : el.clientWidth * 0.8;

    // No behavior passed on purpose: it comes from the CSS scroll-behavior, which is
    // already switched off under prefers-reduced-motion.
    el.scrollBy({ left: direction * step });
  }, []);

  return { trackRef, canScrollPrev, canScrollNext, scrollByItem, refreshControls: sync };
}