import styled, { css } from 'styled-components';

export const StyledHeader = styled.header<{
  $sticky: boolean;
  $transparent: boolean;
  $isScrolled: boolean;
  $overDark: boolean;
}>`
  position: ${({ $sticky }) => ($sticky ? 'fixed' : 'relative')};
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-sticky);
  transition: background-color var(--transition-normal), backdrop-filter var(--transition-normal);

  /* Dark treatment, three states in priority order.

     Over a dark region: black, no border. Not transparent, because a solid colour does not depend on
     the band still being exactly aligned with the header, so a one-pixel rounding difference cannot
     put white behind a black header. The band is the same #000, so there is no seam.

     Everything inside inherits by custom property rather than by a prop. Every colour in this subtree
     was already a var(--color-*), so overriding them here cascades to the brand, the navigation and
     the menu button without threading anything through Navigation's API. Measured against #000, the
     stock values all fail: logo #1D1D1F is 1.25:1, navigation #6E6E73 is 4.14:1 and the GitHub CTA
     #0062C4 is 3.54:1.

     --link-hover-decoration is the one new property: the existing hover moves a link from
     --color-text-secondary to --color-text-primary, a subtle darkening that has nowhere to go when
     both are white. Underline is the affordance that still works, and it defaults to none so the
     light theme does not move by a pixel.

     The mobile menu is portaled to document.body, outside this subtree, so it keeps its white panel
     and dark text without any of this reaching it. */
  ${({ $overDark }) =>
    $overDark &&
    css`
      background-color: #000000;
      backdrop-filter: none;
      border-bottom: none;

      --color-fg: #ffffff;
      --color-fg-muted: #e8e8ed;
      --color-text-secondary: #ffffff;
      --color-text-primary: #ffffff;
      --color-accent-text: #ffffff;
      --color-accent-text-hover: #ffffff;
      --color-bg-muted: rgba(255, 255, 255, 0.14);
      --color-border: rgba(255, 255, 255, 0.24);
      --link-hover-decoration: underline;
    `}

  ${({ $transparent, $isScrolled, $overDark }) =>
    !$overDark &&
    ($transparent && !$isScrolled
      ? css`
          background-color: transparent;
          backdrop-filter: none;
        `
      : css`
          background-color: var(--color-bg);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--color-border);
        `)}
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
