import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledProjectRowItem = styled.li`
  list-style: none;
`;

export const StyledProjectRow = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[3]};
  padding: ${tokens.space[5]};
  border: 1px solid var(--color-border);
  border-radius: ${tokens.radii.xl};
  background: var(--color-bg);
  box-shadow: ${tokens.shadows.xs};
  transition: transform var(--transition-normal) var(--ease-out),
    box-shadow var(--transition-normal) var(--ease-out);

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${tokens.shadows.sm};
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

/* App icons are already designed with their own rounded shape and may not be
   square, so the image is never cropped or re-rounded: it is centred inside a
   fixed 48px slot and keeps the artwork it was given. */
export const StyledProjectIcon = styled.img`
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  object-fit: contain;
  object-position: center;
`;

/* Kept visually identical to StyledProjectIcon so the row does not shift when
   an icon fails to load. */
export const StyledProjectIconFallback = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  color: var(--color-text-tertiary);
`;

export const StyledProjectName = styled.h3`
  flex: 1;
  margin: 0;
  font-size: var(--text-large-subtitle);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.01em;
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
  font-size: var(--text-body);
  font-weight: 400;
  line-height: 1.625;
  color: var(--color-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: break-word;
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