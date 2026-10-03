import styled, { css, keyframes } from 'styled-components';
import { tokens } from '@/styles/tokens';

export const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const StyledButton = styled.button<{
  $variant: 'primary' | 'secondary' | 'ghost' | 'outline';
  $size: 'sm' | 'md' | 'lg';
  $fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${tokens.space[2]};
  font-family: ${tokens.fonts.sans};
  font-weight: ${tokens.fontWeights.medium};
  border: none;
  border-radius: ${tokens.radii.full};
  cursor: pointer;
  transition: all 120ms ease-out;
  text-decoration: none;
  white-space: nowrap;

  ${({ $variant }) => {
    switch ($variant) {
      case 'primary':
        return css`
          background-color: ${tokens.colors.primary};
          color: white;
          &:hover:not(:disabled) {
            background-color: ${tokens.colors.primaryHover};
          }
        `;
      case 'secondary':
        return css`
          background-color: ${tokens.colors.bgMuted};
          color: ${tokens.colors.textPrimary};
          border: 1px solid ${tokens.colors.border};
          &:hover:not(:disabled) {
            background-color: ${tokens.colors.bgAccent};
          }
        `;
      case 'ghost':
        return css`
          background-color: transparent;
          color: ${tokens.colors.textPrimary};
          &:hover:not(:disabled) {
            background-color: ${tokens.colors.bgMuted};
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          color: ${tokens.colors.primary};
          border: 1px solid ${tokens.colors.primary};
          &:hover:not(:disabled) {
            background-color: ${tokens.colors.primaryLight};
            color: ${tokens.colors.primaryHover};
          }
        `;
    }
  }}

  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return css`
          padding: ${tokens.space[1]} ${tokens.space[3]};
          font-size: ${tokens.fontSizes.sm};
          height: 36px;
        `;
      case 'md':
        return css`
          padding: ${tokens.space[2]} ${tokens.space[4]};
          font-size: ${tokens.fontSizes.base};
          height: 44px;
        `;
      case 'lg':
        return css`
          padding: ${tokens.space[3]} ${tokens.space[6]};
          font-size: ${tokens.fontSizes.lg};
          height: 52px;
        `;
    }
  }}

  ${({ $fullWidth }) => $fullWidth && css`width: 100%;`}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.focus};
    outline-offset: 2px;
  }
`;

export const StyledContent = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledIconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const StyledSpinner = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  animation: ${spin} 1s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;