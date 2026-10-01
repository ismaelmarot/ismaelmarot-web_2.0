import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledTechnologies = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[10]};
`;

export const StyledTechnologiesHeader = styled.div`
  text-align: left;
  max-width: 700px;

  @media (max-width: 767px) {
    text-align: left;
  }
`;

export const StyledTechnologiesHeadline = styled.h2`
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

export const StyledTechnologiesCategories = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[10]};
  width: 100%;
`;

export const StyledCategoryGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[4]};
`;

export const StyledCategoryTitle = styled.h3`
  margin: 0;
  font-size: var(--text-label);
  font-weight: 500;
  line-height: 1.5;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding-bottom: ${tokens.space[2]};
  display: inline-block;
`;

export const StyledCategoryGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${tokens.space[3]} ${tokens.space[4]};
  align-items: center;

  @media (max-width: 767px) {
    gap: ${tokens.space[2]} ${tokens.space[3]};
  }
`;