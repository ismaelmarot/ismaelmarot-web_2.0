import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import {
  ESPACIOS,
  ESPACIOS_MOVIL,
  ESPACIOS_MOVIL_QUERY,
  FASE_MS,
  INTERVALO_MOVIL_MS,
  INTERVALO_MS,
  siguienteAsignacion,
} from './iconRotation';

export interface UseIconRotationResult {
  /** Which app each slot shows, positionally aligned with the slots. */
  asignacion: number[];
  /** How many slots the row has, which is one on a phone and six elsewhere. */
  espacios: number;
  /** 1 while the icons are visible, 0 during the first half of the fade. */
  opacidad: number;
  /** Called when the pointer enters the row, which holds the current arrangement. */
  alEntrar: () => void;
  /** Called when the pointer leaves it. */
  alSalir: () => void;
}

/**
 * Whether the row is in its one-icon layout.
 *
 * The breakpoint is the 700px that feature 011's carousel already used, deliberately reused rather than
 * re-chosen. Two widths would leave a range of viewports where one layout's styles apply while the
 * other's elements are in the document, which produces an unreachable rule rather than a visible bug.
 *
 * matchMedia rather than a resize listener because this is a question with a boolean answer, and the
 * browser answers it. The same pattern is already used for reduced motion in
 * `useProjectsAutoAdvance.ts`.
 */
function useEsMovil(): boolean {
  const [esMovil, setEsMovil] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${ESPACIOS_MOVIL_QUERY}px)`);
    setEsMovil(query.matches);
    const alCambiar = (evento: MediaQueryListEvent) => setEsMovil(evento.matches);
    query.addEventListener('change', alCambiar);
    return () => query.removeEventListener('change', alCambiar);
  }, []);

  return esMovil;
}

/**
 * The assignment of apps to slots, the interval that renews it, and everything that stops that interval.
 *
 * Kept out of the component file because the constitution requires a component's state and effects to
 * live in its own hook, and because this is the only part of the strip with timing worth reasoning about
 * without rendering it.
 */
export function useIconRotation(total: number, enPantalla: boolean): UseIconRotationResult {
  const reduceMotion = useReducedMotion();
  const esMovil = useEsMovil();

  /* One slot on a phone, six elsewhere, and never more slots than there are apps to fill them: a row of
     six slots with three apps would render three frames and leave the rest of the row empty. */
  const espacios = Math.min(esMovil ? ESPACIOS_MOVIL : ESPACIOS, total);

  const [asignacion, setAsignacion] = useState<number[]>(() =>
    total === 0 ? [] : siguienteAsignacion(total, espacios, [])
  );
  const [opacidad, setOpacidad] = useState(1);
  const [enFoco, setEnFoco] = useState(false);

  /* The pending half of a fade: the timer's id, so it can be cancelled. A ref rather than state because
     nothing about it is visible, and a `setTimeout` id is not something to re-render over. */
  const idCambio = useRef<number | null>(null);

  /* The apps change, so the first assignment has to be recomputed. Reading `siguienteAsignacion` with an
     empty previous is the same code path every later cycle uses, so the first arrangement is not a
     special case that can drift from the rest.

     `espacios` is a dependency because crossing the breakpoint changes how many slots there are, and a
     six-entry previous assignment means nothing to a single slot: the new arrangement is drawn from the
     full set rather than truncated from the old one. */
  useEffect(() => {
    setAsignacion(total === 0 ? [] : siguienteAsignacion(total, espacios, []));
  }, [total, espacios]);

  /* Two pauses are checked inside the tick rather than by subscribing to events, because a listener's
     state and the interval's state can drift apart, and a drift here means the row changes under a
     reader who asked it not to.

     `enPantalla` is read as a dependency and so is re-established when the observer reports, rather
     than being captured once: the strip's own observer is `triggerOnce`, so it reports entering and then
     stops, and a row that is never entered must not rotate at all. */
  const rotar = useCallback(() => {
    if (document.hidden || enFoco) return;

    /* Half one: fade out. The assignment is not touched yet, because changing it while the old icons
       are still visible would swap the artwork mid-fade and read as a glitch rather than a renewal. */
    setOpacidad(0);

    idCambio.current = window.setTimeout(() => {
      setAsignacion((previa) => siguienteAsignacion(total, espacios, previa));
      setOpacidad(1);
      idCambio.current = null;
    }, FASE_MS);
  }, [total, espacios, enFoco]);

  /* Four conditions stop the rotation.

     Reduced motion removes the interval entirely rather than pausing it. What a visitor with reduced
     motion gets is the six icons and no movement at all.

     `total === 1` is the arithmetic case: a derangement of one element does not exist, so there is
     nothing the row could change to and a timer would re-render the same single icon for the life of
     the page.

     The row must also be on screen. `enPantalla` comes from the strip's own observer, which is
     `triggerOnce`, so this is true from the moment the row is first seen and stays true.

     The interval is shorter on a phone, where there is one icon and nothing else to look at. `esMovil`
     is a dependency, so crossing the breakpoint rebuilds the interval with the other rhythm. That
     restart is correct rather than incidental: the interval genuinely is different on either side of
     it, and preserving the elapsed time would keep counting against the old rhythm for up to its full
     length. */
  useEffect(() => {
    if (reduceMotion || enPantalla === false || total <= 1) return;

    const id = window.setInterval(rotar, esMovil ? INTERVALO_MOVIL_MS : INTERVALO_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, enPantalla, total, rotar, esMovil]);

  /* Both timers have to be cleared with everything else, or a row that unmounts mid-fade leaves a timer
     holding state that no longer belongs to anything. The interval clears itself in the effect above;
     this is the pending half-fade, which the interval's cleanup cannot see. */
  useEffect(
    () => () => {
      if (idCambio.current !== null) window.clearTimeout(idCambio.current);
    },
    []
  );

  const alEntrar = useCallback(() => setEnFoco(true), []);
  const alSalir = useCallback(() => setEnFoco(false), []);

  return { asignacion, espacios, opacidad, alEntrar, alSalir };
}
