import type { SiteConfig } from '../types/site';

export const siteConfig: SiteConfig = {
  name: 'Ismael Marot',
  title: 'Web Developer',
  tagline: 'Building accessible, performant web experiences with modern technologies.',
  aboutText: `I'm a web developer passionate about creating clean, accessible, and performant web applications. With experience across the full stack, I specialize in React, TypeScript, and modern web technologies. When I'm not coding, you'll find me exploring new frameworks, contributing to open source, or sharing knowledge through technical writing.`,
  email: 'ismaelmarot@hotmail.com',
  /* specs/025. Copy rather than markup: the closing band asks the question and this says what
     happens next, so it belongs beside the tagline and the about text and not in the component. */
  contactTagline: 'Hablemos y pongamos manos a la obra',
  githubUsername: 'ismaelmarot',
  socialLinks: [
    {
      id: 'email',
      type: 'email',
      label: 'Email',
      value: 'ismaelmarot@hotmail.com',
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
      value: 'https://linkedin.com/in/ismael-marot-1aab33440',
      iconName: 'linkedin',
      displayOrder: 3,
    },
    /* specs/021. These two have no profile yet, so they point at the platform's own landing page and
       nowhere else — no guessed handle, no invented path. A mark whose link resolved to a profile that
       may not exist is a broken link, which is what specs/007 cost the most. Putting the real profile in
       is one change to the two values below and nothing else in the repository has to move: the band,
       the footer and the contact page all read this list.

       `type` is their own rather than `other`, so the icon table resolves the right glyph and the
       contact card keeps a distinct identity once a real brand surface is warranted. */
    {
      id: 'facebook',
      type: 'facebook',
      label: 'Facebook',
      value: 'https://www.facebook.com',
      iconName: 'facebook',
      displayOrder: 4,
    },
    {
      id: 'instagram',
      type: 'instagram',
      label: 'Instagram',
      value: 'https://www.instagram.com',
      iconName: 'instagram',
      displayOrder: 5,
    },
  ],
  seo: {
    title: 'Ismael Marot | Web Developer Portfolio',
    description: 'Personal portfolio of Ismael Marot, a web developer specializing in React, TypeScript, and modern web technologies.',
    ogImage: '/images/og-image.png',
    twitterHandle: '@ismaelmarot',
    siteUrl: 'https://ismaelmarot.github.io/ismaelmarot-web_2.0',
  },
};