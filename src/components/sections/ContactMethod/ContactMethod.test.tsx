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
  // styled-components only generates hashed names. Each service is expected to paint its own
  // surface, so the three cards do not read as three copies of one button.
  it('paints a distinct surface per service', () => {
    const cases = [
      { type: 'email' as const, label: 'Email', value: 'test@example.com', expected: 'brand-email' },
      { type: 'github' as const, label: 'GitHub', value: 'https://github.com/user', expected: 'brand-github' },
      { type: 'linkedin' as const, label: 'LinkedIn', value: 'https://linkedin.com/in/user', expected: 'brand-linkedin' },
    ];

    const backgrounds = cases.map((c) => {
      const { unmount } = render(<ContactMethod method={{ ...mockMethod, ...c }} index={0} />);
      const css = getCssForElement(screen.getByRole('link'));
      unmount();
      expect(css).toContain(c.expected);
      return css;
    });

    expect(new Set(backgrounds).size).toBe(3);
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
    expect(css).toMatch(/outline-offset:\s*-3px/);
  });

  // A truncated profile URL is a link that goes somewhere else, so the value wraps instead.
  it('does not truncate a long value', () => {
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
    expect(
      screen.getByText('linkedin.com/in/ismael-marot-1aab33440')
    ).toBeInTheDocument();
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