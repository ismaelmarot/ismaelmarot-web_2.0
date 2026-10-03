import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledContact = styled.div`
  width: 100%;
  /* Sized for the content the cards actually carry now: a 56px icon and a domain. 960px was
     for the full addresses, and at that width the cards read as three large empty slabs with
     one short word in each. 760px puts them at roughly 220px, which is where the gradient and
     the icon carry the card and the type does not float in the middle of it. */
  max-width: 760px;
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

/**
 * Stacked on mobile, a row of three from 768px. A fixed column count rather than auto-fit:
 * there are exactly three cards, and auto-fit would settle on two columns plus a lone orphan
 * at tablet widths, which reads as a mistake rather than a layout.
 */
export const StyledContactMethods = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${tokens.space[4]};
  width: 100%;

  @media (min-width: 768px) {
    /* minmax(0, 1fr) rather than 1fr: a bare 1fr has an auto minimum, so the track grows to
       its content and the three cards came out 257/239/307px instead of equal. */
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: ${tokens.space[5]};
    }
`;

/**
 * A grid item, and nothing more. It is deliberately not a flex container: as one it
 * shrink-to-fit the card inside it, which left three unequal cards inside three equal
 * tracks. Block layout lets the card fill its track, and min-width:0 lets the track shrink.
 */
/**
 * A grid item that exists only to carry the listitem role. Displayed as a one-cell grid, not a
 * flex row or a block, because both failed on one axis: a flex row shrink-to-fits the card
 * (257/239/307px), and a block gives a height:100% card no definite containing block to
 * resolve against (169/169/192px). One grid cell stretches on both axes by default, so the
 * card below fills its track exactly.
 */
export const StyledContactMethod = styled.div`
  display: grid;
  min-width: 0;
`;
