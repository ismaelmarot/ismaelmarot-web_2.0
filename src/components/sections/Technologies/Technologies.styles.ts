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
    text-align: center;
  }
`;

export const StyledTechnologiesHeadline = styled.h2`
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
  font-size: ${tokens.fontSizes.lg};
  font-weight: ${tokens.fontWeights.semibold};
  line-height: ${tokens.lineHeights.snug};
  color: ${tokens.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding-bottom: ${tokens.space[2]};
  border-bottom: 2px solid ${tokens.colors.primary};
  display: inline-block;
  width: fit-content;
`;

export const StyledCategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: ${tokens.space[4]};

  @media (max-width: 767px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: ${tokens.space[3]};
  }
`;