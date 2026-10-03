import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledProjectRowItem = styled.div`
  height: 100%;
`;

/* A grey gradient on a light section, drawn by shadow alone with no border: grey
   against #F5F5F7 separates on its own, and the shadow softens the edge.
   135deg puts the light stop at the top left, which is where the eye starts and
   which reads as the surface facing the light rather than as a flat rectangle.
   The lightest stop is #48484A at 8.38:1 against the name colour, which is the
   figure the card's text colours are chosen for: every colour on this card has
   to clear 4.5:1 on that stop, not on the average of the two.
   There is deliberately no :hover rule. A dark card does not need to lift, and
   the request asked for the hover effect gone rather than made subtler. */
export const StyledProjectRow = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[4]};
  height: 100%;
  padding: ${tokens.space[8]};
  border-radius: ${tokens.radii['2xl']};
  background: linear-gradient(
    135deg,
    ${tokens.colors.cardFrom},
    ${tokens.colors.cardTo}
  );
  color: ${tokens.colors.cardFg};
  box-shadow: var(--shadow-card);
`;

/* The icon, the name and the round action share this row on wide screens. Below
   about 520px a 120px icon plus a 48px action leaves the name almost no room, so
   the action is moved to its own line instead of being squeezed: it is pinned to
   the end of its own row and the icon and name stay together above it. */
export const StyledProjectRowMain = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${tokens.space[4]};

  @media (max-width: 519px) {
    flex: 1;
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
  width: 120px;
  height: 120px;
  flex: 0 0 120px;
  overflow: hidden;
  /* 22% of the width, the ratio a rounded app-icon tile uses. Scaling with the
     frame rather than staying at a fixed 22px keeps the same silhouette at 120px
     that it had at 88px. */
  border-radius: 26px;
  /* Translucent white: a solid #D2D2D7 border would read as a bright line on a
     dark card. The background is a step lighter than the card so the icons whose
     corners are transparent resolve against a visible tile and not into the card. */
  border: 1px solid ${tokens.colors.cardBorder};
  background: ${tokens.colors.cardFrame};
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
  width: 120px;
  height: 120px;
  flex: 0 0 120px;
  color: ${tokens.colors.cardFgMuted};
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
`;

/* A round plus, replacing the labelled "Ver" pill. The visible label went because
   on a card this dark and this large the pill competed with the project name; the
   accessible name stayed "Ver <project>" on the element, so the symbol is never
   the only thing a screen reader has to go on.
   48px rather than the 44px minimum, to match the scale of the 120px icon. */
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
`;

export const StyledProjectCategories = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${tokens.space[2]};
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const StyledProjectCategory = styled.li`
  list-style: none;
`;