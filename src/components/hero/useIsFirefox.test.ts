import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useIsFirefox } from "./useIsFirefox";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useIsFirefox", () => {
  it("is false for a non-Firefox user agent", () => {
    vi.stubGlobal("navigator", {
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    });
    const { result } = renderHook(() => useIsFirefox());
    expect(result.current).toBe(false);
  });

  it("is true for a Firefox user agent", () => {
    vi.stubGlobal("navigator", {
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
    });
    const { result } = renderHook(() => useIsFirefox());
    expect(result.current).toBe(true);
  });

  it("matches case-insensitively", () => {
    vi.stubGlobal("navigator", { userAgent: "FIREFOX/1.0" });
    const { result } = renderHook(() => useIsFirefox());
    expect(result.current).toBe(true);
  });
});
