import styled, { css } from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[2]};
  text-align: left;
`;

export const StyledLabel = styled.label`
  font-size: var(--text-label);
  font-weight: ${tokens.fontWeights.medium};
  color: ${tokens.colors.textPrimary};
`;

export const StyledRequiredMark = styled.span`
  color: ${tokens.colors.textDanger};
`;

export const StyledControl = styled.div<{ $invalid: boolean }>`
  /* The invalid border reuses the danger colour because a lighter tint cannot reach the
     3:1 that a non-text indicator needs on the muted background. The message below the
     field is what carries the meaning, so the border reinforces rather than conveys it. */
  ${({ $invalid }) => $invalid && css`
    & > input,
    & > textarea {
      border-color: ${tokens.colors.danger};
    }
  `}
`;

export const StyledHint = styled.p`
  margin: 0;
  font-size: var(--text-label);
  color: ${tokens.colors.textSecondary};
`;

export const StyledError = styled.p`
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${tokens.space[1]};
  font-size: var(--text-label);
  font-weight: ${tokens.fontWeights.medium};
  color: ${tokens.colors.textDanger};
`;