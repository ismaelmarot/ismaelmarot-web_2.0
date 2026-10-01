import { StyledTechnologies, StyledTechnologiesHeader, StyledTechnologiesHeadline, StyledTechnologiesCategories, StyledCategoryGroup, StyledCategoryTitle, StyledCategoryGrid } from './Technologies.styles';
import { useTechnologies } from './useTechnologies';
import { TechnologyCard } from '@/components/sections/TechnologyCard';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import type { Technology } from '@/types/project';

export interface TechnologiesProps {
  technologies?: Technology[];
}

export const Technologies = ({
  technologies = [],
}: TechnologiesProps) => {
  const { categoriesRef } = useTechnologies();

  const groupedTech = technologies.reduce((acc, tech) => {
    const category = tech.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tech);
    return acc;
  }, {} as Record<string, Technology[]>);

  const categoryOrder: Technology['category'][] = [
    'language',
    'framework',
    'tool',
    'database',
    'cloud',
    'testing',
    'other',
  ];

  const categoryLabels: Record<string, string> = {
    language: 'Languages',
    framework: 'Frameworks',
    tool: 'Tools',
    database: 'Databases',
    cloud: 'Cloud & DevOps',
    testing: 'Testing',
    other: 'Other',
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

          <StyledTechnologiesCategories role="list" aria-label="Technology categories">
            {categoryOrder.map((category) => {
              const techs = groupedTech[category];
              if (!techs || techs.length === 0) return null;

              return (
                <StyledCategoryGroup key={category} role="listitem">
                  <StyledCategoryTitle>{categoryLabels[category]}</StyledCategoryTitle>
                  <StyledCategoryGrid>
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