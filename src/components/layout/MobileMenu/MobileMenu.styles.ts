import styled, { css } from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledOverlay = styled.div<{ $visible: boolean }>`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: ${tokens.zIndices.modal - 1};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transition: opacity 200ms ease-out, visibility 200ms ease-out;
`;

export const StyledMobileMenu = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  width: 100%;
  max-width: none;
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
        from {
          background-color: rgba(255, 255, 255, 0.55);
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

  &:hover {
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