import { afterEach, describe, expect, it, vi } from "vitest";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@/test/test-utils";

vi.mock("./DustField", () => ({
  default: (props: { count?: number; opacity?: number }) => (
    <div data-testid="dust-field" data-count={props.count} data-opacity={props.opacity} />
  ),
}));

const { default: HeroSection } = await import("./HeroSection");

function mockMatchMedia(matches: Record<string, boolean>) {
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) =>
      ({
        matches: matches[query] ?? false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
        // framer-motion's reduced-motion detection still uses the legacy API.
        addListener: () => {},
        removeListener: () => {},
      }) as unknown as MediaQueryList
  );
}

function mockUserAgent(userAgent: string) {
  vi.stubGlobal("navigator", { userAgent });
}

function makeScrollContainer({ clientHeight = 1000, scrollTop = 0 } = {}) {
  const el = document.createElement("div");
  Object.defineProperty(el, "clientHeight", { value: clientHeight, configurable: true });
  el.scrollTop = scrollTop;
  return { current: el };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("HeroSection", () => {
  it("renders the name, subtitle and CTA from translations", () => {
    mockMatchMedia({ "(min-width: 768px)": true });
    mockUserAgent("Mozilla/5.0 Chrome/120.0");
    renderWithIntl(<HeroSection />, {
      section: { currentIndex: 0, containerRef: makeScrollContainer() },
    });

    expect(screen.getByText("Miguel Guerreiro")).toBeInTheDocument();
    expect(screen.getByText("React · TypeScript · Node.js")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /view work/i })).toBeInTheDocument();
  });

  it("mounts the particle field only while Hero is the active section", async () => {
    mockMatchMedia({ "(min-width: 768px)": true });
    mockUserAgent("Mozilla/5.0 Chrome/120.0");
    const { rerender } = renderWithIntl(<HeroSection />, {
      section: { currentIndex: 1, containerRef: makeScrollContainer() },
    });
    expect(screen.queryByTestId("dust-field")).not.toBeInTheDocument();

    rerender(<HeroSection />);
    // still index 1 in context — component only reacts to context value,
    // so re-rendering the same tree keeps it hidden.
    expect(screen.queryByTestId("dust-field")).not.toBeInTheDocument();
  });

  it("mounts the particle field with the tuned count/opacity when Hero is active", async () => {
    mockMatchMedia({ "(min-width: 768px)": true });
    mockUserAgent("Mozilla/5.0 Chrome/120.0");
    renderWithIntl(<HeroSection />, {
      section: { currentIndex: 0, containerRef: makeScrollContainer() },
    });

    const field = await screen.findByTestId("dust-field");
    expect(field).toHaveAttribute("data-count", "8000");
    expect(field).toHaveAttribute("data-opacity", "0.22");
  });

  it("skips the particle field when the user prefers reduced motion", () => {
    mockMatchMedia({
      "(min-width: 768px)": true,
      "(prefers-reduced-motion: reduce)": true,
    });
    mockUserAgent("Mozilla/5.0 Chrome/120.0");
    renderWithIntl(<HeroSection />, {
      section: { currentIndex: 0, containerRef: makeScrollContainer() },
    });

    expect(screen.queryByTestId("dust-field")).not.toBeInTheDocument();
  });

  it("scrolls to the Work section when the CTA is clicked", async () => {
    mockMatchMedia({ "(min-width: 768px)": true });
    mockUserAgent("Mozilla/5.0 Chrome/120.0");
    const scrollToIndex = vi.fn();
    renderWithIntl(<HeroSection />, {
      section: { currentIndex: 0, scrollToIndex, containerRef: makeScrollContainer() },
    });

    await userEvent.click(screen.getByRole("button", { name: /view work/i }));
    expect(scrollToIndex).toHaveBeenCalledWith(2);
  });

  it("applies the Firefox backdrop-filter fallback for a Firefox user agent", async () => {
    mockMatchMedia({ "(min-width: 768px)": true });
    mockUserAgent("Mozilla/5.0 (Windows NT 10.0; rv:120.0) Gecko/20100101 Firefox/120.0");
    renderWithIntl(<HeroSection />, {
      section: { currentIndex: 0, containerRef: makeScrollContainer() },
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /view work/i }).closest(".rounded-\\[32px\\]")).toHaveClass(
        "bg-black"
      );
    });
  });

  it("recomputes exit progress from the shared scroll container on scroll", async () => {
    mockMatchMedia({ "(min-width: 768px)": true });
    mockUserAgent("Mozilla/5.0 Chrome/120.0");
    const containerRef = makeScrollContainer({ clientHeight: 1000, scrollTop: 0 });
    renderWithIntl(<HeroSection />, {
      section: { currentIndex: 0, containerRef },
    });

    const photo = screen.getByAltText("Miguel Guerreiro");
    const initialOpacity = (photo.parentElement as HTMLElement).style.opacity;
    expect(initialOpacity).toBe("1");

    act(() => {
      containerRef.current!.scrollTop = 500; // halfway to About
      containerRef.current!.dispatchEvent(new Event("scroll"));
    });

    await waitFor(() => {
      expect((photo.parentElement as HTMLElement).style.opacity).toBe("0.5");
    });
  });
});
