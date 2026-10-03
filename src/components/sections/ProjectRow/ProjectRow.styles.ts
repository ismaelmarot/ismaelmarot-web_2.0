import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledProjectRowItem = styled.div`
  height: 100%;
`;

/* The card is a full-screen surface now, not a list row, so its height comes
   from the strip rather than from a fixed value. No border: on the muted section
   the shadow is the only thing drawing the edge, which is why it needs two
   spread layers rather than the 2px --shadow-xs this replaced. */
export const StyledProjectRow = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[4]};
  height: 100%;
  padding: ${tokens.space[8]};
  border-radius: ${tokens.radii['2xl']};
  background: var(--color-bg);
  box-shadow: var(--shadow-card);
  transition: transform var(--transition-normal) var(--ease-out),
    box-shadow var(--transition-normal) var(--ease-out);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-card-hover);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover {
      transform: none;
    }
  }
`;

export const StyledProjectRowMain = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${tokens.space[4]};
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
  width: 88px;
  height: 88px;
  flex: 0 0 88px;
  overflow: hidden;
  border-radius: 22px;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
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
  width: 88px;
  height: 88px;
  flex: 0 0 88px;
  color: var(--color-text-tertiary);
`;

export const StyledProjectName = styled.h3`
  flex: 1;
  margin: 0;
  font-size: var(--text-card-title);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
  overflow-wrap: break-word;
`;

export const StyledProjectAction = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 44px;
  /* 24px of horizontal padding rather than 16. Without the arrow the label alone rendered
     the control at 58px wide, a sliver of a pill; the padding gives it back enough body to
     read as a button without adding anything to say. */
  padding: ${tokens.space[2]} ${tokens.space[6]};
  font-family: ${tokens.fonts.sans};
  font-size: var(--text-label);
  font-weight: ${tokens.fontWeights.medium};
  /* Uppercase, and spaced to suit three letters. Set here rather than in the markup so the
     text stays "Ver" for anything reading the source or the accessible tree. */
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-decoration: none;
  white-space: nowrap;
  border-radius: ${tokens.radii.full};
  background-color: var(--color-accent);
  color: var(--color-white);
  transition: background-color var(--transition-normal);

  &:hover {
    background-color: var(--color-accent-hover);
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
  color: var(--color-text-secondary);
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

export const StyledProjectFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${tokens.space[4]};
  padding-top: ${tokens.space[4]};
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