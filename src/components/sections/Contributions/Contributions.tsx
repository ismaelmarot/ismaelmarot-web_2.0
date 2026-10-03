import {
  StyledContributions,
  StyledContributionsHeader,
  StyledContributionsTitle,
  StyledContributionsPeriod,
  StyledContributionsScroller,
  StyledContributionsGrid,
  StyledContributionsLegend,
  StyledContributionsLegendScale,
  StyledContributionLegendCell,
  StyledContributionsStats,
  StyledContributionStat,
  StyledContributionStatValue,
  StyledContributionStatLabel,
  StyledContributionCell,
} from './Contributions.styles';
import { formatPeriod } from './useContributions';
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

export const Contributions = ({ data }: ContributionsProps) => {
  const contributions = (data ?? contributionsData) as ContributionsData;

  // The whole section hides itself when the build could not fetch a calendar. An empty grid
  // would read as a year without work, which is the opposite of what happened.
  if (!contributions?.calendar?.weeks?.length) {
    return null;
  }

  const { weeks, totalContributions } = contributions.calendar;
  const { summary } = contributions;

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
        tabIndex={0}
        role="group"
        aria-label={`Calendario de contribuciones de ${contributions.username}, de ${formatPeriod(
          firstDay
        )} a ${formatPeriod(
          lastDay
        )}. ${formatTotal(totalContributions)}. Desplazamiento horizontal para ver el año completo.`}
      >
        <StyledContributionsGrid>
          {/* Flattened into one grid rather than nested per week: the grid already lays itself
              out in columns of seven, so wrapping each week in a fragment keeps the cells in
              reading order without adding a layer of elements. */}
          {weeks.flatMap((week) =>
            week.days.map((day) => (
              <StyledContributionCell
                key={day.date}
                $level={getContributionLevel(day.count)}
                title={getContributionDescription(day)}
                aria-label={getContributionDescription(day)}
              />
            ))
          )}
        </StyledContributionsGrid>
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
