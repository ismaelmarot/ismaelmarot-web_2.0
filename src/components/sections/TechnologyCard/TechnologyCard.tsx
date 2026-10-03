import {
  StyledTechnologyCard,
  StyledTechnologyIcon,
  StyledTechnologyIconSlot,
} from './TechnologyCard.styles';
import { useTechnologyCard } from './useTechnologyCard';
import { getTechnologyIconPath } from '@/data/technologies';
import type { Technology } from '@/types/project';

export interface TechnologyCardProps {
  technology: Technology;
  index?: number;
}

export const TechnologyCard = ({
  technology,
  index = 0,
}: TechnologyCardProps) => {
  const { cardRef } = useTechnologyCard();
  const iconPath = getTechnologyIconPath(technology.iconSlug);

  return (
    <StyledTechnologyCard ref={cardRef} $index={index} role="listitem">
      {/* Decorative: the name is already the accessible text, so announcing the mark too would
          make a screen reader read "TypeScript TypeScript". */}
      {/* The slot is reserved whether or not a mark resolved, so the text starts at the same
          offset in every chip and a row never looks like it has a gap in it. */}
      <StyledTechnologyIconSlot aria-hidden={iconPath ? true : undefined}>
        {iconPath && (
          <StyledTechnologyIcon
            viewBox="0 0 24 24"
            aria-hidden="true"
            data-testid={`brand-mark-${technology.iconSlug}`}
          >
            <path d={iconPath} />
          </StyledTechnologyIcon>
        )}
      </StyledTechnologyIconSlot>
      {technology.name}
    </StyledTechnologyCard>
  );
};
