import { StyledHero, StyledHeroContent, StyledHeroHeadline, StyledHeroTagline, StyledHeroCtaGroup, StyledHeroCta } from './Hero.styles';
import { useHero } from './useHero';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';

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
                  <StyledHeroCta as="a" href={cta.href} ref={ctaRef}>
                    <Button variant="primary" size="lg" fullWidth={false}>
                      {cta.label}
                    </Button>
                  </StyledHeroCta>
                )}
                {secondaryCta && (
                  <StyledHeroCta as="a" href={secondaryCta.href} ref={secondaryCtaRef}>
                    <Button variant="ghost" size="lg" fullWidth={false}>
                      {secondaryCta.label}
                    </Button>
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