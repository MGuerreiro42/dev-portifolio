import { describe, expect, it } from "vitest";
import { routing } from "./routing";

describe("routing", () => {
  it("supports English and Brazilian Portuguese, defaulting to English", () => {
    expect(routing.locales).toEqual(["en", "pt-br"]);
    expect(routing.defaultLocale).toBe("en");
  });

  it("disables browser-based locale auto-detection (explicit /en, /pt-br only)", () => {
    expect(routing.localeDetection).toBe(false);
  });
});
