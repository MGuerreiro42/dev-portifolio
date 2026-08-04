import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import React from "react";

// RTL's own auto-cleanup registers against a global `afterEach`, which
// doesn't exist with `test.globals: false` — without this, unmounted DOM
// from one test leaks into the next within the same file.
afterEach(() => {
  cleanup();
});

// next/image needs the built-in image optimizer, which doesn't exist in a
// test environment — render a plain <img> with the same props instead.
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { src, alt, ...rest } = props;
    // `fill`/`priority` are Next-Image-only props that aren't valid on a
    // plain <img>; deliberately dropped rather than forwarded.
    delete rest.fill;
    delete rest.priority;
    return React.createElement("img", { src, alt, ...rest });
  },
}));

// next/font/google fetches real font files at build time — stub every
// export to return the { variable, className } shape components read.
vi.mock("next/font/google", () => {
  const font = () => ({ variable: "mock-font-variable", className: "mock-font-class" });
  return {
    Bebas_Neue: font,
    Barlow: font,
    Barlow_Condensed: font,
  };
});

// A handful of files (e.g. i18n/request.ts) run under `node` rather than
// jsdom via a `@vitest-environment node` override, since next-intl resolves
// a different, DOM-free build there — none of the browser-only globals
// below exist (or are needed) in that environment.
if (typeof window !== "undefined") {
  // jsdom has no layout engine, so matchMedia doesn't exist at all —
  // default stub reports "no match" for every query; tests override
  // matches per-case.
  class MatchMediaStub {
    matches = false;
    media: string;
    listeners = new Set<(e: MediaQueryListEvent) => void>();
    constructor(media: string) {
      this.media = media;
    }
    addEventListener(_: string, cb: (e: MediaQueryListEvent) => void) {
      this.listeners.add(cb);
    }
    removeEventListener(_: string, cb: (e: MediaQueryListEvent) => void) {
      this.listeners.delete(cb);
    }
    addListener() {}
    removeListener() {}
    dispatchEvent() {
      return true;
    }
  }

  if (!window.matchMedia) {
    window.matchMedia = vi.fn(
      (media: string) => new MatchMediaStub(media)
    ) as unknown as typeof window.matchMedia;
  }

  // jsdom doesn't implement IntersectionObserver — a minimal stub is enough
  // for components that just observe/disconnect; tests trigger callbacks
  // manually by grabbing the instance off this global.
  class IntersectionObserverStub implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = "";
    readonly thresholds: ReadonlyArray<number> = [];
    callback: IntersectionObserverCallback;
    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
    }
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = () => [];
  }

  if (!("IntersectionObserver" in window)) {
    (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
      IntersectionObserverStub;
    (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
      IntersectionObserverStub;
  }

  // jsdom's canvas has no real 2D context — DustField only needs a gradient
  // object it can call addColorStop on, never actual pixel output.
  class FakeCanvasGradient {
    addColorStop = vi.fn();
  }

  const fakeCanvasContext = {
    createRadialGradient: vi.fn(() => new FakeCanvasGradient()),
    fillRect: vi.fn(),
    fillStyle: "",
  };

  HTMLCanvasElement.prototype.getContext = vi.fn(
    () => fakeCanvasContext
  ) as unknown as typeof HTMLCanvasElement.prototype.getContext;
}
