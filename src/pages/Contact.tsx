import { Contact } from '@/components/sections/Contact';
import { siteConfig } from '@/data/site-config';

export const ContactPage = () => {
  return (
    <Contact
      methods={siteConfig.socialLinks}
      introText="¿Tienes un proyecto en mente o quieres colaborar? Estoy a un mensaje de distancia."
    />
  );
};
