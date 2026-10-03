import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectDots } from './ProjectDots';
import { getCssForElement } from '@/test-utils/css';

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

});

describe('ProjectDots carousel controls', () => {
  const withControls = (overrides: Partial<React.ComponentProps<typeof ProjectDots>> = {}) =>
    render(
      <ProjectDots
        count={3}
        currentIndex={0}
        names={names}
        onSelect={vi.fn()}
        playing
        playStopLabel="Pausar"
        onTogglePlay={vi.fn()}
        onStep={vi.fn()}
        {...overrides}
      />
    );

  it('shows a stop glyph while the carousel is moving', () => {
    withControls({ playing: true, playStopLabel: 'Pausar' });
    expect(screen.getByTestId('pause-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('play-icon')).not.toBeInTheDocument();
  });

  it('shows a play glyph once the carousel is stopped', () => {
    withControls({ playing: false, playStopLabel: 'Reproducir' });
    expect(screen.getByTestId('play-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('pause-icon')).not.toBeInTheDocument();
  });

  // Same reasoning as the marquee control: a pressed toggle would be announced as
  // "Pausar, pressed" while the carousel was in fact moving.
  it('names the toggle for the action it performs, not with aria-pressed', () => {
    withControls({ playing: true, playStopLabel: 'Pausar' });
    const toggle = screen.getByTestId('carousel-play-toggle');
    expect(toggle).toHaveAttribute('aria-label', 'Pausar');
    expect(toggle).not.toHaveAttribute('aria-pressed');
  });

  it('toggles the auto-advance', () => {
    const onTogglePlay = vi.fn();
    withControls({ onTogglePlay });
    fireEvent.click(screen.getByTestId('carousel-play-toggle'));
    expect(onTogglePlay).toHaveBeenCalledTimes(1);
  });

  it('steps backward and forward by one project', () => {
    const onStep = vi.fn();
    withControls({ onStep });
    fireEvent.click(screen.getByTestId('carousel-previous'));
    expect(onStep).toHaveBeenLastCalledWith(-1);
    fireEvent.click(screen.getByTestId('carousel-next'));
    expect(onStep).toHaveBeenLastCalledWith(1);
  });

  it('names the arrow controls for what they do', () => {
    withControls();
    expect(screen.getByRole('button', { name: 'Proyecto anterior' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Proyecto siguiente' })).toBeInTheDocument();
  });

  it('reaches every control by keyboard', () => {
    withControls();
    for (const control of [
      screen.getByTestId('carousel-play-toggle'),
      screen.getByTestId('carousel-previous'),
      screen.getByTestId('carousel-next'),
    ]) {
      expect(control).toHaveAttribute('type', 'button');
    }
  });

  // No hover rule at all: a rule with nothing to change is dead CSS, and the
  // request was for the hover behaviour gone rather than made subtler.
  it('declares no hover styling on any control, while keeping focus styling', () => {
    withControls();
    for (const control of [
      screen.getByTestId('carousel-play-toggle'),
      screen.getByTestId('carousel-previous'),
      screen.getByTestId('carousel-next'),
    ]) {
      const css = getCssForElement(control);
      expect(css).not.toContain(':hover');
      expect(css).toContain('box-shadow: var(--shadow-focus)');
    }
  });

  it('omits the controls entirely when the carousel cannot advance', () => {
    renderDots({ count: 0, names: [] });
    expect(screen.queryByTestId('carousel-play-toggle')).not.toBeInTheDocument();
  });
});