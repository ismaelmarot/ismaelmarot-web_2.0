import { useCallback, useEffect, useRef, useState } from 'react';
import type { ContactFormValues, SubmissionStatus, ValidationErrors } from '@/types/contact';
import { submitContactForm } from './submitContactForm';
import { getAccessKey, isContactFormConfigured } from './contactFormConfig';
import { validateContactForm } from './validateContactForm';

const EMPTY_VALUES: ContactFormValues = {
  name: '',
  email: '',
  message: '',
  consent: false,
};

export interface UseContactFormReturn {
  values: ContactFormValues;
  status: SubmissionStatus;
  /** Which fields are currently wrong, keyed by field name. */
  errors: ValidationErrors;
  /** Visitor-facing failure copy. Undefined unless the last attempt failed. */
  errorMessage: string | undefined;
  /** False when the build carries no access key, which is its own condition, not a failure. */
  isConfigured: boolean;
  setField: <K extends keyof ContactFormValues>(
    field: K,
    value: ContactFormValues[K]
  ) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export function useContactForm(): UseContactFormReturn {
  const [values, setValues] = useState<ContactFormValues>(EMPTY_VALUES);
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const isConfigured = isContactFormConfigured();

  // The guard lives in a ref, not in the state, because two activations in the same tick
  // would both read the same stale status. The disabled control is the visible half; this
  // is the half that actually guarantees a single delivery.
  const inFlight = useRef(false);
  const controller = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      controller.current?.abort();
    };
  }, []);

  const setField = useCallback(
    <K extends keyof ContactFormValues>(field: K, value: ContactFormValues[K]) => {
      const next = { ...values, [field]: value } as ContactFormValues;
      setValues(next);

      // Re-check a field only once it has been flagged. Validating on every keystroke from
      // the start would tell someone who is still typing their email that it is wrong.
      setErrors((current) => {
        if (!(field in current)) return current;

        const message = validateContactForm(next)[field];
        if (message) {
          return current[field] === message ? current : { ...current, [field]: message };
        }

        const { [field]: _cleared, ...rest } = current;
        return rest;
      });

      // Typing again clears a previous outcome, so a confirmation or a failure does not sit
      // above a form the visitor has already changed.
      setStatus((current) => (current === 'sending' ? current : 'idle'));
      setErrorMessage(undefined);
    },
    [values]
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (inFlight.current) return;

      const accessKey = getAccessKey();
      if (!accessKey) return;

      const validation = validateContactForm(values);
      setErrors(validation);

      if (Object.keys(validation).length > 0) {
        setStatus('invalid');
        // Move focus to the first problem, otherwise an error that appears away from where
        // the visitor is looking is never announced.
        const firstInvalid = (['name', 'email', 'message', 'consent'] as const).find(
          (field) => field in validation
        );
        if (firstInvalid) {
          // currentTarget is the form itself, so no ref has to be threaded through for this.
          event.currentTarget
            .querySelector<HTMLElement>(`#contact-${firstInvalid}`)
            ?.focus();
        }
        return;
      }

      inFlight.current = true;
      setStatus('sending');
      setErrorMessage(undefined);

      const abort = new AbortController();
      controller.current = abort;

      try {
        const result = await submitContactForm({
          values: {
            ...values,
            // Trimmed here rather than only for validation, so the owner does not receive a
            // message padded with stray spaces from a paste.
            name: values.name.trim(),
            email: values.email.trim(),
            message: values.message.trim(),
          },
          accessKey,
          signal: abort.signal,
        });

        if (result.ok) {
          setStatus('sent');
          setValues(EMPTY_VALUES);
          setErrors({});
        } else {
          // The typed values are deliberately left in place: losing a composed message is
          // the most expensive failure this form can have.
          setStatus('failed');
          setErrorMessage(result.message);
        }
      } finally {
        inFlight.current = false;
        controller.current = null;
      }
    },
    [values]
  );

  return {
    values,
    status,
    errors,
    errorMessage,
    isConfigured,
    setField,
    handleSubmit,
  };
}
