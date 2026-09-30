import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledOverlay = styled.div<{ $visible: boolean }>`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${tokens.zIndices.modal - 1};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transition: opacity 200ms ease-out, visibility 200ms ease-out;
`;

export const StyledMobileMenu = styled.div<{ $open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 320px;
  background-color: ${tokens.colors.background};
  border-left: 1px solid ${tokens.colors.border};
  box-shadow: ${tokens.shadows.xl};
  z-index: ${tokens.zIndices.modal};
  display: flex;
  flex-direction: column;
  transform: ${({ $open }) => ($open ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 200ms ease-out;
`;

export const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding-inline: ${tokens.space[6]};
  border-bottom: 1px solid ${tokens.colors.border};
`;

export const StyledTitle = styled.span`
  font-size: ${tokens.fontSizes.xl};
  font-weight: ${tokens.fontWeights.bold};
  color: ${tokens.colors.textPrimary};
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
  border-radius: ${tokens.radii.md};
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
  padding: ${tokens.space[6]};
  overflow-y: auto;
`;

export const StyledNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[4]};
`;

export const StyledNavItem = styled.a`
  display: flex;
  align-items: center;
  padding: ${tokens.space[3]} ${tokens.space[4]};
  color: ${tokens.colors.textPrimary};
  font-size: ${tokens.fontSizes.lg};
  font-weight: ${tokens.fontWeights.medium};
  text-decoration: none;
  border-radius: ${tokens.radii.md};
  transition: background-color 120ms ease-out;

  &:hover {
    background-color: ${tokens.colors.bgMuted};
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