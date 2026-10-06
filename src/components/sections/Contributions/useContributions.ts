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
