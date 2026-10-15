import { useEffect } from 'react';

/**
 * specs/023-home-scroll-snap.
 *
 * `scroll-snap-type` belongs to the scroll container, and on this site that is `<html>`. Nothing else
 * scrolls the page vertically, so this is the only declaration that has to be scoped: a type set on
 * `<html>` applies to every route, including `/projects`, whose carousel is already `x mandatory` and
 * whose vertical rhythm nobody asked to change.
 *
 * The snap targets are a different problem and do not need this. `scroll-snap-align` goes on the bands,
 * and `Hero`, `SectionSummary` and `ContactBand` render on the landing page and nowhere else, so their
 * declarations are inert everywhere else without a condition. That asymmetry is why this is one hook and
 * not a context, a store or a wrapper.
 *
 * `proximity` rather than `mandatory`, per the specification. It offers a resting place without removing
 * the others: a hard flick still crosses several bands, find-on-page and hash links still land where they
 * were aimed, and the 182px footer — not a snap point — is reachable rather than being pulled back out to
 * the last band.
 *
 * The attribute is removed on unmount, which is the part that has to be right. A leaked
 * `data-scroll-snap` on `<html>` would silently snap every route visited afterwards, and nothing on the
 * landing page would report it.
 */
export function useScrollSnap(enabled: boolean): void {
  useEffect(() => {
    const root = document.documentElement;

    if (!enabled) return;

    root.dataset.scrollSnap = 'y';
    return () => {
      delete root.dataset.scrollSnap;
    };
  }, [enabled]);
}