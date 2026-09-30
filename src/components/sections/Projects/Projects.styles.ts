import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledProjects = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[8]};
`;

export const StyledProjectsHeader = styled.div`
  text-align: left;

  @media (max-width: 767px) {
    text-align: center;
  }
`;

export const StyledProjectsHeadline = styled.h2`
  margin: 0;
  font-size: ${tokens.fontSizes['4xl']};
  font-weight: ${tokens.fontWeights.bold};
  line-height: ${tokens.lineHeights.tight};
  letter-spacing: -0.01em;
  color: ${tokens.colors.textPrimary};

  @media (max-width: 767px) {
    font-size: ${tokens.fontSizes['3xl']};
  }
`;

export const StyledProjectsGrid = styled.div<{ $hasSkeleton?: boolean }>`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${tokens.space[8]};

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const StyledProjectsEmpty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${tokens.space[16]} ${tokens.space[8]};
  color: ${tokens.colors.textTertiary};
  font-size: ${tokens.fontSizes.lg};

  p {
    margin: 0;
  }
`;

export const StyledProjectsError = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${tokens.space[16]} ${tokens.space[8]};
  color: ${tokens.colors.error};
  font-size: ${tokens.fontSizes.lg};
  gap: ${tokens.space[4]};

  p {
    margin: 0;
  }

  button {
    padding: ${tokens.space[3]} ${tokens.space[6]};
    font-size: ${tokens.fontSizes.base};
    font-weight: ${tokens.fontWeights.medium};
    color: ${tokens.colors.background};
    background: ${tokens.colors.error};
    border: none;
    border-radius: ${tokens.radii.md};
    cursor: pointer;
    transition: background ${tokens.transitions.fast};

    &:hover {
      background: ${tokens.colors.error}dd;
    }
  }
`;