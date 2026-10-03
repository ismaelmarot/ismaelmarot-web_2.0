import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

/**
 * Apple-leaning form styling: one column, generous vertical rhythm, a single hairline
 * border per control and no decoration that does not carry meaning.
 */
export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[5]};
  width: 100%;
  /* The contact section centres its content. A form column reads badly centred, so the
     form opts back to the left here. */
  text-align: left;
`;

export const StyledFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[4]};
`;

export const StyledControl = styled.input<{ $invalid?: boolean }>`
  width: 100%;
  padding: ${tokens.space[3]} ${tokens.space[4]};
  font-family: ${tokens.fonts.sans};
  font-size: var(--text-body);
  color: ${tokens.colors.textPrimary};
  background-color: ${tokens.colors.bg};
  border: 1px solid
    ${({ $invalid }) => ($invalid ? tokens.colors.danger : tokens.colors.border)};
  border-radius: ${tokens.radii.md};
  transition: border-color ${tokens.transitions.fast};

  &::placeholder {
    color: ${tokens.colors.textTertiary};
  }

  &:hover:not(:disabled) {
    border-color: ${({ $invalid }) =>
      $invalid ? tokens.colors.danger : tokens.colors.fgMuted};
  }

  &:disabled {
    opacity: 0.6;
  }
`;

export const StyledTextarea = styled.textarea<{ $invalid?: boolean }>`
  width: 100%;
  min-height: 132px;
  padding: ${tokens.space[3]} ${tokens.space[4]};
  font-family: ${tokens.fonts.sans};
  font-size: var(--text-body};
  line-height: ${tokens.lineHeights.normal};
  color: ${tokens.colors.textPrimary};
  background-color: ${tokens.colors.bg};
  border: 1px solid
    ${({ $invalid }) => ($invalid ? tokens.colors.danger : tokens.colors.border)};
  border-radius: ${tokens.radii.md};
  resize: vertical;
  transition: border-color ${tokens.transitions.fast};

  &:hover:not(:disabled) {
    border-color: ${({ $invalid }) =>
      $invalid ? tokens.colors.danger : tokens.colors.fgMuted};
  }

  &:disabled {
    opacity: 0.6;
  }
`;

export const StyledConsentRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${tokens.space[3]};
`;

export const StyledCheckbox = styled.input`
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  margin: 2px 0 0;
  accent-color: ${tokens.colors.accent};
  cursor: pointer;

  &:disabled {
    cursor: default;
  }
`;

export const StyledConsentText = styled.label`
  font-size: var(--text-label);
  line-height: ${tokens.lineHeights.normal};
  color: ${tokens.colors.textSecondary};
  cursor: pointer;
`;

export const StyledNote = styled.p`
  margin: ${tokens.space[2]} 0 0;
  font-size: var(--text-label);
  line-height: ${tokens.lineHeights.normal};
  color: ${tokens.colors.textTertiary};
`;

export const StyledActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[3]};
`;

export const StyledStatus = styled.p<{ $tone: 'success' | 'danger' }>`
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${tokens.space[2]};
  font-size: var(--text-label);
  font-weight: ${tokens.fontWeights.medium};
  color: ${({ $tone }) =>
    $tone === 'success' ? tokens.colors.textSuccess : tokens.colors.textDanger};
`;

/** Shown when the build carries no access key. Not the same as a failed submission. */
export const StyledUnavailable = styled.p`
  margin: 0;
  padding: ${tokens.space[4]};
  font-size: var(--text-label);
  line-height: ${tokens.lineHeights.normal};
  text-align: left;
  color: ${tokens.colors.textSecondary};
  background-color: ${tokens.colors.bgMuted};
  border-radius: ${tokens.radii.md};
`;

/** The honeypot. Kept in the accessibility tree and the tab order out of reach. */
export const StyledHoneypot = styled.div`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;
/**
 * The consent row is not a FormField: its label sits beside the box rather than above it,
 * so the association is written here instead of being forced into the field primitive.
 */
export const StyledConsentError = styled.p`
  margin: 0;
  padding-left: ${tokens.space[3]};
  font-size: var(--text-label);
  font-weight: ${tokens.fontWeights.medium};
  color: ${tokens.colors.textDanger};
`;
