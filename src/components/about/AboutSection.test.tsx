import { afterEach, describe, expect, it, vi } from "vitest";
import { act, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/test-utils";

vi.mock("./GlassBlobs", () => ({
  default: (props: { single?: boolean }) => (
    <div data-testid="glass-blobs" data-single={String(!!props.single)} />
  ),
}));

const { default: AboutSection } = await import("./AboutSection");

function mockMatchMedia(matches: Record<string, boolean>) {
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) =>
      ({
        matches: matches[query] ?? false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
      }) as unknown as MediaQueryList
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("AboutSection", () => {
  it("renders the bio, competencies and tech stack", () => {
    mockMatchMedia({ "(min-width: 768px)": true });
    renderWithIntl(<AboutSection />, { section: { currentIndex: 1 } });

    expect(screen.getByText("Front-end Architecture")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Tailwind")).toBeInTheDocument();
  });

  it("mounts the desktop two-blob scene only while About is active on desktop", async () => {
    mockMatchMedia({ "(min-width: 768px)": true });
    renderWithIntl(<AboutSection />, { section: { currentIndex: 0 } });
    expect(screen.queryByTestId("glass-blobs")).not.toBeInTheDocument();
  });

  it("mounts the desktop scene (not the single-blob variant) when About is active", async () => {
    mockMatchMedia({ "(min-width: 768px)": true });
    renderWithIntl(<AboutSection />, { section: { currentIndex: 1 } });

    const blobs = await screen.findByTestId("glass-blobs");
    expect(blobs).toHaveAttribute("data-single", "false");
  });

  it("mounts the single-blob variant on mobile instead", () => {
    mockMatchMedia({ "(min-width: 768px)": false });
    // On mobile, useIsSectionActive's visibility comes from
    // IntersectionObserver rather than currentIndex — a real observer
    // never fires in jsdom, so this capture-and-trigger mirrors how
    // useIsSectionActive.test.ts exercises that same path.
    let ioCallback: IntersectionObserverCallback | null = null;
    class CapturingObserver implements IntersectionObserver {
      readonly root = null;
      readonly rootMargin = "";
      readonly thresholds: ReadonlyArray<number> = [];
      constructor(cb: IntersectionObserverCallback) {
        ioCallback = cb;
      }
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
      takeRecords = () => [];
    }
    vi.stubGlobal("IntersectionObserver", CapturingObserver);

    renderWithIntl(<AboutSection />, { section: { currentIndex: 1 } });
    expect(screen.queryByTestId("glass-blobs")).not.toBeInTheDocument();

    act(() => {
      ioCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(screen.getByTestId("glass-blobs")).toHaveAttribute("data-single", "true");
    vi.unstubAllGlobals();
  });

  it("skips the 3D scene entirely when the user prefers reduced motion", () => {
    mockMatchMedia({
      "(min-width: 768px)": true,
      "(prefers-reduced-motion: reduce)": true,
    });
    renderWithIntl(<AboutSection />, { section: { currentIndex: 1 } });

    expect(screen.queryByTestId("glass-blobs")).not.toBeInTheDocument();
  });
});
