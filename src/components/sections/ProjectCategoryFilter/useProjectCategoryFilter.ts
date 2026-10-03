import { useCallback } from 'react';
import {
  PROJECT_CATEGORY_FILTER_OPTIONS,
  ALL_PROJECTS,
  type ProjectCategoryFilterValue,
} from '@/types/project';

export interface UseProjectCategoryFilterReturn {
  options: readonly ProjectCategoryFilterValue[];
  activeCategory: ProjectCategoryFilterValue;
  isActive: (value: ProjectCategoryFilterValue) => boolean;
  selectCategory: (value: ProjectCategoryFilterValue) => void;
}

export function useProjectCategoryFilter(
  activeCategory: ProjectCategoryFilterValue,
  onSelect: (value: ProjectCategoryFilterValue) => void
): UseProjectCategoryFilterReturn {
  const isActive = useCallback(
    (value: ProjectCategoryFilterValue) => value === activeCategory,
    [activeCategory]
  );

  const selectCategory = useCallback(
    (value: ProjectCategoryFilterValue) => {
      onSelect(value);
    },
    [onSelect]
  );

  return {
    options: PROJECT_CATEGORY_FILTER_OPTIONS,
    activeCategory,
    isActive,
    selectCategory,
  };
}

export { ALL_PROJECTS };