import styled, { css, type RuleSet } from 'styled-components';
import { tokens } from '@/styles/tokens';
import type { ContactType } from '@/types/contact';

export const StyledContactMethodIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: var(--radius-lg);
`;

/**
 * Each card carries the identity of the service it opens, so the row reads as three
 * destinations instead of three copies of the same button. The geometry is shared, which is
 * what keeps three different materials looking like one design.
 *
 * Declared after the icon so the nested rules below can reach it. A css template is evaluated
 * when this object is built, so referring to a component defined further down the file would
 * throw at import time.
 */
const surfaces: Record<ContactType, RuleSet<object>> = {
  email: css`
    background-color: var(--brand-email);
    border-color: var(--color-border);
    color: var(--color-fg);

    ${StyledContactMethodIcon} {
      background-color: var(--color-accent-light);
      color: var(--color-accent-text);
    }
  `,
  github: css`
    background-color: var(--brand-github);
    border-color: ${tokens.colors.black};
    color: var(--color-white);

    ${StyledContactMethodIcon} {
      background-color: rgba(255, 255, 255, 0.1);
      color: var(--color-white);
    }
  `,
  linkedin: css`
    background-image: linear-gradient(
      160deg,
      var(--brand-linkedin) 0%,
      var(--brand-linkedin-deep) 100%
    );
    border-color: var(--brand-linkedin-deep);
    color: var(--color-white);

    ${StyledContactMethodIcon} {
      background-color: rgba(255, 255, 255, 0.14);
      color: var(--color-white);
    }
  `,
  // twitter, website and other have no brand surface of their own here, so they take the
  // neutral card rather than being left unstyled and inheriting the page background.
  twitter: css`
    background-color: var(--brand-email);
    border-color: var(--color-border);
    color: var(--color-fg);

    ${StyledContactMethodIcon} {
      background-color: var(--color-accent-light);
      color: var(--color-accent-text);
    }
  `,
  website: css`
    background-color: var(--brand-email);
    border-color: var(--color-border);
    color: var(--color-fg);

    ${StyledContactMethodIcon} {
      background-color: var(--color-accent-light);
      color: var(--color-accent-text);
    }
  `,
  other: css`
    background-color: var(--brand-email);
    border-color: var(--color-border);
    color: var(--color-fg);

    ${StyledContactMethodIcon} {
      background-color: var(--color-accent-light);
      color: var(--color-accent-text);
    }
  `,
};

const surface = (type: ContactType) => surfaces[type];

export const StyledContactMethodWrapper = styled.div<{ $index?: number }>`
  /* A grid item defaults to min-width:auto, so a long address would widen its track and push
     the row past the viewport. Handing the excess to the value's overflow-wrap instead keeps
     the grid honest without truncating a profile URL that would then lead somewhere else. */
  min-width: 0;
  display: flex;
  /* Stretch rather than height:100%. This box has an auto height, so a percentage would
     resolve against nothing and the cards came out at 169/169/192px. */
  align-items: stretch;
  opacity: 0;
  animation: fadeInUp var(--duration-normal) var(--ease-out) forwards;
  animation-delay: ${({ $index }) => ($index || 0) * 100}ms;

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    animation: none;
  }
`

export const StyledContactMethodLink = styled.a<{ $type: ContactType }>`
  ${({ $type }) => surface($type)};

  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: ${tokens.space[4]};
  width: 100%;
  min-width: 0;
  height: 100%;
  box-sizing: border-box;
  padding: ${tokens.space[6]};
  border: 1px solid;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xs);
  text-align: left;
  text-decoration: none;
  /* transform and box-shadow are both animated so the card lifts as one object rather than
     sliding under a static shadow. ease-spring settles the movement instead of stopping dead. */
  transition: transform var(--transition-normal) var(--ease-spring),
    box-shadow var(--transition-normal) var(--ease-out);

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-sm);
  }

  /* Inset, and in the card's own text colour, because the project's accent ring is 1.21:1 on
     the LinkedIn blue: an accent-coloured ring on an accent-coloured card is invisible. The
     negative offset keeps it inside the surface, since a white ring drawn outside the card
     would sit on the white page background. */
  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: -3px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover {
      transform: none;
    }
  }
`;

/**
 * The arrow marks the whole card as a link, so it is decorative: the accessible name is on
 * the link itself and already names the destination.
 */
export const StyledContactMethodArrow = styled.span`
  position: absolute;
  top: ${tokens.space[6]};
  right: ${tokens.space[6]};
  display: flex;
  color: currentColor;
  /* The label owns the top-left, so the arrow is faded back until the card is engaged. */
  opacity: 0.55;
  transition: opacity var(--transition-fast), transform var(--transition-fast)
    var(--ease-out);

  ${StyledContactMethodLink}:hover & {
    opacity: 1;
    transform: translate(2px, -2px);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    ${StyledContactMethodLink}:hover & {
      transform: none;
    }
  }
`;

export const StyledContactMethodLabel = styled.span`
  font-size: var(--text-label);
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  /* Not translucent. White at 72% on the LinkedIn blue is 3.72:1 and fails AA, and the label
     has to stay readable as the one thing that tells the three cards apart. */
  color: inherit;
  opacity: 0.9;
`;

export const StyledContactMethodValue = styled.span`
  font-size: var(--text-body);
  font-weight: 600;
  line-height: 1.4;
  color: inherit;
  /* Wrapping rather than ellipsis: a truncated profile URL is a link that goes somewhere
     else. The card grows instead, and the grid keeps the three the same height. */
  min-width: 0;
  overflow-wrap: anywhere;
`;
