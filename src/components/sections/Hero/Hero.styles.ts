import styled, { css } from 'styled-components';
import { tokens } from '@/styles/tokens';
import { Section } from '@/components/common/Section';

/* The Hero section with its top padding removed, so the band can start at y:0 and the fixed header
   rests on black instead of over white.

   The vertical alignment was the actual obstacle, not the padding: `verticalAlign` defaults to
   `center`, which centred the whole content block inside the viewport and put the band at y:161 on a
   1440px screen even though padding-top is only 80px. Removing the padding alone would have left it
   at y:81.

   The bottom padding is declared here rather than left to `size="xl"` because `padding-block` and
   `padding-top` are both single properties, and which one wins comes down to stylesheet order.
   Stating it removes the ambiguity. The values mirror what `size="xl"` provided: 80px from 1024 up,
   48px between 768 and 1023, 40px below 768. */
export const StyledHeroSection = styled(Section)`
  padding-top: 0;
  padding-bottom: ${tokens.space[20]};

  @media (max-width: 1023px) {
    padding-bottom: ${tokens.space[12]};
  }

  @media (max-width: 767px) {
    padding-bottom: ${tokens.space[10]};
  }
`;

/* The name and the title sit on this band, which is a direct child of the Hero section so that
   `width: 100%` already equals the viewport's client width. It is deliberately NOT `100vw`: that unit
   includes the scrollbar, so on a platform with classic scrollbars it would add roughly 15px of
   horizontal scroll. The section measures x:0 with width equal to clientWidth, verified rather than
   assumed, so the full-bleed comes for free.

   `width: 100%` is explicit because the hero composition sets `align-items: center`, which would
   otherwise shrink the band to its content. */
export const StyledHeroBand = styled.div`
  width: 100%;
  background: #000000;
  /* 64px, as specified, and reached from 1000px up. Below that it scales down to a 40px floor
     rather than stepping at a breakpoint, because a fixed 48px under 768px pushed the Hero
     22px past the viewport at 320x640: the name wraps to two lines there, because "Ismael
     Marot" at the 56px minimum of --text-display-hero measures 318px inside a 288px gutter, and
     the extra band padding spent the slack the section used to have. One fluid value fixes the
     narrow case without a second breakpoint to keep in sync. */
  padding-block: clamp(${tokens.space[10]}, 6.4vw, ${tokens.space[16]});
  /* 40px of white between the black surface and the tagline, matching the gap the CTA group
     already uses below the tagline. With the band's own 64px of padding the title sits further
     from the tagline than the tagline sits from the buttons, which is the asymmetry a banded hero
     should have rather than an even 88px channel.
     Fluid for the same reason as the padding: at 320x640 the pair was 6px short of fitting, and
     scaling both together keeps the band's vertical rhythm proportional instead of stepping. */
  margin-bottom: clamp(${tokens.space[6]}, 3.5vw, ${tokens.space[10]});
`;

/* Holds only the name and the title. The 24px gap is the one already used between those two, so the
   band does not introduce a new rhythm of its own. */
export const StyledHeroIdentity = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${tokens.space[6]};
`;

export const StyledHero = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  /* Centres this block in whatever space is left below the band. The section now aligns to the
     top so the band can reach y:0, which means the centring that used to come from the section has
     to come from here instead. */
  margin-block: auto;
`;

export const StyledHeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${tokens.space[6]};
  max-width: 900px;
  width: 100%;
`;

/* White because it sits on the black band. The two are separate props rather than a descendant rule so
   the band can never recolour the tagline below it, which has to stay dark on white. */
export const StyledHeroHeadline = styled.h1`
  margin: 0;
  font-size: var(--text-display-hero);
  font-weight: 700;
  line-height: 1.0;
  letter-spacing: -0.02em;
  color: ${tokens.colors.white};

  span {
    display: block;
  }
`;

export const StyledHeroTagline = styled.p<{ $variant?: 'title' | 'description' }>`
  margin: 0;
  font-size: ${({ $variant }) => {
    switch ($variant) {
      case 'title': return 'var(--text-display-project)';
      case 'description': return 'var(--text-large-subtitle)';
      default: return 'var(--text-large-subtitle)';
    }
  }};
  font-weight: ${({ $variant }) => $variant === 'title' ? 600 : 400};
  line-height: ${tokens.lineHeights.relaxed};
  /* 'title' rides on the black band and has to be white; 'description' stays below it on white and has
     to stay dark. Two states, two backgrounds, so the colour follows the variant rather than the
     surroundings, which is what keeps the tagline readable. */
  color: ${({ $variant }) =>
    $variant === 'description' ? 'var(--color-text-secondary)' : tokens.colors.white};
  max-width: 700px;
`;

export const StyledHeroCtaGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${tokens.space[4]};
  margin-top: ${tokens.space[4]};
`;

export const StyledHeroCta = styled.a<{ $variant?: 'primary' | 'ghost' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  padding: ${tokens.space[3]} ${tokens.space[6]};
  font-family: ${tokens.fonts.sans};
  font-size: ${tokens.fontSizes.lg};
  font-weight: ${tokens.fontWeights.medium};
  text-decoration: none;
  white-space: nowrap;
  border-radius: ${tokens.radii.full};
  transition: background-color 120ms ease-out;

  ${({ $variant }) =>
    $variant === 'ghost'
      ? css`
          background-color: transparent;
          color: ${tokens.colors.textPrimary};

          &:hover {
            background-color: ${tokens.colors.bgMuted};
          }
        `
      : css`
          background-color: ${tokens.colors.primary};
          color: ${tokens.colors.white};

          &:hover {
            background-color: ${tokens.colors.primaryHover};
            color: ${tokens.colors.white};
          }
        `}

  &:focus-visible {
    outline: 2px solid ${tokens.colors.focus};
    outline-offset: 2px;
  }
`;