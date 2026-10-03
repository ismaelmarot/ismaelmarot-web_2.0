import { renderHook, act } from '@testing-library/react';
import { useProjectsCarousel } from '@/components/sections/Projects/useProjectsCarousel';

const GAP = 32;
const CARD = 800;
const DESKTOP_VIEWPORT = 1216;

/**
 * Builds a strip with the geometry the hook actually reads. jsdom reports
 * offsetLeft, offsetWidth, clientWidth and scrollWidth all as 0, so each one has
 * to be defined or the card under the viewport centre is undefined.
 *
 * Desktop is the default because it is the case that matters: there the cards are
 * 800px inside a 1216px strip, so the last card starts past the maximum scroll
 * position and the browser clamps it. That is what the clamping and the
 * centre-based lookup exist for.
 */
function mountStrip(
  count: number,
  options: { cardWidth?: number; viewport?: number } = {}
) {
  const cardWidth = options.cardWidth ?? CARD;
  const viewport = options.viewport ?? DESKTOP_VIEWPORT;
  const strip = document.createElement('ul');
  const scrollCalls: { left: number }[] = [];
  const maxScroll = Math.max(0, count * cardWidth + (count - 1) * GAP - viewport);

  (strip as unknown as { scrollTo: (o: { left: number }) => void }).scrollTo = ({ left }) => {
    scrollCalls.push({ left: Math.min(left, maxScroll) });
  };

  for (let index = 0; index < count; index += 1) {
    const card = document.createElement('li');
    Object.defineProperty(card, 'offsetLeft', { value: index * (cardWidth + GAP) });
    Object.defineProperty(card, 'offsetWidth', { value: cardWidth });
    strip.appendChild(card);
  }

  const contentWidth = count * cardWidth + (count - 1) * GAP;
  Object.defineProperty(strip, 'clientWidth', { value: viewport, configurable: true });
  Object.defineProperty(strip, 'scrollWidth', { value: contentWidth, configurable: true });
  document.body.appendChild(strip);

  return { strip, scrollCalls, maxScroll };
}

function setScrollLeft(strip: HTMLElement, value: number) {
  Object.defineProperty(strip, 'scrollLeft', { value, writable: true, configurable: true });
}

async function scrollStripTo(strip: HTMLElement, value: number) {
  await act(async () => {
    setScrollLeft(strip, value);
    strip.dispatchEvent(new Event('scroll'));
    await new Promise((resolve) => requestAnimationFrame(resolve));
  });
}

async function renderStrip(
  count: number,
  options: { cardWidth?: number; viewport?: number } = {}
) {
  const { strip, scrollCalls, maxScroll } = mountStrip(count, options);
  const view = renderHook(() => useProjectsCarousel({ count }));
  (
    view.result.current as unknown as { stripRef: { current: HTMLElement | null } }
  ).stripRef.current = strip;
  // React would attach this from the onScroll prop; the ref is assigned by hand
  // here, so the listener has to be wired up explicitly.
  strip.addEventListener('scroll', view.result.current.onScroll);
  return { ...view, strip, scrollCalls, maxScroll };
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
    // Centre lands at 1600 + 608 = 2208, inside card 2 (1664 to 2464).
    await scrollStripTo(strip, 1600);
    expect(result.current.currentIndex).toBe(2);
  });

  // The case the centre lookup exists for. Card 5 starts at 4160px but the strip
  // only scrolls to 3744px, so nearest-by-offset ties at 416px each way and
  // resolves to card 4 instead of card 5.
  it('reports the last project when the strip is scrolled as far as it goes', async () => {
    const { result, strip, maxScroll } = await renderStrip(6);
    expect(maxScroll).toBe(3744);
    await scrollStripTo(strip, maxScroll);
    expect(result.current.currentIndex).toBe(5);
  });

  it('reports the card holding the middle of the strip', async () => {
    const { result, strip } = await renderStrip(4, { viewport: CARD });
    await scrollStripTo(strip, 1180);
    expect(result.current.currentIndex).toBe(1);
    await scrollStripTo(strip, 1700);
    expect(result.current.currentIndex).toBe(2);
  });

  it('scrolls to the requested project', async () => {
    const { result, scrollCalls } = await renderStrip(4);
    await act(async () => result.current.goTo(2));
    expect(result.current.currentIndex).toBe(2);
    expect(scrollCalls.at(-1)?.left).toBe(1664);
  });

  // Clicking the last dot used to show the second-to-last card, because the last
  // card's own start is past the maximum the strip can scroll.
  it('scrolls the last dot as far as the strip allows', async () => {
    const { result, scrollCalls, maxScroll } = await renderStrip(6);
    await act(async () => result.current.goTo(5));
    expect(result.current.currentIndex).toBe(5);
    expect(scrollCalls.at(-1)?.left).toBe(maxScroll);
  });

  it('clamps goTo past the end to what the strip can scroll', async () => {
    const { result, scrollCalls, maxScroll } = await renderStrip(3);
    await act(async () => result.current.goTo(99));
    expect(result.current.currentIndex).toBe(2);
    expect(scrollCalls.at(-1)?.left).toBe(maxScroll);
  });

  it('clamps goTo below zero', async () => {
    const { result, scrollCalls } = await renderStrip(3);
    await act(async () => result.current.goTo(-5));
    expect(result.current.currentIndex).toBe(0);
    expect(scrollCalls.at(-1)?.left).toBe(0);
  });

  it('moves by exactly one project with step', async () => {
    const { result, scrollCalls } = await renderStrip(3);
    await act(async () => result.current.step(1));
    expect(result.current.currentIndex).toBe(1);
    expect(scrollCalls.at(-1)?.left).toBe(832);
    await act(async () => result.current.step(-1));
    expect(result.current.currentIndex).toBe(0);
  });

  it('stops at both ends instead of wrapping, because a visitor pressed it', async () => {
    const { result } = await renderStrip(2);
    await act(async () => result.current.step(-1));
    expect(result.current.currentIndex).toBe(0);
    await act(async () => result.current.step(1));
    await act(async () => result.current.step(1));
    expect(result.current.currentIndex).toBe(1);
  });

  it('wraps from the last project back to the first when auto-advancing', async () => {
    const { result } = await renderStrip(3);
    await act(async () => result.current.goTo(2));
    await act(async () => result.current.advance());
    expect(result.current.currentIndex).toBe(0);
  });

  it('advances from wherever it is', async () => {
    const { result } = await renderStrip(4);
    await act(async () => result.current.advance());
    expect(result.current.currentIndex).toBe(1);
    await act(async () => result.current.advance());
    expect(result.current.currentIndex).toBe(2);
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