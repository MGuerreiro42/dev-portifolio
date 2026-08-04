import { vi } from "vitest";

/** Deterministic, manually-stepped requestAnimationFrame double — lets
 * RAF+lerp hooks (useHero, usePanelFloat, DustField, GlassBlobs) be tested
 * by flushing a controlled number of frames instead of waiting on real
 * timers or a real 60fps loop. */
export function installFakeRaf() {
  let queue: FrameRequestCallback[] = [];
  let id = 0;

  const raf = vi.fn((cb: FrameRequestCallback) => {
    queue.push(cb);
    return ++id;
  });
  const caf = vi.fn();

  vi.stubGlobal("requestAnimationFrame", raf);
  vi.stubGlobal("cancelAnimationFrame", caf);

  return {
    raf,
    caf,
    flush(time = 0) {
      const current = queue;
      queue = [];
      current.forEach((cb) => cb(time));
    },
    flushTimes(n: number, timeStep = 16) {
      for (let i = 0; i < n; i++) {
        this.flush(i * timeStep);
      }
    },
  };
}
