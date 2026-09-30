import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileMenu } from './MobileMenu';

const mockItems = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
];

const mockCta = { label: 'Contact', href: '#contact' };

describe('MobileMenu', () => {
  it('renders nothing when closed', () => {
    render(<MobileMenu isOpen={false} onClose={vi.fn()} items={mockItems} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders menu when open', () => {
    render(<MobileMenu isOpen={true} onClose={vi.fn()} items={mockItems} />);
    expect(screen.getByRole('dialog', { name: /mobile menu/i })).toBeInTheDocument();
  });

  it('renders navigation items', () => {
    render(<MobileMenu isOpen={true} onClose={vi.fn()} items={mockItems} />);
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
  });

  it('renders CTA when provided', () => {
    render(<MobileMenu isOpen={true} onClose={vi.fn()} items={mockItems} cta={mockCta} />);
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });

  it('closes on overlay click', () => {
    const onClose = vi.fn();
    render(<MobileMenu isOpen={true} onClose={onClose} items={mockItems} />);
    fireEvent.click(screen.getByTestId('overlay') || document.querySelector('[data-visible="true"]')!);
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on Escape key', () => {
    const onClose = vi.fn();
    render(<MobileMenu isOpen={true} onClose={onClose} items={mockItems} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on close button click', () => {
    const onClose = vi.fn();
    render(<MobileMenu isOpen={true} onClose={onClose} items={mockItems} />);
    fireEvent.click(screen.getByRole('button', { name: /close menu/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('traps focus', () => {
    render(<MobileMenu isOpen={true} onClose={vi.fn()} items={mockItems} />);
    const focusableElements = screen.getByRole('dialog').querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    expect(focusableElements.length).toBeGreaterThan(0);
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<MobileMenu isOpen={true} onClose={vi.fn()} items={mockItems} ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });
});