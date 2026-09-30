import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledFooter = styled.footer<{ $variant: 'minimal' | 'full' }>`
  border-top: 1px solid ${tokens.colors.border};
  padding-block: ${({ $variant }) => ($variant === 'minimal' ? tokens.space[8] : tokens.space[16])};
  background-color: ${tokens.colors.background};
`;

export const StyledInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${tokens.space[6]};
  max-width: ${tokens.containers.xl};
  margin-inline: auto;
  padding-inline: ${tokens.space[6]};
`;

export const StyledCopyright = styled.p`
  font-size: ${tokens.fontSizes.sm};
  color: ${tokens.colors.textMuted};
`;

export const StyledSocialLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.space[4]};
`;

export const StyledNavWrapper = styled.nav`
  display: flex;
  align-items: center;
  gap: ${tokens.space[6]};
  font-size: ${tokens.fontSizes.sm};
  color: ${tokens.colors.textMuted};
`;