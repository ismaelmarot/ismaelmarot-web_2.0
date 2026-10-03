import {
  StyledMarquee,
  StyledMarqueeHeader,
  StyledMarqueeToggle,
  StyledMarqueeRow,
  StyledMarqueeTrack,
  StyledMarqueeGroup,
  StyledMarqueeLabel,
} from './TechnologyMarquee.styles';
import { useMarqueePause } from './useMarqueePause';
import { TechnologyPill } from '@/components/sections/TechnologyCard';
import { getPopulatedCategories } from '@/data/technologies';
import type { Technology } from '@/types/project';

export interface TechnologyMarqueeProps {
  technologies?: Technology[];
}

interface CategoryGroupProps {
  label: string;
  technologies: Technology[];
  /**
   * Marks the second copy of the row. It is what closes the loop, and it is hidden from
   * assistive technology so the list is announced once rather than twice.
   */
  hidden: boolean;
  idPrefix: string;
}

function CategoryGroup({ label, technologies, hidden, idPrefix }: CategoryGroupProps) {
  return (
    <StyledMarqueeGroup
      aria-hidden={hidden || undefined}
      data-testid={hidden ? 'marquee-group-copy' : 'marquee-group'}
    >
      <StyledMarqueeLabel>{label}</StyledMarqueeLabel>
      {technologies.map((technology) => (
        <TechnologyPill
          key={`${idPrefix}-${technology.id}`}
          technology={technology}
          testId={hidden ? undefined : `marquee-mark-${technology.id}`}
        />
      ))}
    </StyledMarqueeGroup>
  );
}

/**
 * Two rows of the technology list, scrolling in opposite directions.
 *
 * Each row carries two copies of the whole list, so the shared keyframe's -50% travels exactly
 * one copy and the loop closes with no seam. One copy is already wider than the container allows,
 * so the visible window cannot run out of content at any viewport, and no measurement is needed.
 *
 * Both rows carry identical content, which is what keeps them travelling at the same speed: same
 * track width, same duration, same keyframes, the second row running them in reverse.
 */
export const TechnologyMarquee = ({ technologies }: TechnologyMarqueeProps) => {
  const { paused, toggle, action } = useMarqueePause();
  const groups = getPopulatedCategories(technologies);

  if (groups.length === 0) return null;

  return (
    <StyledMarquee>
      <StyledMarqueeHeader>
        {/* One control for both rows, as W3C recommends when a page has several moving elements.
            The name states the action rather than using aria-pressed, because a toggle button
            whose label changes with its state reads two contradictory things at once. */}
        <StyledMarqueeToggle onClick={toggle} aria-label={action}>
          {paused ? 'Reanudar' : 'Pausar'}
        </StyledMarqueeToggle>
      </StyledMarqueeHeader>

      <StyledMarqueeRow
        $paused={paused}
        role="group"
        aria-label="Tecnologías, fila superior"
        data-marquee-row="top"
        data-marquee-direction="forward"
      >
        <StyledMarqueeTrack data-testid="marquee-track">
          {groups.map((group) => (
            <CategoryGroup key={`top-${group.category}`} {...group} hidden={false} idPrefix="top" />
          ))}
          {groups.map((group) => (
            <CategoryGroup key={`top-copy-${group.category}`} {...group} hidden idPrefix="top-copy" />
          ))}
        </StyledMarqueeTrack>
      </StyledMarqueeRow>

      <StyledMarqueeRow
        $reverse
        $paused={paused}
        role="group"
        aria-label="Tecnologías, fila inferior"
        data-marquee-row="bottom"
        data-marquee-direction="reverse"
      >
        <StyledMarqueeTrack data-testid="marquee-track">
          {groups.map((group) => (
            <CategoryGroup key={`bottom-${group.category}`} {...group} hidden={false} idPrefix="bottom" />
          ))}
          {groups.map((group) => (
            <CategoryGroup key={`bottom-copy-${group.category}`} {...group} hidden idPrefix="bottom-copy" />
          ))}
        </StyledMarqueeTrack>
      </StyledMarqueeRow>
    </StyledMarquee>
  );
};