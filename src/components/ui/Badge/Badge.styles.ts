import styled, { css } from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledBadge = styled.span<{
  $variant: 'default' | 'outline' | 'subtle' | 'tech';
  $size: 'sm' | 'md';
}>`
  display: inline-flex;
  align-items: center;
  gap: ${tokens.space[1]};
  font-family: ${tokens.fonts.sans};
  font-weight: ${tokens.fontWeights.medium};
  border-radius: ${tokens.radii.full};
  white-space: nowrap;

  ${({ $variant }) => {
    switch ($variant) {
      case 'default':
        return css`
          background-color: ${tokens.colors.bgMuted};
          color: ${tokens.colors.textSecondary};
          border: 1px solid ${tokens.colors.border};
        `;
      case 'outline':
        return css`
          background-color: transparent;
          color: ${tokens.colors.textPrimary};
          border: 1px solid ${tokens.colors.border};
        `;
      case 'subtle':
        return css`
          background-color: ${tokens.colors.bgAccent};
          color: ${tokens.colors.textPrimary};
        `;
      case 'tech':
        return css`
          background-color: ${tokens.colors.primaryLight};
          color: ${tokens.colors.textPrimary};
          border: 1px solid ${tokens.colors.border};
        `;
    }
  }}

  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return css`
          padding: ${tokens.space[1]} ${tokens.space[2]};
          font-size: ${tokens.fontSizes.xs};
        `;
      case 'md':
        return css`
          padding: ${tokens.space[1]} ${tokens.space[3]};
          font-size: ${tokens.fontSizes.sm};
        `;
    }
  }}
`;

export const StyledDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: ${tokens.radii.full};
  background-color: var(--badge-dot-color);
  flex-shrink: 0;
`;