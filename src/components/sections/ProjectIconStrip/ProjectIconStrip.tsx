import { useState } from 'react';
import projectsData from '@/data/projects.json';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import {
  StyledIconStrip,
  StyledIconStripRow,
  StyledIconFrame,
  StyledIconImage,
  StyledIconFallback,
} from './ProjectIconStrip.styles';
import { useIconRotation } from './useIconRotation';
import type { Project } from '@/types/project';

export interface ProjectIconStripProps {
  /** Overridable so the component can be driven from a test fixture. */
  projects?: Project[];
}

/**
 * The six project apps, as icons, on the landing page.
 *
 * This is a preview and shares nothing with the carousel on /projects except the frame: no autoplay,
 * no index, no dots, no keyboard handling. It reaches the page through the `featuredItems` prop that
 * SectionSummary already has, so the shared component is untouched.
 *
 * The entrance is driven by the observer rather than by mount, because a visitor who never scrolls
 * should not be shown an animation, and one who scrolls back should not be shown it again. Where the
 * API is missing the icons simply start visible, because the alternative is a section with no icons in
 * it at all.
 */
export const ProjectIconStrip = ({
  projects = projectsData as Project[],
}: ProjectIconStripProps) => {
  const reduceMotion = useReducedMotion();
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({ triggerOnce: true });
  // A failed icon falls back in place rather than collapsing its frame, so the row keeps
  // its shape and nothing shifts when the six images resolve at different speeds.
  const [fallos, setFallos] = useState<Record<string, boolean>>({});

  // A project with no iconUrl still gets its frame, so a missing asset does not shift the row.
  const animating = !reduceMotion && isIntersecting;

  /* Fixed slots and an assignment of apps to them. The slots are what get rendered and they never move
     or reorder; only the assignment changes, so the icon in a slot is replaced rather than the row being
     permuted.

     That is the whole reason for the indirection. Permuting the array instead would change `$index` from
     a slot index to an app index, and `$index` is what the entrance's 60ms stagger is built from, which
     feature 011's SC-005 measures.

     The slot count comes from the hook because it depends on the viewport: one on a phone, six
     elsewhere. The component does not need to know that, and reading it from one place means the number
     of frames and the styles that hide them change at the same breakpoint. */
  const { asignacion, espacios, opacidad, alEntrar, alSalir } = useIconRotation(
    projects.length,
    isIntersecting
  );

  if (projects.length === 0) return null;

  /* role="list" rather than a bare div with an aria-label, which is a mistake this project made
     once already: aria-label is prohibited on a plain div, so the name would be dropped and a
     screen reader would meet six images with no indication of what they were. The frames carry
     role="listitem", so the row is a list of six things rather than six images in a div. */
  return (
    <StyledIconStrip
      ref={ref}
      role="list"
      aria-label="Iconos de los proyectos"
      onMouseEnter={alEntrar}
      onMouseLeave={alSalir}
      onFocusCapture={alEntrar}
      onBlurCapture={alSalir}
    >
      <StyledIconStripRow data-testid="project-icon-row">
        {asignacion.slice(0, espacios).map((indiceApp, index) => {
          const project = projects[indiceApp];
          if (!project) return null;
          /* Keyed by slot, not by app: the app in a slot is what changes, and a key that followed the
             app would make React tear down and rebuild the frame on every rotation. The frame has to
             survive so its `src` is updated in place and the row never reflows. */
          const fallo = fallos[project.id];
          return (
            <StyledIconFrame
              key={index}
              role="listitem"
              $index={index}
              $animate={animating}
              $opacidad={opacidad}
              data-testid="project-icon-frame"
            >
              {project.iconUrl && !fallo ? (
                <StyledIconImage
                  src={project.iconUrl}
                  alt={`Icono de ${project.name}`}
                  loading="lazy"
                  decoding="async"
                  onError={() => setFallos((f) => ({ ...f, [project.id]: true }))}
                />
              ) : (
                <StyledIconFallback aria-hidden="true" data-testid="project-icon-fallback" />
              )}
            </StyledIconFrame>
          );
        })}
      </StyledIconStripRow>
    </StyledIconStrip>
  );
};
