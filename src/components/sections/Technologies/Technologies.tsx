import { StyledTechnologies, StyledTechnologiesHeader, StyledTechnologiesHeadline, StyledTechnologiesCategories, StyledCategoryGroup, StyledCategoryTitle, StyledCategoryGrid } from './Technologies.styles';
import { useTechnologies } from './useTechnologies';
import { TechnologyCard } from '@/components/sections/TechnologyCard';
import { Contributions } from '@/components/sections/Contributions';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { getPopulatedCategories } from '@/data/technologies';
import type { Technology } from '@/types/project';

export interface TechnologiesProps {
  technologies?: Technology[];
}

export const Technologies = ({
  technologies = [],
}: TechnologiesProps) => {
  const { categoriesRef } = useTechnologies();

  // One source for the grouping, the order and the labels, shared with the home marquee.
  const groups = getPopulatedCategories(technologies);

  return (
    <Section
      id="technologies"
      ariaLabel="Technologies"
      size="xl"
      background="muted"
      fullViewport={true}
      composition="technologies"
      verticalAlign="top"
    >
      <Container size="xl" padding="lg">
        <StyledTechnologies ref={categoriesRef}>
          <StyledTechnologiesHeader>
            <StyledTechnologiesHeadline as="h2">Tecnologías</StyledTechnologiesHeadline>
          </StyledTechnologiesHeader>

          <Contributions />

          <StyledTechnologiesCategories role="list" aria-label="Categorías de tecnologías">
            {groups.map(({ category, label, technologies: techs }) => {
              return (
                <StyledCategoryGroup key={category} role="listitem">
                  <StyledCategoryTitle>{label}</StyledCategoryTitle>
                  {/* Its own list: the chip is already a listitem, and burying one inside
                      another without a list between them is what axe reports as
                      aria-required-parent. It went unnoticed while the section was empty. */}
                  <StyledCategoryGrid role="list" aria-label={label}>
                    {techs.map((tech, index) => (
                      <TechnologyCard key={tech.id} technology={tech} index={index} />
                    ))}
                  </StyledCategoryGrid>
                </StyledCategoryGroup>
              );
            })}
          </StyledTechnologiesCategories>
        </StyledTechnologies>
      </Container>
    </Section>
  );
};