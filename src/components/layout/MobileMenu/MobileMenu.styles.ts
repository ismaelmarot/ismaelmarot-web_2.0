import styled, { css } from 'styled-components';
import { tokens } from '@/styles/tokens';
import { darkSurface } from '@/styles/theme';

export const StyledOverlay = styled.div<{ $visible: boolean }>`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: ${tokens.zIndices.modal - 1};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transition: opacity 200ms ease-out, visibility 200ms ease-out;
`;

export const StyledMobileMenu = styled.div<{ $open: boolean; $overDark: boolean }>`
  position: fixed;
  inset: 0;
  width: 100%;
  max-width: none;
  /* specs/026: the panel takes the theme it sits under. The fragment carries the dark palette, and
     --color-background in it is what turns the line below black without this declaration changing.
     The menu is portaled to document.body, so it cannot inherit the header's overrides and is told
     the theme instead. Everything inside inherits from here, which is why the navigation items and the
     close button recolour without knowing anything about it. */
  ${({ $overDark }) => $overDark && darkSurface}

  background-color: ${tokens.colors.background};
  border-left: none;
  box-shadow: none;
  z-index: ${tokens.zIndices.modal};
  display: flex;
  flex-direction: column;
  transform: ${({ $open }) => ($open ? 'translateY(0)' : 'translateY(-12px)')};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition: transform 240ms var(--ease-out), opacity 240ms var(--ease-out);

  ${({ $open }) =>
    $open &&
    css`
      animation: menuSolidify 360ms var(--ease-out);
      backdrop-filter: blur(0px);

      @keyframes menuSolidify {
        /* specs/026: from transparent, not from a translucent white. The old start was
           rgba(255, 255, 255, 0.55), which on a black panel is exactly the flash this feature removes,
           and lowering the alpha of a var() would need color-mix() or a new token. Transparent is
           correct in both themes because there is no colour left in it that can be wrong. */
        from {
          background-color: transparent;
          backdrop-filter: blur(18px);
        }
        to {
          background-color: ${tokens.colors.background};
          backdrop-filter: blur(0px);
        }
      }
    `}
`;

export const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 52px;
  padding-inline: ${tokens.space[6]};
`;

export const StyledCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  background: transparent;
  color: ${tokens.colors.textPrimary};
  border-radius: ${tokens.radii.full};
  cursor: pointer;
  transition: background-color 120ms ease-out;

  &:hover {
    background-color: ${tokens.colors.bgMuted};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.focus};
    outline-offset: 2px;
  }
`;

export const StyledContent = styled.div`
  flex: 1;
  padding: ${tokens.space[8]} ${tokens.space[6]};
  overflow-y: auto;
`;

export const StyledNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[4]};
`;

export const StyledNavItem = styled.a`
  display: block;
  text-align: left;
  padding: ${tokens.space[3]} 0;
  color: ${tokens.colors.textPrimary};
  font-size: clamp(1.5rem, 5vw, 2rem);
  font-weight: ${tokens.fontWeights.semibold};
  line-height: ${tokens.lineHeights.snug};
  text-decoration: none;
  transition: color 160ms ease-out;
  animation: itemIn 360ms var(--ease-out) 260ms both;

  @keyframes itemIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

/* specs/026: the same three states the navigation list has, so the call to action does not answer
     to a finger or the keyboard differently from the items above it. The outline below stays, because
     for a keyboard the ring is the part that survives a colour that has already moved. */
    &:hover,
    &:active,
    &:focus-visible {
      color: ${tokens.colors.accent};
    }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.focus};
    outline-offset: 2px;
  }
`;

export const StyledCta = styled.a`
  margin-top: ${tokens.space[6]};
  padding: ${tokens.space[3]} ${tokens.space[6]};
  text-align: center;
`;