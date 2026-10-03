/**
 * Contribution data, as published by the GitHub GraphQL contribution calendar.
 *
 * The site is static, so this is fetched during the build and committed as JSON rather than
 * requested from the browser: a visitor would otherwise spend their own GitHub rate limit on
 * every page load, and the calendar would be the one thing on the page that can fail.
 */

export interface ContributionDay {
  /** ISO date, YYYY-MM-DD. */
  date: string;
  count: number;
  /** 1 for Sunday, 7 for Saturday. */
  weekday: number;
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export interface ContributionCalendar {
  weeks: ContributionWeek[];
  totalContributions: number;
}

export interface ContributionsSummary {
  totalContributions: number;
  /** Days with at least one contribution, across the whole calendar. */
  activeDays: number;
  /** Consecutive days with activity, counting back from the most recent day. */
  currentStreak: number;
  longestStreak: number;
  /** Mean contributions per week across the calendar, to one decimal place. */
  averagePerWeek: number;
}

export interface ContributionsData {
  username: string;
  calendar: ContributionCalendar;
  summary: ContributionsSummary;
  /** ISO timestamp of the build that produced this file. */
  fetchedAt: string;
}

/**
 * The five buckets the heatmap paints, and the label each one gets.
 *
 * The two lowest active levels are deliberately not the shades GitHub uses. GitHub's level 1
 * and 2 are 1.32:1 and 2.08:1 against the section's own background, and a calendar cell is a
 * non-text element that WCAG 1.4.11 holds to 3:1. Starting the ramp darker is what lets every
 * level with activity clear that bar. Level 0 stays close to the background, because an empty
 * day is decoration and a low-contrast one is not misleading.
 */
export const CONTRIBUTION_LEVELS = [
  { max: 0, label: 'Sin actividad' },
  { max: 1, label: '1' },
  { max: 3, label: '2-3' },
  { max: 6, label: '4-6' },
  { max: Number.POSITIVE_INFINITY, label: '7+' },
] as const;

/** Which of the five levels a count belongs to, 0 being the empty cell. */
export function getContributionLevel(count: number): number {
  const index = CONTRIBUTION_LEVELS.findIndex((level) => count <= level.max);
  return index === -1 ? CONTRIBUTION_LEVELS.length - 1 : index;
}

/** Readable date, so a cell can describe itself without depending on the file being loaded. */
export function formatContributionDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * What a single cell announces. Phrased so it does not read as a truncated sentence when a
 * screen reader moves one cell at a time.
 */
export function getContributionDescription(day: ContributionDay): string {
  const count = day.count;
  const plural = count === 1 ? 'contribución' : 'contribuciones';
  const when = formatContributionDate(day.date);

  return count === 0
    ? `Sin contribuciones el ${when}`
    : `${count} ${plural} el ${when}`;
}
