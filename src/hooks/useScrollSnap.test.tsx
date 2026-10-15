import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { useScrollSnap } from './useScrollSnap';

/**
 * specs/023-home-scroll-snap.
 *
 * A leaked attribute on <html> would snap every route visited afterwards and nothing on the landing page
 * would report it — the landing page's own computed-style checks all still pass. So the lifecycle is
 * asserted directly, including the removal on unmount.
 */

function Probe({ enabled }: { enabled: boolean }) {
  useScrollSnap(enabled);
  return null;
}

const attr = () => document.documentElement.getAttribute('data-scroll-snap');

describe('useScrollSnap', () => {
  beforeEach(() => {
    delete document.documentElement.dataset.scrollSnap;
  });

  it('sets the attribute while enabled', () => {
    render(<Probe enabled />);
    expect(attr()).toBe('y');
  });

  it('removes it on unmount', () => {
    const { unmount } = render(<Probe enabled />);
    expect(attr()).toBe('y');
    unmount();
    expect(attr()).toBeNull();
  });

  it('leaves it absent when disabled from the start', () => {
    render(<Probe enabled={false} />);
    expect(attr()).toBeNull();
  });

  it('removes it when the flag flips to false without unmounting', () => {
    const { rerender } = render(<Probe enabled />);
    expect(attr()).toBe('y');
    rerender(<Probe enabled={false} />);
    expect(attr()).toBeNull();
  });

  it('restores it when the flag flips back', () => {
    const { rerender } = render(<Probe enabled={false} />);
    rerender(<Probe enabled />);
    expect(attr()).toBe('y');
  });

  it('does not fight an attribute another owner put there', () => {
    // Not a scenario the site has, but the hook's own cleanup is unconditional: if something else owned
    // this attribute, unmount would take it with. Asserted so the behaviour is a decision, not a surprise.
    const { unmount } = render(<Probe enabled />);
    document.documentElement.dataset.scrollSnap = 'y-proximity';
    unmount();
    expect(attr()).toBeNull();
  });
});