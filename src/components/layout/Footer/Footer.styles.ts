import styled from 'styled-components';

export const StyledFooter = styled.footer<{ $variant: 'minimal' | 'full' }>`
  border-top: 1px solid var(--color-border);
  padding-block: ${({ $variant }) => ($variant === 'minimal' ? 'var(--space-8)' : 'var(--space-16)')};
  background-color: var(--color-bg);
`;

export const StyledInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
  max-width: var(--container-xl);
  margin-inline: auto;
  padding-inline: var(--space-6);
`;

export const StyledCopyright = styled.p`
  font-size: var(--text-secondary);
  font-weight: 400;
  color: var(--color-text-tertiary);
  margin: 0;
`;

export const StyledSocialLinks = styled.ul`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;

  a {
    color: var(--color-text-secondary);
    transition: color var(--transition-fast);

    &:hover {
      color: var(--color-accent);
    }
  }
`;
