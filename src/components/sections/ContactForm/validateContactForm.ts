import { CONTACT_FORM_LIMITS } from '@/types/contact';
import type { ContactFormValues, ValidationErrors } from '@/types/contact';

/**
 * Deliberately permissive. A pattern strict enough to be satisfying also rejects addresses
 * people really use, and a visitor who is told their own address is invalid stops trusting
 * the form. This one requires a local part, an at sign, a domain and a plausible top level
 * domain, and rejects the mistakes that actually happen: a missing at sign, a missing dot, or
 * a space where one should not be.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const MESSAGES = {
  nameRequired: 'El nombre es obligatorio.',
  nameTooLong: `El nombre no puede superar los ${CONTACT_FORM_LIMITS.name} caracteres.`,
  emailRequired: 'El email es obligatorio.',
  emailInvalid: 'Introduce un email válido, por ejemplo ada@example.com.',
  emailTooLong: `El email no puede superar los ${CONTACT_FORM_LIMITS.email} caracteres.`,
  messageRequired: 'El mensaje es obligatorio.',
  messageTooLong: `El mensaje no puede superar los ${CONTACT_FORM_LIMITS.message} caracteres.`,
  consentRequired: 'Necesito tu consentimiento para usar tus datos y responderte.',
} as const;

/**
 * Pure validation of one attempt. Returns a record of only the fields that failed, which is
 * what lets each problem be pointed at the field that caused it.
 */
export function validateContactForm(values: ContactFormValues): ValidationErrors {
  const errors: ValidationErrors = {};

  const name = values.name.trim();
  if (!name) {
    errors.name = MESSAGES.nameRequired;
  } else if (name.length > CONTACT_FORM_LIMITS.name) {
    errors.name = MESSAGES.nameTooLong;
  }

  const email = values.email.trim();
  if (!email) {
    errors.email = MESSAGES.emailRequired;
  } else if (email.length > CONTACT_FORM_LIMITS.email) {
    errors.email = MESSAGES.emailTooLong;
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = MESSAGES.emailInvalid;
  }

  const message = values.message.trim();
  if (!message) {
    errors.message = MESSAGES.messageRequired;
  } else if (message.length > CONTACT_FORM_LIMITS.message) {
    errors.message = MESSAGES.messageTooLong;
  }

  if (!values.consent) {
    errors.consent = MESSAGES.consentRequired;
  }

  return errors;
}