import { getTechnologyIconPath, technologies } from '@/data/technologies';
import type { Technology } from '@/types/project';

describe('getTechnologyIconPath', () => {
  it('returns a path for a known slug', () => {
    const path = getTechnologyIconPath('typescript');
    expect(path).toBeTruthy();
    expect(path).toMatch(/^M/);
  });

  // A chip without a mark is a small gap. A crash over a typo in a data file would take the
  // whole section down.
  it('returns undefined for an unknown slug instead of throwing', () => {
    expect(getTechnologyIconPath('no-existe')).toBeUndefined();
  });

  it('returns undefined when no slug is given', () => {
    expect(getTechnologyIconPath(undefined)).toBeUndefined();
  });

  it('resolves a slug containing a hyphen', () => {
    expect(getTechnologyIconPath('styled-components')).toBeTruthy();
    expect(getTechnologyIconPath('github-actions')).toBeTruthy();
  });
});

describe('technologies', () => {
  it('gives every technology an id and a name', () => {
    for (const technology of technologies) {
      expect(technology.id).toBeTruthy();
      expect(technology.name).toBeTruthy();
    }
  });

  it('has no duplicate ids', () => {
    const ids = technologies.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  // AWS is deliberately absent: Amazon asked for its mark to be removed from the icon sets,
  // so including it here would mean shipping an approximation of a logo we do not have rights
  // to reproduce. Playwright is absent for the same reason: no official mark exists there.
  it('omits the two technologies with no official mark', () => {
    expect(technologies.map((t) => t.id)).not.toContain('aws');
    expect(technologies.map((t) => t.id)).not.toContain('playwright');
  });

  // SQL has no icon: it is the one entry left without a slug, and the card is built to
  // tolerate that.
  it('leaves at most one technology without a mark', () => {
    const without = technologies.filter((t: Technology) => !t.iconSlug);
    expect(without.length).toBeLessThanOrEqual(1);
  });

  it('never points a slug at a mark that does not exist', () => {
    for (const technology of technologies) {
      if (technology.iconSlug) {
        expect(getTechnologyIconPath(technology.iconSlug)).toBeTruthy();
      }
    }
  });
});
