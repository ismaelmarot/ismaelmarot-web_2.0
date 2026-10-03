import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledSectionSummary = styled.section<{ $background: 'default' | 'muted' }>`
  padding-block: ${tokens.space[16]};
  /* Full viewport height with the content centered, matching the Section primitive */
  min-height: 100vh; /* fallback for browsers without dynamic viewport units */
  min-height: 100dvh;
  display: grid;
  align-content: center;
  background-color: ${({ $background }) =>
    $background === 'muted' ? tokens.colors.bgMuted : tokens.colors.bg};

  @media (max-width: 767px) {
    padding-block: ${tokens.space[12]};
  }
`;

export const StyledSectionSummaryContent = styled.div`
  max-width: ${tokens.containers.xl};
  /* Two properties, and both are load-bearing for the technology marquee in the featured slot,
     whose track is width:max-content at nearly 7000px:

     width:100% because auto margins on a grid item switch off justify-self:stretch, so without
     an explicit width this box took its max-content width instead of the track's.

     min-width:0 because a grid item's automatic minimum size is its min-content width, which
     raised the track's own minimum to 1072px and pushed it past a 375px phone. */
  width: 100%;
  min-width: 0;
  margin-inline: auto;
  padding-inline: ${tokens.space[6]};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${tokens.space[6]};
`;

export const StyledSectionSummaryTitle = styled.h2`
  font-size: ${tokens.fontSizes['2xl']};
  font-weight: ${tokens.fontWeights.bold};
  color: ${tokens.colors.textPrimary};
  line-height: ${tokens.lineHeights.display};
  margin: 0;
`;

export const StyledSectionSummaryDescription = styled.p`
  font-size: ${tokens.fontSizes.lg};
  color: ${tokens.colors.textSecondary};
  line-height: ${tokens.lineHeights.relaxed};
  max-width: 640px;
  margin: 0;
`;

export const StyledSectionSummaryCta = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: ${tokens.space[2]} ${tokens.space[4]};
  margin-top: ${tokens.space[2]};
  font-family: ${tokens.fonts.sans};
  font-size: ${tokens.fontSizes.base};
  font-weight: ${tokens.fontWeights.medium};
  text-decoration: none;
  white-space: nowrap;
  border-radius: ${tokens.radii.full};
  background-color: ${tokens.colors.primary};
  color: ${tokens.colors.white};
  transition: background-color 120ms ease-out;

  &:hover {
    background-color: ${tokens.colors.primaryHover};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.focus};
    outline-offset: 2px;
  }
`;

export const StyledSectionSummaryFeatured = styled.div`
  margin-top: ${tokens.space[8]};
  width: 100%;
  max-width: ${tokens.containers.lg};
  /* A block's minimum content size is min(max-content, max-width), so max-width:1024px on its
     own puts a 1024px floor under this box. With a wide child such as the technology marquee,
     whose track is width:max-content at nearly 7000px, that floor exceeded a 375px phone and
     pushed a horizontal scrollbar onto the whole page. Zeroing the automatic minimum lets this
     box shrink to the space it actually has. */
  min-width: 0;
`;
