import { useRef, useState } from 'react';
import { ALL_PROJECTS, type Project, type ProjectCategoryFilterValue } from '@/types/project';

export interface UseProjectsReturn {
  listRef: React.RefObject<HTMLUListElement>;
  isLoading: boolean;
  error: string | null;
  activeCategory: ProjectCategoryFilterValue;
  setActiveCategory: (category: ProjectCategoryFilterValue) => void;
  visibleProjects: Project[];
  hasNoProjectsAtAll: boolean;
  hasNoProjectsInCategory: boolean;
}

export function useProjects(projects: Project[] = []): UseProjectsReturn {
  const listRef = useRef<HTMLUListElement>(null!);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<ProjectCategoryFilterValue>(
    ALL_PROJECTS
  );

  // Filtering keeps the published order untouched: every project appears in the
  // same position regardless of the selected category.
  const visibleProjects =
    activeCategory === ALL_PROJECTS
      ? projects
      : projects.filter((project) => project.categories?.includes(activeCategory));

  return {
    listRef,
    isLoading,
    error,
    activeCategory,
    setActiveCategory,
    visibleProjects,
    hasNoProjectsAtAll: projects.length === 0,
    hasNoProjectsInCategory:
      projects.length > 0 && visibleProjects.length === 0,
  };
}