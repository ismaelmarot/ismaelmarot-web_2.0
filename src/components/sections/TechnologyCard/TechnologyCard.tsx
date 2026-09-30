import { StyledTechnologyCard, StyledTechnologyIcon, StyledTechnologyName, StyledTechnologyMeta } from './TechnologyCard.styles';
import { useTechnologyCard } from './useTechnologyCard';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import type { Technology } from '@/types/project';
import type { IconName } from '@/components/ui/Icon';

export interface TechnologyCardProps {
  technology: Technology;
  index?: number;
}

export const TechnologyCard = ({
  technology,
  index = 0,
}: TechnologyCardProps) => {
  const { cardRef } = useTechnologyCard();

  const iconName = (technology.iconName || 'code') as IconName;

  return (
    <StyledTechnologyCard ref={cardRef} $index={index} role="listitem">
      <StyledTechnologyIcon aria-hidden="true">
        <Icon name={iconName} size={28} />
      </StyledTechnologyIcon>
      <StyledTechnologyName>{technology.name}</StyledTechnologyName>
      {technology.proficiency && (
        <StyledTechnologyMeta>
          <Badge variant="subtle" size="sm">
            {technology.proficiency}
          </Badge>
          {technology.yearsExperience && (
            <Badge variant="subtle" size="sm">
              {technology.yearsExperience} yr{technology.yearsExperience > 1 ? 's' : ''}
            </Badge>
          )}
        </StyledTechnologyMeta>
      )}
    </StyledTechnologyCard>
  );
};