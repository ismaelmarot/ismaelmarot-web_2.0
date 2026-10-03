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
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--color-border);
        `}
`;

export const StyledInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
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
  letter-spacing: 0.02em;
  color: var(--color-fg);
  text-decoration: none;
  transition: color var(--transition-fast);

  &:hover {
    color: var(--color-fg-muted);
  }
`;

export const StyledNavWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-8);

  @media (max-width: 1023px) {
    gap: var(--space-4);
  }
`;

export const StyledCtaWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-label);

  a {
    color: var(--color-accent-text);
    text-decoration: none;
    transition: color var(--transition-fast);

    &:hover {
      color: var(--color-accent-text-hover);
    }
  }
`;

export const StyledMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  background: transparent;
  color: var(--color-fg);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast);

  &:hover {
    background-color: var(--color-bg-muted);
  }

  &:active {
    background-color: var(--color-border);
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
`;
