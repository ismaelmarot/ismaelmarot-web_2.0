import {
  siCss,
  siDocker,
  siEslint,
  siFigma,
  siGit,
  siGithubactions,
  siHtml5,
  siJavascript,
  siJest,
  siMongodb,
  siNetlify,
  siNextdotjs,
  siNpm,
  siPostgresql,
  siPrettier,
  siReact,
  siReactrouter,
  siStyledcomponents,
  siSupabase,
  siTypescript,
  siVercel,
  siVite,
  siVitest,
} from 'simple-icons';
import type { Technology, TechnologyCategory } from '../types/project';

/**
 * The official brand marks, imported one by one from the package root.
 *
 * Named imports are what make this cheap: pulling the whole library in costs 5.3 MB, while
 * these 23 come out at roughly 25 KB, because every icon is a long SVG path. The
 * `simple-icons/icons` subpath would be marginally tidier but is deprecated and goes away in
 * v17, so the root is used deliberately. The package is CC0-1.0, carries no dependencies of
 * its own and declares `sideEffects: false`, which is what lets the bundler drop the rest.
 */
const iconPaths: Record<string, string> = {
  typescript: siTypescript.path,
  javascript: siJavascript.path,
  html: siHtml5.path,
  css: siCss.path,
  postgresql: siPostgresql.path,
  react: siReact.path,
  next: siNextdotjs.path,
  vite: siVite.path,
  'styled-components': siStyledcomponents.path,
  git: siGit.path,
  'github-actions': siGithubactions.path,
  npm: siNpm.path,
  eslint: siEslint.path,
  prettier: siPrettier.path,
  figma: siFigma.path,
  supabase: siSupabase.path,
  mongodb: siMongodb.path,
  vercel: siVercel.path,
  netlify: siNetlify.path,
  docker: siDocker.path,
  vitest: siVitest.path,
  jest: siJest.path,
  'react-router': siReactrouter.path,
};

/**
 * The SVG path for a technology, or undefined when the slug is unknown.
 *
 * Undefined rather than a throw or a guess: a chip with no icon is a small gap, whereas a
 * crash on a typo in a data file takes the whole section down. `simple-icons` has no AWS mark
 * (Amazon asked for it to be removed) and no Playwright mark, which is why neither appears in
 * the list below rather than shipping an approximation of someone else's logo.
 */
export function getTechnologyIconPath(slug?: string): string | undefined {
  return slug ? iconPaths[slug] : undefined;
}

/**
 * What the site claims to work with, grouped for the technologies section.
 *
 * Curated by hand rather than derived from the projects: `projects.json` is published by the
 * profile README and currently names only TypeScript for all six repos, which would render a
 * section with a single chip. This is the list of what the portfolio actually represents, so
 * it is edited on purpose like the project metadata.
 */
export const technologies: Technology[] = [
  // Languages
  { id: 'typescript', name: 'TypeScript', category: 'language', iconSlug: 'typescript' },
  { id: 'javascript', name: 'JavaScript', category: 'language', iconSlug: 'javascript' },
  { id: 'html', name: 'HTML', category: 'language', iconSlug: 'html' },
  { id: 'css', name: 'CSS', category: 'language', iconSlug: 'css' },

  // Frameworks
  { id: 'react', name: 'React', category: 'framework', iconSlug: 'react' },
  { id: 'next', name: 'Next.js', category: 'framework', iconSlug: 'next' },
  { id: 'vite', name: 'Vite', category: 'framework', iconSlug: 'vite' },
  {
    id: 'styled-components',
    name: 'styled-components',
    category: 'framework',
    iconSlug: 'styled-components',
  },
  { id: 'react-router', name: 'React Router', category: 'framework', iconSlug: 'react-router' },

  // Tools
  { id: 'git', name: 'Git', category: 'tool', iconSlug: 'git' },
  { id: 'github-actions', name: 'GitHub Actions', category: 'tool', iconSlug: 'github-actions' },
  { id: 'npm', name: 'npm', category: 'tool', iconSlug: 'npm' },
  { id: 'eslint', name: 'ESLint', category: 'tool', iconSlug: 'eslint' },
  { id: 'prettier', name: 'Prettier', category: 'tool', iconSlug: 'prettier' },
  { id: 'figma', name: 'Figma', category: 'tool', iconSlug: 'figma' },

  // Databases
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', iconSlug: 'postgresql' },
  { id: 'supabase', name: 'Supabase', category: 'database', iconSlug: 'supabase' },
  { id: 'mongodb', name: 'MongoDB', category: 'database', iconSlug: 'mongodb' },

  // Cloud & DevOps
  { id: 'vercel', name: 'Vercel', category: 'cloud', iconSlug: 'vercel' },
  { id: 'netlify', name: 'Netlify', category: 'cloud', iconSlug: 'netlify' },
  { id: 'docker', name: 'Docker', category: 'cloud', iconSlug: 'docker' },

  // Testing
  { id: 'vitest', name: 'Vitest', category: 'testing', iconSlug: 'vitest' },
  { id: 'jest', name: 'Jest', category: 'testing', iconSlug: 'jest' },
];

/** Used by the section's ordering, so the categories read in the same sequence as the data. */
export const technologyCategoryOrder: TechnologyCategory[] = [
  'language',
  'framework',
  'tool',
  'database',
  'cloud',
  'testing',
  'other',
];

/**
 * The Spanish heading for each category.
 *
 * Lives here rather than inside a component because two places render it: the technologies page
 * and the home marquee. When the labels were only in the section, the two could drift apart
 * without anything failing.
 */
export const technologyCategoryLabels: Record<TechnologyCategory, string> = {
  language: 'Lenguajes',
  framework: 'Frameworks',
  tool: 'Herramientas',
  database: 'Bases de datos',
  cloud: 'Cloud y DevOps',
  testing: 'Testing',
  other: 'Otras',
};

/**
 * The categories that actually have technologies, in display order.
 *
 * Takes the list as an argument rather than closing over the module's own, so a caller can render
 * a different set and so the component keeps its own prop contract.
 */
export function getPopulatedCategories(
  list: Technology[] = technologies
): { category: TechnologyCategory; label: string; technologies: Technology[] }[] {
  return technologyCategoryOrder
    .map((category) => ({
      category,
      label: technologyCategoryLabels[category],
      technologies: list.filter((technology) => technology.category === category),
    }))
    .filter((group) => group.technologies.length > 0);
}
