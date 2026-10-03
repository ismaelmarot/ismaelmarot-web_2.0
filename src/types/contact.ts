export interface ContactMethod {
  id: string;
  type: ContactType;
  label: string;
  value: string;
  iconName: string;
  displayOrder?: number;
  isPrimary?: boolean;
}

export type ContactType =
  | 'email'
  | 'github'
  | 'linkedin'
  | 'twitter'
  | 'website'
  | 'other';

export function getContactTypeIcon(type: ContactType): string {
  const icons: Record<ContactType, string> = {
    email: 'mail',
    github: 'github',
    linkedin: 'linkedin',
    twitter: 'twitter',
    website: 'globe',
    other: 'link',
  };
  return icons[type] || 'link';
}

export function getContactHref(method: ContactMethod): string {
  switch (method.type) {
    case 'email':
      return `mailto:${method.value}`;
    case 'github':
    case 'linkedin':
    case 'twitter':
    case 'website':
    case 'other':
      return method.value.startsWith('http') ? method.value : `https://${method.value}`;
    default:
      return method.value;
  }
}

export function isExternalLink(type: ContactType): boolean {
  return type !== 'email';
}

/**
 * The short, recognisable part of a destination: `github.com`, `linkedin.com`, `hotmail.com`.
 *
 * The card shows this instead of the full value, because the account and the profile path are
 * noise on a card whose job is to say which service it opens. The full value stays on the link
 * and in the accessible name, so nothing is lost to a screen reader.
 *
 * Falls back to the raw value when it cannot be parsed: a card showing the whole string is
 * harmless, a card showing an empty one is not.
 */
export function getContactDomain(value: string): string {
  const trimmed = value.trim();

  // Blank input returns the original rather than the trimmed empty string, so a method with no
  // value renders its own text instead of a card with nothing in it.
  if (trimmed === '') {
    return value;
  }

  const at = trimmed.lastIndexOf('@');
  if (at !== -1) {
    return trimmed.slice(at + 1);
  }

  // A URL, with or without a scheme, so a bare "github.com/user" also resolves.
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const { hostname } = new URL(withScheme);
    return hostname.replace(/^www\./i, '') || trimmed;
  } catch {
    return trimmed;
  }
}
