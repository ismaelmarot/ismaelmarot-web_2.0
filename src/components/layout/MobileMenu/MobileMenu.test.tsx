import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { readdirSync, readFileSync } from 'node:fs';
import { getCssForElement } from '@/test-utils/css';
import { MobileMenu } from './MobileMenu';

const mockItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
];

const mockCta = { label: 'Contact', href: '/contact' };

describe('MobileMenu', () => {
  it('renders nothing when closed', () => {
    render(
      <MemoryRouter>
        <MobileMenu isOpen={false} overDark={false} onClose={vi.fn()} items={mockItems} />
      </MemoryRouter>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders menu when open', () => {
    render(
      <MemoryRouter>
        <MobileMenu isOpen={true} overDark={false} onClose={vi.fn()} items={mockItems} />
      </MemoryRouter>
    );
    expect(screen.getByRole('dialog', { name: /mobile menu/i })).toBeInTheDocument();
  });

  it('renders navigation items', () => {
    render(
      <MemoryRouter>
        <MobileMenu isOpen={true} overDark={false} onClose={vi.fn()} items={mockItems} />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
  });

  it('renders CTA when provided', () => {
    render(
      <MemoryRouter>
        <MobileMenu isOpen={true} overDark={false} onClose={vi.fn()} items={mockItems} cta={mockCta} />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });

  it('closes on overlay click', () => {
    const onClose = vi.fn();
    render(
      <MemoryRouter>
        <MobileMenu isOpen={true} overDark={false} onClose={onClose} items={mockItems} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByTestId('overlay'));
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on Escape key', () => {
    const onClose = vi.fn();
    render(
      <MemoryRouter>
        <MobileMenu isOpen={true} overDark={false} onClose={onClose} items={mockItems} />
      </MemoryRouter>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on close button click', () => {
    const onClose = vi.fn();
    render(
      <MemoryRouter>
        <MobileMenu isOpen={true} overDark={false} onClose={onClose} items={mockItems} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /close menu/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('traps focus', () => {
    render(
      <MemoryRouter>
        <MobileMenu isOpen={true} overDark={false} onClose={vi.fn()} items={mockItems} />
      </MemoryRouter>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getAllByRole('link').length).toBeGreaterThan(0);
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(
      <MemoryRouter>
        <MobileMenu isOpen={true} overDark={false} onClose={vi.fn()} items={mockItems} ref={ref} />
      </MemoryRouter>
    );
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  // specs/026 Phase 5. What follows checks the theme itself rather than the markup: the menu was
  // already rendering, it was rendering the wrong colours.
  describe('the panel takes the theme it is opened under', () => {
    const renderMenu = (overDark: boolean) =>
      render(
        <MemoryRouter>
          <MobileMenu isOpen={true} overDark={overDark} onClose={vi.fn()} items={mockItems} cta={mockCta} />
        </MemoryRouter>
      );

    it('carries the dark fragment when it is opened over a dark navbar', () => {
      // T018. The panel never had a hex of its own: it sets background-color with the token, which is
      // var(--color-background). The fragment is what makes that variable resolve to black, so the proof
      // is the property being overridden on this element and not the panel looking dark.
      renderMenu(true);
      const css = getCssForElement(screen.getByRole('dialog'));
      expect(css).toContain('--color-background: #000000');
      // And the rest of it, so a fragment that only turned the panel black would still pass.
      expect(css).toContain('--color-fg: #ffffff');
      expect(css).toContain('--color-text-primary: #ffffff');
      expect(css).toContain('--color-accent: #0a84ff');
    });

    it('carries none of it when the navbar is light', () => {
      // T018. The light theme is what the menu did before this feature, so this is the regression guard:
      // overDark must not leak into the light case.
      renderMenu(false);
      const css = getCssForElement(screen.getByRole('dialog'));
      expect(css).not.toContain('--color-background: #000000');
      expect(css).not.toContain('--color-accent: #0a84ff');
      expect(css).not.toContain('--color-fg: #ffffff');
    });

    it('gives the call to action and the navigation items the same three interaction states', () => {
      // T019. A finger and a keyboard have to reach the accent the same way a mouse already did.
      renderMenu(true);
      const cta = getCssForElement(screen.getByRole('link', { name: /contact/i }));
      expect(cta).toContain(':hover');
      expect(cta).toContain(':active');
      expect(cta).toContain(':focus-visible');
      // Through the token, so both the item list and the CTA follow whichever theme is open.
      expect(cta).toContain('var(--color-accent)');

      const item = getCssForElement(screen.getByRole('link', { name: /about/i }));
      expect(item).toContain(':active');
      expect(item).toContain(':focus-visible');
    });

    it('starts the entrance animation from transparent rather than from a white veil', () => {
      // T020, SC-010. Read out of the emitted stylesheet instead of watched frame by frame: the flash
      // lives in the first keyframe, which no assertion on a settled element can see.
      renderMenu(true);
      const css = getCssForElement(screen.getByRole('dialog'));
      const keyframes = Array.from(document.styleSheets)
        .flatMap((sheet) => Array.from(sheet.cssRules))
        .filter((rule) => rule.cssText.includes('menuSolidify'))
        .map((rule) => rule.cssText)
        .join('\n');
      expect(keyframes).toContain('transparent');
      // The old start was rgba(255, 255, 255, 0.55), which over a black panel is the flash itself.
      expect(css).not.toContain('rgba(255, 255, 255, 0.55)');
      expect(keyframes).not.toContain('255, 255, 255');
    });

    it('declares each dark override exactly once across all of src', () => {
      // T021, SC-006. A second copy of any of the nine would be a second place for the theme to be
      // wrong, and neither the header's tests nor the menu's would notice. Scanned over src rather than
      // over the two files this feature touches, and tokens.css is excluded because its same-named
      // declarations are the light theme's, not a second copy of the dark one.
      const nine = [
        '--color-fg:',
        '--color-fg-muted:',
        '--color-text-secondary:',
        '--color-text-primary:',
        '--color-accent:',
        '--color-accent-text:',
        '--color-accent-text-hover:',
        '--color-bg-muted:',
        '--color-border:',
      ];
      const offenders: string[] = [];
      const walk = (dir: string) => {
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
          const full = `${dir}/${entry.name}`;
          if (entry.isDirectory()) {
            walk(full);
          } else if (!/\.test\./.test(entry.name) && entry.name !== 'tokens.css' && /\.(ts|tsx|css)$/.test(entry.name)) {
            for (const property of nine) {
              const hits = readFileSync(full, 'utf-8').split(property).length - 1;
              if (hits > 0) offenders.push(`${full.replace(`${process.cwd()}/`, '')} declares ${property}`);
            }
          }
        }
      };
      walk(`${process.cwd()}/src`);
      // theme.ts is the one place allowed to hold them, and it holds each of the nine once.
      expect(offenders).toEqual([...Array(9)].map((_, i) => `src/styles/theme.ts declares ${nine[i]}`));
    });
  });
});
