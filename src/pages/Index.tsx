import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SkipLink } from '@/components/layout/SkipLink';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Projects } from '@/components/sections/Projects';
import { Technologies } from '@/components/sections/Technologies';
import { Contact } from '@/components/sections/Contact';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { NavItem } from '@/components/layout/Header';
import { siteConfig } from '@/data/site-config';
import type { SiteConfig } from '@/types/site';

const navigation: NavItem[] = [
  { label: 'Sobre mí', href: '#about' },
  { label: 'Proyectos', href: '#projects' },
  { label: 'Tecnologías', href: '#technologies' },
  { label: 'Contacto', href: '#contact' },
];

const cta: NavItem = {
  label: 'GitHub',
  href: 'https://github.com/ismaelmarot',
  external: true,
  ariaLabel: 'View GitHub profile (opens in new tab)',
};

export default function IndexPage() {
  useReducedMotion();

  const config: SiteConfig = siteConfig;

  return (
    <>
      <SkipLink targets={['about', 'projects', 'technologies', 'contact']} />
      <Header navigation={navigation} cta={cta} />
      <main>
        <Hero
          name={config.name}
          title={config.title}
          tagline={config.tagline}
          cta={{ label: 'Ver Proyectos', href: '#projects' }}
          secondaryCta={{ label: 'Contactar', href: '#contact' }}
        />
        <About
          content={config.aboutText}
          stats={[
            { label: 'Años de experiencia', value: '5+', description: 'Desarrollo profesional' },
            { label: 'Proyectos completados', value: '20+', description: 'Open source y trabajo cliente' },
            { label: 'Tecnologías', value: '15+', description: 'Lenguajes y frameworks' },
          ]}
        />
        <Projects
          projects={[]}
          featuredProjectIds={config.featuredProjectIds}
        />
        <Technologies
          technologies={[]}
        />
        <Contact
          methods={config.socialLinks}
          introText="¿Tienes un proyecto en mente o quieres colaborar? Estoy a un mensaje de distancia."
        />
      </main>
      <Footer copyright="Ismael Marot" socialLinks={config.socialLinks} />
    </>
  );
}