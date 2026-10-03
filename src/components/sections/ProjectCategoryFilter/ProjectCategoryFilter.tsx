import {
  StyledProjectCategoryFilter,
  StyledProjectCategoryOption,
} from './ProjectCategoryFilter.styles';
import { useProjectCategoryFilter } from './useProjectCategoryFilter';
import type { ProjectCategoryFilterValue } from '@/types/project';

export interface ProjectCategoryFilterProps {
  activeCategory: ProjectCategoryFilterValue;
  onSelect: (value: ProjectCategoryFilterValue) => void;
}

export const ProjectCategoryFilter = ({
  activeCategory,
  onSelect,
}: ProjectCategoryFilterProps) => {
  const { options, isActive, selectCategory } = useProjectCategoryFilter(
    activeCategory,
    onSelect
  );

  return (
    <StyledProjectCategoryFilter role="group" aria-label="Filtrar proyectos por categoría">
      {options.map((option) => {
        const active = isActive(option);
        return (
          <StyledProjectCategoryOption
            key={option}
            type="button"
            $active={active}
            aria-pressed={active}
            onClick={() => selectCategory(option)}
          >
            {option}
          </StyledProjectCategoryOption>
        );
      })}
    </StyledProjectCategoryFilter>
  );
};