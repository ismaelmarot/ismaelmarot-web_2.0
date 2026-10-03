import type {
  ContributionCalendar,
  ContributionDay,
  ContributionsData,
  ContributionsSummary,
  ContributionWeek,
} from '../types/contributions';

const GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

interface CalendarResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions?: number;
          weeks?: {
            contributionDays?: { date: string; contributionCount: number }[];
          }[];
        };
      };
    };
  };
  errors?: { message: string }[];
}

/** ISO dates are UTC midnight. getUTCDay gives 0 for Sunday, which is what the grid wants. */
function toDay(date: string, count: number): ContributionDay {
  return { date, count, weekday: new Date(`${date}T00:00:00Z`).getUTCDay() + 1 };
}

export function summarise(
  weeks: ContributionWeek[],
  totalContributions: number
): ContributionsSummary {
  const days = weeks.flatMap((week) => week.days);

  let activeDays = 0;
  let currentStreak = 0;
  let longestStreak = 0;
  let running = 0;

  for (const day of days) {
    if (day.count > 0) {
      activeDays += 1;
      running += 1;
      longestStreak = Math.max(longestStreak, running);
    } else {
      running = 0;
    }
  }

  for (let i = days.length - 1; i >= 0; i -= 1) {
    if (days[i]!.count > 0) {
      currentStreak += 1;
    } else {
      break;
    }
  }

  const averagePerWeek =
    weeks.length === 0 ? 0 : Math.round((totalContributions / weeks.length) * 10) / 10;

  return { totalContributions, activeDays, currentStreak, longestStreak, averagePerWeek };
}

export interface FetchContributionsResult {
  success: boolean;
  data: ContributionsData | null;
  errors: string[];
}

/**
 * The contribution calendar is only on the GraphQL API, and GraphQL needs a token. Without one
 * this returns a failure rather than throwing, so the caller can keep the previous file: a
 * calendar that quietly renders empty would look like a year without work.
 */
export async function fetchContributions(
  username: string,
  token?: string
): Promise<FetchContributionsResult> {
  const errors: string[] = [];

  if (!token) {
    return {
      success: false,
      data: null,
      errors: ['GITHUB_TOKEN is required: the contribution calendar is only served by the GraphQL API.'],
    };
  }

  const query = `
    query Contributions($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github+json',
        'User-Agent': 'ismaelmarot-portfolio',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables: { login: username } }),
    });

    if (!response.ok) {
      return {
        success: false,
        data: null,
        errors: [`GraphQL responded ${response.status}.`],
      };
    }

    const payload = (await response.json()) as CalendarResponse;

    if (payload.errors?.length) {
      return {
        success: false,
        data: null,
        errors: payload.errors.map((error) => error.message),
      };
    }

    const raw = payload.data?.user?.contributionsCollection?.contributionCalendar;

    if (!raw?.weeks?.length) {
      return {
        success: false,
        data: null,
        errors: ['The calendar came back empty, so nothing was written.'],
      };
    }

    const weeks: ContributionWeek[] = raw.weeks.map((week) => ({
      days: (week.contributionDays ?? []).map((day) =>
        toDay(day.date, day.contributionCount)
      ),
    }));

    const totalContributions = raw.totalContributions ?? 0;
    const calendar: ContributionCalendar = { weeks, totalContributions };

    return {
      success: true,
      data: {
        username,
        calendar,
        summary: summarise(weeks, totalContributions),
        fetchedAt: new Date().toISOString(),
      },
      errors,
    };
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Unknown error');
    return { success: false, data: null, errors };
  }
}
