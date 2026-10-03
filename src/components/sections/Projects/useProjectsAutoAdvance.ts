import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseProjectsAutoAdvanceOptions {
  /** Advances the strip by one project. */
  onAdvance: () => void;
  /** Milliseconds between advances. */
  intervalMs?: number;
  /**
   * Whether any control in the section currently holds focus. The carousel holds
   * still while a visitor is on the controls, so it does not move out from under
   * someone stepping through with the keyboard.
   */
  pausedForFocus?: boolean;
}

export interface UseProjectsAutoAdvanceReturn {
  playing: boolean;
  toggle: () => void;
  /** Name for the control, stating the action it performs. */
  label: string;
}

const DEFAULT_INTERVAL_MS = 7000;

/**
 * Drives the strip's auto-advance.
 *
 * One timer exists at a time by construction: `playing` is the only input to the
 * effect, and the effect's cleanup clears the interval. A toggle that started and
 * stopped quickly cannot leave a second interval behind, because a stopped state
 * never enters the branch that creates one.
 *
 * Under `prefers-reduced-motion` the carousel does not advance at all. Disabling
 * only the scroll animation would leave the card changing every seven seconds,
 * which is the same motion more slowly rather than reduced motion.
 */
export function useProjectsAutoAdvance({
  onAdvance,
  intervalMs = DEFAULT_INTERVAL_MS,
  pausedForFocus = false,
}: UseProjectsAutoAdvanceOptions): UseProjectsAutoAdvanceReturn {
  const [playing, setPlaying] = useState(true);
  const [documentHidden, setDocumentHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const advanceRef = useRef(onAdvance);

  // Keep the latest callback without making it a dependency, so a caller that
  // rebuilds its handlers on every render does not restart the interval each time.
  useEffect(() => {
    advanceRef.current = onAdvance;
  }, [onAdvance]);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => setDocumentHidden(document.visibilityState === 'hidden');
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  const running = playing && !pausedForFocus && !documentHidden && !reducedMotion;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => advanceRef.current(), intervalMs);
    return () => window.clearInterval(timer);
  }, [running, intervalMs]);

  const toggle = useCallback(() => setPlaying((previous) => !previous), []);

  // What the control reports, which is not simply what was asked for. Reduced
  // motion is permanent, so the carousel will never move and the toggle must not
  // show a stop glyph for something that will never stop because it never starts.
  // The focus and hidden-tab pauses are deliberately not folded in: they lift on
  // their own, so the carousel is still playing and saying otherwise would
  // misrepresent a control that is only briefly held.
  const reported = playing && !reducedMotion;

  return { playing: reported, toggle, label: reported ? 'Pausar' : 'Reproducir' };
}