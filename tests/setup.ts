import '@testing-library/jest-dom';
import { vi } from 'vitest';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

// jsdom implements scrollTo on window but not on elements, so the projects carousel's
// `strip.scrollTo(...)` throws. It surfaced as an unhandled error after the suite had already
// reported green, which made CI fail on a run whose tests all passed. Mocking it here is the
// difference between the two: the error never happens, so the run's exit code matches its output.
Object.defineProperty(Element.prototype, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(Element.prototype, 'scrollIntoView', {
  writable: true,
  value: vi.fn(),
});

HTMLDialogElement.prototype.showModal = vi.fn();
HTMLDialogElement.prototype.close = vi.fn();