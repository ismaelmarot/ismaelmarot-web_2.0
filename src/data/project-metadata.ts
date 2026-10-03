import {
  PROJECT_CATEGORIES,
  PROJECT_LANGUAGES,
  PROJECT_VIEWPORTS,
  PROJECT_PLATFORMS,
  DEFAULT_APP_LANGUAGES,
  type Project,
  type ProjectCategory,
  type ProjectEditorialMetadata,
  type ProjectLanguage,
  type ProjectPlatform,
  type ProjectViewport,
} from '@/types/project';

/**
 * Editorial metadata curated by the portfolio owner, keyed by the exact
 * repository name on GitHub. Add an entry here when a new app is published in
 * the profile README.
 *
 * The typed values below are validated at build time; the resolver still
 * filters against the canonical sets so a retired value degrades to "no
 * category" instead of hiding the project.
 */
export const projectEditorialMetadata: Record<string, ProjectEditorialMetadata> = {
  trash2treasure: {
    categories: ['Social', 'Navigation'],
    viewports: ['desktop', 'tablet', 'mobile'],
    platforms: ['web'],
  },
  'car-expense-tracker': {
    categories: ['Finances', 'Tools', 'Work'],
    viewports: ['desktop'],
    platforms: ['mac', 'pc'],
  },
  LinkIO: {
    categories: ['Tools', 'Work'],
    viewports: ['desktop'],
    platforms: ['mac', 'pc'],
  },
  QEntry: {
    categories: ['Tools', 'Work'],
    viewports: ['desktop'],
    platforms: ['mac', 'pc'],
  },
  NauticAcademy: {
    categories: ['Education'],
    viewports: ['desktop', 'tablet', 'mobile'],
    platforms: ['web'],
  },
  'cash-counter': {
    categories: ['Tools', 'Work'],
    viewports: ['desktop', 'tablet', 'mobile'],
    platforms: ['web'],
  },
};

const findKey = (repoName: string): string | undefined =>
  Object.keys(projectEditorialMetadata).find(
    (key) => key.toLowerCase() === repoName.toLowerCase()
  );

function keepValid<T extends string>(values: string[] | undefined, allowed: readonly T[]): T[] {
  return (values ?? []).filter((value): value is T =>
    (allowed as readonly string[]).includes(value)
  );
}

export function getEditorialMetadata(repoName: string): ProjectEditorialMetadata | undefined {
  const key = findKey(repoName);
  if (!key) return undefined;

  const metadata = projectEditorialMetadata[key];
  return {
    categories: keepValid<ProjectCategory>(metadata.categories, PROJECT_CATEGORIES),
    viewports: keepValid<ProjectViewport>(metadata.viewports, PROJECT_VIEWPORTS),
    platforms: keepValid<ProjectPlatform>(metadata.platforms, PROJECT_PLATFORMS),
    languages: keepValid<ProjectLanguage>(metadata.languages, PROJECT_LANGUAGES),
  };
}

/**
 * Attaches the curated metadata to a project. A project without metadata is
 * returned unchanged so it is never removed from the complete list.
 */
export function withEditorialMetadata(project: Project): Project {
  const metadata = getEditorialMetadata(project.name);

  // A project without an entry is returned with the fields it already had, so it is never
  // dropped from the list. Only the languages get a default, since GitHub has no way to
  // report which languages an app ships with.
  if (!metadata) {
    return { ...project, languages: project.languages ?? DEFAULT_APP_LANGUAGES };
  }

  return {
    ...project,
    categories: metadata.categories,
    viewports: metadata.viewports,
    platforms: metadata.platforms,
    languages: metadata.languages?.length ? metadata.languages : DEFAULT_APP_LANGUAGES,
  };
}