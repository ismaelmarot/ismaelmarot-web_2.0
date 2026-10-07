import { useEffect, useRef, useState } from 'react';

export interface UseIntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean;
  onIntersect?: (entry: IntersectionObserverEntry) => void;
}

export interface UseIntersectionObserverReturn {
  ref: React.RefObject<HTMLElement>;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

export function useIntersectionObserver<T extends HTMLElement = HTMLElement>(
  options: UseIntersectionObserverOptions = {}
): { ref: React.RefObject<T>; isIntersecting: boolean; entry: IntersectionObserverEntry | null } {
  const {
    root = null,
    rootMargin = '0px 0px -10% 0px',
    threshold = 0.1,
    triggerOnce = true,
    onIntersect,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const ref = useRef<T>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    /* Where the API is missing, report the element as already in view rather than throwing.
       FR-011 of the icon strip requires it: the observer drives an entrance animation, and the
       alternative to running the observer is a section whose images never appear. jsdom has no
       IntersectionObserver, so without this every test that renders a page containing an
       observer-driven component fails on a missing global rather than on anything about itself. */
    if (typeof IntersectionObserver === 'undefined') {
      setIsIntersecting(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setEntry(entry);
        setIsIntersecting(entry.isIntersecting);

        if (entry.isIntersecting && onIntersect) {
          onIntersect(entry);
        }

        if (triggerOnce && entry.isIntersecting) {
          observerRef.current?.unobserve(element);
        }
      },
      { root, rootMargin, threshold }
    );

    observerRef.current.observe(element);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [root, rootMargin, threshold, triggerOnce, onIntersect]);

  return { ref, isIntersecting, entry };
}