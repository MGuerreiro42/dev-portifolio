import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import type { MouseEvent } from "react";
import { usePanelFloat } from "./usePanelFloat";
import { installFakeRaf } from "@/test/raf";

function mouseEventAt(x: number, y: number) {
  return { clientX: x, clientY: y } as MouseEvent<HTMLDivElement>;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("usePanelFloat", () => {
  it("mounts floated down by 28px with no tilt, before any frame runs", () => {
    installFakeRaf();
    vi.spyOn(performance, "now").mockReturnValue(0);
    const { result } = renderHook(() => usePanelFloat());
    expect(result.current.rotateX).toBe(0);
    expect(result.current.rotateY).toBe(0);
    expect(result.current.translateY).toBe(28);
  });

  it("eases the mount offset down toward 0 as frames advance (time held still)", () => {
    const fakeRaf = installFakeRaf();
    vi.spyOn(performance, "now").mockReturnValue(0);
    const { result } = renderHook(() => usePanelFloat());

    act(() => {
      fakeRaf.flushTimes(400);
    });
    // Held at t=0 the whole time, so the ambient sine terms are all 0 —
    // translateY here is purely the decaying mount offset.
    expect(result.current.translateY).toBeCloseTo(0, 1);
  });

  it("tilts toward the hovered position, isolated from the ambient float by holding time still", () => {
    const fakeRaf = installFakeRaf();
    vi.spyOn(performance, "now").mockReturnValue(0);
    const { result } = renderHook(() => usePanelFloat());

    const panel = document.createElement("div");
    panel.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 200 }) as DOMRect;
    result.current.panelRef.current = panel;

    act(() => {
      result.current.handleMouseMove(mouseEventAt(200, 200)); // bottom-right corner: (1, 1)
      fakeRaf.flushTimes(400);
    });

    // t is pinned at 0 throughout, so ambient rotateX/rotateY are 0/1.8;
    // hoverCurrent converges to (1, 1): rotateX = 0 - 1*6, rotateY = 1.8 + 1*6.
    expect(result.current.rotateX).toBeCloseTo(-6, 1);
    expect(result.current.rotateY).toBeCloseTo(7.8, 1);
  });

  it("relaxes back to the ambient-only tilt on mouse leave", () => {
    const fakeRaf = installFakeRaf();
    vi.spyOn(performance, "now").mockReturnValue(0);
    const { result } = renderHook(() => usePanelFloat());

    const panel = document.createElement("div");
    panel.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 200 }) as DOMRect;
    result.current.panelRef.current = panel;

    act(() => {
      result.current.handleMouseMove(mouseEventAt(200, 200));
      fakeRaf.flushTimes(400);
    });
    expect(result.current.rotateX).toBeCloseTo(-6, 1);

    act(() => {
      result.current.handleMouseLeave();
      fakeRaf.flushTimes(400);
    });
    expect(result.current.rotateX).toBeCloseTo(0, 1);
    expect(result.current.rotateY).toBeCloseTo(1.8, 1);
  });

  it("cancels the animation frame loop on unmount", () => {
    const fakeRaf = installFakeRaf();
    vi.spyOn(performance, "now").mockReturnValue(0);
    const { unmount } = renderHook(() => usePanelFloat());
    unmount();
    expect(fakeRaf.caf).toHaveBeenCalledTimes(1);
  });
});
