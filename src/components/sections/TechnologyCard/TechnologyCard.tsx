import { StyledTechnologyCard } from './TechnologyCard.styles';
import { TechnologyPill } from './TechnologyPill';
import { useTechnologyCard } from './useTechnologyCard';
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

  return (
    <StyledTechnologyCard ref={cardRef} $index={index} role="listitem">
      <TechnologyPill technology={technology} />
    </StyledTechnologyCard>
  );
};

export { TechnologyPill } from './TechnologyPill';
export type { TechnologyPillProps } from './TechnologyPill';