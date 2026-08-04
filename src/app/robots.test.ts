import { describe, expect, it } from "vitest";
import robots from "./robots";
import { SITE_URL } from "@/lib/site";

describe("robots", () => {
  it("allows all crawlers and points at the sitemap", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: `${SITE_URL}/sitemap.xml`,
    });
  });
});
