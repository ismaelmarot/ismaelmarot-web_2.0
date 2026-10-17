import type { ContactMethod } from './contact';

export interface SEOConfig {
  title: string;
  description: string;
  ogImage: string;
  twitterHandle: string;
  siteUrl: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  tagline: string;
  aboutText: string;
  email: string;
  /** specs/027: the address the closing band shows. Independent of `email`, which stays the mailto
      destination, because the visible text and where the link writes to are two different values. */
  contactDisplayEmail: string;
  /** specs/025: the sentence under the closing question. Copy, so it lives with the rest of it. */
  contactTagline: string;
  githubUsername: string;
  socialLinks: ContactMethod[];
  seo: SEOConfig;
}
