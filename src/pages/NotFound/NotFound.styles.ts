import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledNotFound = styled.div`
  text-align: center;
`;

export const StyledNotFoundTitle = styled.h1`
  font-size: ${tokens.fontSizes['6xl']};
  font-weight: ${tokens.fontWeights.bold};
  color: ${tokens.colors.textPrimary};
  margin-bottom: ${tokens.space[4]};
  line-height: ${tokens.lineHeights.display};
`;

export const StyledNotFoundText = styled.p`
  font-size: ${tokens.fontSizes.lg};
  color: ${tokens.colors.textSecondary};
  margin-bottom: ${tokens.space[8]};
  line-height: ${tokens.lineHeights.relaxed};
`;

export const StyledNotFoundCta = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  padding: ${tokens.space[3]} ${tokens.space[6]};
  margin-top: ${tokens.space[6]};
  font-family: ${tokens.fonts.sans};
  font-size: ${tokens.fontSizes.lg};
  font-weight: ${tokens.fontWeights.medium};
  text-decoration: none;
  white-space: nowrap;
  border-radius: ${tokens.radii.full};
  background-color: ${tokens.colors.primary};
  color: ${tokens.colors.white};
  transition: background-color 120ms ease-out;

  &:hover {
    background-color: ${tokens.colors.primaryHover};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.focus};
    outline-offset: 2px;
  }
`;
