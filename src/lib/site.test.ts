import { describe, expect, it } from "vitest";
import { SITE_URL } from "./site";

describe("SITE_URL", () => {
  it("is the canonical production URL, no trailing slash", () => {
    expect(SITE_URL).toBe("https://guerreiro-dev.vercel.app");
    expect(SITE_URL.endsWith("/")).toBe(false);
  });
});
