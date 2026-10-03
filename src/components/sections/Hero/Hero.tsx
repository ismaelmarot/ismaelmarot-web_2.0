import {
  StyledHero,
  StyledHeroContent,
  StyledHeroHeadline,
  StyledHeroTagline,
  StyledHeroCtaGroup,
  StyledHeroCta,
} from './Hero.styles';
import { useHero } from './useHero';
import { Section } from '@/components/common/Section';
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
    <Section
      id="hero"
      ariaLabel="Hero"
      size="xl"
      background="default"
      fullViewport={true}
      composition="hero"
      verticalAlign="center"
    >
      <Container size="xl" padding="lg">
        <StyledHero>
          <StyledHeroContent>
            <StyledHeroHeadline as="h1">
              <span>{name}</span>
            </StyledHeroHeadline>
            <StyledHeroTagline as="p" $variant="title">{title}</StyledHeroTagline>
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
      </Container>
    </Section>
  );
};