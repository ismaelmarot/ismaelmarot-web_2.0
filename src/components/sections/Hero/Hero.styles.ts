import styled, { css } from 'styled-components';
import { tokens } from '@/styles/tokens';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';

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
/* The auto margins belong HERE, on the Container, which is the section's direct flex child.
   Amendment 2 put them on StyledHero, which is a grandchild, and auto margins only distribute free
   space on a flex item: the declaration did nothing at all. The result was the content sitting
   immediately below the band with 322px of empty space underneath it, the only section on the page
   that was not vertically balanced. The other four centre theirs and sit at 319/318. */
/* Amendment 2 put the centring margin here, on the section's direct flex child, because auto
   margins distribute free space on a flex item and on a descendant they did nothing at all.

   Amendment 7: this is the declaration that was making the gap, and this is the element that has
   to stop. The `margin-block: auto` below was also left on `StyledHero` by mistake when the
   centring was first written, so both the parent and its child were asking to be centred and the
   mobile override was landing on the child, which is not the one distributing space. Measured in
   production before this was found: the rule was deployed, and the gap was still 70px at 390x844
   with a computed margin-top of 46px. The parent is what has to change. */
export const StyledHeroBody = styled(Container)`
  margin-block: auto;

  /* Below 768px the block sits under the band rather than centred in the leftover space, so the
     gap is the band's own 24px margin at every mobile size instead of growing with the screen. */
  @media (max-width: 767px) {
    margin-block: 0;
  }
`;

export const StyledHeroSection = styled(Section)`
  padding-top: 0;
  padding-bottom: ${tokens.space[20]};

  @media (max-width: 1023px) {
    padding-bottom: ${tokens.space[12]};
  }

  @media (max-width: 767px) {
    /* Amendment 5. 32px rather than 40px, and those eight pixels are the entire cost of this
       amendment. At 320x640 the band is 320px of 50% and the rest of the Hero wants 322: 24px of
       margin under the band, 258px of tagline and buttons, and this padding. Two pixels over.
       Taking them from here rather than from the margin or the type means the only thing given up
       anywhere is eight pixels of air under the buttons. */
    padding-bottom: ${tokens.space[8]};
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

  /* The band is a statement, so it is sized as a proportion of the screen rather than by its
     content. Content-driven height left it at 43% of a 900px viewport and only 30% of an 844px
     phone, which read as a text block with padding rather than as the dark region the rest of the
     design implies.

     min-height rather than height, so a viewport too short to hold the proportion still grows to fit
     its content instead of clipping the name. */
  min-height: 55dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;

  /* Top: the header is fixed and floats over this band, so the band reserves its height plus one
     spacing step. Derived rather than written, so a change to --header-height carries the band
     with it instead of silently overlapping. With the content centred inside the band this is what
     guarantees the name clears the header even when the band is at its minimum. */
  padding-top: calc(var(--header-height) + ${tokens.space[12]});
  padding-bottom: clamp(${tokens.space[10]}, 6.4vw, ${tokens.space[16]});

  @media (max-width: 767px) {
    padding-top: calc(var(--header-height) + ${tokens.space[8]});

    /* Amendment 5. Half the screen on a phone, 55% from 768px up. Two statements rather than one
       inverted rule, so that desktop is untouched by construction and not by a subtraction that
       could be got wrong.

       55% was more than a phone needs: at 390x844 it left 464px of black above 190px of tagline
       and buttons, and the name sat 136px below a 52px header.

       The band's own floor is its content, 312px at 320px wide because the name wraps to two lines
       there and the band reserves the header's height plus a spacing step above itself. That is 49%
       of a 640px screen. Below that floor min-height grows the band to fit rather than clipping,
       which is what the previous max-height: 720px fallback was for, except that it did it by
       discarding the proportion instead. That fallback is gone: it left a 375x667 iPhone SE showing
       38% of the screen in black, the smallest band on the site, on a phone of ordinary size.

       Amendment 6 raises this to 60%. The proportion is a single declaration; the work was in the
       CTA row, which wraps below 375px and cost the band 58px of overflow at 320x640. See
       FR-043 for the fix and the reasons the alternatives were rejected. */
    min-height: 60dvh;
  }
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
  /* Centring lives on StyledHeroBody, which is the section's direct flex child and therefore the
     element that can distribute free space. This one is a plain block wrapper: the auto margin
     that used to sit here did nothing on mobile, because its parent was already being centred,
     and Amendment 7's mobile override was measured landing on this child while the gap stayed at
     70px. Kept without a margin so the two cannot disagree again. */
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

  /* Amendment 6, FR-043. The two buttons measure 182px and 143px with a 16px gap, which is 341px
     together, against 288px of width available at 320px and 343px at 375px. They therefore wrap
     below 375px, and a wrapped row costs a whole 52px line, which is the 58px by which the band
     could not reach 60% at 320x640.

     17px with 16px of horizontal padding brings them to 277px. The height stays at 52px, which is
     what FR-004's 44px minimum is about: no reachability is traded for the fit, in either
     dimension. 375px and above keep their 20px buttons, because they already fit.

     Measured against the alternatives, none of which reached: clamping the description to two lines
     left 25px over and cost a line of text; trimming the band's margin and the section padding left
     9px over; and capping the band with a calc() against its measured content height gave no
     overflow but only 51% at 320x640, and reintroduced the content-coupled rule Amendment 5
     deleted. */
  @media (max-width: 360px) {
    height: 52px;
    padding: ${tokens.space[3]} ${tokens.space[4]};
    font-size: 17px;
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.focus};
    outline-offset: 2px;
  }
`;