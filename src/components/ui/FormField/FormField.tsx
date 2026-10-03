import type { ReactNode } from 'react';
import {
  StyledField,
  StyledLabel,
  StyledRequiredMark,
  StyledControl,
  StyledHint,
  StyledError,
} from './FormField.styles';

export interface FormFieldRenderProps {
  id: string;
  'aria-describedby': string | undefined;
  'aria-invalid': boolean | undefined;
}

export interface FormFieldProps {
  id: string;
  label: string;
  /** Shown under the control while there is no error. Replaced by the error, not stacked. */
  hint?: string;
  error?: string;
  required?: boolean;
  /**
   * Supplies the control. The render prop exists so the id, the description link and the
   * invalid flag are written once here instead of being copied across every field, where
   * they would drift apart.
   */
  children: (props: FormFieldRenderProps) => ReactNode;
}

/**
 * A label, its control, and the hint or error that describes it.
 *
 * The error takes the place of the hint rather than appearing next to it, so a field never
 * shows two descriptions at once.
 *
 * Field errors deliberately carry no live-region role: `aria-invalid` plus
 * `aria-describedby` makes the error announced when focus reaches the field, and a live
 * region would announce it a second time at the moment it appears. The form announces its
 * own progress and outcome separately.
 */
export const FormField = ({
  id,
  label,
  hint,
  error,
  required = false,
  children,
}: FormFieldProps) => {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <StyledField>
      <StyledLabel htmlFor={id}>
        {label}
        {required && (
          <StyledRequiredMark aria-hidden="true"> *</StyledRequiredMark>
        )}
      </StyledLabel>

      <StyledControl $invalid={Boolean(error)}>{children({
        id,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
      })}</StyledControl>

      {error ? (
        <StyledError id={errorId}>{error}</StyledError>
      ) : (
        hint && <StyledHint id={hintId}>{hint}</StyledHint>
      )}
    </StyledField>
  );
};