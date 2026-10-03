import { render, screen } from '@testing-library/react';
import { getCssForElement } from '@/test-utils/css';
import { ContactMethod } from './ContactMethod';

const mockMethod = {
  id: 'email',
  type: 'email' as const,
  label: 'Email',
  value: 'test@example.com',
  iconName: 'mail',
};

describe('ContactMethod', () => {
  it('renders email link with mailto', () => {
    render(<ContactMethod method={mockMethod} index={0} />);
    const link = screen.getByRole('link', { name: 'Email: test@example.com' });
    expect(link).toHaveAttribute('href', 'mailto:test@example.com');
    expect(link).not.toHaveAttribute('target');
  });

  it('renders external link with target blank', () => {
    render(<ContactMethod method={{ ...mockMethod, type: 'github', label: 'GitHub', value: 'https://github.com/user' }} index={0} />);
    const link = screen.getByRole('link', { name: 'GitHub: https://github.com/user' });
    expect(link).toHaveAttribute('href', 'https://github.com/user');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  // The card displays the address as visible text, so the accessible name has to carry it as
  // well. Naming the link only "Email" once left a screen reader announcing a destination it
  // could not read.
  it('names the link with both the label and the address', () => {
    render(<ContactMethod method={mockMethod} index={0} />);
    expect(screen.getByRole('link', { name: 'Email: test@example.com' })).toBeInTheDocument();
  });

  // Asserted against the emitted stylesheet rather than the class name, because
  // styled-components only generates hashed names. Each service is expected to carry its own
  // gradient, so the three cards do not read as three copies of one tile.
  it('paints a distinct gradient per service', () => {
    const cases = [
      { type: 'email' as const, label: 'Email', value: 'test@example.com', from: '--brand-email-from' },
      { type: 'github' as const, label: 'GitHub', value: 'https://github.com/user', from: '--brand-github-from' },
      { type: 'linkedin' as const, label: 'LinkedIn', value: 'https://linkedin.com/in/user', from: '--brand-linkedin-from' },
    ];

    const gradients = cases.map((c) => {
      const { unmount } = render(<ContactMethod method={{ ...mockMethod, ...c }} index={0} />);
      const css = getCssForElement(screen.getByRole('link'));
      unmount();
      expect(css).toContain('linear-gradient');
      expect(css).toContain(`var(${c.from})`);
      return css;
    });

    expect(new Set(gradients).size).toBe(3);
  });

  // The gradient is the background, so the icon sits straight on it. A squircle behind it
  // would be a second surface fighting the first for the eye.
  it('sets the icon straight on the gradient, with no box behind it', () => {
    render(<ContactMethod method={mockMethod} index={0} />);
    // Both the icon and the arrow are aria-hidden, so they are not reachable by role. The link
    // itself is the only handle, and the assertion is that no rule in this component draws a
    // rounded box: the card's own 24px radius is the only radius in play, and it belongs to the
    // card. A squircle behind the icon would mean a border-radius on some element between them.
    const css = Array.from(document.styleSheets)
      .flatMap((sheet) => Array.from(sheet.cssRules).map((rule) => rule.cssText))
      .filter((text) => text.includes('svg') || text.includes('margin-bottom'))
      .join('\n');

    expect(css).not.toMatch(/border-radius/);
  });

  // The project's accent ring is 1.21:1 against the LinkedIn blue, so an accent ring drawn
  // outside the card would be invisible on the one card that most needs it.
  it('draws the focus ring inside the card, in its own text colour', () => {
    render(
      <ContactMethod
        method={{ ...mockMethod, type: 'linkedin', label: 'LinkedIn', value: 'https://linkedin.com/in/user' }}
        index={0}
      />
    );
    const css = getCssForElement(screen.getByRole('link'));
    expect(css).toContain('outline');
    expect(css).toMatch(/outline-offset:\s*-4px/);
  });

  // The project's accent ring is 1.21:1 against the LinkedIn blue, so an accent ring drawn
  // outside the card would be invisible on the one card that most needs it.
  it('draws the focus ring inside the card, in its own text colour', () => {
    render(
      <ContactMethod
        method={{ ...mockMethod, type: 'linkedin', label: 'LinkedIn', value: 'https://linkedin.com/in/user' }}
        index={0}
      />
    );
    const css = getCssForElement(screen.getByRole('link'));
    expect(css).toContain('outline');
    expect(css).toMatch(/outline-offset:\s*-4px/);
  });

  // The card shows only the domain. The account and profile path are noise at this size, and
  // the full address stays in the accessible name so nothing is lost.
  it('shows the domain and not the full address', () => {
    render(
      <ContactMethod
        method={{
          ...mockMethod,
          type: 'linkedin',
          label: 'LinkedIn',
          value: 'https://linkedin.com/in/ismael-marot-1aab33440',
        }}
        index={0}
      />
    );
    expect(screen.getByText('linkedin.com')).toBeInTheDocument();
    expect(
      screen.queryByText('linkedin.com/in/ismael-marot-1aab33440')
    ).not.toBeInTheDocument();
  });

  // The full address is still there for anyone who needs it, just not on the surface.
  it('keeps the full address for assistive technology', () => {
    render(<ContactMethod method={mockMethod} index={0} />);
    const link = screen.getByRole('link', { name: 'Email: test@example.com' });
    expect(link).toHaveAccessibleName('Email: test@example.com');
    expect(link).toHaveTextContent('test@example.com');
  });

  it('takes the domain from a bare host without a scheme', () => {
    render(
      <ContactMethod
        method={{ ...mockMethod, type: 'github', label: 'GitHub', value: 'github.com/user' }}
        index={0}
      />
    );
    expect(screen.getByText('github.com')).toBeInTheDocument();
  });

  it('falls back to the raw value when nothing parses', () => {
    render(
      <ContactMethod
        method={{ ...mockMethod, type: 'other', label: 'Elsewhere', value: 'not a url at all' }}
        index={0}
      />
    );
    // A card showing the whole string is harmless; one showing an empty string is not. Found by
    // role because the address also appears in the hidden span, which is the point of it.
    expect(screen.getByRole('link')).toHaveTextContent('not a url at all');
  });

  // An exact-name match doubles as the check that nothing decorative is announced: if the icon
  // or the arrow leaked into the accessible name, this would stop matching.
  it('announces the destination once, with no decorative extras', () => {
    render(<ContactMethod method={mockMethod} index={0} />);
    expect(screen.getByRole('link', { name: 'Email: test@example.com' })).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });

  it('renders icon and label', () => {
    render(<ContactMethod method={mockMethod} index={0} />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });
});