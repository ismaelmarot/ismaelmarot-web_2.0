import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';

describe('Hero', () => {
  const defaultProps = {
    name: 'Ismael Marot',
    title: 'Web Developer',
    tagline: 'Building beautiful, functional web experiences.',
    cta: { label: 'View Projects', href: '#projects' },
    secondaryCta: { label: 'Contact Me', href: '#contact' },
  };

  it('renders name, title, and tagline', () => {
    render(<Hero {...defaultProps} />);
    expect(screen.getByText('Ismael Marot')).toBeInTheDocument();
    expect(screen.getByText('Web Developer')).toBeInTheDocument();
    expect(screen.getByText('Building beautiful, functional web experiences.')).toBeInTheDocument();
  });

  it('renders primary CTA button', () => {
    render(<Hero {...defaultProps} />);
    expect(screen.getByRole('link', { name: 'View Projects' })).toBeInTheDocument();
  });

  it('renders secondary CTA button', () => {
    render(<Hero {...defaultProps} />);
    expect(screen.getByRole('link', { name: 'Contact Me' })).toBeInTheDocument();
  });

  it('renders without secondary CTA when not provided', () => {
    render(<Hero {...defaultProps} secondaryCta={undefined} />);
    expect(screen.queryByRole('link', { name: 'Contact Me' })).not.toBeInTheDocument();
  });

  it('applies hero section composition', () => {
    render(<Hero {...defaultProps} />);
    const section = screen.getByRole('region', { name: /hero/i });
    expect(section).toHaveAttribute('style', expect.stringContaining('min-height'));
  });
});