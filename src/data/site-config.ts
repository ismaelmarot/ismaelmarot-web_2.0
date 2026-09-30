import type { SiteConfig } from '../types/site';

export const siteConfig: SiteConfig = {
  name: 'Ismael Marot',
  title: 'Web Developer',
  tagline: 'Building accessible, performant web experiences with modern technologies.',
  aboutText: `I'm a web developer passionate about creating clean, accessible, and performant web applications. With experience across the full stack, I specialize in React, TypeScript, and modern web technologies. When I'm not coding, you'll find me exploring new frameworks, contributing to open source, or sharing knowledge through technical writing.`,
  email: 'ismael@marot.dev',
  githubUsername: 'ismaelmarot',
  socialLinks: [
    {
      id: 'email',
      type: 'email',
      label: 'Email',
      value: 'ismael@marot.dev',
      iconName: 'mail',
      displayOrder: 1,
      isPrimary: true,
    },
    {
      id: 'github',
      type: 'github',
      label: 'GitHub',
      value: 'https://github.com/ismaelmarot',
      iconName: 'github',
      displayOrder: 2,
    },
    {
      id: 'linkedin',
      type: 'linkedin',
      label: 'LinkedIn',
      value: 'https://linkedin.com/in/ismaelmarot',
      iconName: 'linkedin',
      displayOrder: 3,
    },
  ],
  featuredProjectIds: ['1', '2'],
  seo: {
    title: 'Ismael Marot | Web Developer Portfolio',
    description: 'Personal portfolio of Ismael Marot, a web developer specializing in React, TypeScript, and modern web technologies.',
    ogImage: '/images/og-image.png',
    twitterHandle: '@ismaelmarot',
    siteUrl: 'https://ismaelmarot.github.io/ismaelmarot-web_2.0',
  },
};