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
export const StyledContactBandTitle = styled.h2`
  margin: 0 0 ${tokens.space[3]};
  font-size: var(--text-display-section);
  font-weight: ${tokens.fontWeights.bold};
  line-height: 1.05;
  letter-spacing: -0.01em;
  color: ${tokens.colors.textPrimary};
  max-width: 16ch;
`;

/* Two columns above the fold and one below it. `align-items: end` puts the address's baseline and the
   link's baseline near each other rather than centring two boxes of different heights against each
   other, which is what a visitor comparing them actually sees. */
export const StyledContactBandRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: end;
  gap: ${tokens.space[6]} ${tokens.space[10]};

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: ${tokens.space[5]};
  }
`;

/* The band's own route to the contact page. A pill because every call to action on the site is one,
   and a link that looks like one thing on this page and another on the next is not a call to action.
   The arrow is a separate element rather than part of the label so it can be hidden from assistive
   technology, leaving the name as "ir →". */
export const StyledContactBandCta = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${tokens.space[2]};
  padding: ${tokens.space[2]} ${tokens.space[6]};
  font-size: var(--text-body);
  font-weight: ${tokens.fontWeights.semibold};
  color: ${tokens.colors.textPrimary};
  background-color: ${tokens.colors.bg};
  border-radius: ${tokens.radii.full};
  box-shadow: var(--shadow-sm);
  text-decoration: none;
  white-space: nowrap;
  transition: box-shadow var(--transition-fast), transform var(--transition-fast);

  &:hover {
    box-shadow: var(--shadow-card);
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

export const StyledContactBandFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${tokens.space[4]};
  margin-top: ${tokens.space[10]};
  padding-top: ${tokens.space[6]};
  border-top: 1px solid var(--color-border);

  @media (max-width: 767px) {
    margin-top: ${tokens.space[8]};
    padding-top: ${tokens.space[5]};
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

export const StyledContactBandName = styled.p`
  margin: 0;
  font-size: var(--text-secondary);
  font-weight: ${tokens.fontWeights.medium};
  color: ${tokens.colors.textTertiary};
`;