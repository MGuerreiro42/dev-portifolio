import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import type { MouseEvent } from "react";
import { useHero } from "./useHero";
import { installFakeRaf } from "@/test/raf";

function mouseEventAt(x: number, y: number) {
  return { clientX: x, clientY: y } as MouseEvent<HTMLDivElement>;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useHero", () => {
  it("starts centered, with no tilt", () => {
    installFakeRaf();
    const { result } = renderHook(() => useHero());
    expect(result.current.rotateX).toBeCloseTo(0);
    expect(result.current.rotateY).toBeCloseTo(0);
    expect(result.current.glowPos).toEqual({ x: 50, y: 50 });
  });

  it("tilts toward the mouse position over time", () => {
    const fakeRaf = installFakeRaf();
    const { result } = renderHook(() => useHero());

    const container = document.createElement("div");
    container.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 200, height: 200 }) as DOMRect;
    result.current.containerRef.current = container;

    act(() => {
      result.current.handleMouseMove(mouseEventAt(200, 200));
    });
    // Raw mouse refs update synchronously, before any RAF tick.
    expect(result.current.mouseXRef.current).toBe(1);
    expect(result.current.mouseYRef.current).toBe(1);

    act(() => {
      fakeRaf.flushTimes(300);
    });

    // Lerp asymptotically approaches the target; after many frames it
    // should be close to (but need not exactly equal) the extremes.
    expect(result.current.rotateY).toBeCloseTo(11, 0);
    expect(result.current.rotateX).toBeCloseTo(-9, 0);
    expect(result.current.translateX).toBeCloseTo(18, 0);
    expect(result.current.translateY).toBeCloseTo(12, 0);
    expect(result.current.glowPos.x).toBeCloseTo(70, 0);
    expect(result.current.glowPos.y).toBeCloseTo(66, 0);
  });

  it("recenters on mouse leave", () => {
    const fakeRaf = installFakeRaf();
    const { result } = renderHook(() => useHero());

    const container = document.createElement("div");
    container.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 200, height: 200 }) as DOMRect;
    result.current.containerRef.current = container;

    act(() => {
      result.current.handleMouseMove(mouseEventAt(200, 200));
      fakeRaf.flushTimes(300);
    });
    expect(result.current.rotateY).toBeGreaterThan(5);

    act(() => {
      result.current.handleMouseLeave();
      fakeRaf.flushTimes(300);
    });
    expect(result.current.mouseXRef.current).toBe(0);
    expect(result.current.rotateY).toBeCloseTo(0, 0);
  });

  it("cancels the animation frame loop on unmount", () => {
    const fakeRaf = installFakeRaf();
    const { unmount } = renderHook(() => useHero());
    unmount();
    expect(fakeRaf.caf).toHaveBeenCalledTimes(1);
  });
});
