import { describe, expect, it, vi } from "vitest";
import { routing } from "./i18n/routing";

const middlewareFn = vi.fn();
const createMiddleware = vi.fn(() => middlewareFn);
vi.mock("next-intl/middleware", () => ({ default: createMiddleware }));

const { default: middleware, config } = await import("./middleware");

describe("middleware", () => {
  it("wraps next-intl's middleware with this app's routing config", () => {
    expect(createMiddleware).toHaveBeenCalledWith(routing);
    expect(middleware).toBe(middlewareFn);
  });

  it("excludes Next's metadata routes and static assets from locale prefixing", () => {
    const matcher = config.matcher[0];
    for (const path of [
      "/icon",
      "/apple-icon",
      "/opengraph-image",
      "/twitter-image",
      "/favicon.ico",
      "/robots.txt",
      "/sitemap.xml",
      "/api/whatever",
      "/_next/static/chunk.js",
      "/photo.webp",
    ]) {
      expect(new RegExp(`^${matcher}$`).test(path)).toBe(false);
    }
    for (const path of ["/", "/en", "/pt-br/work/miniTms"]) {
      expect(new RegExp(`^${matcher}$`).test(path)).toBe(true);
    }
  });
});
