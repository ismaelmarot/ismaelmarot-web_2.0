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
/* ---------------------------------------------------------------------------------
 * Contact form
 *
 * The portfolio keeps no visitor data: these live in component state and are cleared
 * after a successful send.
 * -------------------------------------------------------------------------------- */

/** Maximums are declared to the visitor before they type, so the limit is never a surprise. */
export const CONTACT_FORM_LIMITS = {
  name: 100,
  email: 254,
  message: 2000,
} as const;

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
  consent: boolean;
}

export type ContactFormValuesKey = keyof ContactFormValues;

/**
 * Where one attempt stands. `sending` is the only state that blocks a further submit,
 * so a retry after a failure needs no extra step.
 */
export type SubmissionStatus = 'idle' | 'invalid' | 'sending' | 'sent' | 'failed';

/** Only the fields that failed appear, which is what lets each problem be pointed at. */
export type ValidationErrors = Partial<Record<ContactFormValuesKey, string>>;

/** Why a submission did not reach the service. */
export type SubmitFailureReason = 'network' | 'timeout' | 'rejected' | 'provider';
