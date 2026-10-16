import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

/* The shell is `SectionSummary`'s, value for value: padding-block, the 100vh fallback with the
   100dvh that follows it, and centring by grid rather than by flexbox. It is repeated rather than
   extracted because the four bands on the landing page all carry it and a fifth caller does not make
   a primitive out of ten lines of values. If this one ever changes, three others change with it —
   `specs/020`'s plan records that as the deliberate cost. */
export const StyledContactBand = styled.section`
  padding-block: ${tokens.space[16]};
  min-height: 100vh; /* fallback for browsers without dynamic viewport units */
  min-height: 100dvh;
  /* specs/023: a snap target. Landing page only. */
  scroll-snap-align: start;
  display: grid;
  align-content: center;
  background-color: ${tokens.colors.bg};

  @media (max-width: 767px) {
    padding-block: ${tokens.space[12]};
  }
`;

/* A flex column because the band's own button is aligned with align-self, and align-self does nothing
   in a block container. The row and the copy above it set their own widths, so making this a flex column
   changes nothing about them. */
export const StyledContactBandInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  max-width: ${tokens.containers.xl};
  width: 100%;
  margin-inline: auto;
  padding-inline: ${tokens.space[6]};

  @media (max-width: 767px) {
    padding-inline: ${tokens.space[4]};
  }
`;

/* The question is the band's heading, and it is the largest text in it. The address is a link rather
   than a heading, so the band keeps exactly one level-two heading and the page's outline does not
   gain a second top-level voice. */
/* Subordinate to the address at every viewport, and not a display size.

   specs/020 shipped this heading at --text-display-section, 72px at desktop, against an address of
   36px. specs/021 moved it down, but to --text-large-subtitle, whose floor of 20px is ABOVE the
   address's own floor of 18px — so the band still rendered the question larger than the address on a
   phone, and on a 320px screen the question was the thing that read as the subject. Measured, not
   assumed: 20px against 18px at both 390 and 320.

   --text-body is 16px and its floor is below the address's, which is what FR-001 asks for. It is the
   least interesting token on the scale and that is the point: this heading is deliberately not a
   display, because the display in this band is an email address. The ratio is 0.4 at desktop and 0.89
   on a 320px screen, and the second number is honest — at 288px of column there is no room for a
   difference and pretending otherwise would mean a question too small to read. */
export const StyledContactBandTitle = styled.h2`
  margin: 0;
  font-size: var(--text-body);
  font-weight: ${tokens.fontWeights.semibold};
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: ${tokens.colors.textTertiary};
  max-width: 18ch;
`;

/* specs/025: what happens after the question. One step below the question and two below the address,
   because it is neither of them: the question asks and this answers, and the address is the thing being
   asked about. A paragraph and not a heading, so the band keeps exactly one level-two heading. */
export const StyledContactBandDescription = styled.p`
  margin: 0;
  font-size: var(--text-secondary);
  font-weight: ${tokens.fontWeights.normal};
  line-height: 1.4;
  letter-spacing: -0.005em;
  color: ${tokens.colors.textTertiary};
  max-width: 46ch;
`;

/* The top row: the networks on the left and the address on the right.
   `auto 1fr`, and that is specs/025's central decision. `1fr 1fr` would split the row in half and hand
   the address 596px at 1440 -- the 596px that specs/021 measured a 44px address against and found 3px
   too wide. The token has since gone to 56px, which needs 711.

   `auto 1fr` sizes the networks to what they are: four 44px marks and three gaps, about 230px. The
   address then takes the rest -- roughly 960 at 1440 and 498 at 768, against the 711 and 393 that
   --text-display-project needs. **The arrangement change is what made the size change possible**, and
   not the other way round.

   `align-items: center` because the network marks are 44px squares and the address is a line of text
   whose height now depends on its size. Centring keeps them looking related at any of them. */
export const StyledContactBandRow = styled.div`
  /* specs/025: raised above the question by CSS so the reading order can stay the other way round.
     Without it the drawing would need the markup reordered, and the page's outline would start with
     four social links instead of with the question that says what the section is. */
  order: -1;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: ${tokens.space[6]} ${tokens.space[8]};

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: ${tokens.space[5]};
  }
`;

/* The question and the sentence under it. A column, so the button can sit beneath both and still
   align right, which is the arrangement the drawing specifies. */
export const StyledContactBandCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[2]};
  margin-top: ${tokens.space[10]};

  @media (max-width: 767px) {
    margin-top: ${tokens.space[8]};
  }
`;

/* The band's own route to the contact page, and the one thing in the band shaped like a control.
   Black with white text and a white arrow, which is a request rather than a palette choice: on a white
   band a white button disappears and a grey one reads as disabled.

   The focus ring is white rather than inherited. --shadow-focus is drawn in the page's own colour, and
   on a black surface that colour is the background, so inheriting it would leave this button with no
   visible focus indicator at all — a WCAG 2.4.7 failure on the band's only control. Asserted rather
   than assumed. */
export const StyledContactBandCta = styled.a`
  display: inline-flex;
  align-items: center;
  /* specs/025: aligned right, because the drawing indents it. align-self rather than
     margin-left:auto so the rule reads as an alignment and reversing it is one declaration. */
  align-self: flex-end;
  gap: ${tokens.space[2]};
  margin-top: ${tokens.space[6]};
  padding: ${tokens.space[3]} ${tokens.space[6]};
  font-size: var(--text-body);
  font-weight: ${tokens.fontWeights.semibold};
  color: ${tokens.colors.white};
  background-color: ${tokens.colors.black};
  border-radius: ${tokens.radii.full};
  text-decoration: none;
  white-space: nowrap;
  transition: transform var(--transition-fast), opacity var(--transition-fast);

  &:hover {
    transform: translateY(-1px);
    opacity: 0.88;
  }

  /* On a phone the band's copy fills the width, and a right-aligned pill sits at the far edge of a
     thumb. Left there, where the text above it starts. */
  @media (max-width: 767px) {
    align-self: flex-start;
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.white};
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover {
      transform: none;
    }
  }
`;

/* The subject. A single link holding the address, its weight and its own arrow, at the band's own
   display step.
   `min-width: 0` because a grid item defaults to `min-width: auto`, and a long unbreakable address
   would then widen its track and push the row past the viewport. The address itself is allowed to
   wrap only between characters if it must, which `overflow-wrap: anywhere` allows and `break-word`
   does not: `break-word` still lets the line box overflow its container first. */
export const StyledContactEmail = styled.a`
  display: inline-flex;
  align-items: baseline;
  gap: ${tokens.space[3]};
  min-width: 0;
  font-size: var(--text-display-email);
  font-weight: ${tokens.fontWeights.semibold};
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: ${tokens.colors.textPrimary};
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  text-decoration: none;
  overflow-wrap: anywhere;
  transition: color var(--transition-fast);

  &:hover {
    color: ${tokens.colors.accent};
  }

  &:focus-visible {
    outline: none;
    border-radius: ${tokens.radii.sm};
    box-shadow: var(--shadow-focus);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/* The address and its arrow are one link, so the arrow must not shrink while the address can.
   `align-self: center` rather than `baseline` on the parent: an arrow has no baseline, so on a line
   whose text is three times its size it would sit on the text baseline and read as an underline. */
export const StyledContactEmailArrow = styled.span`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  align-self: center;
  color: currentColor;
`;

/* The networks. They moved into the top row beside the address in specs/025, so this no longer carries
   a margin of its own — the row owns the space now. */
export const StyledContactNetworks = styled.ul`
  display: flex;
  align-items: center;
  gap: ${tokens.space[3]};
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const StyledContactNetworkItem = styled.li`
  display: flex;
`;

export const StyledContactNetwork = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: ${tokens.colors.textSecondary};
  background-color: ${tokens.colors.bg};
  border-radius: ${tokens.radii.full};
  box-shadow: var(--shadow-xs);
  transition: color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);

  &:hover {
    color: ${tokens.colors.textPrimary};
    box-shadow: var(--shadow-sm);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--shadow-focus);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover {
      transform: none;
    }
  }
`;

