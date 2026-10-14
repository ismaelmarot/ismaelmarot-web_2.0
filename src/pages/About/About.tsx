import { About } from '@/components/sections/About';
import { siteConfig } from '@/data/site-config';

export const AboutPage = () => {
  return (
    <About
      content={siteConfig.aboutText}
      stats={[
        { label: 'Años de experiencia', value: '5+', description: 'Desarrollo profesional' },
        { label: 'Proyectos completados', value: '20+', description: 'Open source y trabajo cliente' },
        { label: 'Tecnologías', value: '15+', description: 'Lenguajes y frameworks' },
      ]}
    />
  );
};
