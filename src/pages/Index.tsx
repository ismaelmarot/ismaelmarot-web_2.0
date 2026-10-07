import { Hero } from '@/components/sections/Hero';
import { SectionSummary } from '@/components/sections/SectionSummary';
import { TechnologyMarquee } from '@/components/sections/TechnologyMarquee';
import { ProjectIconStrip } from '@/components/sections/ProjectIconStrip';
import { siteConfig } from '@/data/site-config';
import { StyledIndexPage } from './Index.styles';

export const IndexPage = () => {
  return (
    <StyledIndexPage>
      <Hero
        name={siteConfig.name}
        title={siteConfig.title}
        tagline={siteConfig.tagline}
        cta={{ label: 'Ver Proyectos', href: '/projects' }}
        secondaryCta={{ label: 'Contactar', href: '/contact' }}
      />
      {/* Order: work first, then the tools, then the person, then the way to reach them.

          The backgrounds alternate strictly, starting from the Hero's own default. Reordering
          the blocks without also reassigning them left Tecnologías and Sobre mí both on
          muted, two identical bands in a row, which reads as a mistake rather than a rhythm.
          So each block moved and the band follows its position, not its name. */}
      <SectionSummary
        id="projects-summary"
        title="Proyectos"
        description="Una selección de proyectos en los que trabajé, tecnologías utilizadas y problemas que resolví."
        ctaLabel="Ver proyectos"
        ctaHref="/projects"
        background="muted"
        /* The section says a selection of projects exists and then showed nothing. The six apps
            are the evidence for its own claim, and they go through the featured slot the
            technology marquee already uses, so this shared section is not changed to make room. */
        featuredItems={<ProjectIconStrip />}
      />
      <SectionSummary
        id="technologies-summary"
        title="Tecnologías"
        description="Las tecnologías y herramientas que utilizo para construir aplicaciones web modernas."
        ctaLabel="Ver tecnologías"
        ctaHref="/technologies"
        background="default"
        featuredItems={<TechnologyMarquee />}
      />
      <SectionSummary
        id="about-summary"
        title="Sobre mí"
        description="Una breve introducción sobre quién soy, mi recorrido y mi forma de trabajar."
        ctaLabel="Conocé más"
        ctaHref="/about"
        background="muted"
      />
      <SectionSummary
        id="contact-summary"
        title="Contacto"
        description="¿Tienes un proyecto en mente o quieres colaborar? Estoy a un mensaje de distancia."
        ctaLabel="Contactar"
        ctaHref="/contact"
        background="default"
      />
    </StyledIndexPage>
  );
};
