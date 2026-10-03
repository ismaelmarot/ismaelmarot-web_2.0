import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseProjectsCarouselOptions {
  /** Number of cards currently in the strip, after filtering. */
  count: number;
}

export interface UseProjectsCarouselReturn {
  /** Ref for the scrollable strip, which the dots and the keys drive. */
  stripRef: React.RefObject<HTMLUListElement>;
  /** Index of the card currently snapped into view. */
  currentIndex: number;
  /** Scroll to a card by index, clamped to the strip. */
  goTo: (index: number) => void;
  /** Move one card forward or backward, clamped at both ends. */
  step: (delta: number) => void;
  /** Move one card forward, wrapping from the last back to the first. */
  advance: () => void;
  /** Attach to the strip's onScroll. */
  onScroll: () => void;
  /** Attach to the strip's onKeyDown. */
  onKeyDown: (event: React.KeyboardEvent<HTMLUListElement>) => void;
}

/** Pixels a card is offset from the strip's own padding, used to snap-align. */
function offsetOf(element: HTMLElement | null, index: number): number {
  const card = element?.children[index] as HTMLElement | undefined;
  if (!card) return 0;
  // scrollLeft is measured from the padding edge, so the card's own offset left
  // is already in the same coordinate space. Reading it rather than multiplying
  // by an index keeps this correct when the gutter changes with the breakpoint.
  return card.offsetLeft;
}

/** How far the strip can actually scroll. */
function maxScrollOf(strip: HTMLElement | null): number {
  if (!strip) return 0;
  return Math.max(0, strip.scrollWidth - strip.clientWidth);
}

/**
 * Which card the strip is showing, found from the middle of what is visible
 * rather than from whichever card start is nearest.
 *
 * Nearest-by-offset ties on the last card and gets it wrong. The final card
 * starts at 4160px but the strip can only scroll to 3744px, so the browser clamps
 * it: the last card fills most of the view yet sits 416px from that start while
 * the previous card's tail is also 416px away, and the tie goes to the earlier
 * card. The middle of the viewport has no such ambiguity, because it can only be
 * inside one card.
 */
function indexAtCentre(strip: HTMLElement, count: number): number {
  const centre = strip.scrollLeft + strip.clientWidth / 2;

  for (let index = 0; index < count; index += 1) {
    const start = offsetOf(strip, index);
    const card = strip.children[index] as HTMLElement | undefined;
    const end = start + (card?.offsetWidth ?? 0);
    if (centre < end) return index;
  }

  return Math.max(0, count - 1);
}

/**
 * Tracks which card of a horizontal strip is in view.
 *
 * The index comes from the scroll position rather than from one observer per
 * card: the repo's `useIntersectionObserver` handles a single element, so
 * watching six cards would mean calling a hook in a loop. Reading scrollLeft is
 * also cheaper, and it is the source of truth the snap already agrees with.
 */
export function useProjectsCarousel({
  count,
}: UseProjectsCarouselOptions): UseProjectsCarouselReturn {
  const stripRef = useRef<HTMLUListElement>(null!);
  const [currentIndex, setCurrentIndex] = useState(0);
  const frameRef = useRef<number | null>(null);

  const readIndex = useCallback(() => {
    const strip = stripRef.current;
    if (!strip || count === 0) return;

    const next = indexAtCentre(strip, count);
    setCurrentIndex((previous) => (previous === next ? previous : next));
  }, [count]);

  const onScroll = useCallback(() => {
    // Scroll fires far more often than the state is worth re-rendering for, so
    // the read is collapsed into one per frame.
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      readIndex();
    });
  }, [readIndex]);

  const goTo = useCallback(
    (index: number) => {
      const strip = stripRef.current;
      if (!strip || count === 0) return;
      const clamped = Math.min(Math.max(index, 0), count - 1);
      // Clamped to what the strip can really scroll: the final card starts beyond
      // the maximum scroll position, and asking for more than exists lands the
      // strip short of it, which is how the last dot used to show the wrong card.
      const left = Math.min(offsetOf(strip, clamped), maxScrollOf(strip));
      strip.scrollTo({ left, behavior: 'smooth' });
      setCurrentIndex(clamped);
    },
    [count]
  );

  const step = useCallback(
    (delta: number) => {
      goTo(currentIndex + delta);
    },
    [goTo, currentIndex]
  );

  /**
   * One step forward, wrapping past the last project back to the first. The arrow
   * controls deliberately do not use this: stopping at the end is right for a
   * control a visitor presses, but auto-advance has to come back around or the
   * carousel would sit on the last card forever.
   */
  const advance = useCallback(() => {
    const next = currentIndex + 1;
    goTo(next > count - 1 ? 0 : next);
  }, [goTo, currentIndex, count]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLUListElement>) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        step(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        step(-1);
      }
    },
    [step]
  );

  // A narrowed list can leave the strip scrolled past its new end, which would
  // show blank space instead of a project. The strip itself is reset by
  // `useProjects`; this keeps the reported index consistent with that.
  useEffect(() => {
    setCurrentIndex((previous) => (previous > count - 1 ? 0 : previous));
  }, [count]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    []
  );

  return { stripRef, currentIndex, goTo, step, advance, onScroll, onKeyDown };
}