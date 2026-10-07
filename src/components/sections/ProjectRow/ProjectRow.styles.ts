import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledProjectRowItem = styled.div`
  height: 100%;
`;

/* White on a #F5F5F7 section, with no border: the shadow is the separator, because a #D2D2D7
   border measures 1.51:1 here and WCAG holds a non-text boundary to 3:1. White rather than a light
   grey because the section is already grey: at #F2F2F7 the card would measure 1.02:1 against it and
   drop the action's blue to 4.21:1, failing AA. Every colour on this card is chosen against
   #FFFFFF, which is the lightest stop and therefore the one that matters.
   There is deliberately no :hover rule. The request asked for the hover effect gone rather than
   made subtler, and a light card with a soft shadow gains nothing from lifting. */
export const StyledProjectRow = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[4]};
  height: 100%;
  padding: ${tokens.space[8]};
  border-radius: ${tokens.radii['2xl']};
  /* Flat rather than a gradient now. Both stops are white, so the gradient resolved to a
     linear-gradient of two whites and left background-color transparent, which is not what a card
     is; with a single colour there is no direction to preserve. The value is set twice on purpose:
     background-color is what a computed-style check reads, and it is also what paints if anything
     ever drops the shorthand. */
  background: ${tokens.colors.cardFrom};
  background-color: ${tokens.colors.cardFrom};
  color: ${tokens.colors.cardFg};
  box-shadow: var(--shadow-card);

  /* Amendment 1 of the carousel spec. 32px of padding is 64px of a 640px-tall phone, and the
     section only reaches one screen by taking every pixel it can from padding and gaps, which are
     the two things nobody sees. Measured with everything else in that amendment in place: at
     320x640 this is the difference between the description fitting in two whole lines and being cut
     through the middle of the second. */
  @media (max-width: 519px) {
    padding: ${tokens.space[5]};
    gap: ${tokens.space[3]};
  }
`;

/* The icon, the name and the round action share this row on wide screens. Below
   about 520px a 96px icon plus a 48px action leaves the name little room, so
   the action is moved to its own line instead of being squeezed: it is pinned to
   the end of its own row and the icon and name stay together above it.

   Amendment 1 of the carousel spec changed `flex: 1` to `flex: 0 0 auto` here, and that is the
   single largest cause of the mobile overflow. With `flex: 1` this row absorbed every pixel of
   leftover space in the card and the description received none: at 320x640 the card body held 72px
   and cut the description mid-line. It was invisible in the CSS because shrinking the icon from
   120px to 64px changed the measured layout by exactly zero, the row simply grew into whatever
   was left over. Now the leftover goes to the description, where it is worth something. */
export const StyledProjectRowMain = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${tokens.space[4]};

  @media (max-width: 519px) {
    flex: 0 0 auto;
    align-content: center;
    min-height: 0;
  }
`;

/* Every icon in src/data/projects.json is a square canvas. Five have slightly
   transparent corners, which at the old 48px was a radius of roughly 3-8px and
   did not read as rounded; LinkIO is fully opaque and read as a hard square.
   The frame is what defines the silhouette, so the artwork is clipped rather
   than trusted to arrive pre-rounded. `cover` fills the frame, which crops about
   4% off QEntry (379x366, not square) and is accepted for that reason. */
export const StyledProjectIconFrame = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  flex: 0 0 96px;
  overflow: hidden;
  /* 22% of the width, the ratio a rounded app-icon tile uses. Scaling with the
     frame rather than staying at a fixed 22px keeps the same silhouette at 96px
     that it had at 88px. */
  border-radius: 21px;
  /* Translucent white: a solid #D2D2D7 border would read as a bright line on a
     dark card. The background is a step lighter than the card so the icons whose
     corners are transparent resolve against a visible tile and not into the card. */
  border: 1px solid transparent;
  background: ${tokens.colors.cardFrame};

  /* Amendment 2 took this from 120px to 80px below 520px, and Amendment 3 took the desktop value to
     96px to match the smaller card. At 320px the card is 256px wide inside the gutters, and a
     120px icon, the name and a 48px action cannot share one line there, which this spec's own edge
     case already conceded. The radius stays at 22% of the frame so the silhouette is unchanged. */
  @media (max-width: 519px) {
    width: 80px;
    height: 80px;
    flex: 0 0 80px;
    border-radius: 18px;
  }
`;

export const StyledProjectIcon = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

/* Kept identical to the frame so a failed icon never changes the card geometry. */
export const StyledProjectIconFallback = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  flex: 0 0 96px;
  color: ${tokens.colors.cardFgMuted};

  /* Kept identical to the frame above, so a failed icon cannot change the geometry. */
  @media (max-width: 519px) {
    width: 80px;
    height: 80px;
    flex: 0 0 80px;
  }
`;

export const StyledProjectName = styled.h3`
  flex: 1;
  margin: 0;
  font-size: var(--text-card-title);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: ${tokens.colors.cardFg};
  overflow-wrap: break-word;

  /* Amendment 2 of the dark-card spec. 28px of name next to an 80px icon leaves the name a narrow
     column that wraps "NauticAcademy" onto two lines and costs the card a row it does not have at
     320x640.

     Amendment 4 reserves two lines on desktop, and this is the second of the two causes of unequal
     card heights: car-expense-tracker has a one-line description and was still 10px taller than the
     cards beside it, because its heading wrapped. Describing it was not enough. Expressed as a
     multiple of line-height rather than as a pixel figure so it follows the type if the token moves. */
  @media (max-width: 519px) {
    font-size: 22px;
  }

  /* Above 520px, where the card's height is fixed at 381px and a two-line heading would otherwise
     make that one card taller than the five beside it. */
  @media (min-width: 520px) {
    min-height: calc(2 * 1.1em);
  }
`;

/* A round plus, replacing the labelled "Ver" pill. The visible label went because
   on a card this dark and this large the pill competed with the project name; the
   accessible name stayed "Ver <project>" on the element, so the symbol is never
   the only thing a screen reader has to go on.
   48px rather than the 44px minimum, to match the scale of the icon. */
export const StyledProjectAction = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  padding: 0;
  border-radius: ${tokens.radii.full};
  background-color: var(--color-accent);
  color: var(--color-white);
  text-decoration: none;

  /* Amendment 2 of the dark-card spec. 44px rather than 48px below 520px, which still satisfies
     FR-004's 44px minimum, so nothing here trades away reachability for height. */
  @media (max-width: 519px) {
    width: 44px;
    height: 44px;
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${tokens.shadows.focus};
  }
`;

export const StyledProjectDescription = styled.p`
  margin: 0;
  font-size: var(--text-card-body);
  font-weight: 400;
  line-height: 1.6;
  color: ${tokens.colors.cardFgMuted};
  /* Clamped at 3 lines so every card is the same height, which is what keeps the
     section filling exactly one screen instead of varying with description length. */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: break-word;

  /* Amendment 1 of the carousel spec. The body is a flex column, so its children default to
     flex-shrink: 1 and were being compressed when the content ran a few pixels over, which cut the
     description through the middle of a line instead of letting the clamp truncate it cleanly. At
     320x640 one card measured 1.65 lines. Held at its content height here, the body's own
     overflow-y then takes over, which is what this spec's short-viewport edge case always intended. */
  flex-shrink: 0;

  /* Amendment 2 of the dark-card spec. Two lines below 520px, because that is what fits at 320x640
     once the icon, the name, the action and the chips are placed. This is not only a cap: the body
     box at that size was already smaller than three lines, so the text was being cut through the
     middle by the container rather than by the clamp, which reads as a fault rather than as
     truncation. Stating it here makes every phone the same shape, which is the job the three-line
     clamp was doing on larger screens. */
  @media (max-width: 519px) {
    -webkit-line-clamp: 2;
  }
`;

/* Pushes the categories to the bottom so the action stays anchored and cards
   read the same whether they carry two categories or four. */
export const StyledProjectBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[4]};
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

/* Holds the round action alone, pinned to the end. On narrow screens this is a
   row of its own under the icon and name rather than something wedged beside them. */
export const StyledProjectFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${tokens.space[4]};
  padding-top: ${tokens.space[4]};
  flex-shrink: 0;

  /* Amendment 1 of the carousel spec. 8px of padding above the action, out of the same budget as
     the card's own padding. */
  @media (max-width: 519px) {
    padding-top: ${tokens.space[3]};
  }
`;

export const StyledProjectCategories = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${tokens.space[2]};
  margin: 0;
  padding: 0;
  list-style: none;

  /* Held at its content height for the same reason as the description: compressed, the badges
     squashed and the row no longer matched the category count it stands for. */
  flex-shrink: 0;
`;

export const StyledProjectCategory = styled.li`
  list-style: none;

  /* Amendment 3 of the dark-card spec. The Badge's subtle variant is #F5F5F7, which was chosen
     to sit on a near-black card and measures 1.02:1 against this one, so the chips were invisible
     rather than merely plain. #F2F2F7 with #48484A text measures 8.18:1 and reads as a chip.

     The parent selector is repeated rather than the child being nested, so this rule carries two
     classes against the Badge's one and wins regardless of the order the two stylesheets end up
     injected in. A plain span selector did not win, which is why the values below were declared
     correctly and did not apply.

     Literal hexes on purpose: tokens.colors.bgMuted is #F5F5F7, which is the section background
     and not what this chip needs. */
  && > span {
    background-color: #F2F2F7;
    color: #48484A;
  }
`;
