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

export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch {
    return dateString;
  }
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