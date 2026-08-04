import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { createRef } from "react";
import { SectionContext, useSectionContext } from "./SectionContext";

describe("SectionContext", () => {
  it("provides sensible no-op defaults outside any provider", () => {
    const { result } = renderHook(() => useSectionContext());
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.containerRef.current).toBeNull();
    expect(() => result.current.scrollToIndex(2)).not.toThrow();
  });

  it("returns the value supplied by a provider", () => {
    const scrollToIndex = vi.fn();
    const containerRef = createRef<HTMLDivElement>();
    const { result } = renderHook(() => useSectionContext(), {
      wrapper: ({ children }) => (
        <SectionContext.Provider value={{ scrollToIndex, currentIndex: 2, containerRef }}>
          {children}
        </SectionContext.Provider>
      ),
    });

    expect(result.current.currentIndex).toBe(2);
    result.current.scrollToIndex(3);
    expect(scrollToIndex).toHaveBeenCalledWith(3);
  });
});
