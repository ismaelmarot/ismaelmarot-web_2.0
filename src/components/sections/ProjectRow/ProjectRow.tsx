import { Link } from 'react-router-dom';
import {
  StyledProjectRowItem,
  StyledProjectRow,
  StyledProjectRowMain,
  StyledProjectIcon,
  StyledProjectIconFallback,
  StyledProjectName,
  StyledProjectDescription,
  StyledProjectAction,
  StyledProjectCategories,
  StyledProjectCategory,
} from './ProjectRow.styles';
import { useProjectRow } from './useProjectRow';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { NO_DESCRIPTION_FALLBACK } from '@/utils/helpers';
import type { Project } from '@/types/project';

export interface ProjectRowProps {
  project: Project;
}

export const ProjectRow = ({ project }: ProjectRowProps) => {
  const { handleIconError, hasIconError } = useProjectRow(project.iconUrl);
  const showIcon = Boolean(project.iconUrl) && !hasIconError;
  const description = project.description?.trim() || NO_DESCRIPTION_FALLBACK;
  const categories = project.categories ?? [];

  return (
    <StyledProjectRowItem>
      <StyledProjectRow aria-label={`${project.name} - ${description}`}>
        <StyledProjectRowMain>
          {showIcon ? (
            <StyledProjectIcon
              src={project.iconUrl}
              alt={`${project.name} icon`}
              loading="lazy"
              decoding="async"
              onError={handleIconError}
            />
          ) : (
            <StyledProjectIconFallback data-testid="project-icon-fallback" aria-hidden="true">
              <Icon name="folder" size={24} />
            </StyledProjectIconFallback>
          )}

          <StyledProjectName as="h3">{project.name}</StyledProjectName>

          <StyledProjectAction
            as={Link}
            to={`/projects/${project.id}`}
            data-testid="project-view-action"
            aria-label={`Ver ${project.name}`}
          >
            {/* No arrow here: the control says "Ver" and the project name sits beside it, so
                the verb is what the row needs and nothing else. The accessible name stays
                "Ver <project>", which is why a screen reader still hears the destination
                rather than a bare "Ver". */}
            <span>Ver</span>
          </StyledProjectAction>
        </StyledProjectRowMain>

        <StyledProjectDescription as="p">{description}</StyledProjectDescription>

        {categories.length > 0 && (
          <StyledProjectCategories aria-label={`Categorías de ${project.name}`}>
            {categories.map((category) => (
              <StyledProjectCategory key={category}>
                <Badge variant="subtle" size="sm">
                  {category}
                </Badge>
              </StyledProjectCategory>
            ))}
          </StyledProjectCategories>
        )}
      </StyledProjectRow>
    </StyledProjectRowItem>
  );
};