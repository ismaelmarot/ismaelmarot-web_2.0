import { useRef, useState } from 'react';
import { ALL_PROJECTS, type Project, type ProjectCategoryFilterValue } from '@/types/project';

export interface UseProjectsReturn {
  listRef: React.RefObject<HTMLUListElement>;
  activeCategory: ProjectCategoryFilterValue;
  setActiveCategory: (category: ProjectCategoryFilterValue) => void;
  visibleProjects: Project[];
  hasNoProjectsAtAll: boolean;
  hasNoProjectsInCategory: boolean;
}

/**
 * The section's category filter and the two empty conditions.
 *
 * There is deliberately no loading or error state here, and this is the third time that has been
 * recorded rather than assumed. `specs/001` FR-015 and FR-016 asked for both. Project data is fetched
 * at build time by `npm run fetch:github` and committed as a JSON module, so by the time this hook runs
 * the projects are already in the bundle: there is no request to be loading and none to fail. The two
 * branches that rendered those states existed in this component for weeks and could not be reached.
 * `specs/001`'s Amendment 2 withdraws the two requirements; `specs/017` FR-009 removed the code.
 *
 * The empty conditions are a different matter and stay, because they are derived from the array rather
 * than from a request: an empty `projects.json`, or a category with nothing in it, both render.
 */
export function useProjects(projects: Project[] = []): UseProjectsReturn {
  const listRef = useRef<HTMLUListElement>(null!);
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
    activeCategory,
    setActiveCategory,
    visibleProjects,
    hasNoProjectsAtAll: projects.length === 0,
    hasNoProjectsInCategory:
      projects.length > 0 && visibleProjects.length === 0,
  };
}