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
  isFeatured?: boolean;
  displayOrder?: number;
}

export interface Technology {
  id: string;
  name: string;
  category: TechnologyCategory;
  proficiency?: ProficiencyLevel;
  yearsExperience?: number;
  iconName?: string;
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

export function filterFeaturedProjects(projects: Project[]): Project[] {
  return projects.filter((p) => p.isFeatured);
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