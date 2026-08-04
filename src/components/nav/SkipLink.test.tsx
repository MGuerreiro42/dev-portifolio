import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/test-utils";
import SkipLink from "./SkipLink";

describe("SkipLink", () => {
  it("links to the main content region", () => {
    renderWithIntl(<SkipLink />);
    expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute(
      "href",
      "#main-content"
    );
  });

  it("is visually hidden until focused", () => {
    renderWithIntl(<SkipLink />);
    expect(screen.getByRole("link", { name: "Skip to content" })).toHaveClass("sr-only");
  });
});
