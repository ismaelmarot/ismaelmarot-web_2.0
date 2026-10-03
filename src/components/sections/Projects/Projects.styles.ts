import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledProjects = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[6]};
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

export const StyledProjectsFilterWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${tokens.space[3]};
`;

/* Single-column list: one project per row, published order preserved. */
export const StyledProjectsList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[4]};
  margin: 0;
  padding: 0;
  list-style: none;
  max-width: ${tokens.containers.lg};
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
    padding: ${tokens.space[2]} ${tokens.space[4]};
    font-size: var(--text-label);
    font-weight: 500;
    color: var(--color-white);
    background: var(--color-accent);
    border: none;
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: background-color var(--transition-fast);

    &:hover {
      background: var(--color-accent-hover);
    }

    &:focus-visible {
      outline: none;
      box-shadow: var(--shadow-focus);
    }
  }
`;