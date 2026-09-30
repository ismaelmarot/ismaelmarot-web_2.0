import { render, screen } from '@testing-library/react';
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
    const link = screen.getByRole('link', { name: 'Email' });
    expect(link).toHaveAttribute('href', 'mailto:test@example.com');
    expect(link).not.toHaveAttribute('target');
  });

  it('renders external link with target blank', () => {
    render(<ContactMethod method={{ ...mockMethod, type: 'github', value: 'https://github.com/user' }} index={0} />);
    const link = screen.getByRole('link', { name: 'GitHub' });
    expect(link).toHaveAttribute('href', 'https://github.com/user');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders icon and label', () => {
    render(<ContactMethod method={mockMethod} index={0} />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });
});