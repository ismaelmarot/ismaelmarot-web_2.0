import { getContactDomain } from '@/types/contact';

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
