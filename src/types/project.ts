export type ProjectType = 'web' | 'mobile' | 'other';

/** Closed set of editorial categories curated by the portfolio owner */
export type ProjectCategory =
  | 'Social'
  | 'Navigation'
  | 'Finances'
  | 'Tools'
  | 'Work'
  | 'Education';

export type ProjectViewport = 'desktop' | 'tablet' | 'mobile';

export type ProjectPlatform = 'web' | 'mac' | 'pc';

export const PROJECT_CATEGORIES: readonly ProjectCategory[] = [
  'Social',
  'Navigation',
  'Finances',
  'Tools',
  'Work',
  'Education',
];

export const PROJECT_VIEWPORTS: readonly ProjectViewport[] = ['desktop', 'tablet', 'mobile'];

export const PROJECT_PLATFORMS: readonly ProjectPlatform[] = ['web', 'mac', 'pc'];

/** Interface languages a published app ships with */
export type ProjectLanguage = 'EN' | 'ES';

export const PROJECT_LANGUAGES: readonly ProjectLanguage[] = ['EN', 'ES'];

/**
 * Shown when a project does not declare its languages. GitHub cannot tell us this, so the
 * portfolio assumes a bilingual app rather than leaving the pair empty.
 */
export const DEFAULT_APP_LANGUAGES: ProjectLanguage[] = ['EN', 'ES'];

/** "All" is a filter state, never a stored category */
export const ALL_PROJECTS = 'All';

export type ProjectCategoryFilterValue = typeof ALL_PROJECTS | ProjectCategory;

export const PROJECT_CATEGORY_FILTER_OPTIONS: readonly ProjectCategoryFilterValue[] = [
  ALL_PROJECTS,
  ...PROJECT_CATEGORIES,
];

export interface ProjectEditorialMetadata {
  categories: ProjectCategory[];
  viewports: ProjectViewport[];
  platforms: ProjectPlatform[];
  /** Absent means "unknown", which the detail page renders as the default pair */
  languages?: ProjectLanguage[];
}

export interface ProjectVersion {
  version: string;
  date?: string;
  url: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  primaryLanguage?: string;
  technologies: string[];
  githubUrl: string;
  demoUrl?: string;
  screenshotUrls: string[];
  stars?: number;
  forks?: number;
  lastUpdated: string;
  /** Repository size in kilobytes */
  sizeKb?: number;
  /** Size in bytes of the newest published downloadable file, when there is one */
  appSizeBytes?: number;
  /** Page listing the published downloads, when the project publishes any */
  downloadUrl?: string;
  /** Published versions, newest first */
  versions?: ProjectVersion[];
  displayOrder?: number;
  iconUrl?: string;
  projectType?: ProjectType;
  categories?: ProjectCategory[];
  viewports?: ProjectViewport[];
  platforms?: ProjectPlatform[];
  languages?: ProjectLanguage[];
}

export interface Technology {
  id: string;
  name: string;
  category: TechnologyCategory;
  proficiency?: ProficiencyLevel;
  yearsExperience?: number;
  iconName?: string;
  /**
   * Key into the brand marks in src/data/technologies.ts. Kept as a slug rather than a colour
   * on purpose: the official brand hexes are chosen to be recognisable, not legible, and nine
   * of them measure under 3:1 on the chip, which would leave the JavaScript and Vitest marks
   * effectively invisible. The icons render in the interface's ink instead.
   */
  iconSlug?: string;
  color?: string;
  displayOrder?: number;
}

export type TechnologyCategory =
  | 'language'
  | 'framework'
  | 'tool'
  | 'database'
  | 'cloud'
  | 'testing'
  | 'other';

export type ProficiencyLevel = 'expert' | 'advanced' | 'intermediate' | 'learning';

export function getTechnologyCategoryLabel(category: TechnologyCategory): string {
  const labels: Record<TechnologyCategory, string> = {
    language: 'Languages',
    framework: 'Frameworks',
    tool: 'Tools',
    database: 'Databases',
    cloud: 'Cloud & DevOps',
    testing: 'Testing',
    other: 'Other',
  };
  return labels[category] || category;
}

export function getTechnologyCategoryColor(category: TechnologyCategory): string {
  const colors: Record<TechnologyCategory, string> = {
    language: '#3178c6',
    framework: '#e34c26',
    tool: '#f0db4f',
    database: '#336791',
    cloud: '#ff9900',
    testing: '#c21325',
    other: '#6e6e73',
  };
  return colors[category] || '#6e6e73';
}

export function sortProjectsByDisplayOrder(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    const orderA = a.displayOrder ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.displayOrder ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
  });
}


export function groupTechnologiesByCategory(
  technologies: Technology[]
): Record<TechnologyCategory, Technology[]> {
  const grouped: Partial<Record<TechnologyCategory, Technology[]>> = {};
  for (const tech of technologies) {
    if (!grouped[tech.category]) {
      grouped[tech.category] = [];
    }
    grouped[tech.category]!.push(tech);
  }
  return grouped as Record<TechnologyCategory, Technology[]>;
}