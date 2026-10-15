import { siteConfig } from '@/data/site-config';
import type { ContactMethod } from '@/types/contact';

export interface UseContactBandReturn {
  /** The configured address, with no `mailto:` on it. */
  email: string;
  /** The networks, in display order, with anything that has no destination dropped. */
  redes: ContactMethod[];
}

/**
 * What the band says, derived once from one configuration object.
 *
 * Three surfaces already read `siteConfig.socialLinks`: this band, the footer and the contact page.
 * Reading it here rather than taking props means a network added to that list reaches all three, and
 * that the band cannot drift from the footer by being given a second list.
 *
 * The email is dropped from the networks because it is the band's subject and gets rendered as the
 * address, at display size, with its own arrow. Leaving it in the row would print it twice, once
 * small.
 *
 * An entry with no destination does not render. That is what makes Facebook and Instagram a
 * configuration question rather than a code one: `specs/020` added the two to `ContactType` and to the
 * icon table, and nothing else needs writing when their URLs exist.
 */
export function useContactBand(): UseContactBandReturn {
  const redes = siteConfig.socialLinks
    .filter((method) => method.type !== 'email')
    .filter((method) => method.value.trim() !== '')
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  return {
    email: siteConfig.email,
    redes,
  };
}