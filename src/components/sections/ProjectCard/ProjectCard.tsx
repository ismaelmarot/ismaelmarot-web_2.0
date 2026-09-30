import { StyledProjectCardWrapper, StyledProjectImage, StyledProjectContent, StyledProjectName, StyledProjectDescription, StyledProjectTechStack, StyledProjectTechBadge, StyledProjectLinks, StyledProjectLink } from './ProjectCard.styles';
import { useProjectCard } from './useProjectCard';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import type { Project } from '@/types/project';

export interface ProjectCardProps {
  project: Project;
  isFeatured?: boolean;
  index?: number;
  isSkeleton?: boolean;
}

export const ProjectCard = ({
  project,
  isFeatured = false,
  index = 0,
  isSkeleton = false,
}: ProjectCardProps) => {
  const { cardRef, handleKeyDown } = useProjectCard();

  if (isSkeleton) {
    return (
      <Card variant="elevated" padding="lg" className="animate-stagger-item stagger-0">
        <div className="skeleton" style={{ height: '200px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(90deg, var(--color-bg-muted) 25%, var(--color-bg-accent) 50%, var(--color-bg-muted) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        <div style={{ marginTop: 'var(--space-4)' }}>
          <div className="skeleton" style={{ height: '32px', width: '60%', borderRadius: 'var(--radius-sm)' }} />
        </div>
        <div style={{ marginTop: 'var(--space-3)' }}>
          <div className="skeleton" style={{ height: '16px', width: '80%', borderRadius: 'var(--radius-sm)' }} />
        </div>
        <div style={{ marginTop: 'var(--space-3)' }}>
          <div className="skeleton" style={{ height: '16px', width: '50%', borderRadius: 'var(--radius-sm)' }} />
        </div>
        <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <div className="skeleton" style={{ height: '24px', width: '80px', borderRadius: 'var(--radius-full)' }} />
          <div className="skeleton" style={{ height: '24px', width: '80px', borderRadius: 'var(--radius-full)' }} />
          <div className="skeleton" style={{ height: '24px', width: '80px', borderRadius: 'var(--radius-full)' }} />
        </div>
      </Card>
    );
  }

  return (
    <StyledProjectCardWrapper
      ref={cardRef}
      $isFeatured={isFeatured}
      $index={index}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="article"
      aria-label={`${project.name} - ${project.description}`}
    >
      <Card variant="elevated" padding="none" hoverable={false}>
        <StyledProjectImage>
          {project.screenshotUrls && project.screenshotUrls.length > 0 ? (
            <img
              src={project.screenshotUrls[0]}
              alt={`Screenshot of ${project.name}`}
              loading="lazy"
            />
          ) : (
            <div className="project-placeholder">
              <Icon name="code" size={48} aria-hidden="true" />
            </div>
          )}
        </StyledProjectImage>

        <StyledProjectContent>
          <StyledProjectName as="h3">{project.name}</StyledProjectName>
          <StyledProjectDescription as="p">{project.description}</StyledProjectDescription>

          {project.technologies && project.technologies.length > 0 && (
            <StyledProjectTechStack role="list" aria-label="Technologies">
              {project.technologies.slice(0, 5).map((tech) => (
                <StyledProjectTechBadge key={tech} role="listitem">
                  <Badge variant="tech" size="sm" dotColor={getTechColor(tech)}>
                    {tech}
                  </Badge>
                </StyledProjectTechBadge>
              ))}
              {project.technologies.length > 5 && (
                <StyledProjectTechBadge>
                  <Badge variant="subtle" size="sm">+{project.technologies.length - 5} more</Badge>
                </StyledProjectTechBadge>
              )}
            </StyledProjectTechStack>
          )}

          <StyledProjectLinks>
            <StyledProjectLink
              as="a"
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.name} on GitHub (opens in new tab)`}
            >
              <Icon name="github" size={18} aria-hidden="true" />
              <span>Code</span>
            </StyledProjectLink>
            {project.demoUrl && (
<StyledProjectLink
            as="a"
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.name} demo (opens in new tab)`}
          >
            <Icon name="externalLink" size={18} aria-hidden="true" />
            <span>Demo</span>
          </StyledProjectLink>
            )}
          </StyledProjectLinks>
        </StyledProjectContent>
      </Card>
    </StyledProjectCardWrapper>
  );
};

function getTechColor(tech: string): string {
  const colors: Record<string, string> = {
    react: '#61dafb',
    typescript: '#3178c6',
    javascript: '#f7df1e',
    node: '#339933',
    python: '#3776ab',
    go: '#00add8',
    rust: '#dea584',
    docker: '#2496ed',
    kubernetes: '#326ce5',
    aws: '#ff9900',
    postgres: '#4169e1',
    mongodb: '#47a248',
    redis: '#dc382d',
    graphql: '#e10098',
    nextjs: '#000000',
    tailwind: '#06b6d4',
    vite: '#646cff',
  };
  return colors[tech.toLowerCase()] || '#0066cc';
}