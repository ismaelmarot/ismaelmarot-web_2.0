import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledSkipLink = styled.a`
  position: absolute;
  top: -100%;
  left: 50%;
  transform: translateX(-50%);
  padding: ${tokens.space[3]} ${tokens.space[4]};
  background-color: ${tokens.colors.primary};
  color: white;
  font-weight: ${tokens.fontWeights.medium};
  border-radius: ${tokens.radii.full};
  z-index: ${tokens.zIndices.toast};
  transition: top 120ms ease-out;
  text-decoration: none;

  &:focus {
    top: ${tokens.space[4]};
  }

  &:hover {
    background-color: ${tokens.colors.accentHover};
  }
`;