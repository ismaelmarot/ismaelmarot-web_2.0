import { useCallback, useEffect, useMemo, useState } from 'react';
import projectsData from '@/data/projects.json';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import {
  StyledShowcase,
  StyledShowcaseGrid,
  StyledScene,
  StyledStage,
  StyledBackdrop,
  StyledStack,
  StyledBackPanel,
  StyledFrontPanel,
  StyledScreenImage,
  StyledScreenFallback,
  StyledCaption,
  StyledSceneName,
  StyledSceneDescription,
} from './ProjectShowcase.styles';
import { COLUMNAS, INTERVALO_MS, projectIndexes } from './showcaseRotation';
import { accentDeProyecto } from './showcaseScenes';
import type { Project } from '@/types/project';

export interface ProjectShowcaseProps {
  /** Overridable so the component can be driven from a test fixture. */
  projects?: Project[];
}

/**
 * The projects presented as floating 3D scenes on a coloured backdrop.
 *
 * The screenshots already exist in `projects.json` and were used nowhere on the landing page. This is the
 * same content the icon row above gestures at, at a size where it can be read.
 *
 * The rotation lives in `showcaseRotation.ts` as a pure function driven by an explicit counter, so the
 * property that matters, that no project repeats in a column on consecutive cycles, is asserted without a
 * timer.
 */
export const ProjectShowcase = ({ projects = projectsData as Project[] }: ProjectShowcaseProps) => {
  const reduceMotion = useReducedMotion();
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({ triggerOnce: true });
  const [ciclo, setCiclo] = useState(0);
  const [fallos, setFallos] = useState<Record<string, boolean>>({});
  const [enFoco, setEnFoco] = useState(false);

  const columnas = useMemo(
    () => Math.min(COLUMNAS, projects.length),
    [projects.length]
  );

  const visibles = useMemo(
    () => projectIndexes(ciclo, projects.length),
    [ciclo, projects.length]
  );

  // The entrance is one thing for the whole grid rather than per scene, so a scene that changes on the
  // next cycle does not re-run its own animation when the new project arrives.
  const visible = isIntersecting && !reduceMotion;

  const alEntrar = useCallback(() => setEnFoco(true), []);
  const alSalir = useCallback(() => setEnFoco(false), []);

  useEffect(() => {
    // Reduced motion means no rotation at all, and neither means a timer that would elapse while nobody is
    // looking: a visitor who returns finds four different projects and has missed two. Hover and focus also
    // hold it, which is what lets someone read a name and description before it changes.
    if (reduceMotion || projects.length <= columnas) return;

    const id = window.setInterval(() => {
      if (document.hidden || enFoco) return;
      setCiclo((actual) => actual + 1);
    }, INTERVALO_MS);

    return () => window.clearInterval(id);
  }, [reduceMotion, projects.length, columnas, enFoco]);

  if (projects.length === 0) return null;

  return (
    <StyledShowcase
      ref={ref}
      data-testid="project-showcase"
      onMouseEnter={alEntrar}
      onMouseLeave={alSalir}
      onFocusCapture={alEntrar}
      onBlurCapture={alSalir}
    >
      <StyledShowcaseGrid data-testid="showcase-grid">
        {visibles.slice(0, columnas).map((indice, columna) => {
          const project = projects[indice];
          if (!project) return null;
          const captura = project.screenshotUrls?.[0];
          const fallo = fallos[project.id];
          const accent = accentDeProyecto(project.id);

          return (
            <StyledScene
              key={project.id}
              $indice={columna}
              $visible={visible}
              data-testid="showcase-scene"
            >
              <StyledStage data-testid="showcase-stage">
                <StyledBackdrop $accent={accent} data-testid="showcase-backdrop" aria-hidden="true" />
                <StyledStack data-testid="showcase-stack">
                  <StyledBackPanel $accent={accent} data-testid="showcase-back-panel" aria-hidden="true" />
                  <StyledFrontPanel data-testid="showcase-front-panel">
                    {captura && !fallo ? (
                      <StyledScreenImage
                        src={captura}
                        alt={`Captura de ${project.name}`}
                        loading="lazy"
                        decoding="async"
                        onError={() => setFallos((f) => ({ ...f, [project.id]: true }))}
                      />
                    ) : (
                      <StyledScreenFallback aria-hidden="true" />
                    )}
                  </StyledFrontPanel>
                </StyledStack>
              </StyledStage>
              <StyledCaption>
                <StyledSceneName>{project.name}</StyledSceneName>
                <StyledSceneDescription>{project.description ?? ''}</StyledSceneDescription>
              </StyledCaption>
            </StyledScene>
          );
        })}
      </StyledShowcaseGrid>
    </StyledShowcase>
  );
};