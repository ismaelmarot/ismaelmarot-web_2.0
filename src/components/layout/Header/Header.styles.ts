import styled, { css } from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledHeader = styled.header<{
  $sticky: boolean;
  $transparent: boolean;
  $isScrolled: boolean;
}>`
  position: ${({ $sticky }) => ($sticky ? 'fixed' : 'relative')};
  top: 0;
  left: 0;
  right: 0;
  z-index: ${tokens.zIndices.sticky};
  transition: background-color 200ms ease-out, backdrop-filter 200ms ease-out;

  ${({ $transparent, $isScrolled }) =>
    $transparent && !$isScrolled
      ? css`
          background-color: transparent;
          backdrop-filter: none;
        `
      : css`
          background-color: ${tokens.colors.background};
          backdrop-filter: blur(8px);
        `}
`;

export const StyledInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding-inline: ${tokens.space[6]};
  max-width: ${tokens.containers.xl};
  margin-inline: auto;
`;

export const StyledBrand = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledLogo = styled.a`
  font-size: ${tokens.fontSizes.xl};
  font-weight: ${tokens.fontWeights.bold};
  color: ${tokens.colors.textPrimary};
  text-decoration: none;

  &:hover {
    color: ${tokens.colors.primary};
  }
`;

export const StyledNavWrapper = styled.nav`
  display: flex;
  align-items: center;
  gap: ${tokens.space[8]};

  @media (max-width: 767px) {
    display: none;
  }
`;

export const StyledCtaWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.space[3]};
`;