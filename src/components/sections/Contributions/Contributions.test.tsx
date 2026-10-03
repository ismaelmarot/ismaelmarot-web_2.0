import { render, screen } from '@testing-library/react';
import { Contributions } from './Contributions';
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
