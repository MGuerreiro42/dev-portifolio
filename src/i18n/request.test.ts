import { describe, expect, it, vi } from "vitest";
import { routing } from "./routing";

// The real getRequestConfig resolves to a client-only stub that throws
// under Vite's module resolution (next-intl's react-server/react-client
// split isn't replicated outside actual Next.js RSC request handling) —
// mocked as identity so this test can exercise this file's own locale
// fallback logic without depending on that resolution succeeding.
vi.mock("next-intl/server", () => ({
  getRequestConfig: (fn: unknown) => fn,
}));

const { default: getConfig } = await import("./request");

describe("i18n request config", () => {
  it("uses the requested locale when it's supported", async () => {
    const result = await getConfig({
      requestLocale: Promise.resolve("pt-br"),
    } as never);
    expect(result.locale).toBe("pt-br");
    expect((result.messages as { Metadata: unknown }).Metadata).toBeDefined();
  });

  it("falls back to the default locale for an unsupported/missing request locale", async () => {
    const result = await getConfig({
      requestLocale: Promise.resolve(undefined),
    } as never);
    expect(result.locale).toBe(routing.defaultLocale);
  });

  it("falls back to the default locale for a locale outside the supported set", async () => {
    const result = await getConfig({
      requestLocale: Promise.resolve("fr"),
    } as never);
    expect(result.locale).toBe(routing.defaultLocale);
  });
});
