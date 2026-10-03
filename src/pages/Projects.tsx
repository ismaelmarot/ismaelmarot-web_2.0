import { Projects } from '@/components/sections/Projects';
import projectsData from '@/data/projects.json';
import { withEditorialMetadata } from '@/data/project-metadata';
import { sortProjectsByDisplayOrder } from '@/types/project';
import type { Project } from '@/types/project';

export const ProjectsPage = () => {
  const projects = sortProjectsByDisplayOrder(projectsData as Project[]).map(
    withEditorialMetadata
  );

  return <Projects projects={projects} />;
};