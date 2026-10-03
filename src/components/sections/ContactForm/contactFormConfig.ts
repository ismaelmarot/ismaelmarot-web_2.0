/**
 * Build-time configuration for the contact form.
 *
 * Kept apart from the component so a missing key is a distinct condition from a failed
 * submission: a visitor whose form was never configured cannot be told to try again.
 */
export function getAccessKey(): string | undefined {
  const key = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim();
  return key ? key : undefined;
}

export function isContactFormConfigured(): boolean {
  return getAccessKey() !== undefined;
}