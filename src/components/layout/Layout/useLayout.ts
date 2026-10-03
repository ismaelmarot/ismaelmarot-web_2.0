import type { NavItem } from '@/components/layout/Header';

export const useLayout = () => {
  const navigation: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Sobre mí', href: '/about' },
    { label: 'Proyectos', href: '/projects' },
    { label: 'Tecnologías', href: '/technologies' },
    { label: 'Contacto', href: '/contact' },
  ];

  const cta: NavItem = {
    label: 'GitHub',
    href: 'https://github.com/ismaelmarot',
    external: true,
    ariaLabel: 'View GitHub profile (opens in new tab)',
  };

  return { navigation, cta };
};
