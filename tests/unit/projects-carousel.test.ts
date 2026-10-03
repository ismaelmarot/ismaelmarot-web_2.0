import { renderHook, act } from '@testing-library/react';
import { useProjectsCarousel } from '@/components/sections/Projects/useProjectsCarousel';

/**
 * Builds a strip whose cards sit at 0, 800, 1600 and so on. jsdom reports
 * offsetLeft as 0 for everything, so the positions the logic depends on have to
 * be defined explicitly or every card would look like the first one. jsdom also
 * has no scrollTo on elements, so it is stubbed to record what was asked for.
 */
function mountStrip(count: number, cardWidth = 800) {
  const strip = document.createElement('ul');
  const scrollCalls: { left: number }[] = [];
  (strip as unknown as { scrollTo: (o: { left: number }) => void }).scrollTo = ({ left }) => {
    scrollCalls.push({ left });
  };
  for (let index = 0; index < count; index += 1) {
    const card = document.createElement('li');
    Object.defineProperty(card, 'offsetLeft', { value: index * cardWidth });
    strip.appendChild(card);
  }
  document.body.appendChild(strip);
  return { strip, scrollCalls };
}

function setScrollLeft(strip: HTMLElement, value: number) {
  Object.defineProperty(strip, 'scrollLeft', { value, writable: true, configurable: true });
}

/** Sets the position, fires the event the hook listens to, then waits a frame. */
async function scrollStripTo(strip: HTMLElement, value: number) {
  await act(async () => {
    setScrollLeft(strip, value);
    strip.dispatchEvent(new Event('scroll'));
    await new Promise((resolve) => requestAnimationFrame(resolve));
  });
}

async function renderStrip(count: number) {
  const { strip, scrollCalls } = mountStrip(count);
  const view = renderHook(() => useProjectsCarousel({ count }));
  (
    view.result.current as unknown as { stripRef: { current: HTMLElement | null } }
  ).stripRef.current = strip;
  // The real component gets this from React's onScroll prop; here the ref is
  // assigned directly, so the listener has to be wired up by hand.
  strip.addEventListener('scroll', view.result.current.onScroll);
  return { ...view, strip, scrollCalls };
}

describe('useProjectsCarousel', () => {
  it('starts on the first project', async () => {
    const { result } = await renderStrip(4);
    expect(result.current.currentIndex).toBe(0);
  });

  it('reports the first project when the strip has not moved', async () => {
    const { result, strip } = await renderStrip(4);
    await scrollStripTo(strip, 0);
    expect(result.current.currentIndex).toBe(0);
  });

  it('reports a middle project from the scroll position', async () => {
    const { result, strip } = await renderStrip(4);
    await scrollStripTo(strip, 1600);
    expect(result.current.currentIndex).toBe(2);
  });

  it('reports the last project', async () => {
    const { result, strip } = await renderStrip(4);
    await scrollStripTo(strip, 2400);
    expect(result.current.currentIndex).toBe(3);
  });

  it('rounds a partial offset to the nearest card, in both directions', async () => {
    const { result, strip } = await renderStrip(4);
    // Cards sit at 0, 800, 1600, 2400. 1180 is 380px past card 1 and 420px
    // short of card 2, so it belongs to card 1...
    await scrollStripTo(strip, 1180);
    expect(result.current.currentIndex).toBe(1);

    // ...and 1220 flips the same comparison, so it belongs to card 2.
    await scrollStripTo(strip, 1220);
    expect(result.current.currentIndex).toBe(2);
  });

  it('scrolls to the requested project', async () => {
    const { result, scrollCalls } = await renderStrip(4);
    await act(async () => result.current.goTo(2));
    expect(scrollCalls.at(-1)?.left).toBe(1600);
  });

  it('clamps goTo to the strip instead of scrolling past the end', async () => {
    const { result, scrollCalls } = await renderStrip(3);
    await act(async () => result.current.goTo(99));
    expect(result.current.currentIndex).toBe(2);
    expect(scrollCalls.at(-1)?.left).toBe(1600);
  });

  it('clamps goTo below zero', async () => {
    const { result } = await renderStrip(3);
    await act(async () => result.current.goTo(-5));
    expect(result.current.currentIndex).toBe(0);
  });

  it('moves by exactly one project with step', async () => {
    const { result, scrollCalls } = await renderStrip(3);
    await act(async () => result.current.step(1));
    expect(result.current.currentIndex).toBe(1);
    expect(scrollCalls.at(-1)?.left).toBe(800);
    await act(async () => result.current.step(-1));
    expect(result.current.currentIndex).toBe(0);
  });

  it('does not move past the last or before the first project', async () => {
    const { result } = await renderStrip(2);
    await act(async () => result.current.step(-1));
    expect(result.current.currentIndex).toBe(0);
    await act(async () => result.current.step(1));
    await act(async () => result.current.step(1));
    expect(result.current.currentIndex).toBe(1);
  });

  it('returns to the first project when the list narrows past the current one', async () => {
    const { strip } = mountStrip(6);
    const view = renderHook(({ count }) => useProjectsCarousel({ count }), {
      initialProps: { count: 6 },
    });
    (
      view.result.current as unknown as { stripRef: { current: HTMLElement | null } }
    ).stripRef.current = strip;

    await act(async () => view.result.current.goTo(5));
    expect(view.result.current.currentIndex).toBe(5);

    // A filter that leaves two projects must not leave the strip reporting five.
    view.rerender({ count: 2 });
    expect(view.result.current.currentIndex).toBe(0);
  });
});