import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

const sectionSizes = {
  sm: tokens.space[10],
  md: tokens.space[12],
  lg: tokens.space[16],
  xl: tokens.space[20],
} as const;

const sectionBackgrounds = {
  default: tokens.colors.background,
  muted: tokens.colors.bgMuted,
  accent: tokens.colors.bgMuted,
} as const;

const compositionStyles = {
  default: `
    /* Default: natural flow */
  `,
  hero: `
    /* Hero: centered content with generous space */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  `,
  about: `
    /* About: left-aligned, generous negative space, max-width constrained */
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: var(--container-xl);
    margin: 0 auto;
    padding-inline: var(--space-6);
  `,
  projects: `
    /* Projects: visual-first, asymmetric on desktop, large images */
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: var(--container-2xl);
    margin: 0 auto;
    width: 100%;
  `,
  technologies: `
    /* Technologies: categorized, clean hierarchy, not card grid */
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: var(--container-xl);
    margin: 0 auto;
    padding-inline: var(--space-6);
  `,
  contact: `
    /* Contact: centered, vertically distributed, spacious, direct */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    min-height: 100%;
    max-width: var(--container-lg);
    margin: 0 auto;
    padding-inline: var(--space-6);
  `,
  centered: `
    /* Centered: horizontally and vertically centered */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    max-width: var(--container-lg);
    margin: 0 auto;
  `,
} as const;

const verticalAlignStyles = {
  top: `
    align-items: flex-start;
    justify-content: flex-start;
  `,
  center: `
    align-items: center;
    justify-content: center;
  `,
  bottom: `
    align-items: flex-end;
    justify-content: flex-end;
  `,
  'space-between': `
    justify-content: space-between;
  `,
} as const;

export const StyledSection = styled.section<{
  $size: keyof typeof sectionSizes;
  $background: keyof typeof sectionBackgrounds;
  $fullViewport: boolean;
  $composition: keyof typeof compositionStyles;
  $verticalAlign: keyof typeof verticalAlignStyles;
}>`
  width: 100%;
  padding-block: ${({ $size }) => sectionSizes[$size]};
  background: ${({ $background }) => sectionBackgrounds[$background]};

  /* Full viewport height - allows content to grow beyond */
  ${({ $fullViewport }) => $fullViewport && `
    min-height: 100dvh;
    min-height: 100vh; /* fallback for older browsers */
  `}

  /* Composition variants */
  ${({ $composition }) => compositionStyles[$composition]}

  /* Vertical alignment within the section */
  ${({ $verticalAlign }) => verticalAlignStyles[$verticalAlign]}

  /* Responsive adjustments */
  @media (max-width: 767px) {
    /* Mobile: reduce padding */
    padding-block: ${tokens.space[10]};
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    /* Tablet: intermediate padding */
    padding-block: ${tokens.space[12]};
  }

  @media (min-width: 1024px) {
    /* Desktop: full padding */
    padding-block: ${({ $size }) => sectionSizes[$size]};
  }
`;