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
    text-align: left;
  }
`;

export const StyledProjectsHeadline = styled.h2`
  margin: 0;
  font-size: var(--text-display-section);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.01em;
  color: var(--color-text-primary);

  @media (max-width: 767px) {
    font-size: var(--text-display-section);
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
    /* Asymmetric layout: 1 featured large + 2 smaller, or custom arrangement */
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: ${tokens.space[6]};
  }
`;

export const StyledProjectsEmpty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  text-align: left;
  padding: ${tokens.space[16]} ${tokens.space[8]};
  color: var(--color-text-tertiary);
  font-size: var(--text-large-subtitle);

  p {
    margin: 0;
  }
`;

export const StyledProjectsError = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  text-align: left;
  padding: ${tokens.space[16]} ${tokens.space[8]};
  color: var(--color-text-primary);
  font-size: var(--text-large-subtitle);
  gap: ${tokens.space[4]};

  p {
    margin: 0;
  }

  button {
    padding: ${tokens.space[3]} ${tokens.space[6]};
    font-size: var(--text-label);
    font-weight: 500;
    color: var(--color-white);
    background: var(--color-accent);
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background var(--transition-fast);

    &:hover {
      opacity: 0.8;
    }
  }
`;