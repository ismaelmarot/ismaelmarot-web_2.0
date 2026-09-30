import type { Project } from './project';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  disabled: boolean;
  license: { key: string; name: string } | null;
}

export interface FetchConfig {
  username: string;
  token?: string;
  includeForks?: boolean;
  includeArchived?: boolean;
  minStars?: number;
  requiredTopics?: string[];
  maxRepos?: number;
  outputPath: string;
}

export interface FetchResult {
  success: boolean;
  projects: Project[];
  errors: string[];
  fetchedAt: string;
  rateLimitRemaining: number;
}

export function transformGitHubRepo(repo: GitHubRepo): Project {
  const fallbackDescription = repo.description || `No description provided for ${repo.name}`;

  return {
    id: String(repo.id),
    name: repo.name,
    description: fallbackDescription,
    longDescription: undefined,
    primaryLanguage: repo.language || undefined,
    technologies: repo.topics.filter((t) => t.length > 0),
    githubUrl: repo.html_url,
    demoUrl: repo.homepage && isValidUrl(repo.homepage) ? repo.homepage : undefined,
    screenshotUrls: [],
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    lastUpdated: repo.pushed_at,
    isFeatured: false,
    displayOrder: undefined,
  };
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function filterPortfolioRepos(
  repos: GitHubRepo[],
  config: FetchConfig
): GitHubRepo[] {
  return repos.filter((repo) => {
    if (repo.fork && !config.includeForks) return false;
    if (repo.archived && !config.includeArchived) return false;
    if (repo.disabled) return false;
    if (config.minStars && repo.stargazers_count < config.minStars) return false;
    if (config.requiredTopics && config.requiredTopics.length > 0) {
      const hasRequiredTopic = config.requiredTopics.some((topic) =>
        repo.topics.includes(topic)
      );
      if (!hasRequiredTopic) return false;
    }
    return true;
  });
}

export function sortReposByActivity(repos: GitHubRepo[]): GitHubRepo[] {
  return [...repos].sort(
    (a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
  );
}

export function limitRepos(repos: GitHubRepo[], max: number): GitHubRepo[] {
  return repos.slice(0, max);
}