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
  accent: tokens.colors.bgAccent,
  gradient: `linear-gradient(180deg, ${tokens.colors.background} 0%, ${tokens.colors.bgMuted} 100%)`,
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
  content: `
    /* Content: left-aligned, max-width constrained */
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: var(--container-xl);
    margin: 0 auto;
  `,
  split: `
    /* Split: two-column layout for desktop */
    display: grid;
    grid-template-columns: 1fr;
    gap: ${tokens.space[12]};
    align-items: center;

    @media (min-width: 1024px) {
      grid-template-columns: 1fr 1fr;
    }
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
  'space-between': `
    /* Space-between: content distributed vertically */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100%;
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
    /* Mobile: reduce padding, stack split layouts */
    padding-block: ${tokens.space[10]};

    ${({ $composition }) => $composition === 'split' && `
      grid-template-columns: 1fr;
    `}
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