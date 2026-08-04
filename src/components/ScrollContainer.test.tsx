import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";
import { useSectionContext } from "@/context/SectionContext";
import { installFakeRaf } from "@/test/raf";
import ScrollContainer from "./ScrollContainer";

function mockMatchMedia(isDesktop: boolean) {
  vi.spyOn(window, "matchMedia").mockReturnValue({
    matches: isDesktop,
    media: "(min-width: 768px)",
    addEventListener: () => {},
    removeEventListener: () => {},
  } as unknown as MediaQueryList);
}

type Ctx = ReturnType<typeof useSectionContext>;

function Probe({ onReady }: { onReady: (ctx: Ctx) => void }) {
  const ctx = useSectionContext();
  onReady(ctx);
  return <span data-testid="current-index">{ctx.currentIndex}</span>;
}

function Sections() {
  return (
    <>
      <div>Home</div>
      <div>About</div>
      <div>Work</div>
      <div>Contact</div>
    </>
  );
}

function setup({ isDesktop = true, clientHeight = 800 } = {}) {
  mockMatchMedia(isDesktop);
  // Must be in place before mount — the hash deep-link effect reads
  // clientHeight synchronously during the commit phase (useLayoutEffect),
  // before render() returns control to the test.
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(clientHeight);

  let ctx!: Ctx;
  const utils = render(
    <ScrollContainer overlay={<Probe onReady={(c) => (ctx = c)} />}>
      <Sections />
    </ScrollContainer>
  );
  const scrollDiv = utils.container.querySelector(".overflow-y-scroll") as HTMLElement;
  return { ...utils, scrollDiv, getCtx: () => ctx };
}

afterEach(() => {
  vi.restoreAllMocks();
  window.history.replaceState(null, "", "/");
});

describe("ScrollContainer", () => {
  it("renders the scrollable content as a <main> landmark, reachable via the skip link", () => {
    installFakeRaf();
    const { scrollDiv } = setup();
    expect(scrollDiv.tagName).toBe("MAIN");
    expect(scrollDiv).toHaveAttribute("id", "main-content");
    expect(scrollDiv).toHaveAttribute("tabIndex", "-1");
  });

  it("animates scrollTop and lands on the requested section", () => {
    const fakeRaf = installFakeRaf();
    vi.spyOn(performance, "now").mockReturnValue(0);
    const { scrollDiv, getCtx } = setup();

    act(() => {
      getCtx().scrollToIndex(2);
    });
    expect(scrollDiv.scrollTop).toBe(0); // animation hasn't ticked yet

    act(() => {
      fakeRaf.flush(1400); // duration default: completes in one step
    });

    expect(scrollDiv.scrollTop).toBe(2 * 800);
    expect(getCtx().currentIndex).toBe(2);
  });

  it("ignores a second scrollToIndex call while one is still animating", () => {
    const fakeRaf = installFakeRaf();
    vi.spyOn(performance, "now").mockReturnValue(0);
    const { getCtx } = setup();

    act(() => {
      getCtx().scrollToIndex(1);
      getCtx().scrollToIndex(3); // should be dropped — an animation is in flight
    });

    act(() => {
      fakeRaf.flush(1400);
    });
    expect(getCtx().currentIndex).toBe(1);
  });

  it("ignores an out-of-range index", () => {
    const fakeRaf = installFakeRaf();
    vi.spyOn(performance, "now").mockReturnValue(0);
    const { getCtx } = setup();

    act(() => {
      getCtx().scrollToIndex(99);
    });
    expect(fakeRaf.raf).not.toHaveBeenCalled();
    expect(getCtx().currentIndex).toBe(0);
  });

  it("advances one section per wheel tick on desktop", () => {
    const fakeRaf = installFakeRaf();
    vi.spyOn(performance, "now").mockReturnValue(0);
    const { scrollDiv, getCtx } = setup({ isDesktop: true });

    act(() => {
      scrollDiv.dispatchEvent(new WheelEvent("wheel", { deltaY: 120, cancelable: true }));
    });
    act(() => {
      fakeRaf.flush(1400);
    });

    expect(getCtx().currentIndex).toBe(1);
  });

  it("lets native touch scroll happen on mobile — wheel handler is a no-op", () => {
    const fakeRaf = installFakeRaf();
    const { scrollDiv, getCtx } = setup({ isDesktop: false });

    const event = new WheelEvent("wheel", { deltaY: 120, cancelable: true });
    act(() => {
      scrollDiv.dispatchEvent(event);
    });

    expect(event.defaultPrevented).toBe(false);
    expect(fakeRaf.raf).not.toHaveBeenCalled();
    expect(getCtx().currentIndex).toBe(0);
  });

  it("recomputes currentIndex from a native scroll position change on desktop", () => {
    installFakeRaf();
    const { scrollDiv, getCtx } = setup({ isDesktop: true });

    act(() => {
      scrollDiv.scrollTop = 2 * 800;
      scrollDiv.dispatchEvent(new Event("scroll"));
    });

    expect(getCtx().currentIndex).toBe(2);
  });

  it("jumps straight to the section named by the URL hash on mount, unanimated", () => {
    installFakeRaf();
    window.history.replaceState(null, "", "/#work");
    const { scrollDiv, getCtx } = setup();

    expect(scrollDiv.scrollTop).toBe(2 * 800);
    expect(getCtx().currentIndex).toBe(2);
  });

  it("keeps the URL hash in sync with the current section", () => {
    const fakeRaf = installFakeRaf();
    vi.spyOn(performance, "now").mockReturnValue(0);
    const { getCtx } = setup();

    act(() => {
      getCtx().scrollToIndex(3);
    });
    act(() => {
      fakeRaf.flush(1400);
    });

    expect(window.location.hash).toBe("#contact");
  });

  it("skips rewriting the hash when it already matches the current section", () => {
    installFakeRaf();
    window.history.replaceState(null, "", "/#home");
    const replaceStateSpy = vi.spyOn(window.history, "replaceState");

    setup();

    expect(replaceStateSpy).not.toHaveBeenCalled();
  });

  it("keeps scheduling frames mid-animation, before landing on the final frame", () => {
    const fakeRaf = installFakeRaf();
    vi.spyOn(performance, "now").mockReturnValue(0);
    const { scrollDiv, getCtx } = setup();

    act(() => {
      getCtx().scrollToIndex(2);
    });
    const callsAfterStart = fakeRaf.raf.mock.calls.length;

    act(() => {
      fakeRaf.flush(700); // halfway through the 1400ms default duration
    });
    expect(getCtx().currentIndex).toBe(0); // not yet committed
    expect(scrollDiv.scrollTop).toBeGreaterThan(0);
    expect(scrollDiv.scrollTop).toBeLessThan(1600);
    // Still mid-flight, so another frame must have been scheduled.
    expect(fakeRaf.raf.mock.calls.length).toBeGreaterThan(callsAfterStart);

    act(() => {
      fakeRaf.flush(1400);
    });
    expect(getCtx().currentIndex).toBe(2);
  });

  it("targets a section's offsetTop instead of index*clientHeight on mobile", () => {
    const fakeRaf = installFakeRaf();
    vi.spyOn(performance, "now").mockReturnValue(0);
    const { scrollDiv, getCtx } = setup({ isDesktop: false });

    const workSection = scrollDiv.children[2] as HTMLElement;
    Object.defineProperty(workSection, "offsetTop", { value: 3333, configurable: true });

    act(() => {
      getCtx().scrollToIndex(2);
    });
    act(() => {
      fakeRaf.flush(1400);
    });

    expect(scrollDiv.scrollTop).toBe(3333);
  });

  it("still preventDefaults the wheel event on desktop even while an animation is in flight", () => {
    const fakeRaf = installFakeRaf();
    vi.spyOn(performance, "now").mockReturnValue(0);
    const { scrollDiv, getCtx } = setup({ isDesktop: true });

    act(() => {
      getCtx().scrollToIndex(1);
    });

    const secondWheel = new WheelEvent("wheel", { deltaY: 120, cancelable: true });
    act(() => {
      scrollDiv.dispatchEvent(secondWheel);
    });
    expect(secondWheel.defaultPrevented).toBe(true);

    act(() => {
      fakeRaf.flush(1400);
    });
    // The wheel tick fired while animating was dropped — only the first
    // scrollToIndex(1) call actually lands.
    expect(getCtx().currentIndex).toBe(1);
  });

  it("ignores a native scroll event while an animation is in flight", () => {
    const fakeRaf = installFakeRaf();
    vi.spyOn(performance, "now").mockReturnValue(0);
    const { scrollDiv, getCtx } = setup({ isDesktop: true });

    act(() => {
      getCtx().scrollToIndex(1);
      scrollDiv.scrollTop = 3 * 800; // a native scroll racing the animation
      scrollDiv.dispatchEvent(new Event("scroll"));
    });
    // Ignored — an animation owns scrollTop right now.
    expect(getCtx().currentIndex).toBe(0);

    act(() => {
      fakeRaf.flush(1400);
    });
    expect(getCtx().currentIndex).toBe(1);
  });

  it("ignores native scroll events on mobile (touch scroll is left alone)", () => {
    installFakeRaf();
    const { scrollDiv, getCtx } = setup({ isDesktop: false });

    act(() => {
      scrollDiv.scrollTop = 2 * 800;
      scrollDiv.dispatchEvent(new Event("scroll"));
    });

    expect(getCtx().currentIndex).toBe(0);
  });
});
