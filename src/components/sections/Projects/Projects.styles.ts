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

  /* Amendment 1. 24px between four blocks is 72px, and on a 640px-tall phone that is the
     difference between a two-line description and one cut through the middle. Tightened to 16px
     below 520px only, where it is the second-largest source of space after the filter. */
  @media (max-width: 519px) {
    gap: ${tokens.space[4]};
  }
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
   card keeps a usable height and the section lands close to one screen.

   Amendment 1. The remaining part of the problem is that `min-height: 100dvh` is a floor, not a
   size: the section's height is max(100dvh, natural content), and the natural content cannot be
   worked out without the card's natural height. The browser breaks that circle by using the
   card's natural 455px, which is how a 640px-tall phone ended up with an 911px section.

   Giving the section a definite height below 1024px closes the circle from the other end. Every
   link in the chain already carries `flex: 1; min-height: 0` and was waiting for a definite parent:
   the strip's flex finally has leftover space to distribute, the card's `height: 100%` finally
   resolves to something other than auto, and the card takes what is left after the heading, the
   filter and the controls. The card's height stays derived by flex, so FR-002 is untouched.

   1024px rather than 520px because this is about the section having a definite height, which is
   true for any viewport where the natural content would otherwise win. Above 1024px the natural
   content is smaller than the viewport and the floor was never binding, so desktop is left alone. */
export const StyledProjectsSection = styled(Section)`
  @media (max-width: 767px) {
    padding-block: ${tokens.space[10]};
  }

  @media (max-width: 1023px) {
    height: 100dvh;
  }

  /* Amendment 3 of the dark-card spec. The definite height was written for phones and tablets and
     stopped at 1024px, which left the carousel overflowing on short desktop viewports: measured
     795 of 720 at 1280x720, 782 of 700 at 1024x700 and 782 of 768 at 1024x768. The card was never
     the cause; 160px of block padding plus the heading, filter and controls does not fit in 720px
     whatever the card does. So the height is fixed at every viewport, and the block padding drops
     from 80px to 48px once the viewport is under 1000px of height, which is where it stops fitting. */
  height: 100dvh;

  @media (max-height: 1000px) {
    padding-block: ${tokens.space[12]};
  }

  /* Reclaimed from the section rather than from the card, and only where the section was over
     budget. Stacked after the 767px block so it wins at equal specificity. */
  @media (max-width: 519px) {
    padding-block: ${tokens.space[8]};
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
   visible; from 900px the card settles at 620px.

   Amendment 3 of the dark-card spec, which took it from 800px. The width alone does not make the
   card smaller: measured at 800, 700, 620 and 560px wide the card stayed 476px tall, because its
   height is set by the flex chain and not by its content. So the size request needs an explicit
   maximum height as well, and the section is re-checked at every viewport after it. */
export const StyledProjectCard = styled.li`
  flex: 0 0 100%;
  min-width: 0;
  height: 100%;
  scroll-snap-align: start;
  list-style: none;

  @media (min-width: 900px) {
    flex: 0 0 620px;
    max-width: 620px;

    /* 380px is the smallest height at which the 96px icon row, the three-line description clamp,
       the badges and the 52px action all fit without the body scrolling. Below that the body
       scrolls internally, which is this spec's documented fallback and not a clip.

       align-self: flex-start is what makes the smaller card read as a card. The strip is a flex
       row that takes flex: 1, so at 1440x900 it is 564px tall while the card is 380, and without
       this the leftover sat under the card and read as a band of section background with the
       card's shadow lying across it. Measured at 1440x900: strip 564, card 380, 184px of visible
       grey. Aligning to the start moves that space below the shadow, where it is the gap the
       controls occupy. */
    align-self: flex-start;

    /* Amendment 4. Fixed, not a maximum. The maximum let each card measure its own content, and
       the six came out at four heights between 326 and 381: the description varies by 27px per line
       within the three-line clamp, and the name adds 10px on the two projects whose heading wraps.
       381 is the tallest card measured, so nothing is truncated to reach it.

       The clamp is what keeps this safe when the data changes: a description of four lines is cut to
       three by the existing line-clamp, so the height cannot grow. */
    height: 381px;
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