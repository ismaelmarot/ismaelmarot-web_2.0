import { formatPeriod } from '@/components/sections/Contributions/useContributions';
import { fetchContributions, summarise } from '@/data/fetch-contributions';
import type { ContributionDay } from '@/types/contributions';

describe('formatPeriod', () => {
  it('reads as a month and a year, in Spanish', () => {
    expect(formatPeriod('2025-09-28')).toMatch(/septiembre de 2025/);
    expect(formatPeriod('2026-10-03')).toMatch(/octubre de 2026/);
  });
});

describe('summarise', () => {
  const week = (counts: number[]) => ({
    days: counts.map((count, index) => ({
      date: `2026-01-${String(index + 1).padStart(2, '0')}`,
      count,
      weekday: ((index % 7) + 1) as ContributionDay['weekday'],
    })),
  });

  it('counts days with any activity', () => {
    const result = summarise([week([0, 1, 0, 3])], 4);
    expect(result.activeDays).toBe(2);
  });

  it('measures the streak at the end, not anywhere in the year', () => {
    const result = summarise([week([1, 1, 1, 0, 1, 1])], 5);
    expect(result.currentStreak).toBe(2);
    expect(result.longestStreak).toBe(3);
  });

  it('reports a streak of zero when the last day is empty', () => {
    const result = summarise([week([1, 1, 1, 0])], 3);
    expect(result.currentStreak).toBe(0);
  });

  it('averages per week rather than per day', () => {
    const result = summarise([week([10, 10]), week([10, 10])], 40);
    expect(result.averagePerWeek).toBe(20);
  });

  it('does not divide by zero on an empty calendar', () => {
    const result = summarise([], 0);
    expect(result.averagePerWeek).toBe(0);
    expect(result.currentStreak).toBe(0);
  });
});

describe('fetchContributions', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  const mockFetch = (payload: unknown, status = 200) => {
    const spy = vi.fn().mockResolvedValue({
      ok: status < 400,
      status,
      json: async () => payload,
    });
    global.fetch = spy as unknown as typeof fetch;
    return spy;
  };

  // The calendar is GraphQL only, and GraphQL needs a token. Failing loudly here is what keeps
  // the previous file instead of writing an empty calendar that looks like a year off.
  it('refuses to guess without a token', async () => {
    const result = await fetchContributions('ismaelmarot');

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.errors[0]).toMatch(/GITHUB_TOKEN/);
  });

  it('turns a calendar into weeks and a summary', async () => {
    mockFetch({
      data: {
        user: {
          contributionsCollection: {
            contributionCalendar: {
              totalContributions: 3,
              weeks: [
                {
                  contributionDays: [
                    { date: '2026-01-01', contributionCount: 1 },
                    { date: '2026-01-02', contributionCount: 0 },
                    { date: '2026-01-03', contributionCount: 2 },
                  ],
                },
              ],
            },
          },
        },
      },
    });

    const result = await fetchContributions('ismaelmarot', 'token');

    expect(result.success).toBe(true);
    expect(result.data?.calendar.weeks[0]?.days).toHaveLength(3);
    expect(result.data?.summary.totalContributions).toBe(3);
    expect(result.data?.summary.activeDays).toBe(2);
  });

  it('rejects an empty calendar rather than writing one', async () => {
    mockFetch({ data: { user: { contributionsCollection: { contributionCalendar: { totalContributions: 0, weeks: [] } } } } });

    const result = await fetchContributions('ismaelmarot', 'token');

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
  });

  it('reports GraphQL errors instead of pretending they did not happen', async () => {
    mockFetch({ errors: [{ message: 'Bad credentials' }] });

    const result = await fetchContributions('ismaelmarot', 'token');

    expect(result.success).toBe(false);
    expect(result.errors).toContain('Bad credentials');
  });

  it('reports an HTTP failure', async () => {
    mockFetch({}, 401);

    const result = await fetchContributions('ismaelmarot', 'token');

    expect(result.success).toBe(false);
    expect(result.errors[0]).toMatch(/401/);
  });
});
