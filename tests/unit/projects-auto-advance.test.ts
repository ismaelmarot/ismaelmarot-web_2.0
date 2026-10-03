import { renderHook, act } from '@testing-library/react';
import {
  useProjectsAutoAdvance,
} from '@/components/sections/Projects/useProjectsAutoAdvance';

/** jsdom has no matchMedia by default, so reduced motion is driven from here. */
let reducedMotion = false;
let mediaListeners: ((event: MediaQueryListEvent) => void)[] = [];

const noop = () => undefined;

function stubMatchMedia() {
  window.matchMedia = ((query: string) => ({
    matches: reducedMotion,
    media: query,
    onchange: null,
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
      mediaListeners.push(listener);
    },
    removeEventListener: noop,
    addListener: noop,
    removeListener: noop,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

function setHidden(hidden: boolean) {
  Object.defineProperty(document, 'visibilityState', {
    value: hidden ? 'hidden' : 'visible',
    configurable: true,
  });
  document.dispatchEvent(new Event('visibilitychange'));
}

beforeEach(() => {
  reducedMotion = false;
  mediaListeners = [];
  stubMatchMedia();
  setHidden(false);
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useProjectsAutoAdvance', () => {
  it('advances on its own once the interval elapses', () => {
    const onAdvance = vi.fn();
    renderHook(() => useProjectsAutoAdvance({ onAdvance }));

    expect(onAdvance).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(7000));
    expect(onAdvance).toHaveBeenCalledTimes(1);
    act(() => vi.advanceTimersByTime(7000));
    expect(onAdvance).toHaveBeenCalledTimes(2);
  });

  it('honours a custom interval', () => {
    const onAdvance = vi.fn();
    renderHook(() => useProjectsAutoAdvance({ onAdvance, intervalMs: 1000 }));
    act(() => vi.advanceTimersByTime(1000));
    expect(onAdvance).toHaveBeenCalledTimes(1);
  });

  it('reports playing and names the action to stop it', () => {
    const { result } = renderHook(() => useProjectsAutoAdvance({ onAdvance: vi.fn() }));
    expect(result.current.playing).toBe(true);
    expect(result.current.label).toBe('Pausar');
  });

  it('stops on the first toggle and resumes on the second', () => {
    const onAdvance = vi.fn();
    const { result } = renderHook(() => useProjectsAutoAdvance({ onAdvance }));

    act(() => result.current.toggle());
    expect(result.current.playing).toBe(false);
    expect(result.current.label).toBe('Reproducir');
    act(() => vi.advanceTimersByTime(20000));
    expect(onAdvance).not.toHaveBeenCalled();

    act(() => result.current.toggle());
    expect(result.current.label).toBe('Pausar');
    act(() => vi.advanceTimersByTime(7000));
    expect(onAdvance).toHaveBeenCalledTimes(1);
  });

  // Toggling quickly is exactly how a single timer per playing state is proven: if
  // cleanup did not clear the interval, the calls would be two or three per tick.
  it('leaves no second timer behind after rapid toggling', () => {
    const onAdvance = vi.fn();
    const { result } = renderHook(() => useProjectsAutoAdvance({ onAdvance }));

    for (let index = 0; index < 6; index += 1) {
      act(() => result.current.toggle());
      act(() => vi.advanceTimersByTime(10));
    }
    expect(result.current.playing).toBe(true);

    act(() => vi.advanceTimersByTime(7000));
    expect(onAdvance).toHaveBeenCalledTimes(1);
  });

  it('does not advance at all under reduced motion, and reports stopped', () => {
    reducedMotion = true;
    const onAdvance = vi.fn();
    const { result } = renderHook(() => useProjectsAutoAdvance({ onAdvance }));

    act(() => vi.advanceTimersByTime(60000));
    expect(onAdvance).not.toHaveBeenCalled();
    // It must not show a stop glyph for something that will never run.
    expect(result.current.label).toBe('Reproducir');
  });

  it('starts advancing when reduced motion is turned off mid-session', () => {
    const onAdvance = vi.fn();
    renderHook(() => useProjectsAutoAdvance({ onAdvance }));
    expect(vi.getTimerCount()).toBe(1);

    act(() => {
      reducedMotion = true;
      mediaListeners.forEach((listener) => listener({ matches: true } as MediaQueryListEvent));
    });
    expect(vi.getTimerCount()).toBe(0);

    act(() => {
      reducedMotion = false;
      mediaListeners.forEach((listener) => listener({ matches: false } as MediaQueryListEvent));
    });
    act(() => vi.advanceTimersByTime(7000));
    expect(onAdvance).toHaveBeenCalledTimes(1);
  });

  it('holds still while focus is inside the section, and resumes when focus leaves', () => {
    const onAdvance = vi.fn();
    const { rerender } = renderHook(({ paused }) => useProjectsAutoAdvance({ onAdvance, pausedForFocus: paused }), {
      initialProps: { paused: true },
    });

    act(() => vi.advanceTimersByTime(21000));
    expect(onAdvance).not.toHaveBeenCalled();

    rerender({ paused: false });
    act(() => vi.advanceTimersByTime(7000));
    expect(onAdvance).toHaveBeenCalledTimes(1);
  });

  it('holds still while the tab is hidden', () => {
    const onAdvance = vi.fn();
    renderHook(() => useProjectsAutoAdvance({ onAdvance }));

    act(() => setHidden(true));
    act(() => vi.advanceTimersByTime(20000));
    expect(onAdvance).not.toHaveBeenCalled();
  });

  // Without the reset the interval that started before the tab was hidden would
  // fire immediately on return, jumping the strip several projects at once.
  it('does not jump on return from a hidden tab', () => {
    const onAdvance = vi.fn();
    renderHook(() => useProjectsAutoAdvance({ onAdvance }));

    act(() => vi.advanceTimersByTime(3000));
    act(() => setHidden(true));
    act(() => vi.advanceTimersByTime(60000));
    act(() => setHidden(false));

    onAdvance.mockClear();
    act(() => vi.advanceTimersByTime(1000));
    expect(onAdvance).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(6000));
    expect(onAdvance).toHaveBeenCalledTimes(1);
  });

  it('clears its timer on unmount', () => {
    const onAdvance = vi.fn();
    const { unmount } = renderHook(() => useProjectsAutoAdvance({ onAdvance }));
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('keeps the latest advance callback without restarting the interval', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(({ cb }) => useProjectsAutoAdvance({ onAdvance: cb }), {
      initialProps: { cb: first },
    });

    rerender({ cb: second });
    act(() => vi.advanceTimersByTime(7000));
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});