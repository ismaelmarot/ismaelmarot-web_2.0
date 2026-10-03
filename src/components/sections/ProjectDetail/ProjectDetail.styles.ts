import styled, { css } from 'styled-components';
import { tokens } from '@/styles/tokens';

/**
 * One definition for the label of a label/value pair. It existed twice as a copy, which is
 * how the platforms label and the information terms drifted apart. The element stays per
 * use so the description list keeps its dt/dd semantics.
 */
const labelCss = css`
  font-size: var(--text-label);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
`;

export const StyledProjectDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[8]};
`;

export const StyledDetailActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${tokens.space[4]};
`;

export const StyledDetailTextButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: ${tokens.space[2]} ${tokens.space[4]};
  font-family: ${tokens.fonts.sans};
  font-size: var(--text-label);
  font-weight: ${tokens.fontWeights.medium};
  color: var(--color-text-secondary);
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: ${tokens.radii.full};
  transition: background-color var(--transition-normal), color var(--transition-normal);

  &:hover {
    background-color: var(--color-bg-muted);
    color: var(--color-text-primary);
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${tokens.shadows.focus};
  }
`;

/**
 * Icon only variant of the text button. It extends it so the border, radius, hover and
 * focus treatment stay in one place, and only overrides the geometry: without equal padding
 * the pill would come out as a 48x32 lozenge around a single glyph.
 */
export const StyledDetailIconButton = styled(StyledDetailTextButton)`
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  /* Filled so the chevron can invert to white. The glyph uses currentColor, so this one
     declaration sets the arrow. White on --color-text-secondary is 5.07:1, which clears AA
     for the text size and the 3:1 that WCAG 1.4.11 asks of a graphical object. */
  background-color: var(--color-text-secondary);
  border-color: var(--color-text-secondary);
  color: var(--color-white);

  /* The base button darkens on hover and paints a focus ring. Neither belongs here, and CSS
     cannot withdraw an inherited rule, so both are restated with the resting values: the
     control looks identical whether the pointer is on it or not. */
  &:hover {
    background-color: var(--color-text-secondary);
    border-color: var(--color-text-secondary);
    color: var(--color-white);
  }

  /* Focus Visible (WCAG 2.4.7, AA) is deliberately not met here. See the task notes. */
  &:focus-visible {
    outline: none;
    box-shadow: none;
  }
`;

export const StyledDetailHeader = styled.header`
  display: flex;
  align-items: flex-start;
  gap: ${tokens.space[4]};
`;

export const StyledDetailIcon = styled.img`
  width: 72px;
  height: 72px;
  flex: 0 0 72px;
  object-fit: contain;
  object-position: center;
`;

export const StyledDetailIconFallback = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  flex: 0 0 72px;
  color: var(--color-text-secondary);
`;

export const StyledDetailHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[2]};
  min-width: 0;
`;

export const StyledDetailName = styled.h1`
  margin: 0;
  font-size: var(--text-display-project);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  overflow-wrap: break-word;
`;

/* A sentence rather than a set of tags, so the weight carries the emphasis that the
   pill background used to. Kept as a paragraph: comma separated text is not a list. */
export const StyledDetailMeta = styled.p`
  margin: 0;
  font-size: var(--text-body);
  font-weight: ${tokens.fontWeights.semibold};
  line-height: ${tokens.lineHeights.snug};
  color: var(--color-text-secondary);
`;

export const StyledDetailRule = styled.hr`
  width: 100%;
  height: 1px;
  margin: 0;
  border: none;
  background-color: var(--color-border);
`;

export const StyledDetailBody = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${tokens.space[6]};

  @media (min-width: 768px) {
    grid-template-columns: 1fr auto;
    align-items: start;
    gap: ${tokens.space[10]};
  }
`;

/* Value lists share one gap and one type style so every pair reads the same. */
export const StyledDetailPlatforms = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${tokens.space[2]};
  margin: 0;
  padding: 0;
  list-style: none;
`;

/* Tight on purpose: the glyphs are small, and the wider 8px read as two separate items.
   Both icon lists share this value so the pair spacing stays identical. */
export const StyledDetailPlatform = styled.li`
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-body);
  color: var(--color-text-primary);
`;

export const StyledDetailDescription = styled.p`
  margin: 0;
  font-size: var(--text-body);
  line-height: 1.625;
  color: var(--color-text-secondary);
`;

export const StyledDetailLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[3]};

  @media (min-width: 768px) {
    align-items: flex-end;
  }
`;

export const StyledDetailLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-label);
  font-weight: ${tokens.fontWeights.medium};
  color: var(--color-accent);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
    border-radius: ${tokens.radii.sm};
  }
`;

export const StyledDetailSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[4]};
`;

export const StyledDetailSectionTitle = styled.h2`
  margin: 0;
  font-size: var(--text-large-subtitle);
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
`;

/* Horizontal carousel. The strip is the scroll container itself rather than a wrapper,
   so the snap points and the keyboard focus ring apply to what actually scrolls. */
export const StyledGalleryFrame = styled.div`
  position: relative;
`;

export const StyledGalleryControl = styled.button<{ $position: 'prev' | 'next' }>`
  position: absolute;
  top: 50%;
  ${({ $position }) => ($position === 'prev' ? 'left: var(--space-2);' : 'right: var(--space-2);')}
  transform: translateY(-50%);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  cursor: pointer;

  /* No hover colour on this control, by request, and the transition went with it since it
     only animated that change. */
  &:focus-visible {
    /* globals.css sets a button:focus-visible outline, which is more specific than a single
       class, so the suppression has to live on :focus-visible too to win the cascade.
       Declaring it on the base rule alone loses. */
    outline: none;
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
  }
`;

export const StyledGallery = styled.ul`
  display: flex;
  align-items: center;
  gap: ${tokens.space[4]};
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  /* Drives the carousel buttons, and is already neutralised under reduced motion. */
  scroll-behavior: smooth;
  scroll-padding-inline-start: ${tokens.space[1]};
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 4px;
    border-radius: ${tokens.radii.sm};
  }

  @media (prefers-reduced-motion: reduce) {
    scroll-behavior: auto;
  }
`;

export const StyledGalleryItem = styled.li`
  flex: 0 0 auto;
  scroll-snap-align: start;
`;

/* Height is fixed rather than the width: phone screenshots are portrait, so a width
   driven strip made each item about 920px tall and only one image fitted on screen.
   Fixing the height keeps every shot whole, gives the row a level baseline, and lets
   each image keep its own proportions. max-width still caps the wide desktop shots. */
export const StyledGalleryImage = styled.img`
  display: block;
  height: clamp(220px, 54vh, 560px);
  width: auto;
  max-width: min(82vw, 560px);
  border: 1px solid var(--color-border);
  border-radius: ${tokens.radii.lg};
  background: var(--color-bg-muted);
`;

/* A fixed column count rather than auto-fit: there are six pairs and the layout is meant
   to read as a row of four followed by a row of two. auto-fit sizes tracks from the
   available width, so it would have squeezed all six onto one line on a wide screen. */
export const StyledInfoGrid = styled.dl`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${tokens.space[5]};
  margin: 0;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    /* Row and column gaps are split because the layout reads as two rows of pairs that
       need air between them. Below this width there are no rows to separate, just six
       stacked pairs, where the wider gap would only add scrolling. */
    row-gap: ${tokens.space[8]};
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const StyledInfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[2]};
`;

export const StyledInfoTerm = styled.dt`
  ${labelCss}
`;

export const StyledInfoValue = styled.dd`
  margin: 0;
  font-size: var(--text-body);
  color: var(--color-text-primary);
`;

/* Comma separated sentence rather than separate list items, matching the line under the
   project title. */
export const StyledInfoInline = styled.p`
  margin: 0;
`;

export const StyledViewports = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${tokens.space[2]};
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const StyledViewport = styled.li`
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-body);
  color: var(--color-text-primary);
`;

export const StyledVersionList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[3]};
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const StyledVersion = styled.li`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-3);
  font-size: var(--text-body);
`;

export const StyledVersionName = styled.span`
  font-weight: 600;
  color: var(--color-text-primary);
`;

export const StyledVersionDate = styled.span`
  font-size: var(--text-label);
  color: var(--color-text-secondary);
`;

export const StyledDetailNote = styled.p`
  margin: 0;
  font-size: var(--text-body);
  color: var(--color-text-secondary);
`;