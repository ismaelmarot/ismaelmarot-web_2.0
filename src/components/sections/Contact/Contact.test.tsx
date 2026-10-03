import { render, screen } from '@testing-library/react';
import { getCssForElement } from '@/test-utils/css';
import { Contact } from './Contact';

const mockMethods = [
  { id: 'email', type: 'email' as const, label: 'Email', value: 'test@example.com', iconName: 'mail' },
  { id: 'github', type: 'github' as const, label: 'GitHub', value: 'https://github.com/user', iconName: 'github' },
  { id: 'linkedin', type: 'linkedin' as const, label: 'LinkedIn', value: 'https://linkedin.com/in/user', iconName: 'linkedin' },
];

describe('Contact', () => {
  it('renders section heading', () => {
    render(<Contact methods={mockMethods} />);
    expect(screen.getByRole('heading', { name: 'Contacto' })).toBeInTheDocument();
  });

  it('renders intro text when provided', () => {
    render(<Contact methods={mockMethods} introText="Feel free to reach out!" />);
    expect(screen.getByText('Feel free to reach out!')).toBeInTheDocument();
  });

  it('renders contact methods', () => {
    render(<Contact methods={mockMethods} />);
    expect(screen.getByRole('link', { name: 'Email' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument();
  });

  it('exposes the methods as one list with no nested list items', () => {
    render(<Contact methods={mockMethods} />);
    expect(screen.getByRole('list', { name: /contact methods/i })).toBeInTheDocument();
    // Exactly one list item per method. A role="listitem" nested inside another one
    // would double this count, which is what axe reports as aria-required-parent.
    expect(screen.getAllByRole('listitem')).toHaveLength(mockMethods.length);
  });

  it('applies contact section composition', () => {
    render(<Contact methods={mockMethods} />);
    const section = screen.getByRole('region', { name: /contact/i });
    expect(getCssForElement(section)).toContain('min-height');
  });

  it('offers the contact form below the existing methods', () => {
    vi.stubEnv('VITE_WEB3FORMS_ACCESS_KEY', 'w3f_test_key');
    render(<Contact methods={mockMethods} />);

    // The methods stay: a visitor who would rather not use a form still has them.
    expect(screen.getByRole('link', { name: 'Email' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument();
  });

  it('shows the unavailability notice instead of a dead form when unconfigured', () => {
    vi.stubEnv('VITE_WEB3FORMS_ACCESS_KEY', '');
    render(<Contact methods={mockMethods} />);

    expect(screen.getByText(/no está disponible/i)).toBeInTheDocument();
    // The methods are unaffected: that is the whole point of the notice.
    expect(screen.getByRole('link', { name: 'Email' })).toBeInTheDocument();
  });
});
