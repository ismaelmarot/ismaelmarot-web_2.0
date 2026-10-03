import {
  StyledProjects,
  StyledProjectsHeader,
  StyledProjectsHeadline,
  StyledProjectsFilterWrapper,
  StyledProjectsList,
  StyledProjectsEmpty,
  StyledProjectsError,
} from './Projects.styles';
import { useProjects } from './useProjects';
import { ProjectRow } from '@/components/sections/ProjectRow';
import { ProjectCategoryFilter } from '@/components/sections/ProjectCategoryFilter';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { ALL_PROJECTS } from '@/types/project';
import type { Project } from '@/types/project';

export interface ProjectsProps {
  projects?: Project[];
}

export const Projects = ({ projects = [] }: ProjectsProps) => {
  const {
    listRef,
    isLoading,
    error,
    activeCategory,
    setActiveCategory,
    visibleProjects,
    hasNoProjectsAtAll,
    hasNoProjectsInCategory,
  } = useProjects(projects);

  if (isLoading) {
    return (
      <Section
        id="projects"
        ariaLabel="Projects"
        size="xl"
        background="default"
        fullViewport={true}
        composition="projects"
        verticalAlign="top"
      >
        <Container size="xl" padding="lg">
          <StyledProjects>
            <StyledProjectsHeader>
              <StyledProjectsHeadline as="h2">Proyectos</StyledProjectsHeadline>
            </StyledProjectsHeader>
            <StyledProjectsList aria-hidden="true">
              {[...Array(4)].map((_, i) => (
                <li key={i}>
                  <div style={{ height: '96px' }} />
                </li>
              ))}
            </StyledProjectsList>
          </StyledProjects>
        </Container>
      </Section>
    );
  }

  if (error) {
    return (
      <Section
        id="projects"
        ariaLabel="Projects"
        size="xl"
        background="default"
        fullViewport={true}
        composition="projects"
        verticalAlign="center"
      >
        <Container size="xl" padding="lg">
          <StyledProjects>
            <StyledProjectsHeader>
              <StyledProjectsHeadline as="h2">Proyectos</StyledProjectsHeadline>
            </StyledProjectsHeader>
            <StyledProjectsError>
              <p>Failed to load projects. Please try again later.</p>
              <button type="button" onClick={() => window.location.reload()}>Retry</button>
            </StyledProjectsError>
          </StyledProjects>
        </Container>
      </Section>
    );
  }

  return (
    <Section
      id="projects"
      ariaLabel="Projects"
      size="xl"
      background="default"
      fullViewport={true}
      composition="projects"
      verticalAlign="top"
    >
      <Container size="xl" padding="lg">
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
            <StyledProjectsList ref={listRef}>
              {visibleProjects.map((project) => (
                <ProjectRow key={project.id} project={project} />
              ))}
            </StyledProjectsList>
          )}
        </StyledProjects>
      </Container>
    </Section>
  );
};