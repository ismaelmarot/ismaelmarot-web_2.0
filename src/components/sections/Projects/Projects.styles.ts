import styled from 'styled-components';
import { tokens } from '@/styles/tokens';
import { Container } from '@/components/common/Container';
import { Section } from '@/components/common/Section';

export const StyledProjects = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  gap: ${tokens.space[6]};
`;

/* The shared Container is a plain block, and the card height depends on a flex
   chain running the whole way down: Section (min-height 100dvh) > Container >
   StyledProjects > strip (flex: 1). Extending it here keeps the change local
   instead of altering a component the whole site shares. */
export const StyledProjectsContainer = styled(Container)`
  display: flex;
  flex: 1;
  min-height: 0;
`;

/* size="xl" puts 80px of block padding above and below, which is 160px of a
   640px-tall phone before any content. On narrow screens it is halved so the
   card keeps a usable height and the section lands close to one screen. */
export const StyledProjectsSection = styled(Section)`
  @media (max-width: 767px) {
    padding-block: ${tokens.space[10]};
  }
`;

export const StyledProjectsHeader = styled.div`
  text-align: left;

  @media (max-width: 767px) {
    text-align: left;
  }
`;

export const StyledProjectsHeadline = styled.h2`
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

export const StyledProjectsFilterWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${tokens.space[3]};
`;

/* One project per screen, moved by native scrolling.
   The height is never written here: the section is a flex column of
   min-height 100dvh and this strip takes `flex: 1` with `min-height: 0`, so the
   card is whatever is left after the heading, the filter and the dots. That is
   also what keeps it correct when the filter wraps to two lines on a narrow
   phone, which a calc() against 100dvh would get wrong.
   The bottom padding and the matching negative margin give the card's shadow
   room inside the scroll box: overflow-x clips in both axes, so a shadow with no
   room would be cut off at the strip's edge without moving the layout. */
export const StyledProjectsList = styled.ul`
  display: flex;
  flex: 1;
  min-height: 0;
  align-self: stretch;
  flex-direction: row;
  gap: ${tokens.space[6]};
  margin: 0;
  margin-bottom: -${tokens.space[6]};
  padding: 0 0 ${tokens.space[6]};
  list-style: none;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    scroll-behavior: auto;
  }

  /* Cards bleed to the screen edges so the next one is visible as a hint. The
     padding restores the gutter, so a snapped card sits at the same 16px the
     rest of the page uses rather than flush against the bezel. */
  @media (max-width: 767px) {
    margin-inline: -${tokens.space[4]};
    padding-inline: ${tokens.space[4]};
    scroll-padding-inline-start: ${tokens.space[4]};
  }

  @media (min-width: 900px) {
    gap: ${tokens.space[8]};
  }
`;

/* Each card is one screen. The item carries the snap so the article inside can
   stay a plain block, and `flex: 0 0 100%` below 900px is what makes exactly one
   visible; from 900px the card settles at a fixed 800px, which is the width the
   spec chose for desktop. */
export const StyledProjectCard = styled.li`
  flex: 0 0 100%;
  min-width: 0;
  height: 100%;
  scroll-snap-align: start;
  list-style: none;

  @media (min-width: 900px) {
    flex: 0 0 800px;
    max-width: 800px;
  }
`;

export const StyledProjectsDots = styled.div`
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  padding-top: ${tokens.space[2]};
`;

/* Loading placeholder, sized to the card it replaces so the section does not
   change height when the real cards arrive. */
export const StyledProjectsSkeletonCard = styled.div`
  width: 100%;
  height: 100%;
  border-radius: ${tokens.radii['2xl']};
  background: var(--color-bg);
  box-shadow: var(--shadow-card);
`;

export const StyledProjectsEmpty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  text-align: left;
  padding: ${tokens.space[16]} ${tokens.space[8]};
  color: var(--color-text-tertiary);
  font-size: var(--text-large-subtitle);

  p {
    margin: 0;
  }
`;

export const StyledProjectsError = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  text-align: left;
  padding: ${tokens.space[16]} ${tokens.space[8]};
  color: var(--color-text-primary);
  font-size: var(--text-large-subtitle);
  gap: ${tokens.space[4]};

  p {
    margin: 0;
  }

  button {
    padding: ${tokens.space[2]} ${tokens.space[4]};
    font-size: var(--text-label);
    font-weight: 500;
    color: var(--color-white);
    background: var(--color-accent);
    border: none;
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: background-color var(--transition-fast);

    &:hover {
      background: var(--color-accent-hover);
    }

    &:focus-visible {
      outline: none;
      box-shadow: var(--shadow-focus);
    }
  }
`;