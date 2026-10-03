import {
  StyledProjectDots,
  StyledProjectDot,
} from './ProjectDots.styles';

export interface ProjectDotsProps {
  /** How many projects are in the strip, after filtering. */
  count: number;
  /** Index of the project currently in view. */
  currentIndex: number;
  /** Project names, used to name each dot for assistive technology. */
  names: string[];
  /** Move the strip to a project. */
  onSelect: (index: number) => void;
}

/**
 * One dot per project: the count is what tells a visitor the section holds more
 * than the single card they can see, which is otherwise indistinguishable from a
 * page with one project. Each dot is also a way in.
 */
export const ProjectDots = ({
  count,
  currentIndex,
  names,
  onSelect,
}: ProjectDotsProps) => {
  if (count === 0) return null;

  return (
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
  );
};