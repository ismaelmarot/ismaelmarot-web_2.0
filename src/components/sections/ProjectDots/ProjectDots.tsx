import {
  StyledProjectControls,
  StyledProjectDots,
  StyledProjectDot,
  StyledProjectDotGroup,
  StyledProjectControl,
} from './ProjectDots.styles';
import { Icon } from '@/components/ui/Icon';

export interface ProjectDotsProps {
  /** How many projects are in the strip, after filtering. */
  count: number;
  /** Index of the project currently in view. */
  currentIndex: number;
  /** Project names, used to name each dot for assistive technology. */
  names: string[];
  /** Move the strip to a project. */
  onSelect: (index: number) => void;
  /** Whether the carousel is advancing by itself. */
  playing?: boolean;
  /** Name for the play/stop control, stating the action it performs. */
  playStopLabel?: string;
  /** Stop or start the auto-advance. */
  onTogglePlay?: () => void;
  /** Move one project backward or forward. */
  onStep?: (delta: number) => void;
}

/**
 * The carousel's controls: a play/stop toggle, previous and next, and one dot per
 * project. The count is what tells a visitor the section holds more than the
 * single card they can see, which is otherwise indistinguishable from a page with
 * one project.
 *
 * The toggle is named for the action it performs rather than carrying
 * `aria-pressed`, matching the marquee's control: the glyph already states the
 * current state, and a pressed toggle would say "Pausar, pressed" while playing.
 */
export const ProjectDots = ({
  count,
  currentIndex,
  names,
  onSelect,
  playing = false,
  playStopLabel,
  onTogglePlay,
  onStep,
}: ProjectDotsProps) => {
  if (count === 0) return null;

  return (
    <StyledProjectControls>
      {onTogglePlay && (
        <StyledProjectControl
          type="button"
          aria-label={playStopLabel}
          onClick={onTogglePlay}
          data-testid="carousel-play-toggle"
        >
          <Icon name={playing ? 'pause' : 'play'} size={16} aria-hidden="true" />
        </StyledProjectControl>
      )}

      {onStep && (
        <StyledProjectDotGroup>
          <StyledProjectControl
            type="button"
            aria-label="Proyecto anterior"
            onClick={() => onStep(-1)}
            data-testid="carousel-previous"
          >
            <Icon name="chevronLeft" size={18} aria-hidden="true" />
          </StyledProjectControl>
          <StyledProjectControl
            type="button"
            aria-label="Proyecto siguiente"
            onClick={() => onStep(1)}
            data-testid="carousel-next"
          >
            <Icon name="chevronRight" size={18} aria-hidden="true" />
          </StyledProjectControl>
        </StyledProjectDotGroup>
      )}

      {/* Only li children: a div inside this ul would take the list's semantics away
          from its children, which axe reports as a list with invalid children. */}
      <StyledProjectDots>
        {Array.from({ length: count }, (_, index) => {
          const name = names[index] ?? '';
          return (
            <li key={name || index}>
              <StyledProjectDot
                type="button"
                aria-current={index === currentIndex}
                aria-label={`Proyecto ${index + 1} de ${count}${name ? `: ${name}` : ''}`}
                onClick={() => onSelect(index)}
              />
            </li>
          );
        })}
      </StyledProjectDots>
    </StyledProjectControls>
  );
};