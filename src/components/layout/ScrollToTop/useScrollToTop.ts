import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Puts the window back at the top when the path changes.
 *
 * A single-page app does not do this by itself: the browser keeps the scroll position it had, so a
 * visitor who reads halfway down `/projects`, opens a project and comes back lands halfway down the
 * list with no idea they had scrolled. `ScrollToTop` exists to make the router behave like a page
 * load, and this hook is its whole content.
 */
export function useScrollToTop(): void {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}