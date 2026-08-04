import { describe, expect, it } from "vitest";
import { personJsonLd } from "./personJsonLd";
import { SITE_URL } from "./site";

describe("personJsonLd", () => {
  it("is a valid schema.org Person pointing at the canonical site URL", () => {
    expect(personJsonLd["@context"]).toBe("https://schema.org");
    expect(personJsonLd["@type"]).toBe("Person");
    expect(personJsonLd.url).toBe(SITE_URL);
  });

  it("links out to the real GitHub and LinkedIn profiles", () => {
    expect(personJsonLd.sameAs).toContain("https://github.com/MGuerreiro42");
    expect(personJsonLd.sameAs).toContain("https://linkedin.com/in/miguelpguerreiro");
  });

  it("is JSON-serializable (no undefined/function values)", () => {
    expect(() => JSON.stringify(personJsonLd)).not.toThrow();
  });
});
