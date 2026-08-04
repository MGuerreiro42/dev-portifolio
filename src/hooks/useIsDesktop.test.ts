import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useIsDesktop } from "./useIsDesktop";

function mockMatchMedia(initialMatches: boolean) {
  const listeners = new Set<(e: MediaQueryListEvent) => void>();
  const addEventListener = vi.fn((_: string, cb: (e: MediaQueryListEvent) => void) =>
    listeners.add(cb)
  );
  const removeEventListener = vi.fn((_: string, cb: (e: MediaQueryListEvent) => void) =>
    listeners.delete(cb)
  );
  const mql = {
    matches: initialMatches,
    media: "(min-width: 768px)",
    addEventListener,
    removeEventListener,
  };
  vi.spyOn(window, "matchMedia").mockReturnValue(mql as unknown as MediaQueryList);
  return {
    addEventListener,
    removeEventListener,
    change(matches: boolean) {
      mql.matches = matches;
      act(() => {
        listeners.forEach((cb) => cb({ matches } as MediaQueryListEvent));
      });
    },
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useIsDesktop", () => {
  it("reflects a non-matching (min-width: 768px) query", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useIsDesktop());
    expect(result.current).toBe(false);
  });

  it("reflects a matching (min-width: 768px) query", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useIsDesktop());
    expect(result.current).toBe(true);
  });

  it("updates when the media query changes", () => {
    const media = mockMatchMedia(false);
    const { result } = renderHook(() => useIsDesktop());
    expect(result.current).toBe(false);

    media.change(true);
    expect(result.current).toBe(true);
  });

  it("subscribes on mount and unsubscribes on unmount", () => {
    const media = mockMatchMedia(true);
    const { unmount } = renderHook(() => useIsDesktop());
    expect(media.addEventListener).toHaveBeenCalledTimes(1);

    unmount();
    expect(media.removeEventListener).toHaveBeenCalledTimes(1);
  });
});
