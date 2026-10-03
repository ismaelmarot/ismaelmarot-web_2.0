const PROFILE_README_OWNER_SUFFIX = '.github';

/** The README can publish many screenshots per project; only the first ones ship. */
export const MAX_SCREENSHOTS_PER_PROJECT = 6;

export interface ProfileProject {
  /** Display name as written in the README */
  name: string;
  /** Repository name, used to look the repository up in the GitHub API */
  repo: string;
  /** App icon hosted in the repository, when the README references one */
  iconUrl?: string;
  /** Link the owner curated as the live/download destination, when present */
  demoUrl?: string;
  /** Screenshots of the app published in the README, already capped */
  screenshotUrls: string[];
}

function stripTags(value: string): string {
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getTables(markdown: string): string[] {
  const tables: string[] = [];
  const pattern = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let match = pattern.exec(markdown);
  while (match !== null) {
    tables.push(match[1]);
    match = pattern.exec(markdown);
  }
  return tables;
}

/**
 * Extracts the repository names the owner lists inside a single projects table.
 * Only links that point at the owner's own repositories count, and anything
 * after the repository name (`/releases`, `/issues`, ...) is discarded.
 */
function getLinkedRepos(table: string, username: string): string[] {
  const owner = escapeRegExp(username);
  const pattern = new RegExp(
    `https?://github\\.com/${owner}/([A-Za-z0-9._-]+)`,
    'gi'
  );
  const repos: string[] = [];
  let match = pattern.exec(table);
  while (match !== null) {
    const repo = match[1];
    const isProfileRepo = repo.toLowerCase() === username.toLowerCase();
    const isProfileReadme = repo.toLowerCase().startsWith(PROFILE_README_OWNER_SUFFIX);
    if (!isProfileRepo && !isProfileReadme && !repos.includes(repo)) {
      repos.push(repo);
    }
    match = pattern.exec(table);
  }
  return repos;
}

function getAppIcon(table: string, username: string, repo: string): string | undefined {
  const owner = escapeRegExp(username);
  const repoPattern = escapeRegExp(repo);
  const pattern = new RegExp(
    `<img[^>]+src="(https?://raw\\.githubusercontent\\.com/${owner}/${repoPattern}/[^"]+)"`,
    'i'
  );
  const match = table.match(pattern);
  return match ? match[1] : undefined;
}

/**
 * Any link in the table that does not point back at GitHub is a curated
 * destination: a live demo or a download page.
 */
function getCuratedDestination(table: string, username: string): string | undefined {
  const owner = escapeRegExp(username);
  const pattern = /<a[^>]+href="(https?:\/\/[^"]+)"/gi;
  let match = pattern.exec(table);
  while (match !== null) {
    const href = match[1];
    const isGithub = new RegExp(`https?://github\\.com/${owner}/`, 'i').test(href);
    const isBadge = /shields\.io/i.test(href);
    if (!isGithub && !isBadge) return href;
    match = pattern.exec(table);
  }
  return undefined;
}

function getDetailsBlocks(markdown: string): string[] {
  const blocks: string[] = [];
  const pattern = /<details[^>]*>([\s\S]*?)<\/details>/gi;
  let match = pattern.exec(markdown);
  while (match !== null) {
    blocks.push(match[1]);
    match = pattern.exec(markdown);
  }
  return blocks;
}

/**
 * Screenshots are published in a collapsible "Preview Screenshots" block that
 * sits outside the project's table. The block is located by its structure
 * rather than by guessing from file names, because the owner names them
 * inconsistently (screenshot-01.png, capture_01.png, mob-v2-01.png, ...).
 * Every image is attributed to the repository that hosts it.
 */
function getScreenshots(markdown: string, username: string): Map<string, string[]> {
  const owner = escapeRegExp(username);
  const pattern = new RegExp(
    `<img[^>]+src="(https?://raw\\.githubusercontent\\.com/${owner}/([A-Za-z0-9._-]+)/[^"]+)"`,
    'gi'
  );
  const byRepo = new Map<string, string[]>();

  for (const block of getDetailsBlocks(markdown)) {
    pattern.lastIndex = 0;
    let match = pattern.exec(block);
    while (match !== null) {
      const url = match[1];
      const repo = match[2];
      const lower = repo.toLowerCase();
      if (lower !== username.toLowerCase() && !lower.startsWith(PROFILE_README_OWNER_SUFFIX)) {
        const list = byRepo.get(lower) ?? [];
        if (list.length < MAX_SCREENSHOTS_PER_PROJECT && !list.includes(url)) {
          list.push(url);
        }
        byRepo.set(lower, list);
      }
      match = pattern.exec(block);
    }
  }

  return byRepo;
}

/**
 * Parses the projects the owner has published in the GitHub profile README.
 *
 * Each project is an HTML table holding the app icon and the project details.
 * The order of the tables in the README is the display order of the projects.
 */
export function parseProfileProjects(markdown: string, username: string): ProfileProject[] {
  const projects: ProfileProject[] = [];
  const seen = new Set<string>();
  const screenshotsByRepo = getScreenshots(markdown, username);

  for (const table of getTables(markdown)) {
    const [repo] = getLinkedRepos(table, username);
    if (!repo || seen.has(repo)) continue;

    const heading = table.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i);
    const name = heading ? stripTags(heading[1]) : repo;
    if (!name) continue;

    seen.add(repo);
    projects.push({
      name,
      repo,
      iconUrl: getAppIcon(table, username, repo),
      demoUrl: getCuratedDestination(table, username),
      screenshotUrls: screenshotsByRepo.get(repo.toLowerCase()) ?? [],
    });
  }

  return projects;
}