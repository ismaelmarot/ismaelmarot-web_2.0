import { useCallback, useState } from 'react';

/**
 * Holds which screenshot the full screen viewer is showing.
 *
 * A null index means the viewer is closed, which keeps "closed" a single source of truth
 * instead of a boolean that could disagree with the index.
 *
 * Unlike the inline carousel, which stops at its ends and disables a control, this one
 * wraps: a full screen viewer is a browsing context, and a control that goes dead at the
 * last image reads as a broken control rather than as the end of the set.
 */
export function useGalleryViewer(total: number) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const isOpen = activeIndex !== null;

  const open = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const close = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showNext = useCallback(() => {
    setActiveIndex((current) => (current === null ? current : (current + 1) % total));
  }, [total]);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => (current === null ? current : (current - 1 + total) % total));
  }, [total]);

  return { activeIndex, isOpen, open, close, showNext, showPrevious };
}