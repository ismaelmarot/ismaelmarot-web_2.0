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
  display: grid;
  align-content: center;
  background-color: ${tokens.colors.bg};

  @media (max-width: 767px) {
    padding-block: ${tokens.space[12]};
  }
`;

export const StyledContactBandInner = styled.div`
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

/* Two columns above the fold and one below it. `align-items: end` puts the address's baseline and the
   link's baseline near each other rather than centring two boxes of different heights against each
   other, which is what a visitor comparing them actually sees. */
/* Two equal columns, which is the requirement: the address has half the width to itself and the
   question and the button share the other half. The gap is 40px, so each column is (1232 - 40) / 2 =
   596px, and the token's comment carries the arithmetic that decides the address's ceiling.

   Stacked, the address comes first because it is the subject. `order` rather than a second copy of the
   markup, so the two elements exist once and the desktop and mobile arrangements cannot disagree. */
export const StyledContactBandRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: ${tokens.space[6]} ${tokens.space[10]};

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: ${tokens.space[5]};
  }
`;

/* The half that carries the question and the route to the contact page. */
export const StyledContactBandActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${tokens.space[6]};
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
  gap: ${tokens.space[2]};
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

/* The networks, alone. The divider above them and the owner's name beside them were both removed by
   specs/021; what is left is a row of marks belonging to the address above it rather than a footer of
   its own. */
export const StyledContactBandFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${tokens.space[4]};
  margin-top: ${tokens.space[10]};

  @media (max-width: 767px) {
    margin-top: ${tokens.space[8]};
  }
`;

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

