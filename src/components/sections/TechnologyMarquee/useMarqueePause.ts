import { useCallback, useState } from 'react';

export interface UseMarqueePauseReturn {
  paused: boolean;
  toggle: () => void;
  /** The action the control performs, phrased for its accessible name. */
  action: string;
}

/**
 * Whether the marquee is stopped.
 *
 * WCAG 2.2.2 at level A requires a mechanism to pause content that moves by itself for longer
 * than five seconds, and failure F16 is this exact case. Reduced motion is handled in CSS and
 * covers users who have asked the operating system for less movement; this covers everyone else,
 * including someone who simply wants to read the row without it moving under their eyes.
 */
export function useMarqueePause(): UseMarqueePauseReturn {
  const [paused, setPaused] = useState(false);

  const toggle = useCallback(() => {
    setPaused((current) => !current);
  }, []);

  return {
    paused,
    toggle,
    action: paused ? 'Reanudar el carrusel de tecnologías' : 'Pausar el carrusel de tecnologías',
  };
}