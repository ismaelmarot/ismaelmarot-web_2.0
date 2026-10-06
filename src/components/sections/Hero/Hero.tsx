import {
  StyledHeroSection,
  StyledHeroBody,
  StyledHeroBand,
  StyledHeroIdentity,
  StyledHero,
  StyledHeroContent,
  StyledHeroHeadline,
  StyledHeroTagline,
  StyledHeroCtaGroup,
  StyledHeroCta,
} from './Hero.styles';
import { useHero } from './useHero';
import { Container } from '@/components/common/Container';
import { Link } from 'react-router-dom';

export interface HeroSectionLink {
  label: string;
  summary: string;
  href: string;
}

export interface HeroProps {
  name: string;
  title: string;
  tagline: string;
  cta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  sections?: HeroSectionLink[];
}

export const Hero = ({
  name,
  title,
  tagline,
  cta,
  secondaryCta,
}: HeroProps) => {
  const { ctaRef, secondaryCtaRef } = useHero();

  return (
    <StyledHeroSection
      id="hero"
      data-testid="hero-section"
      ariaLabel="Hero"
      size="xl"
      background="default"
      fullViewport={true}
      composition="hero"
      verticalAlign="top"
    >
      {/* The band is a sibling of the container, not a child, so that it can span the full
          viewport width. Nesting a Container inside it keeps the gutters identical to the rest
          of the page instead of repeating the numbers here and letting them drift. */}
      {/* data-header-contrast is how the fixed header finds this band by itself: the header is
          mounted in the layout, above the page, so it cannot be told about this from a prop. */}
      <StyledHeroBand data-testid="hero-band" data-header-contrast="dark">
        <Container size="xl" padding="lg">
          <StyledHeroIdentity>
            <StyledHeroHeadline as="h1">
              <span>{name}</span>
            </StyledHeroHeadline>
            <StyledHeroTagline as="p" $variant="title">{title}</StyledHeroTagline>
          </StyledHeroIdentity>
        </Container>
      </StyledHeroBand>

      <StyledHeroBody size="xl" padding="lg" data-testid="hero-body">
        <StyledHero>
          <StyledHeroContent>
            <StyledHeroTagline as="p" $variant="description">{tagline}</StyledHeroTagline>

            {(cta || secondaryCta) && (
              <StyledHeroCtaGroup>
                {cta && (
                  <StyledHeroCta as={Link} to={cta.href} $variant="primary" ref={ctaRef}>
                    {cta.label}
                  </StyledHeroCta>
                )}
                {secondaryCta && (
                  <StyledHeroCta as={Link} to={secondaryCta.href} $variant="ghost" ref={secondaryCtaRef}>
                    {secondaryCta.label}
                  </StyledHeroCta>
                )}
              </StyledHeroCtaGroup>
            )}
          </StyledHeroContent>
        </StyledHero>
      </StyledHeroBody>
    </StyledHeroSection>
  );
};