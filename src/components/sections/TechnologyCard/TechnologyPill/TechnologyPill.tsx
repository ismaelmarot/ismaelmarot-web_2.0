import { getTechnologyIconPath } from '@/data/technologies';
import {
  StyledTechnologyPill,
  StyledTechnologyIconSlot,
  StyledTechnologyIcon,
} from './TechnologyPill.styles';
import type { Technology } from '@/types/project';

export interface TechnologyPillProps {
  technology: Technology;
  /** Recorded in the DOM so a test can tell a drawn mark from an unresolved one. */
  testId?: string;
}

export function TechnologyPill({ technology, testId }: TechnologyPillProps) {
  const iconPath = getTechnologyIconPath(technology.iconSlug);

  return (
    <StyledTechnologyPill>
      <StyledTechnologyIconSlot aria-hidden={iconPath ? true : undefined}>
        {iconPath && (
          <StyledTechnologyIcon
            viewBox="0 0 24 24"
            aria-hidden="true"
            data-testid={testId ?? `brand-mark-${technology.iconSlug}`}
          >
            <path d={iconPath} />
          </StyledTechnologyIcon>
        )}
      </StyledTechnologyIconSlot>
      {technology.name}
    </StyledTechnologyPill>
  );
}