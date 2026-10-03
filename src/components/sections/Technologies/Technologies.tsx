import { StyledTechnologies, StyledTechnologiesHeader, StyledTechnologiesHeadline, StyledTechnologiesCategories, StyledCategoryGroup, StyledCategoryTitle, StyledCategoryGrid } from './Technologies.styles';
import { useTechnologies } from './useTechnologies';
import { TechnologyCard } from '@/components/sections/TechnologyCard';
import { Contributions } from '@/components/sections/Contributions';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { groupTechnologiesByCategory } from '@/types/project';
import { technologyCategoryOrder } from '@/data/technologies';
import type { Technology } from '@/types/project';

export interface TechnologiesProps {
  technologies?: Technology[];
}

export const Technologies = ({
  technologies = [],
}: TechnologiesProps) => {
  const { categoriesRef } = useTechnologies();

  const groupedTech = groupTechnologiesByCategory(technologies);

  const categoryLabels: Record<string, string> = {
    language: 'Lenguajes',
    framework: 'Frameworks',
    tool: 'Herramientas',
    database: 'Bases de datos',
    cloud: 'Cloud y DevOps',
    testing: 'Testing',
    other: 'Otras',
  };

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
            {technologyCategoryOrder.map((category) => {
              const techs = groupedTech[category];
              if (!techs || techs.length === 0) return null;

              return (
                <StyledCategoryGroup key={category} role="listitem">
                  <StyledCategoryTitle>{categoryLabels[category]}</StyledCategoryTitle>
                  {/* Its own list: the chip is already a listitem, and burying one inside
                      another without a list between them is what axe reports as
                      aria-required-parent. It went unnoticed while the section was empty. */}
                  <StyledCategoryGrid role="list" aria-label={categoryLabels[category]}>
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