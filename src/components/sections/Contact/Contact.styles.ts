import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledContact = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100%;
  gap: ${tokens.space[8]};
`;

export const StyledContactHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[4]};
`;

export const StyledContactHeadline = styled.h2`
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

export const StyledContactIntro = styled.p`
  margin: 0;
  font-size: var(--text-large-subtitle);
  font-weight: 400;
  line-height: 1.625;
  color: var(--color-text-secondary);
  max-width: 500px;
  margin: 0 auto;

  @media (max-width: 767px) {
    font-size: var(--text-large-subtitle);
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