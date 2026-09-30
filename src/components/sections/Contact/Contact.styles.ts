import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledContact = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[8]};
`;

export const StyledContactHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[4]};
`;

export const StyledContactHeadline = styled.h2`
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

export const StyledContactIntro = styled.p`
  margin: 0;
  font-size: ${tokens.fontSizes.lg};
  font-weight: ${tokens.fontWeights.normal};
  line-height: ${tokens.lineHeights.relaxed};
  color: ${tokens.colors.textSecondary};
  max-width: 500px;
  margin: 0 auto;

  @media (max-width: 767px) {
    font-size: ${tokens.fontSizes.base};
  }
`;

export const StyledContactMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[4]};
  width: 100%;
`;

export const StyledContactMethod = styled.div`
  display: flex;
  justify-content: center;
`;