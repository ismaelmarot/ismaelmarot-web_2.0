import type { GitHubRepo, FetchConfig, FetchResult} from '../types/github';
import { transformGitHubRepo, filterPortfolioRepos, sortReposByActivity, limitRepos } from '../types/github';

const GITHUB_API_BASE = 'https://api.github.com';

async function fetchWithAuth(url: string, token?: string): Promise<Response> {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'ismaelmarot-portfolio',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(url, { headers });
}

async function fetchUserRepos(username: string, token?: string): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const url = `${GITHUB_API_BASE}/users/${username}/repos?page=${page}&per_page=${perPage}&sort=pushed&direction=desc`;
    const response = await fetchWithAuth(url, token);

    if (!response.ok) {
      if (response.status === 403) {
        const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
        throw new Error(
          `GitHub API rate limit exceeded. Remaining: ${rateLimitRemaining || 'unknown'}. ` +
            'Set GITHUB_TOKEN environment variable for higher limits.'
        );
      }
      throw new Error(`Failed to fetch repos: ${response.status} ${response.statusText}`);
    }

    const pageRepos = (await response.json()) as GitHubRepo[];
    if (pageRepos.length === 0) break;

    repos.push(...pageRepos);

    if (pageRepos.length < perPage) break;
    page++;
  }

  return repos;
}

export async function fetchGitHubProjects(config: FetchConfig): Promise<FetchResult> {
  const errors: string[] = [];
  const rateLimitRemaining = 60;

  try {
    const repos = await fetchUserRepos(config.username, config.token);

    const filteredRepos = filterPortfolioRepos(repos, config);
    const sortedRepos = sortReposByActivity(filteredRepos);
    const limitedRepos = limitRepos(sortedRepos, config.maxRepos || 50);

    const projects = limitedRepos.map(transformGitHubRepo);

    return {
      success: true,
      projects,
      errors,
      fetchedAt: new Date().toISOString(),
      rateLimitRemaining,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    errors.push(message);
    return {
      success: false,
      projects: [],
      errors,
      fetchedAt: new Date().toISOString(),
      rateLimitRemaining: 0,
    };
  }
}

async function main() {
  const username = process.env.VITE_GITHUB_USERNAME || 'ismaelmarot';
  const token = process.env.GITHUB_TOKEN;
  const outputPath = process.env.OUTPUT_PATH || 'src/data/projects.json';

  const config: FetchConfig = {
    username,
    token,
    includeForks: false,
    includeArchived: false,
    minStars: 0,
    requiredTopics: [],
    maxRepos: 20,
    outputPath,
  };

  console.log(`Fetching GitHub repos for ${username}...`);
  const result = await fetchGitHubProjects(config);

  if (!result.success) {
    console.error('Failed to fetch GitHub projects:');
    result.errors.forEach((err) => console.error(`  - ${err}`));
    process.exit(1);
  }

  const fs = await import('fs');
  const path = await import('path');

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(result.projects, null, 2));
  console.log(`Successfully fetched ${result.projects.length} projects.`);
  console.log(`Written to ${outputPath}`);
}

main().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});