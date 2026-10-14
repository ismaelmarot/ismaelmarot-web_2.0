import { useScrollToTop } from './useScrollToTop';

/**
 * Renders nothing and moves the window to the top on every path change.
 *
 * It is mounted once, by the router, so that every navigation behaves like a page load. A component
 * that renders nothing and holds no markup still needs to exist as a mount point, and this is it.
 */
export const ScrollToTop = () => {
  useScrollToTop();

  return null;
};
