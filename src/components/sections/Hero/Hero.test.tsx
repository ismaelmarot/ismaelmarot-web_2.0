import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { getCssForElement } from '@/test-utils/css';
import { Hero } from './Hero';
import type { HeroProps } from './Hero';

describe('Hero', () => {
  const defaultProps: HeroProps = {
    name: 'Ismael Marot',
    title: 'Web Developer',
    tagline: 'Building beautiful, functional web experiences.',
    cta: { label: 'View Projects', href: '/projects' },
    secondaryCta: { label: 'Contact Me', href: '/contact' },
  };

  const renderHero = (props: HeroProps = defaultProps) =>
    render(
      <MemoryRouter>
        <Hero {...props} />
      </MemoryRouter>
    );

  it('renders name, title, and tagline', () => {
    renderHero();
    expect(screen.getByText('Ismael Marot')).toBeInTheDocument();
    expect(screen.getByText('Web Developer')).toBeInTheDocument();
    expect(screen.getByText('Building beautiful, functional web experiences.')).toBeInTheDocument();
  });

  it('renders primary CTA button', () => {
    renderHero();
    expect(screen.getByRole('link', { name: 'View Projects' })).toBeInTheDocument();
  });

  it('renders secondary CTA button', () => {
    renderHero();
    expect(screen.getByRole('link', { name: 'Contact Me' })).toBeInTheDocument();
  });

  it('renders without secondary CTA when not provided', () => {
    renderHero({ ...defaultProps, secondaryCta: undefined });
    expect(screen.queryByRole('link', { name: 'Contact Me' })).not.toBeInTheDocument();
  });

  it('applies hero section composition', () => {
    renderHero();
    const section = screen.getByRole('region', { name: /hero/i });
    expect(getCssForElement(section)).toContain('min-height');
  });
});