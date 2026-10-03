import type { Project, ProjectType } from './project';
import { NO_DESCRIPTION_FALLBACK } from '@/utils/helpers';

const MOBILE_TOPICS = ['ios', 'android', 'react-native', 'flutter', 'swift', 'kotlin'];

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
  /** Repository size in kilobytes */
  size: number;
  fork: boolean;
  archived: boolean;
  disabled: boolean;
  license: { key: string; name: string } | null;
}

export interface GitHubReleaseAsset {
  name: string;
  /** Asset size in bytes */
  size: number;
  browser_download_url: string;
}

export interface GitHubRelease {
  tag_name: string;
  name: string | null;
  html_url: string;
  published_at: string | null;
  assets: GitHubReleaseAsset[];
}

export interface FetchConfig {
  username: string;
  token?: string;
  includeForks?: boolean;
  includeArchived?: boolean;
  requiredTopics?: string[];
  outputPath: string;
}

export interface FetchResult {
  success: boolean;
  projects: Project[];
  errors: string[];
  fetchedAt: string;
  rateLimitRemaining: number;
}

export function getOpenGraphIconUrl(fullName: string): string | undefined {
  const [owner, repo] = fullName.split('/');
  if (!owner || !repo) return undefined;
  return `https://opengraph.githubassets.com/1/${owner}/${repo}`;
}

export function detectProjectType(topics: string[]): ProjectType {
  const isMobile = topics.some((topic) => MOBILE_TOPICS.includes(topic.toLowerCase()));
  return isMobile ? 'mobile' : 'web';
}

export function getTechnologies(repo: GitHubRepo): string[] {
  const topics = repo.topics.filter((topic) => topic.length > 0);
  if (topics.length > 0) return topics;
  return repo.language ? [repo.language] : [];
}

/** Derived from the project's published releases, when it publishes any */
export interface ReleaseInfo {
  /** Page listing every published download */
  downloadUrl: string;
  /** Size in bytes of the newest published downloadable file */
  appSizeBytes?: number;
  versions: {
    version: string;
    date?: string;
    url: string;
  }[];
}

export interface ProfileOverrides {
  /** App icon curated in the profile README */
  iconUrl?: string;
  /** Destination curated in the profile README */
  demoUrl?: string;
  /** Position of the project in the profile README */
  displayOrder?: number;
  /** Screenshots published in the project README, already capped */
  screenshotUrls?: string[];
  /** Releases published by the repository */
  release?: ReleaseInfo;
}

export function transformGitHubRepo(
  repo: GitHubRepo,
  overrides: ProfileOverrides = {}
): Project {
  const fallbackDescription = repo.description?.trim() || NO_DESCRIPTION_FALLBACK;
  const technologies = getTechnologies(repo);
  const homepage = repo.homepage && isValidUrl(repo.homepage) ? repo.homepage : undefined;

  return {
    id: String(repo.id),
    name: repo.name,
    description: fallbackDescription,
    longDescription: undefined,
    primaryLanguage: repo.language || undefined,
    technologies,
    githubUrl: repo.html_url,
    demoUrl: overrides.demoUrl ?? homepage,
    screenshotUrls: overrides.screenshotUrls ?? [],
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    lastUpdated: repo.pushed_at,
    sizeKb: repo.size,
    appSizeBytes: overrides.release?.appSizeBytes,
    downloadUrl: overrides.release?.downloadUrl,
    versions: overrides.release?.versions,
    displayOrder: overrides.displayOrder,
    iconUrl: overrides.iconUrl ?? getOpenGraphIconUrl(repo.full_name),
    projectType: detectProjectType(technologies),
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
    if (config.requiredTopics && config.requiredTopics.length > 0) {
      const hasRequiredTopic = config.requiredTopics.some((topic) =>
        repo.topics.includes(topic)
      );
      if (!hasRequiredTopic) return false;
    }
    return true;
  });
}
