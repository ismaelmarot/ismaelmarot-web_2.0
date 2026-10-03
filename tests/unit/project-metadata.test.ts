import { describe, it, expect } from 'vitest';
import {
  getEditorialMetadata,
  withEditorialMetadata,
  projectEditorialMetadata,
} from '@/data/project-metadata';
import {
  PROJECT_CATEGORIES,
  PROJECT_VIEWPORTS,
  PROJECT_PLATFORMS,
  DEFAULT_APP_LANGUAGES,
} from '@/types/project';
import type { Project, ProjectLanguage } from '@/types/project';

const baseProject: Project = {
  id: '1',
  name: 'Trash2Treasure',
  description: 'A recycling app',
  technologies: ['TypeScript'],
  githubUrl: 'https://github.com/ismaelmarot/trash2treasure',
  screenshotUrls: [],
  lastUpdated: '2024-01-01T00:00:00Z',
};

describe('projectEditorialMetadata', () => {
  it('covers every published project', () => {
    expect(Object.keys(projectEditorialMetadata).sort()).toEqual(
      [
        'LinkIO',
        'NauticAcademy',
        'QEntry',
        'car-expense-tracker',
        'cash-counter',
        'trash2treasure',
      ].sort()
    );
  });

  it('resolves metadata regardless of the repository name casing', () => {
    expect(getEditorialMetadata('LinkIO')?.categories).toEqual(['Tools', 'Work']);
    expect(getEditorialMetadata('linkio')?.categories).toEqual(['Tools', 'Work']);
    expect(getEditorialMetadata('qentry')?.categories).toEqual(['Tools', 'Work']);
  });

  it('returns undefined for a repository without metadata', () => {
    expect(getEditorialMetadata('language-learning-game')).toBeUndefined();
  });

  it('attaches categories, viewports and platforms to a project', () => {
    const project = withEditorialMetadata({ ...baseProject, name: 'trash2treasure' });
    expect(project.categories).toEqual(['Social', 'Navigation']);
    expect(project.viewports).toEqual(['desktop', 'tablet', 'mobile']);
    expect(project.platforms).toEqual(['web']);
  });

  it('resolves a mixed-case repository such as NauticAcademy', () => {
    const project = withEditorialMetadata({ ...baseProject, name: 'NauticAcademy' });
    expect(project.categories).toEqual(['Education']);
    expect(project.platforms).toEqual(['web']);
  });

  it('keeps the data of a project with no metadata and only defaults its languages', () => {
    const uncategorised = { ...baseProject, name: 'unknown-repo' };
    const result = withEditorialMetadata(uncategorised);

    // Nothing is invented for the curated fields, and the project is not dropped.
    expect(result.categories).toBeUndefined();
    expect(result.viewports).toBeUndefined();
    expect(result.platforms).toBeUndefined();
    expect(result.id).toBe(uncategorised.id);
    expect(result.name).toBe('unknown-repo');
    // GitHub cannot report the interface languages, so the bilingual default applies.
    expect(result.languages).toEqual(DEFAULT_APP_LANGUAGES);
  });

  it('defaults the languages of a project that has metadata but declares none', () => {
    expect(withEditorialMetadata(baseProject).languages).toEqual(DEFAULT_APP_LANGUAGES);
  });

  it('uses the languages declared for a project', () => {
    const declared = { ...baseProject, name: 'LinkIO' };
    // LinkIO is the one repo the owner curates; give it a single language to prove the
    // editorial value wins over the default.
    const metadata = projectEditorialMetadata.LinkIO;
    metadata.languages = ['ES'];

    expect(withEditorialMetadata(declared).languages).toEqual(['ES']);

    delete metadata.languages;
  });

  it('drops a language that is no longer part of the closed set', () => {
    const metadata = projectEditorialMetadata.LinkIO;
    metadata.languages = ['EN', 'Retired' as ProjectLanguage];

    const result = withEditorialMetadata({ ...baseProject, name: 'LinkIO' });
    expect(result.languages).toEqual(['EN']);

    delete metadata.languages;
  });

  it('only accepts values from the closed sets', () => {
    Object.entries(projectEditorialMetadata).forEach(([repo, metadata]) => {
      metadata.categories.forEach((category) =>
        expect(PROJECT_CATEGORIES).toContain(category)
      );
      metadata.viewports.forEach((viewport) => expect(PROJECT_VIEWPORTS).toContain(viewport));
      metadata.platforms.forEach((platform) => expect(PROJECT_PLATFORMS).toContain(platform));
      expect(repo).toBeTruthy();
    });
  });

  it('drops a value that is no longer part of a closed set', () => {
    const polluted = {
      'trash2treasure': {
        categories: ['Social', 'Retired'] as Project['categories'],
        viewports: ['desktop'] as Project['viewports'],
        platforms: ['web'] as Project['platforms'],
      },
    };
    const original = projectEditorialMetadata['trash2treasure'];
    // Simulates a retired category left behind in the metadata file.
    Object.assign(polluted['trash2treasure'], {
      categories: [...(original?.categories ?? []), 'Retired'],
    });
    Object.assign(projectEditorialMetadata, polluted);
    try {
      expect(getEditorialMetadata('trash2treasure')?.categories).toEqual([
        'Social',
        'Navigation',
      ]);
    } finally {
      Object.assign(projectEditorialMetadata['trash2treasure'], original);
    }
  });
});