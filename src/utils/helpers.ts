export const NO_DESCRIPTION_FALLBACK = 'No description available';

/**
 * A repository name, written the way it reads rather than the way GitHub stores it.
 *
 * Only names carrying a hyphen are rewritten, and that guard is the whole rule: `LinkIO`,
 * `QEntry` and `NauticAcademy` carry capitals on purpose, and a general title-case would turn them
 * into `Linkio`, `Qentry` and `Nauticacademy`. `trash2treasure` has no hyphen and stays as it is.
 *
 * `filter(Boolean)` drops empty segments so a leading or trailing hyphen cannot leave a phantom space:
 * without it `-leading` became " Leading" and `trailing-` became "Trailing ", which then reads as
 * indented in the card.
 *
 * Presentation only. Routes use the numeric id, and outbound links use the URL fields, so nothing
 * here reaches a link.
 */
export function formatProjectName(name: string): string {
  if (!name.includes('-')) return name;
  return name
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1).trimEnd() + '…';
}

const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      ...DEFAULT_DATE_OPTIONS,
      ...options,
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const megabytes = bytes / (1024 * 1024);
  if (megabytes < 1024) return `${megabytes.toFixed(1)} MB`;
  return `${(megabytes / 1024).toFixed(1)} GB`;
}

export function formatKilobytes(kilobytes: number): string {
  if (kilobytes < 1024) return `${kilobytes} KB`;
  return `${(kilobytes / 1024).toFixed(1)} MB`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getTechCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    language: '#3178c6',
    framework: '#e34c26',
    tool: '#f0db4f',
    database: '#336791',
    cloud: '#ff9900',
    testing: '#c21325',
    other: '#6e6e73',
  };
  return colors[category] || '#6e6e73';
}

export function getTechCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    language: 'Languages',
    framework: 'Frameworks',
    tool: 'Tools',
    database: 'Databases',
    cloud: 'Cloud & DevOps',
    testing: 'Testing',
    other: 'Other',
  };
  return labels[category] || category;
}

export function getProjectTypeLabel(projectType: string | undefined): string {
  return projectType === 'mobile' ? 'Go Live App' : 'Go Live';
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}