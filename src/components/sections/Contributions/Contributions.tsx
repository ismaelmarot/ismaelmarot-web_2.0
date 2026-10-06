import { useLayoutEffect, useRef } from 'react';
import {
  StyledContributions,
  StyledContributionsHeader,
  StyledContributionsTitle,
  StyledContributionsPeriod,
  StyledContributionsScroller,
  StyledContributionsContent,
  StyledContributionsGrid,
  StyledContributionsToday,
  StyledContributionsLegend,
  StyledContributionsLegendScale,
  StyledContributionLegendCell,
  StyledContributionsStats,
  StyledContributionStat,
  StyledContributionStatValue,
  StyledContributionStatLabel,
  StyledContributionCell,
} from './Contributions.styles';
import { formatPeriod, localToday } from './useContributions';
import contributionsData from '@/data/contributions.json';
import {
  CONTRIBUTION_LEVELS,
  getContributionDescription,
  getContributionLevel,
} from '@/types/contributions';
import type { ContributionsData } from '@/types/contributions';

export interface ContributionsProps {
  /** Overridable so the component can be driven from a test fixture. */
  data?: ContributionsData;
}

const formatNumber = (value: number): string =>
  new Intl.NumberFormat('es-ES').format(value);

const formatTotal = (value: number): string =>
  value === 1 ? '1 contribución en total' : `${formatNumber(value)} contribuciones en total`;

/** The day in words, with no date: the section header already states the period. */
const describeToday = (count: number): string => {
  if (count === 0) return 'sin contribuciones';
  return `${formatNumber(count)} ${count === 1 ? 'contribución' : 'contribuciones'}`;
};

export const Contributions = ({ data }: ContributionsProps) => {
  const contributions = (data ?? contributionsData) as ContributionsData;
  const scrollerRef = useRef<HTMLDivElement>(null);

  /* The strip is wider than any phone, so the browser leaves it at the far left, which is the
     oldest week of the year. Today's cell sat 416px away at 390px wide and 486px at 320px: the
     data was always right and the cell was simply off-screen, which is why this read as "no
     pushes today" rather than as a scroll problem. GitHub's own graph opens at the recent end.

     useLayoutEffect rather than useEffect so the jump happens before the first paint; with the
     passive effect the browser would show the oldest month for a frame before correcting itself.
     Assigning scrollLeft is not an animation, so it needs no reduced-motion branch, and where
     there is no overflow the assignment is a no-op rather than an error. Mount only: re-running it
     on re-render would fight a visitor who has scrolled the strip themselves. */
  useLayoutEffect(() => {
    const strip = scrollerRef.current;
    if (strip) strip.scrollLeft = strip.scrollWidth;
  }, []);

  // The whole section hides itself when the build could not fetch a calendar. An empty grid
  // would read as a year without work, which is the opposite of what happened.
  if (!contributions?.calendar?.weeks?.length) {
    return null;
  }

  /* Compared against the visitor's own date rather than assuming the last cell is today: when a
     build is stale the two diverge and both the label and the cell's description would name a day
     that has already passed. The basis is local rather than UTC. The stored dates were produced in
     the build runner's timezone, so matching them against the UTC date agrees with the data source
     while describing someone else's day; at 21:14 in UTC-3 the UTC date is already tomorrow, and
     the label then reported a day minutes old and empty as the whole truth for today. Amendment 2. */
  const today = localToday();

  const { weeks, totalContributions } = contributions.calendar;
  const { summary } = contributions;

  const todayDay = weeks.flatMap((week) => week.days).find((day) => day.date === today);

  const firstDay = weeks[0]!.days[0]!.date;
  const lastDay = weeks[weeks.length - 1]!.days.at(-1)!.date;

  const stats = [
    { value: formatNumber(summary.totalContributions), label: 'Contribuciones' },
    { value: formatNumber(summary.activeDays), label: 'Días activos' },
    { value: formatNumber(summary.longestStreak), label: 'Mejor racha' },
    { value: formatNumber(summary.averagePerWeek), label: 'Media semanal' },
  ];

  return (
    <StyledContributions aria-labelledby="contributions-title">
      <StyledContributionsHeader>
        <StyledContributionsTitle id="contributions-title">
          Contribuciones en GitHub
        </StyledContributionsTitle>
        <StyledContributionsPeriod>
          {formatPeriod(firstDay)} - {formatPeriod(lastDay)}
        </StyledContributionsPeriod>
      </StyledContributionsHeader>

      <StyledContributionsScroller
        ref={scrollerRef}
        tabIndex={0}
        role="group"
        aria-label={`Calendario de contribuciones de ${contributions.username}, de ${formatPeriod(
          firstDay
        )} a ${formatPeriod(
          lastDay
        )}. ${formatTotal(totalContributions)}. Desplazamiento horizontal para ver el año completo.`}
      >
        <StyledContributionsContent data-testid="contributions-content">
          <StyledContributionsGrid>
            {/* Flattened into one grid rather than nested per week: the grid already lays itself
                out in columns of seven, so wrapping each week in a fragment keeps the cells in
                reading order without adding a layer of elements. */}
            {weeks.flatMap((week) =>
              week.days.map((day) => {
                const isToday = day.date === today;
                const description = getContributionDescription(day);
                return (
                  <StyledContributionCell
                    key={day.date}
                    $level={getContributionLevel(day.count)}
                    title={isToday ? `${description} (hoy)` : description}
                    aria-label={isToday ? `${description} (hoy)` : description}
                  />
                );
              })
            )}
          </StyledContributionsGrid>

          {/* Inside the scroller and sized to the grid, so it lands under today's column at
              every viewport rather than under the container's right edge. */}
          {todayDay && (
            <StyledContributionsToday aria-hidden="true" data-testid="contributions-today">
              Hoy · {describeToday(todayDay.count)}
            </StyledContributionsToday>
          )}
        </StyledContributionsContent>
      </StyledContributionsScroller>

      <StyledContributionsLegend>
        <span>Menos</span>
        <StyledContributionsLegendScale>
          {CONTRIBUTION_LEVELS.map((level, index) => (
            <StyledContributionLegendCell
              key={level.label}
              $level={index}
              title={level.label}
            />
          ))}
        </StyledContributionsLegendScale>
        <span>Más</span>
      </StyledContributionsLegend>

      <StyledContributionsStats>
        {stats.map((stat) => (
          <StyledContributionStat key={stat.label}>
            <StyledContributionStatValue>{stat.value}</StyledContributionStatValue>
            <StyledContributionStatLabel>{stat.label}</StyledContributionStatLabel>
          </StyledContributionStat>
        ))}
      </StyledContributionsStats>
    </StyledContributions>
  );
};
