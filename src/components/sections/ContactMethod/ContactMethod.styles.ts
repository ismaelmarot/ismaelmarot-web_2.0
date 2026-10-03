import styled, { css, type RuleSet } from 'styled-components';
import { tokens } from '@/styles/tokens';
import type { ContactType } from '@/types/contact';

/**
 * Three cards, three identities. The geometry is deliberately identical so they read as one
 * design, while the surface changes: an Apple-style deep gradient, sized generously and with
 * the icon set directly on the colour rather than boxed inside it, which is how Apple treats
 * a product tile and why the gradient gets to do the work.
 *
 * Each pair is measured against its lightest stop. A gradient is only as readable as its
 * brightest end, so the values here are darker than they first want to be:
 *
 *   email     #7A3FD1 -> #4C1D9E   white 6.07:1   label 90% 5.25:1
 *   github    #2A3138 -> #0A0D10   white 13.17:1  label 90% 10.95:1
 *   linkedin  #0A66C2 -> #07427E   white 5.69:1   label 90% 4.93:1
 *
 * Declared before the card that interpolates them, because a css template is evaluated as this
 * object is built and would throw on a component defined further down the file.
 */
const surfaces: Record<ContactType, RuleSet<object>> = {
  email: css`
    background-image: linear-gradient(
      155deg,
      var(--brand-email-from) 0%,
      var(--brand-email-to) 100%
    );
  `,
  github: css`
    background-image: linear-gradient(
      155deg,
      var(--brand-github-from) 0%,
      var(--brand-github-to) 100%
    );
  `,
  linkedin: css`
    background-image: linear-gradient(
      155deg,
      var(--brand-linkedin-from) 0%,
      var(--brand-linkedin-to) 100%
    );
  `,
  // twitter, website and other have no brand surface of their own here, so they take the
  // neutral violet rather than inheriting the page background and reading as unstyled.
  twitter: css`
    background-image: linear-gradient(
      155deg,
      var(--brand-email-from) 0%,
      var(--brand-email-to) 100%
    );
  `,
  website: css`
    background-image: linear-gradient(
      155deg,
      var(--brand-email-from) 0%,
      var(--brand-email-to) 100%
    );
  `,
  other: css`
    background-image: linear-gradient(
      155deg,
      var(--brand-email-from) 0%,
      var(--brand-email-to) 100%
    );
  `,
};

const surface = (type: ContactType) => surfaces[type];

export const StyledContactMethodWrapper = styled.div<{ $index?: number }>`
  /* A grid item defaults to min-width:auto, so a long domain would widen its track and push
     the row past the viewport. */
  min-width: 0;
  display: flex;
  /* Stretch rather than height:100%. This box has an auto height, so a percentage would
     resolve against nothing and the cards came out at three different heights. */
  align-items: stretch;
  opacity: 0;
  animation: fadeInUp var(--duration-normal) var(--ease-out) forwards;
  animation-delay: ${({ $index }) => ($index || 0) * 100}ms;

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    animation: none;
  }
`;

export const StyledContactMethodLink = styled.a<{ $type: ContactType }>`
  ${({ $type }) => surface($type)};

  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: ${tokens.space[3]};
  width: 100%;
  min-width: 0;
  height: 100%;
  box-sizing: border-box;
  padding: ${tokens.space[8]} ${tokens.space[6]};
  border-radius: var(--radius-2xl);
  color: var(--color-white);
  text-align: left;
  text-decoration: none;
  /* The highlight along the top edge is what sells a coloured tile as a physical surface
     catching light, the way Apple shades its product cards. Kept subtle so it reads as a
     highlight and not as a border, and it is decorative: it carries no information. */
  box-shadow: var(--shadow-xs), inset 0 1px 0 rgba(255, 255, 255, 0.18);
  transition: transform var(--transition-normal) var(--ease-spring),
    box-shadow var(--transition-normal) var(--ease-out);

  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-sm), inset 0 1px 0 rgba(255, 255, 255, 0.24);
  }

  /* Inset, and in the card's own text colour, because the project's accent ring is 1.21:1 on
     the LinkedIn blue: an accent-coloured ring on an accent-coloured card is invisible. The
     negative offset keeps it inside the surface, since a white ring drawn outside the card
     would sit on the white page background. */
  &:focus-visible {
    outline: 3px solid currentColor;
    outline-offset: -4px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover {
      transform: none;
    }
  }
`;

/**
 * Set straight onto the gradient with no box around it. The card colour is the background, so
 * a squircle behind the icon would be a second surface competing with the first. White on each
 * gradient's lightest stop measures 6.07:1, 13.17:1 and 5.69:1, comfortably past the 3:1 that a
 * non-text element needs, so the icon stays legible without one.
 */
export const StyledContactMethodIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-bottom: ${tokens.space[5]};
  color: currentColor;
`;

/**
 * Marks the whole card as a link, so it is decorative: the accessible name is on the link and
 * already names the destination. Faded until the card is engaged, and nudged outward to point
 * away from the tile.
 */
export const StyledContactMethodArrow = styled.span`
  position: absolute;
  top: ${tokens.space[6]};
  right: ${tokens.space[6]};
  display: flex;
  color: currentColor;
  /* 70% rather than 55%: on the LinkedIn blue, white at 55% measures 2.80:1 and the arrow
     disappears into the gradient. Decorative, so 3:1 is not required, but it should still read. */
  opacity: 0.7;
  transition: opacity var(--transition-fast), transform var(--transition-normal) var(--ease-out);

  ${StyledContactMethodLink}:hover & {
    opacity: 1;
    transform: translate(3px, -3px);
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
  letter-spacing: 0.09em;
  text-transform: uppercase;
  /* Not translucent: white at 75% measures 3.09:1 on the violet stop, well under AA. */
  color: inherit;
  opacity: 0.9;
`;

/**
 * The domain, at large-text size. This is the only thing left that tells the three cards apart
 * beyond their icon, so it is set big and bold rather than as a caption.
 */
export const StyledContactMethodValue = styled.span`
  font-size: 1.375rem;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: inherit;
  min-width: 0;
  /* Wrapping rather than ellipsis: a truncated domain is a link to somewhere else. */
  overflow-wrap: anywhere;
`;
