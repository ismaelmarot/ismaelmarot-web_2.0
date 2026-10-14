import {
  dataAge,
  formatFetchHour,
  formatPeriod,
  isStale,
  STALE_AFTER_HOURS,
} from '@/components/sections/Contributions/useContributions';
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

/**
 * The freshness derivation, added by specs/019.
 *
 * Every case is reachable without touching the real clock because both functions take `now`. That is the
 * reason they are pure: the boundary at three hours and the future-timestamp case are the two the
 * component cannot produce on its own, and a test that has to wait for a real hour to check them is a
 * test that is never run.
 */
describe('dataAge', () => {
  const ahora = new Date('2026-10-14T12:00:00Z');

  it('measures the hours since the fetch', () => {
    expect(dataAge('2026-10-14T09:00:00Z', ahora)).toBeCloseTo(3, 5);
    expect(dataAge('2026-10-14T11:30:00Z', ahora)).toBeCloseTo(0.5, 5);
  });

  it('returns zero rather than a fraction when the fetch is this instant', () => {
    expect(dataAge('2026-10-14T12:00:00Z', ahora)).toBe(0);
  });

  it('returns null when the field is absent', () => {
    // Not the same as zero hours old. Every build made before specs/019 shipped without the field.
    expect(dataAge(undefined, ahora)).toBeNull();
    expect(dataAge('', ahora)).toBeNull();
  });

  it('returns null rather than NaN when the field does not parse', () => {
    expect(dataAge('no es una fecha', ahora)).toBeNull();
  });

  it('reports a future timestamp as negative rather than clamping it', () => {
    // Clock skew between a build runner and a visitor is real. Hiding it here would make the caller
    // unable to tell it apart from a fetch that genuinely happened before now.
    expect(dataAge('2026-10-14T13:00:00Z', ahora)).toBeCloseTo(-1, 5);
  });
});

describe('isStale', () => {
  const ahora = new Date('2026-10-14T12:00:00Z');
  const hace = (hours: number) =>
    new Date(ahora.getTime() - hours * 3_600_000).toISOString();

  it('is false below the threshold', () => {
    expect(isStale(hace(0), ahora)).toBe(false);
    expect(isStale(hace(2.9), ahora)).toBe(false);
  });

  it('is true at the threshold, which is where the word stops being true', () => {
    expect(isStale(hace(STALE_AFTER_HOURS), ahora)).toBe(true);
    expect(isStale(hace(STALE_AFTER_HOURS + 0.1), ahora)).toBe(true);
  });

  it('is false for a timestamp in the future', () => {
    // "Última lectura a las 14:00" for a build that claims to be from the afternoon would name an hour
    // the visitor has not reached. Treating skew as fresh is the smaller wrong answer.
    expect(isStale('2026-10-14T13:00:00Z', ahora)).toBe(false);
  });

  it('is false when the age is unknown, rather than guessing from the calendar', () => {
    // Reading the last cell to guess an age is the substitution specs/010 Amendment 2 refused for the
    // same reason: it presents something that is not today's as though it were.
    expect(isStale(undefined, ahora)).toBe(false);
    expect(isStale('no es una fecha', ahora)).toBe(false);
  });

  it('takes its threshold as an argument so the boundary is testable at any value', () => {
    expect(isStale(hace(1), ahora, 0.5)).toBe(true);
    expect(isStale(hace(1), ahora, 2)).toBe(false);
  });
});

describe('formatFetchHour', () => {
  const instante = '2026-10-14T09:37:00Z';

  /**
   * The local wall-clock reading of an instant, computed without asking the formatter to do it.
   *
   * `toLocaleTimeString(locale)` resolves the timezone from the runtime, not from the locale: on this
   * machine `es-ES` renders in UTC-3 and reads 06:37 for a 09:37Z instant, which is correct and is the
   * whole point of the function. Asserting a hard-coded "09:37" would have been asserting that the
   * formatter ignores the visitor's zone, which is the defect specs/010's Amendment 2 fixed for dates
   * and this function has to not reintroduce for hours.
   */
  const local = (iso: string) => {
    const minutos = -new Date(iso).getTimezoneOffset();
    return new Date(new Date(iso).getTime() + minutos * 60_000).toISOString().slice(11, 16);
  };

  it('renders the hour in the visitor\'s own zone rather than in UTC', () => {
    expect(formatFetchHour(instante, 'es-ES')).toBe(local(instante));
  });

  it('renders the same instant differently under different locales, because the zone follows the reader', () => {
    // Only meaningful when the runner is not on UTC, which is the case this defect exists in.
    if (new Date(instante).getTimezoneOffset() === 0) return;

    expect(formatFetchHour(instante, 'es-ES')).not.toBe(instante.slice(11, 16));
  });

  it('renders two digits, so the line never reads "a las 9:05"', () => {
    const madrugada = '2026-10-14T09:05:00Z';
    const conCeros = new Date(madrugada);
    const minutos = -conCeros.getTimezoneOffset();
    const esperado = new Date(conCeros.getTime() + minutos * 60_000)
      .toISOString()
      .slice(11, 16);

    expect(formatFetchHour(madrugada, 'es-ES')).toBe(esperado);
    expect(formatFetchHour(madrugada, 'es-ES')).toMatch(/^\d{2}:\d{2}$/);
  });

  it('renders a different wall clock for two instants an hour apart', () => {
    const manana = new Date(instante).getTime() + 3_600_000;
    expect(formatFetchHour(new Date(manana).toISOString(), 'es-ES')).not.toBe(
      formatFetchHour(instante, 'es-ES')
    );
  });
});
