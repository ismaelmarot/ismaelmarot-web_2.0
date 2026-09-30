import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

const containerSizes = {
  sm: tokens.containers.sm,
  md: tokens.containers.md,
  lg: tokens.containers.lg,
  xl: tokens.containers.xl,
  full: 'none',
} as const;

const containerPaddings = {
  none: '0',
  sm: tokens.space[4],
  md: tokens.space[6],
  lg: tokens.space[8],
} as const;

export const StyledContainer = styled.div<{
  $size: keyof typeof containerSizes;
  $padding: keyof typeof containerPaddings;
}>`
  width: 100%;
  margin-inline: auto;
  max-width: ${({ $size }) => containerSizes[$size]};
  padding-inline: ${({ $padding }) => containerPaddings[$padding]};

  @media (max-width: 767px) {
    padding-inline: ${tokens.space[4]};
  }
`;