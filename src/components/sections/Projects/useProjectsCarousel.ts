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

    const scroll = strip.scrollLeft;
    let closest = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    for (let index = 0; index < count; index += 1) {
      const distance = Math.abs(offsetOf(strip, index) - scroll);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = index;
      }
    }

    setCurrentIndex((previous) => (previous === closest ? previous : closest));
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
      const next = Math.min(Math.max(index, 0), count - 1);
      strip.scrollTo({ left: offsetOf(strip, next), behavior: 'smooth' });
      setCurrentIndex(next);
    },
    [count]
  );

  const step = useCallback(
    (delta: number) => {
      goTo(currentIndex + delta);
    },
    [goTo, currentIndex]
  );

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

  return { stripRef, currentIndex, goTo, step, onScroll, onKeyDown };
}