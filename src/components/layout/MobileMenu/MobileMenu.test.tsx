import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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
        <MobileMenu isOpen={false} onClose={vi.fn()} items={mockItems} />
      </MemoryRouter>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders menu when open', () => {
    render(
      <MemoryRouter>
        <MobileMenu isOpen={true} onClose={vi.fn()} items={mockItems} />
      </MemoryRouter>
    );
    expect(screen.getByRole('dialog', { name: /mobile menu/i })).toBeInTheDocument();
  });

  it('renders navigation items', () => {
    render(
      <MemoryRouter>
        <MobileMenu isOpen={true} onClose={vi.fn()} items={mockItems} />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
  });

  it('renders CTA when provided', () => {
    render(
      <MemoryRouter>
        <MobileMenu isOpen={true} onClose={vi.fn()} items={mockItems} cta={mockCta} />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });

  it('closes on overlay click', () => {
    const onClose = vi.fn();
    render(
      <MemoryRouter>
        <MobileMenu isOpen={true} onClose={onClose} items={mockItems} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByTestId('overlay'));
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on Escape key', () => {
    const onClose = vi.fn();
    render(
      <MemoryRouter>
        <MobileMenu isOpen={true} onClose={onClose} items={mockItems} />
      </MemoryRouter>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on close button click', () => {
    const onClose = vi.fn();
    render(
      <MemoryRouter>
        <MobileMenu isOpen={true} onClose={onClose} items={mockItems} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /close menu/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('traps focus', () => {
    render(
      <MemoryRouter>
        <MobileMenu isOpen={true} onClose={vi.fn()} items={mockItems} />
      </MemoryRouter>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getAllByRole('link').length).toBeGreaterThan(0);
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(
      <MemoryRouter>
        <MobileMenu isOpen={true} onClose={vi.fn()} items={mockItems} ref={ref} />
      </MemoryRouter>
    );
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });
});
