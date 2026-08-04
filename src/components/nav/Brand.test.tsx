import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/test-utils";
import Brand from "./Brand";

describe("Brand", () => {
  it("links to the home route with the site's brand text", () => {
    renderWithIntl(<Brand />);
    const link = screen.getByRole("link", { name: "guerreiro-dev" });
    expect(link).toHaveAttribute("href", "/en");
  });
});
