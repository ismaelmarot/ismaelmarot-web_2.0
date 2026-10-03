import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectDots } from './ProjectDots';

const names = ['Alpha', 'Beta', 'Gamma'];

const renderDots = (
  overrides: Partial<React.ComponentProps<typeof ProjectDots>> = {}
) =>
  render(
    <ProjectDots
      count={names.length}
      currentIndex={0}
      names={names}
      onSelect={vi.fn()}
      {...overrides}
    />
  );

describe('ProjectDots', () => {
  it('renders one dot per project', () => {
    renderDots();
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('marks the current project', () => {
    renderDots({ currentIndex: 1 });
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('aria-current', 'false');
    expect(buttons[1]).toHaveAttribute('aria-current', 'true');
    expect(buttons[2]).toHaveAttribute('aria-current', 'false');
  });

  it('names each dot with its position so the count is announced', () => {
    renderDots({ currentIndex: 1 });
    expect(screen.getByRole('button', { name: 'Proyecto 1 de 3: Alpha' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Proyecto 3 de 3: Gamma' })).toBeInTheDocument();
  });

  it('reports the project that was selected', () => {
    const onSelect = vi.fn();
    renderDots({ onSelect });
    fireEvent.click(screen.getByRole('button', { name: /Proyecto 3 de 3/ }));
    expect(onSelect).toHaveBeenCalledWith(2);
  });

  it('reaches every dot by keyboard', () => {
    renderDots();
    for (const dot of screen.getAllByRole('button')) {
      expect(dot).toHaveAttribute('type', 'button');
    }
  });

  it('renders nothing when there are no projects, rather than an empty control', () => {
    const { container } = renderDots({ count: 0, names: [] });
    expect(container).toBeEmptyDOMElement();
  });

  it('offers no autoplay control', () => {
    renderDots();
    const labels = screen
      .getAllByRole('button')
      .map((dot) => dot.getAttribute('aria-label') ?? '');
    expect(labels.some((label) => /play|pause|paus|reproduc/i.test(label))).toBe(false);
  });
});