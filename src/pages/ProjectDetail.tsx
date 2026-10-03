import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProjectDetail } from '@/components/sections/ProjectDetail';
import { NotFoundPage } from '@/pages/NotFound';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import projectsData from '@/data/projects.json';
import { withEditorialMetadata } from '@/data/project-metadata';
import { sortProjectsByDisplayOrder } from '@/types/project';
import type { Project } from '@/types/project';

const projects = sortProjectsByDisplayOrder(projectsData as Project[]).map(
  withEditorialMetadata
);

export const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') setShareUrl(window.location.href);
  }, []);

  const project = projects.find((item) => item.id === id);

  if (!project) {
    return <NotFoundPage />;
  }

  return (
    <Section
      id="project-detail"
      ariaLabel={`${project.name} detail`}
      size="xl"
      background="default"
      fullViewport={false}
      composition="default"
      verticalAlign="top"
    >
      <Container size="xl" padding="lg">
        <ProjectDetail project={project} shareUrl={shareUrl} />
      </Container>
    </Section>
  );
};