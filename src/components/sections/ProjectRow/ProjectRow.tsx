import { Link } from 'react-router-dom';
import {
  StyledProjectRowItem,
  StyledProjectRow,
  StyledProjectRowMain,
  StyledProjectIconFrame,
  StyledProjectIcon,
  StyledProjectIconFallback,
  StyledProjectName,
  StyledProjectBody,
  StyledProjectDescription,
  StyledProjectFooter,
  StyledProjectAction,
  StyledProjectCategories,
  StyledProjectCategory,
} from './ProjectRow.styles';
import { useProjectRow } from './useProjectRow';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { formatProjectName, NO_DESCRIPTION_FALLBACK } from '@/utils/helpers';
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
          {/* The frame, not the artwork, is what rounds the icon: every icon in
              src/data/projects.json is a square canvas and one is fully opaque. */}
          <StyledProjectIconFrame data-testid="project-icon-frame">
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
                <Icon name="folder" size={32} />
              </StyledProjectIconFallback>
            )}
          </StyledProjectIconFrame>

          <StyledProjectName as="h3">{formatProjectName(project.name)}</StyledProjectName>
        </StyledProjectRowMain>

        <StyledProjectBody>
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
        </StyledProjectBody>

        <StyledProjectFooter>
          <span />
          <StyledProjectAction
            as={Link}
            to={`/projects/${project.id}`}
            data-testid="project-view-action"
            aria-label={`Ver ${project.name}`}
          >
            {/* A plus glyph, not a text label: on a card this large the pill competed
                with the project name. The accessible name stays "Ver <project>" on the
                element above, so a screen reader still hears the destination and the
                symbol is never the only name. */}
            <Icon name="plus" size={22} aria-hidden="true" />
          </StyledProjectAction>
        </StyledProjectFooter>
      </StyledProjectRow>
    </StyledProjectRowItem>
  );
};