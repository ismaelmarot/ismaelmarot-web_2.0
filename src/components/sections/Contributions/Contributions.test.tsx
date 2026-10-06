import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Contributions } from './Contributions';
import { localToday } from './useContributions';
import { getCssForElement } from '@/test-utils/css';
import type { ContributionsData, ContributionWeek } from '@/types/contributions';

const week = (start: string, counts: number[]): ContributionWeek => ({
  days: counts.map((count, index) => {
    const day = new Date(`${start}T00:00:00Z`);
    day.setUTCDate(day.getUTCDate() + index);
    return {
      date: day.toISOString().slice(0, 10),
      count,
      weekday: ((day.getUTCDay() + 6) % 7 + 1) as ContributionWeek['days'][number]['weekday'],
    };
  }),
});

const fixture = (weeks: ContributionWeek[], total: number): ContributionsData => ({
  username: 'ismaelmarot',
  calendar: { weeks, totalContributions: total },
  summary: {
    totalContributions: total,
    activeDays: 2,
    currentStreak: 1,
    longestStreak: 3,
    averagePerWeek: 1.5,
  },
  fetchedAt: '2026-10-03T00:00:00.000Z',
});

describe('Contributions', () => {
  it('renders the heading and the period', () => {
    render(<Contributions data={fixture([week('2026-01-05', [1, 2, 3, 0, 0, 0, 0])], 6)} />);

    expect(screen.getByRole('heading', { name: /contribuciones/i })).toBeInTheDocument();
    expect(screen.getByText(/enero de 2026/)).toBeInTheDocument();
  });

  // A calendar cell cannot be read by colour alone, or the whole graphic is meaningless to
  // anyone who cannot see the shades.
  it('describes every cell in words', () => {
    render(<Contributions data={fixture([week('2026-01-05', [1, 2, 3, 0, 0, 0, 0])], 6)} />);

    expect(screen.getByLabelText(/1 contribución el/)).toBeInTheDocument();
    // getAllBy, not getBy: the fixture has four empty days, and a single one would not prove
    // that every empty cell carries a description.
    expect(screen.getAllByLabelText(/^Sin contribuciones el/)).toHaveLength(4);
  });

  it('uses the singular for a single contribution', () => {
    render(<Contributions data={fixture([week('2026-01-05', [1, 0, 0, 0, 0, 0, 0])], 1)} />);

    expect(screen.getByLabelText(/^1 contribución el/)).toBeInTheDocument();
    // Anchored, because the scroll region's own label mentions "1 contribuciones" in its
    // summary and would otherwise be matched by a looser pattern.
    // The plural only appears in the scroll region's own summary now, where it reads
    // "1 contribución en total" thanks to formatTotal, so no cell claims the plural.
    expect(screen.queryByLabelText(/^\d+ contribuciones el/)).not.toBeInTheDocument();
  });

  it('paints a cell per day, with no legend-only gaps', () => {
    render(
      <Contributions
        data={fixture([week('2026-01-05', [1, 2, 3, 0, 0, 0, 0]), week('2026-01-12', [0, 0, 0, 0, 0, 0, 0])], 6)}
      />
    );

    expect(screen.getAllByTitle(/2026|contribuciones/i)).toHaveLength(14);
  });

  it('shows the four figures', () => {
    render(<Contributions data={fixture([week('2026-01-05', [1, 0, 0, 0, 0, 0, 0])], 1)} />);

    expect(screen.getByText('Contribuciones')).toBeInTheDocument();
    expect(screen.getByText('Días activos')).toBeInTheDocument();
    expect(screen.getByText('Mejor racha')).toBeInTheDocument();
    expect(screen.getByText('Media semanal')).toBeInTheDocument();
  });

  // 53 weeks is wider than a phone. The scroller carries tabIndex so the keyboard can reach
  // the overflow; without it the extra weeks are unreachable for anyone not using a mouse.
  it('makes the horizontal scroller reachable by keyboard', () => {
    render(<Contributions data={fixture([week('2026-01-05', [1, 0, 0, 0, 0, 0, 0])], 1)} />);

    const scroller = screen.getByRole('group', { name: /calendario de contribuciones/i });
    expect(scroller).toHaveAttribute('tabindex', '0');
    expect(getCssForElement(scroller)).toContain('overflow-x');
  });

  // An empty calendar would read as a year with no work, which is the opposite of what
  // happened. The section hides itself instead.
  it('renders nothing when the build could not fetch a calendar', () => {
    const { container } = render(
      <Contributions
        data={
          {
            username: 'ismaelmarot',
            calendar: { weeks: [], totalContributions: 0 },
            summary: {
              totalContributions: 0,
              activeDays: 0,
              currentStreak: 0,
              longestStreak: 0,
              averagePerWeek: 0,
            },
            fetchedAt: '2026-10-03T00:00:00.000Z',
          } satisfies ContributionsData
        }
      />
    );

    expect(container).toBeEmptyDOMElement();
  });
});

// Added by this feature. The defect was that the strip never moved from its left edge, so today's
// cell was off-screen on any viewport narrower than the year. None of the seven tests above could
// see it, because none of them looked at the scroll position.
describe('Contributions most recent day', () => {
  // Local rather than UTC, because that is what the component now compares against. Left on
  // toISOString() these fixtures would end on the UTC day while the component looked for the
  // local one, so the whole block would pass on a CI runner in UTC and fail on any developer
  // machine west of Greenwich in the evening. That is the same defect in the test rather than
  // the component, and it would have hidden the fix.
  const todayIso = localToday();

  /** A week whose LAST day is today, because today is the final cell of the whole calendar. */
  const weekEndingToday = (counts: number[]) => {
    const start = new Date(`${todayIso}T00:00:00Z`);
    start.setUTCDate(start.getUTCDate() - 6);
    return week(start.toISOString().slice(0, 10), counts);
  };

  const shadowOf = (cell: Element) => getComputedStyle(cell).boxShadow;

  /**
   * jsdom reports scrollWidth and clientWidth as 0 on every element, and the mount effect reads
   * them before any test code can reach the node. They are therefore defined on the prototype,
   * before the render, so the effect sees the same geometry a phone would. Computed style is used
   * for the outline instead of getCssForElement, which returns every rule sharing the element's
   * generated class and therefore cannot tell one cell from another.
   */
  const getStrip = () => screen.getByRole('group', { name: /calendario de contribuciones/i });

  const renderWithStrip = (data: ContributionsData, scrollWidth: number, clientWidth: number) => {
    Object.defineProperty(HTMLDivElement.prototype, 'scrollWidth', {
      value: scrollWidth,
      configurable: true,
    });
    Object.defineProperty(HTMLDivElement.prototype, 'clientWidth', {
      value: clientWidth,
      configurable: true,
    });
    try {
      render(<Contributions data={data} />);
    } finally {
      delete (HTMLDivElement.prototype as unknown as Record<string, unknown>).scrollWidth;
      delete (HTMLDivElement.prototype as unknown as Record<string, unknown>).clientWidth;
    }
  };

  it('opens the strip at its most recent end', () => {
    renderWithStrip(fixture([weekEndingToday([0, 0, 0, 0, 0, 0, 2])], 2), 690, 274);
    // 690 is the full year and 274 what a 390px phone shows, so the strip must land at the end.
    expect(getStrip().scrollLeft).toBe(690);
  });

  it('opens the strip at its end where the year does not overflow', () => {
    renderWithStrip(fixture([weekEndingToday([0, 0, 0, 0, 0, 0, 2])], 2), 1108, 1108);
    // The assignment is a no-op without overflow and must not throw or go negative.
    expect(getStrip().scrollLeft).toBeGreaterThanOrEqual(0);
  });

  it('still opens the strip under reduced motion, because a jump is not an animation', () => {
    // Nothing reads the media query: the scroll is an instant assignment, not an animation, so it
    // has to happen under reduced motion too. This pins that so nobody smooths it later.
    renderWithStrip(fixture([weekEndingToday([0, 0, 0, 0, 0, 0, 2])], 2), 690, 274);
    expect(getStrip().scrollLeft).toBe(690);
  });

  it('names today in words under the grid', () => {
    render(<Contributions data={fixture([weekEndingToday([5, 1, 0, 2, 3, 1, 4])], 16)} />);
    const label = screen.getByTestId('contributions-today');
    expect(label).toHaveTextContent('Hoy · 4 contribuciones');
    expect(screen.getAllByTestId('contributions-today')).toHaveLength(1);
  });

  it('says so plainly when today has no contributions', () => {
    render(<Contributions data={fixture([weekEndingToday([5, 1, 0, 2, 3, 1, 0])], 12)} />);
    // An empty day is the one most in need of naming, since its colour says nothing at all.
    expect(screen.getByTestId('contributions-today')).toHaveTextContent(
      'Hoy · sin contribuciones'
    );
  });

  it('uses the singular for a single contribution today', () => {
    render(<Contributions data={fixture([weekEndingToday([5, 1, 0, 2, 3, 1, 1])], 13)} />);
    expect(screen.getByTestId('contributions-today')).toHaveTextContent('Hoy · 1 contribución');
  });

  it('does not repeat the date, which the section header already states', () => {
    render(<Contributions data={fixture([weekEndingToday([0, 0, 0, 0, 0, 0, 4])], 4)} />);
    const label = screen.getByTestId('contributions-today');
    expect(label).not.toHaveTextContent('octubre');
    expect(label).not.toHaveTextContent('2026');
  });

  it('marks no cell at all, so no tile is distinguished', () => {
    render(<Contributions data={fixture([weekEndingToday([5, 1, 0, 2, 3, 1, 4])], 16)} />);
    const cells = screen.getAllByRole('img');
    // Every cell computes the same, which is the point: the outline read as three different marks
    // depending on the level, and none of them was a clean edge.
    const shadows = new Set(cells.map((cell) => shadowOf(cell)));
    // Identical is the point; jsdom reports an unset box-shadow as an empty string rather than none.
    expect(shadows.size).toBe(1);
    expect([...shadows][0] || 'none').toBe('none');
  });

  it('is not announced, because the cell already says it', () => {
    render(<Contributions data={fixture([weekEndingToday([0, 0, 0, 0, 0, 0, 4])], 4)} />);
    // The cell's accessible name is the single authoritative statement.
    expect(screen.getByTestId('contributions-today')).toHaveAttribute('aria-hidden', 'true');
    const cells = screen.getAllByRole('img');
    expect(cells.at(-1)).toHaveAccessibleName(expect.stringContaining('(hoy)'));
  });

  it('shows no label when the calendar does not reach today', () => {
    // Seven days ENDING yesterday, so the calendar genuinely stops short of today. Starting two
    // days back would still reach today on its fifth day.
    const stale = new Date(`${todayIso}T00:00:00Z`);
    stale.setUTCDate(stale.getUTCDate() - 7);
    const staleIso = stale.toISOString().slice(0, 10);
    render(<Contributions data={fixture([week(staleIso, [1, 2, 3, 1, 2, 3, 1])], 13)} />);
    // A stale build must not name its last day as today, in words or in a description.
    expect(screen.queryByTestId('contributions-today')).not.toBeInTheDocument();
    const cells = screen.getAllByRole('img');
    expect(cells.some((cell) => (cell.getAttribute('aria-label') ?? '').includes('(hoy)'))).toBe(
      false
    );
  });

  it('describes today in words, so the mark is not visual only', () => {
    render(<Contributions data={fixture([weekEndingToday([0, 0, 0, 0, 0, 0, 2])], 2)} />);
    const cells = screen.getAllByRole('img');
    expect(cells.at(-1)?.getAttribute('aria-label')).toContain('(hoy)');
    expect(cells.at(-2)?.getAttribute('aria-label')).not.toContain('(hoy)');
  });

  it('aligns the label to the grid, not to the scroll container', () => {
    render(<Contributions data={fixture([weekEndingToday([0, 0, 0, 0, 0, 0, 4])], 4)} />);
    // The grid is a fixed 686px while the container is not, so the label has to hang off a wrapper
    // sized to the grid. Aligning to the container put it 420px away at 1440 and 164px at 1024.
    expect(getCssForElement(screen.getByTestId('contributions-content'))).toContain(
      'width: max-content'
    );
    expect(screen.getByTestId('contributions-today')).toHaveStyle({ textAlign: 'right' });
  });
});

// Amendment 2. The label read "Hoy · sin contribuciones" on an evening that held real work,
// because "today" was resolved in UTC while the reader's day was not. The timezone is pinned
// explicitly below rather than inherited from the runner, because CI runs in UTC where an
// assertion written for this defect would pass without testing anything at all.
describe("Contributions today is the visitor's day, not the runner's", () => {
  const originalTz = process.env.TZ;

  afterEach(() => {
    if (originalTz === undefined) {
      delete process.env.TZ;
    } else {
      process.env.TZ = originalTz;
    }
    vi.useRealTimers();
  });

  /** Fakes Date only, so React's own scheduling is left untouched. */
  const atInstant = (iso: string) => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(iso));
  };

  const markedCells = () =>
    screen
      .getAllByRole('img')
      .filter((cell) => (cell.getAttribute('aria-label') ?? '').includes('(hoy)')).length;

  it('builds the date from the local getters rather than from toISOString', () => {
    process.env.TZ = 'America/Argentina/Buenos_Aires';
    // 00:14 UTC on the 6th is still 21:14 on the 5th in Buenos Aires. That difference is the
    // entire bug: toISOString() would answer the 6th here.
    expect(localToday(new Date('2026-10-06T00:14:00Z'))).toBe('2026-10-05');
    // Same zone, a few hours earlier in the calendar, so the date is the 4th and not the 5th.
    expect(localToday(new Date('2026-10-05T02:00:00Z'))).toBe('2026-10-04');
  });

  it('reports the local day once UTC has already rolled over', () => {
    process.env.TZ = 'America/Argentina/Buenos_Aires';
    atInstant('2026-10-06T00:14:00Z');

    // The deployed shape exactly. A runner fetching at 00:00 UTC on the 6th produces a calendar
    // whose last day is the 6th, empty because it was minutes old, with the 5th's real count one
    // cell back. Under the UTC comparison this rendered "sin contribuciones".
    render(<Contributions data={fixture([week('2026-09-29', [1, 2, 3, 4, 5, 6, 7, 0])], 21)} />);

    expect(screen.getByTestId('contributions-today')).toHaveTextContent('Hoy · 7 contribuciones');
    // The 6th is the day the visitor has not lived through yet, so it stays unmarked.
    const cells = screen.getAllByRole('img');
    expect(cells.at(-2)).toHaveAccessibleName(expect.stringContaining('(hoy)'));
    expect(cells.at(-1)?.getAttribute('aria-label')).not.toContain('(hoy)');
  });

  it('reports today normally where the two bases agree', () => {
    process.env.TZ = 'America/Argentina/Buenos_Aires';
    atInstant('2026-10-05T18:00:00Z');

    // 15:00 on the 5th in Buenos Aires, so local and UTC name the same day. The change must not
    // have cost anything in the ordinary afternoon case.
    render(<Contributions data={fixture([week('2026-09-29', [1, 2, 3, 4, 5, 6, 7])], 28)} />);

    expect(screen.getByTestId('contributions-today')).toHaveTextContent('Hoy · 7 contribuciones');
    expect(markedCells()).toBe(1);
  });

  it('says nothing when a timezone ahead of UTC has outrun the data', () => {
    process.env.TZ = 'Asia/Kolkata';
    atInstant('2026-10-05T20:00:00Z');

    // 01:30 on the 6th in Kolkata, but the calendar was fetched in UTC and stops on the 5th. The
    // visitor's own day is not in the data, and FR-015 forbids promoting the 5th to stand in for
    // it. Falling back to the nearest available day was proposed and rejected for that reason.
    render(<Contributions data={fixture([week('2026-09-29', [1, 2, 3, 4, 5, 6, 7])], 28)} />);

    expect(screen.queryByTestId('contributions-today')).not.toBeInTheDocument();
    expect(markedCells()).toBe(0);
  });
});
