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

  /* Feature 014. Reserved so the signature cannot move the social links. Measured: the handwriting
     face sets its inline box at 25px against Inter's 17px at the same 14px, which grew the line from
     21px to 22px and pushed the link row down by 1px when the font arrived. Fixing the height holds
     the row at exactly what it is with the font absent. It is deliberately not a line-height: pinning
     that to 22px measured 23px, because the inline box overflows it either way. */
  height: 21px;
`;

/* The name, and only the name, in the handwriting face. The symbol and the year stay in the
   paragraph's own stack, because they are not part of the signature. */
export const StyledSignature = styled.span`
  font-family: var(--font-hand);
  /* Declared rather than inherited, and it is not redundant. Playwrite's axis stops at 400 and it
     has no bold, so a value above that would not make the name heavier: the browser would
     synthesise a heavier face the typeface was never drawn with. Verified by raising the parent to
     700 and leaving this out, at which point the name computed to 700. */
  font-weight: 400;
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
