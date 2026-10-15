import {
  getContactDomain,
  getContactHref,
  getContactTypeIcon,
  isExternalLink,
  type ContactMethod,
} from '@/types/contact';

describe('getContactDomain', () => {
  it('takes the mail domain from an address', () => {
    expect(getContactDomain('ismaelmarot@hotmail.com')).toBe('hotmail.com');
  });

  it('takes the host from a URL', () => {
    expect(getContactDomain('https://github.com/ismaelmarot')).toBe('github.com');
    expect(getContactDomain('https://linkedin.com/in/ismael-marot-1aab33440')).toBe(
      'linkedin.com'
    );
  });

  it('resolves a bare host without a scheme', () => {
    expect(getContactDomain('github.com/user')).toBe('github.com');
    expect(getContactDomain('linkedin.com/in/someone')).toBe('linkedin.com');
  });

  // A card showing the whole string is harmless. One showing an empty string is not, so
  // anything unparseable falls through untouched rather than becoming blank.
  it('falls back to the raw value when nothing parses', () => {
    expect(getContactDomain('not a url at all')).toBe('not a url at all');
    expect(getContactDomain('   ')).toBe('   ');
  });

  it('keeps a plus-addressed mail intact', () => {
    expect(getContactDomain('ismael+portfolio@hotmail.com')).toBe('hotmail.com');
  });

  it('drops a www prefix', () => {
    expect(getContactDomain('https://www.example.com/page')).toBe('example.com');
  });

  it('is case insensitive about the scheme', () => {
    expect(getContactDomain('HTTPS://GitHub.com/user')).toBe('github.com');
  });

  it('trims surrounding whitespace', () => {
    expect(getContactDomain('  github.com/user  ')).toBe('github.com');
  });
});

/**
 * specs/020 added `facebook` and `instagram` to `ContactType` so that adding those two networks is a
 * configuration change rather than a code change. Neither has a URL yet, which is the reason they are
 * absent from `site-config.ts` rather than present with a guessed link — and it is the reason these
 * tests exist: they prove the mappings are ready for the day the URLs arrive, so that nothing has to
 * be written then.
 */
describe('los tipos de red que faltan', () => {
  const metodo = (type: ContactMethod['type'], value: string): ContactMethod => ({
    id: type,
    type,
    label: type,
    value,
    iconName: getContactTypeIcon(type),
  });

  it('cada red nueva tiene su propio glifo', () => {
    expect(getContactTypeIcon('facebook')).toBe('facebook');
    expect(getContactTypeIcon('instagram')).toBe('instagram');
    // And they are different from each other and from the three that existed.
    const glifos = (
      ['email', 'github', 'linkedin', 'twitter', 'facebook', 'instagram', 'website', 'other'] as const
    ).map((tipo) => getContactTypeIcon(tipo));
    expect(new Set(glifos).size).toBe(glifos.length);
  });

  it('cada red nueva resuelve su href como una web', () => {
    expect(getContactHref(metodo('facebook', 'https://facebook.com/ismaelmarot'))).toBe(
      'https://facebook.com/ismaelmarot'
    );
    // A bare host gets the scheme, the same as every other network.
    expect(getContactHref(metodo('instagram', 'instagram.com/ismaelmarot'))).toBe(
      'https://instagram.com/ismaelmarot'
    );
  });

  it('las dos son externas, porque no son un correo', () => {
    expect(isExternalLink('facebook')).toBe(true);
    expect(isExternalLink('instagram')).toBe(true);
    expect(isExternalLink('email')).toBe(false);
  });

  it('todo tipo conocido resuelve un glifo que existe en la tabla de iconos', () => {
    // The cast in the components is `as IconName`, which the compiler cannot check because the value
    // arrives as a string. This is what checks it: every mapping must name a glyph that exists, or a
    // network added tomorrow renders nothing at all and no type says so.
    const existentes = [
      'mail', 'github', 'linkedin', 'twitter', 'facebook', 'instagram', 'globe', 'link',
    ];
    const tipos: ContactMethod['type'][] = [
      'email', 'github', 'linkedin', 'twitter', 'facebook', 'instagram', 'website', 'other',
    ];

    for (const tipo of tipos) {
      expect(existentes).toContain(getContactTypeIcon(tipo));
    }
  });
});
