import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Reveal from "./Reveal";

class CapturingIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = () => [];
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Reveal", () => {
  it("always renders its children, regardless of visibility", () => {
    vi.stubGlobal("IntersectionObserver", CapturingIntersectionObserver);
    render(
      <Reveal>
        <span>hello</span>
      </Reveal>
    );
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("merges a custom className onto the overflow-hidden wrapper", () => {
    vi.stubGlobal("IntersectionObserver", CapturingIntersectionObserver);
    const { container } = render(
      <Reveal className="mb-10">
        <span>content</span>
      </Reveal>
    );
    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveClass("overflow-hidden");
    expect(wrapper).toHaveClass("mb-10");
  });

  it("starts with the pre-reveal opacity/offset before scrolling into view", () => {
    vi.stubGlobal("IntersectionObserver", CapturingIntersectionObserver);
    const { container } = render(
      <Reveal>
        <span>content</span>
      </Reveal>
    );
    const motionEl = container.querySelector("[style]") as HTMLElement;
    expect(motionEl.style.opacity).toBe("0");
  });
});
