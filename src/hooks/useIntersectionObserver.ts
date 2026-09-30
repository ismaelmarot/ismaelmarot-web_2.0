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

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const {
    root = null,
    rootMargin = '0px 0px -10% 0px',
    threshold = 0.1,
    triggerOnce = true,
    onIntersect,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const ref = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

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