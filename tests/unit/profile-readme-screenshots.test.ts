import { describe, it, expect } from 'vitest';
import { parseProfileProjects, MAX_SCREENSHOTS_PER_PROJECT } from '@/data/profile-readme';

const detailsBlock = (images: string[]) =>
  `<details>\n  <summary><strong>Preview Screenshots</strong></summary>\n  <p align="center">\n${images
    .map((src) => `    <img src="${src}" width="230"/>`)
    .join('\n')}\n  </p>\n</details>`;

const projectTable = (repo: string, name: string) => `
<table>
  <tr>
    <td><img src="https://raw.githubusercontent.com/ismaelmarot/${repo}/main/icon-192.png" alt="${name} Icon" /></td>
    <td>
      <h2>${name}</h2>
      <a href="https://github.com/ismaelmarot/${repo}" target="_blank">repo</a>
    </td>
  </tr>
</table>`;

const README = [
  projectTable('my-app', 'My App'),
  detailsBlock(
    Array.from({ length: 9 }, (_, i) =>
      `https://raw.githubusercontent.com/ismaelmarot/my-app/main/docs/shots/shot-0${i + 1}.png`
    )
  ),
  projectTable('other-app', 'Other App'),
  detailsBlock([
    'https://raw.githubusercontent.com/ismaelmarot/other-app/main/assets/mob-v2-01.png',
    'https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge',
  ]),
  projectTable('no-shots', 'No Shots'),
].join('\n');

describe('parseProfileProjects screenshots', () => {
  it('collects the screenshots published for each project', () => {
    const projects = parseProfileProjects(README, 'ismaelmarot');
    const [myApp, otherApp, noShots] = projects;

    expect(myApp.screenshotUrls).toHaveLength(MAX_SCREENSHOTS_PER_PROJECT);
    expect(myApp.screenshotUrls[0]).toContain('shot-01.png');
    expect(otherApp.screenshotUrls).toEqual([
      'https://raw.githubusercontent.com/ismaelmarot/other-app/main/assets/mob-v2-01.png',
    ]);
    expect(noShots.screenshotUrls).toEqual([]);
  });

  it('caps the screenshots so no more than six ever ship', () => {
    const projects = parseProfileProjects(README, 'ismaelmarot');
    expect(projects[0].screenshotUrls).toHaveLength(MAX_SCREENSHOTS_PER_PROJECT);
    expect(MAX_SCREENSHOTS_PER_PROJECT).toBe(6);
  });

  it('never treats the app icon as a screenshot', () => {
    const projects = parseProfileProjects(README, 'ismaelmarot');
    projects.forEach((project) => {
      if (!project.iconUrl) return;
      expect(project.screenshotUrls).not.toContain(project.iconUrl);
    });
  });

  it('ignores badge images that are not hosted in the repository', () => {
    const projects = parseProfileProjects(README, 'ismaelmarot');
    projects.forEach((project) => {
      project.screenshotUrls.forEach((url) => expect(url).not.toContain('shields.io'));
    });
  });

  it('returns no screenshots when the README publishes none', () => {
    expect(parseProfileProjects(projectTable('solo', 'Solo'), 'ismaelmarot')[0].screenshotUrls)
      .toEqual([]);
  });
});