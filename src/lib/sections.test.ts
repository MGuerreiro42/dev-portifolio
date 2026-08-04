import { describe, expect, it } from "vitest";
import { SECTION_KEYS } from "./sections";

describe("SECTION_KEYS", () => {
  it("lists the four sections in scroll order", () => {
    expect(SECTION_KEYS).toEqual(["home", "about", "work", "contact"]);
  });
});
