import styled, { css } from 'styled-components';

export const StyledHeader = styled.header<{
  $sticky: boolean;
  $transparent: boolean;
  $isScrolled: boolean;
}>`
  position: ${({ $sticky }) => ($sticky ? 'fixed' : 'relative')};
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-sticky);
  transition: background-color var(--transition-normal), backdrop-filter var(--transition-normal);

  ${({ $transparent, $isScrolled }) =>
    $transparent && !$isScrolled
      ? css`
          background-color: transparent;
          backdrop-filter: none;
        `
      : css`
          background-color: var(--color-bg);
          backdrop-filter: blur(8px);
        `}
`;

export const StyledInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding-inline: var(--space-6);
  max-width: var(--container-xl);
  margin-inline: auto;
`;

export const StyledBrand = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledLogo = styled.a`
  font-size: var(--text-label);
  font-weight: 500;
  color: var(--color-fg);
  text-decoration: none;
  transition: color var(--transition-fast);

  &:hover {
    color: var(--color-accent);
  }
`;

export const StyledNavWrapper = styled.nav`
  display: flex;
  align-items: center;
  gap: var(--space-8);

  @media (max-width: 767px) {
    display: none;
  }
`;

export const StyledCtaWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
`;