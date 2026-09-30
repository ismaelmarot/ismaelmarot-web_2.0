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