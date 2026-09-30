import { StyledProjects, StyledProjectsHeader, StyledProjectsHeadline, StyledProjectsGrid, StyledProjectsEmpty, StyledProjectsError } from './Projects.styles';
import { useProjects } from './useProjects';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import type { Project } from '@/types/project';

export interface ProjectsProps {
  projects?: Project[];
  featuredProjectIds?: string[];
}

export const Projects = ({
  projects = [],
  featuredProjectIds = [],
}: ProjectsProps) => {
  const { gridRef, isLoading, error } = useProjects();

  if (isLoading) {
    return (
      <Section
        id="projects"
        ariaLabel="Projects"
        size="xl"
        background="default"
        fullViewport={true}
        composition="content"
        verticalAlign="top"
      >
        <Container size="xl" padding="lg">
          <StyledProjects>
            <StyledProjectsHeader>
              <StyledProjectsHeadline as="h2">Proyectos</StyledProjectsHeadline>
            </StyledProjectsHeader>
            <StyledProjectsGrid ref={gridRef} role="list" aria-label="Projects loading">
              {[...Array(6)].map((_, i) => (
                <ProjectCard key={i} project={{ id: `skeleton-${i}`, name: '', description: '', technologies: [], githubUrl: '', lastUpdated: '', screenshotUrls: [] }} isSkeleton />
              ))}
            </StyledProjectsGrid>
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
        composition="content"
        verticalAlign="center"
      >
        <Container size="xl" padding="lg">
          <StyledProjects>
            <StyledProjectsHeader>
              <StyledProjectsHeadline as="h2">Proyectos</StyledProjectsHeadline>
            </StyledProjectsHeader>
            <StyledProjectsError>
              <p>Failed to load projects. Please try again later.</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </StyledProjectsError>
          </StyledProjects>
        </Container>
      </Section>
    );
  }

  const featuredProjects = projects.filter(p => featuredProjectIds.includes(p.id));
  const regularProjects = projects.filter(p => !featuredProjectIds.includes(p.id));
  const displayProjects = [...featuredProjects, ...regularProjects];

  return (
    <Section
      id="projects"
      ariaLabel="Projects"
      size="xl"
      background="default"
      fullViewport={true}
      composition="content"
      verticalAlign="top"
    >
      <Container size="xl" padding="lg">
        <StyledProjects ref={gridRef}>
          <StyledProjectsHeader>
            <StyledProjectsHeadline as="h2">Proyectos</StyledProjectsHeadline>
          </StyledProjectsHeader>

          {displayProjects.length === 0 ? (
            <StyledProjectsEmpty>
              <p>No projects available yet.</p>
            </StyledProjectsEmpty>
          ) : (
            <StyledProjectsGrid role="list" aria-label="Projects">
              {displayProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isFeatured={featuredProjectIds.includes(project.id)}
                  index={index}
                />
              ))}
            </StyledProjectsGrid>
          )}
        </StyledProjects>
      </Container>
    </Section>
  );
};