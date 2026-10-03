import type { GitHubRepo, FetchConfig, FetchResult, ReleaseInfo, GitHubRelease } from '../types/github';
import { transformGitHubRepo, filterPortfolioRepos } from '../types/github';
import { parseProfileProjects } from './profile-readme';
import { projectEditorialMetadata } from './project-metadata';
import type { Project } from '../types/project';

const GITHUB_API_BASE = 'https://api.github.com';

async function fetchWithAuth(url: string, token?: string): Promise<Response> {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'ismaelmarot-portfolio',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(url, { headers });
}

/**
 * The profile README is where the owner publishes the projects to showcase,
 * so it decides what appears in the portfolio and in which order.
 */
async function fetchProfileReadme(username: string, token?: string): Promise<string> {
  const response = await fetchWithAuth(
    `${GITHUB_API_BASE}/repos/${username}/${username}/readme`,
    token
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch profile README: ${response.status} ${response.statusText}`
    );
  }

  const payload = (await response.json()) as { content?: string; encoding?: string };
  if (!payload.content) {
    throw new Error('Profile README is empty or unreadable');
  }

  const markdown =
    payload.encoding === 'base64'
      ? Buffer.from(payload.content, 'base64').toString('utf8')
      : payload.content;

  return markdown;
}

async function fetchUserRepos(username: string, token?: string): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let page = 1;
  let hasMorePages = true;
  const perPage = 100;

  while (hasMorePages) {
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
    if (pageRepos.length === 0) {
      hasMorePages = false;
      break;
    }

    repos.push(...pageRepos);

    if (pageRepos.length < perPage) {
      hasMorePages = false;
      break;
    }
    page++;
  }

  return repos;
}

/**
 * Reads what a repository publishes as formal versions. Projects that publish
 * none get no release information at all, so the page can say so plainly.
 * A failure here never fails the build: the rest of the project data is
 * still valid without a version history.
 */
async function fetchReleaseInfo(
  repo: GitHubRepo,
  token?: string
): Promise<ReleaseInfo | undefined> {
  try {
    const response = await fetchWithAuth(
      `${GITHUB_API_BASE}/repos/${repo.full_name}/releases?per_page=20`,
      token
    );

    if (!response.ok) return undefined;

    const releases = (await response.json()) as GitHubRelease[];
    if (!Array.isArray(releases) || releases.length === 0) return undefined;

    const versions = releases.map((release) => ({
      version: release.tag_name,
      date: release.published_at ?? undefined,
      url: release.html_url,
    }));

    // Releases arrive newest first, so the newest one that ships a file is the
    // size of the version a visitor would download today. Within that release
    // the largest file is shown, since it is what most visitors pick.
    const newestRelease = releases.find(
      (release) => (release.assets ?? []).some((asset) => asset.size > 0)
    );
    const newestAsset = (newestRelease?.assets ?? [])
      .filter((asset) => asset.size > 0)
      .sort((a, b) => b.size - a.size)[0];

    return {
      downloadUrl: `${repo.html_url}/releases`,
      appSizeBytes: newestAsset?.size,
      versions,
    };
  } catch {
    return undefined;
  }
}

export async function fetchGitHubProjects(config: FetchConfig): Promise<FetchResult> {
  const errors: string[] = [];
  const rateLimitRemaining = 60;

  try {
    const [readme, repos] = await Promise.all([
      fetchProfileReadme(config.username, config.token),
      fetchUserRepos(config.username, config.token),
    ]);

    const featured = parseProfileProjects(readme, config.username);

    if (featured.length === 0) {
      errors.push(
        `No projects found in the profile README of ${config.username}. ` +
          'Add a project table to the README to showcase it.'
      );
    }

    const eligibleRepos = filterPortfolioRepos(repos, config);
    const reposByName = new Map(eligibleRepos.map((repo) => [repo.name.toLowerCase(), repo]));

    // The README is the source of truth for what is showcased and in which order.
    const projects: Project[] = [];
    for (const entry of featured) {
      const repo = reposByName.get(entry.repo.toLowerCase());
      if (!repo) {
        errors.push(
          `"${entry.repo}" is listed in the README but is not an eligible repository ` +
            `(missing, private, archived or a fork). Skipping.`
        );
        continue;
      }
      projects.push(
        transformGitHubRepo(repo, {
          iconUrl: entry.iconUrl,
          demoUrl: entry.demoUrl,
          screenshotUrls: entry.screenshotUrls,
          displayOrder: projects.length + 1,
          release: await fetchReleaseInfo(repo, config.token),
        })
      );
    }

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

/**
 * The curated metadata is authored by hand in src/data/project-metadata.ts, so
 * it can drift from what the README publishes. Report both directions instead of
 * failing: an uncategorised project is still listed, it just shows no tags.
 */
function reportEditorialMetadataDrift(projects: Project[]): void {
  const curated = new Map(
    Object.keys(projectEditorialMetadata).map((key) => [key.toLowerCase(), key])
  );
  const published = new Map(projects.map((project) => [project.name.toLowerCase(), project.name]));

  const missingMetadata = projects
    .filter((project) => !curated.has(project.name.toLowerCase()))
    .map((project) => project.name);
  const orphanMetadata = Object.keys(curated).filter(
    (key) => !published.has(key.toLowerCase())
  );

  if (missingMetadata.length > 0) {
    console.warn(
      `\n  ! No curated metadata for: ${missingMetadata.join(', ')}\n` +
        '    Add an entry in src/data/project-metadata.ts'
    );
  }
  if (orphanMetadata.length > 0) {
    console.warn(
      `\n  ! Curated metadata with no published project: ${orphanMetadata.join(', ')}\n` +
        '    Remove it from src/data/project-metadata.ts'
    );
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
    requiredTopics: [],
    outputPath,
  };

  console.log(`Fetching GitHub repos for ${username} (showcasing the profile README)...`);
  const result = await fetchGitHubProjects(config);

  if (!result.success) {
    console.error('Failed to fetch GitHub projects:');
    result.errors.forEach((err) => console.error(`  - ${err}`));
    process.exit(1);
  }

  reportEditorialMetadataDrift(result.projects);

  if (result.projects.length === 0) {
    console.error('No projects resolved from the profile README, keeping the existing data.');
    result.errors.forEach((err) => console.error(`  - ${err}`));
    process.exit(1);
  }

  result.errors.forEach((err) => console.warn(`  ! ${err}`));

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