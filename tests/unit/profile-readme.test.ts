import { describe, it, expect } from 'vitest';
import { parseProfileProjects } from '@/data/profile-readme';

const README_WITH_TABLE = `
## Some Projects

<table>
   <tr>
      <td>
         <img src="https://raw.githubusercontent.com/ismaelmarot/trash2treasure/main/frontend/public/apple-touch-icon.png" alt="Trash2Treasure Icon" width="100" />
      </td>
      <td>
         <h2>Trash2Treasure</h2>
         <p><strong>A community recycling mobile app.</strong></p>
         <div style="display: flex; gap: 50px;">
            <a href="https://trash2treasure-app.vercel.app/" target="_blank">
               <img src="https://img.shields.io/badge/Go-Live App-blue?style=for-the-badge" alt="Demo" />
            </a>
            <a href="https://github.com/ismaelmarot/trash2treasure" target="_blank">
               <img src="https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge" />
            </a>
         </div>
      </td>
   </tr>
</table>

<table>
   <tr>
      <td>
         <img src="https://raw.githubusercontent.com/ismaelmarot/car-expense-tracker/main/app-icon.png" alt="Car Expense Tracker Icon" width="100" />
      </td>
      <td>
         <h2>Car Expense Tracker</h2>
         <div>
            <a href="https://github.com/ismaelmarot/car-expense-tracker/releases" target="_blank">
               <img src="https://img.shields.io/badge/Go-Download App-blue?style=for-the-badge" alt="Download" />
            </a>
            <a href="https://github.com/ismaelmarot/car-expense-tracker" target="_blank">
               <img src="https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge" />
            </a>
         </div>
      </td>
   </tr>
</table>

<p>Contact me at <a href="https://github.com/ismaelmarot">my profile</a>.</p>
`;

describe('parseProfileProjects', () => {
  it('returns one entry per projects table, in README order', () => {
    const projects = parseProfileProjects(README_WITH_TABLE, 'ismaelmarot');
    expect(projects.map((p) => p.name)).toEqual(['Trash2Treasure', 'Car Expense Tracker']);
    expect(projects.map((p) => p.repo)).toEqual(['trash2treasure', 'car-expense-tracker']);
  });

  it('reads the app icon hosted in the repository', () => {
    const [trash] = parseProfileProjects(README_WITH_TABLE, 'ismaelmarot');
    expect(trash.iconUrl).toBe(
      'https://raw.githubusercontent.com/ismaelmarot/trash2treasure/main/frontend/public/apple-touch-icon.png'
    );
  });

  it('reads the curated live destination', () => {
    const [trash] = parseProfileProjects(README_WITH_TABLE, 'ismaelmarot');
    expect(trash.demoUrl).toBe('https://trash2treasure-app.vercel.app/');
  });

  it('has no live destination when the only links are GitHub release and repo links', () => {
    const [, car] = parseProfileProjects(README_WITH_TABLE, 'ismaelmarot');
    expect(car.demoUrl).toBeUndefined();
    expect(car.iconUrl).toBe(
      'https://raw.githubusercontent.com/ismaelmarot/car-expense-tracker/main/app-icon.png'
    );
  });

  it('ignores links to other owners and the profile itself', () => {
    const markdown = `
<table>
  <tr><td>
    <h2>External</h2>
    <a href="https://github.com/someone-else/their-repo">repo</a>
    <a href="https://github.com/ismaelmarot">profile</a>
  </td></tr>
</table>`;
    expect(parseProfileProjects(markdown, 'ismaelmarot')).toEqual([]);
  });

  it('ignores duplicates of the same repository', () => {
    const markdown = `
<table><tr><td><h2>One</h2><a href="https://github.com/ismaelmarot/qentry">r</a></td></tr></table>
<table><tr><td><h2>One again</h2><a href="https://github.com/ismaelmarot/qentry">r</a></td></tr></table>`;
    const projects = parseProfileProjects(markdown, 'ismaelmarot');
    expect(projects).toHaveLength(1);
    expect(projects[0].name).toBe('One');
  });

  it('falls back to the repository name when there is no heading', () => {
    const markdown = `
<table><tr><td><a href="https://github.com/ismaelmarot/LinkIO">r</a></td></tr></table>`;
    expect(parseProfileProjects(markdown, 'ismaelmarot')[0]).toEqual({
      name: 'LinkIO',
      repo: 'LinkIO',
      iconUrl: undefined,
      demoUrl: undefined,
      screenshotUrls: [],
    });
  });

  it('returns an empty list when the README lists no projects', () => {
    expect(parseProfileProjects('# Profile\n\nNothing here yet.', 'ismaelmarot')).toEqual([]);
  });
});