import { useState } from 'react';
import {
  StyledProjects,
  StyledProjectsSection,
  StyledProjectsContainer,
  StyledProjectsHeader,
  StyledProjectsHeadline,
  StyledProjectsFilterWrapper,
  StyledProjectsList,
  StyledProjectCard,
  StyledProjectsSkeletonCard,
  StyledProjectsDots,
  StyledProjectsEmpty,
  StyledProjectsError,
} from './Projects.styles';
import { useProjects } from './useProjects';
import { useProjectsCarousel } from './useProjectsCarousel';
import { useProjectsAutoAdvance } from './useProjectsAutoAdvance';
import { ProjectRow } from '@/components/sections/ProjectRow';
import { ProjectDots } from '@/components/sections/ProjectDots';
import { ProjectCategoryFilter } from '@/components/sections/ProjectCategoryFilter';
import { ALL_PROJECTS } from '@/types/project';
import type { Project } from '@/types/project';

export interface ProjectsProps {
  projects?: Project[];
}

export const Projects = ({ projects = [] }: ProjectsProps) => {
  const {
    isLoading,
    error,
    activeCategory,
    setActiveCategory,
    visibleProjects,
    hasNoProjectsAtAll,
    hasNoProjectsInCategory,
  } = useProjects(projects);

  const { stripRef, currentIndex, goTo, step, advance, onScroll, onKeyDown } = useProjectsCarousel({
    count: visibleProjects.length,
  });

  // Auto-advance holds still while anything in the section holds focus. Watching
  // the whole section rather than just the strip matters: a visitor who tabs to
  // the next control has focus here too, and the carousel moving out from under
  // them would be the worst version of this feature.
  const [focusInside, setFocusInside] = useState(false);
  const { playing, toggle, label: playStopLabel } = useProjectsAutoAdvance({
    onAdvance: advance,
    pausedForFocus: focusInside,
  });

  if (isLoading) {
    return (
      <StyledProjectsSection
        id="projects"
        ariaLabel="Projects"
        size="xl"
        background="muted"
        fullViewport={true}
        composition="projects"
        verticalAlign="top"
      >
        <StyledProjectsContainer size="xl" padding="lg">
          <StyledProjects>
            <StyledProjectsHeader>
              <StyledProjectsHeadline as="h2">Proyectos</StyledProjectsHeadline>
            </StyledProjectsHeader>
            <StyledProjectsList aria-hidden="true">
              {[...Array(4)].map((_, i) => (
                <StyledProjectCard key={i}>
                  <StyledProjectsSkeletonCard />
                </StyledProjectCard>
              ))}
            </StyledProjectsList>
          </StyledProjects>
        </StyledProjectsContainer>
      </StyledProjectsSection>
    );
  }

  if (error) {
    return (
      <StyledProjectsSection
        id="projects"
        ariaLabel="Projects"
        size="xl"
        background="muted"
        fullViewport={true}
        composition="projects"
        verticalAlign="center"
      >
        <StyledProjectsContainer size="xl" padding="lg">
          <StyledProjects>
            <StyledProjectsHeader>
              <StyledProjectsHeadline as="h2">Proyectos</StyledProjectsHeadline>
            </StyledProjectsHeader>
            <StyledProjectsError>
              <p>Failed to load projects. Please try again later.</p>
              <button type="button" onClick={() => window.location.reload()}>Retry</button>
            </StyledProjectsError>
          </StyledProjects>
        </StyledProjectsContainer>
      </StyledProjectsSection>
    );
  }

  return (
    <StyledProjectsSection
      id="projects"
      ariaLabel="Projects"
      size="xl"
      background="muted"
      fullViewport={true}
      composition="projects"
      verticalAlign="top"
      onFocusCapture={() => setFocusInside(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocusInside(false);
        }
      }}
    >
      <StyledProjectsContainer size="xl" padding="lg">
        <StyledProjects>
          <StyledProjectsHeader>
            <StyledProjectsHeadline as="h2">Proyectos</StyledProjectsHeadline>
          </StyledProjectsHeader>

          {!hasNoProjectsAtAll && (
            <StyledProjectsFilterWrapper>
              <ProjectCategoryFilter
                activeCategory={activeCategory}
                onSelect={setActiveCategory}
              />
            </StyledProjectsFilterWrapper>
          )}

          {hasNoProjectsAtAll ? (
            <StyledProjectsEmpty>
              <p>No projects available yet.</p>
            </StyledProjectsEmpty>
          ) : hasNoProjectsInCategory ? (
            <StyledProjectsEmpty>
              <p>
                {activeCategory === ALL_PROJECTS
                  ? 'No projects available yet.'
                  : `No projects in ${activeCategory} yet.`}
              </p>
            </StyledProjectsEmpty>
          ) : (
            <>
              {/* The strip keeps its implicit list role: giving the ul role="group"
                  overrides it, which strands the six li outside a list and fails
                  the listitem rule. The name and the focus go on the ul itself,
                  which supports both. No aria-live either, because the strip never
                  moves without the visitor moving it. */}
              <StyledProjectsList
                ref={stripRef}
                aria-label="Proyectos, desliza para ver más"
                tabIndex={0}
                onScroll={onScroll}
                onKeyDown={onKeyDown}
              >
                {visibleProjects.map((project) => (
                  <StyledProjectCard key={project.id}>
                    <ProjectRow project={project} />
                  </StyledProjectCard>
                ))}
              </StyledProjectsList>

              <StyledProjectsDots>
                <ProjectDots
                  count={visibleProjects.length}
                  currentIndex={currentIndex}
                  names={visibleProjects.map((project) => project.name)}
                  onSelect={goTo}
                  playing={playing}
                  playStopLabel={playStopLabel}
                  onTogglePlay={toggle}
                  onStep={step}
                />
              </StyledProjectsDots>
            </>
          )}
        </StyledProjects>
      </StyledProjectsContainer>
    </StyledProjectsSection>
  );
};