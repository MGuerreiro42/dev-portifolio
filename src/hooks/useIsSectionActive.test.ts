import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import type { RefObject } from "react";
import { useIsSectionActive } from "./useIsSectionActive";

function mockMatchMedia(matches: boolean) {
  vi.spyOn(window, "matchMedia").mockReturnValue({
    matches,
    media: "(min-width: 768px)",
    addEventListener: () => {},
    removeEventListener: () => {},
  } as unknown as MediaQueryList);
}

let observeCallback: IntersectionObserverCallback | null = null;
let observeSpy = vi.fn();
let disconnectSpy = vi.fn();

class FakeIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];
  constructor(callback: IntersectionObserverCallback) {
    observeCallback = callback;
  }
  observe = observeSpy;
  unobserve = vi.fn();
  disconnect = disconnectSpy;
  takeRecords = () => [];
}

afterEach(() => {
  vi.restoreAllMocks();
  observeCallback = null;
  observeSpy = vi.fn();
  disconnectSpy = vi.fn();
});

function refTo(el: HTMLElement | null): RefObject<HTMLElement | null> {
  return { current: el };
}

describe("useIsSectionActive", () => {
  it("on desktop, is active exactly when currentIndex matches the section index", () => {
    mockMatchMedia(true);
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
    // Refs must stay referentially stable across renders (as a real
    // useRef() would be) — recreating them inline on every render would
    // retrigger the effect's cleanup/rerun, same as a real ref churning.
    const elementRef = refTo(document.createElement("div"));
    const containerRef = refTo(document.createElement("div"));

    const { result, rerender } = renderHook(
      ({ currentIndex }) => useIsSectionActive(1, currentIndex, elementRef, containerRef),
      { initialProps: { currentIndex: 0 } }
    );
    expect(result.current).toBe(false);

    rerender({ currentIndex: 1 });
    expect(result.current).toBe(true);
  });

  it("on mobile, ignores currentIndex and follows IntersectionObserver instead", () => {
    mockMatchMedia(false);
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
    const elementRef = refTo(document.createElement("div"));
    const containerRef = refTo(document.createElement("div"));

    const { result } = renderHook(() =>
      useIsSectionActive(1, 0, elementRef, containerRef)
    );
    expect(result.current).toBe(false);
    expect(observeSpy).toHaveBeenCalledWith(elementRef.current);

    act(() => {
      observeCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });
    expect(result.current).toBe(true);
  });

  it("does nothing when the element ref isn't attached yet", () => {
    mockMatchMedia(false);
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
    const elementRef = refTo(null);
    const containerRef = refTo(null);

    const { result } = renderHook(() => useIsSectionActive(0, 0, elementRef, containerRef));
    expect(result.current).toBe(false);
    expect(observeSpy).not.toHaveBeenCalled();
  });

  it("disconnects the observer on unmount", () => {
    mockMatchMedia(false);
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
    const elementRef = refTo(document.createElement("div"));
    const containerRef = refTo(null);

    const { unmount } = renderHook(() => useIsSectionActive(0, 0, elementRef, containerRef));
    unmount();
    expect(disconnectSpy).toHaveBeenCalledTimes(1);
  });
});
