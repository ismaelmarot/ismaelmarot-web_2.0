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

  if (projects.length === 0) return null;

  /* role="list" rather than a bare div with an aria-label, which is a mistake this project made
     once already: aria-label is prohibited on a plain div, so the name would be dropped and a
     screen reader would meet six images with no indication of what they were. The frames carry
     role="listitem", so the row is a list of six things rather than six images in a div. */
  return (
    <StyledIconStrip ref={ref} role="list" aria-label="Iconos de los proyectos">
      <StyledIconStripRow data-testid="project-icon-row">
        {projects.map((project, index) => {
          const fallo = fallos[project.id];
          return (
            <StyledIconFrame
              key={project.id}
              role="listitem"
              $index={index}
              $animate={animating}
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
