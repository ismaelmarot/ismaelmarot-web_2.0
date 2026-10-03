import { Hero } from '@/components/sections/Hero';
import { SectionSummary } from '@/components/sections/SectionSummary';
import { TechnologyMarquee } from '@/components/sections/TechnologyMarquee';
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
      <SectionSummary
        id="about-summary"
        title="Sobre mí"
        description="Una breve introducción sobre quién soy, mi recorrido y mi forma de trabajar."
        ctaLabel="Conocé más"
        ctaHref="/about"
        background="muted"
      />
      <SectionSummary
        id="projects-summary"
        title="Proyectos"
        description="Una selección de proyectos en los que trabajé, tecnologías utilizadas y problemas que resolví."
        ctaLabel="Ver proyectos"
        ctaHref="/projects"
        background="default"
      />
      <SectionSummary
        id="technologies-summary"
        title="Tecnologías"
        description="Las tecnologías y herramientas que utilizo para construir aplicaciones web modernas."
        ctaLabel="Ver tecnologías"
        ctaHref="/technologies"
        background="muted"
        featuredItems={<TechnologyMarquee />}
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
