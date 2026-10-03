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
  githubUsername: string;
  socialLinks: ContactMethod[];
  seo: SEOConfig;
}
