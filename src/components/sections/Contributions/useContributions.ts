/** Month and year, in Spanish, for the calendar's period line. */
export function formatPeriod(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * The visitor's own calendar date, as YYYY-MM-DD.
 *
 * Built from the local getters on purpose, and NOT from `toISOString()`. The stored dates come
 * from a build runner in UTC, so comparing them against the UTC date matches the data source
 * while telling the reader about someone else's day: at 21:14 in UTC-3 the UTC date is already
 * tomorrow, and the label then reported a day that had begun minutes ago and held no work.
 * "Today" belongs to whoever is looking at the page, which is the same basis GitHub's own graph
 * uses.
 *
 * Formatted by hand rather than with `Intl` or `toLocaleDateString` because both can emit a
 * different calendar under some locales, and the value is compared against a plain ISO string.
 */
export function localToday(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * How many hours ago the calendar was fetched, or null when that cannot be known.
 *
 * The age is computed from `fetchedAt` and never from the calendar's last day. A last day says which day
 * the data covers; it says nothing about when the data was read. On this repository the two differ by
 * most of a working day, because the fetch happens once and the page is read all day.
 *
 * Negative is returned rather than clamped. Clock skew between a build runner and a visitor is real and
 * small, and the caller treats a negative age as current rather than inventing a reading of the future.
 *
 * Null covers the two cases that are not "zero hours old": the field is absent from every build made
 * before this existed, and it is a string that does not parse. Neither is a reason to render a date the
 * visitor will read.
 */
export function dataAge(fetchedAt: string | undefined, now: Date = new Date()): number | null {
  if (!fetchedAt) return null;

  const entonces = new Date(fetchedAt);
  if (Number.isNaN(entonces.getTime())) return null;

  return (now.getTime() - entonces.getTime()) / 3_600_000;
}

/**
 * Whether a number stops being describable as "today".
 *
 * Three hours is the point at which "Hoy" stops being true rather than merely imprecise, and it is a
 * named constant because a threshold written inline is one nobody finds when it needs changing. No caller
 * has a reason to move it, so it is not a prop.
 *
 * An unknown age is not stale. Guessing would mean reading the last cell and presenting it as freshness,
 * which is the substitution `specs/010`'s Amendment 2 refused for the same reason.
 */
export const STALE_AFTER_HOURS = 3;

export function isStale(
  fetchedAt: string | undefined,
  now: Date = new Date(),
  thresholdHours: number = STALE_AFTER_HOURS
): boolean {
  const age = dataAge(fetchedAt, now);
  if (age === null) return false;

  // A negative age is a clock skew, not a build from the future. Treating it as current avoids a line
  // that names an hour the visitor has not reached yet.
  return age >= thresholdHours;
}

/**
 * The hour the calendar was read, in the reader's own timezone.
 *
 * An absolute instant rendered in the visitor's zone is the only reading that is about them, which is the
 * same decision `localToday` makes for the date. es-ES with a two-digit hour and no seconds is chosen so
 * the line reads "a las 05:37" rather than "a las 05:37:00".
 */
export function formatFetchHour(fetchedAt: string, locale = 'es-ES'): string {
  return new Date(fetchedAt).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}
