import { StyledAbout, StyledAboutContent, StyledAboutHeadline, StyledAboutText, StyledAboutStats, StyledStatItem, StyledStatValue, StyledStatLabel } from './About.styles';
import { useAbout } from './useAbout';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';

export interface AboutProps {
  content: string;
  stats?: {
    label: string;
    value: string | number;
    description?: string;
  }[];
}

export const About = ({
  content,
  stats,
}: AboutProps) => {
  const { contentRef } = useAbout();

  return (
    <Section
      id="about"
      ariaLabel="About"
      size="xl"
      background="muted"
      fullViewport={true}
      composition="content"
      verticalAlign="center"
    >
      <Container size="xl" padding="lg">
        <StyledAbout ref={contentRef}>
          <StyledAboutHeadline as="h2">Sobre mí</StyledAboutHeadline>
          <StyledAboutContent>
            <StyledAboutText as="p">{content}</StyledAboutText>
          </StyledAboutContent>

          {stats && stats.length > 0 && (
            <StyledAboutStats>
              {stats.map((stat, index) => (
                <StyledStatItem key={stat.label} $index={index}>
                  <StyledStatValue>{stat.value}</StyledStatValue>
                  <StyledStatLabel>{stat.label}</StyledStatLabel>
                  {stat.description && <StyledStatLabel $variant="description">{stat.description}</StyledStatLabel>}
                </StyledStatItem>
              ))}
            </StyledAboutStats>
          )}
        </StyledAbout>
      </Container>
    </Section>
  );
};