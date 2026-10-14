import { ProjectDetail } from '@/components/sections/ProjectDetail';
import { NotFoundPage } from '@/pages/NotFound';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { useProjectDetailPage } from './useProjectDetailPage';

export const ProjectDetailPage = () => {
  const { project, shareUrl } = useProjectDetailPage();

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