import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/test-utils";
import LocaleSwitcher from "./LocaleSwitcher";

describe("LocaleSwitcher", () => {
  it("renders both locale options", () => {
    renderWithIntl(<LocaleSwitcher />);
    expect(screen.getByRole("link", { name: "EN" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "PT-BR" })).toBeInTheDocument();
  });

  it("highlights the active locale", () => {
    renderWithIntl(<LocaleSwitcher />, { locale: "en" });
    expect(screen.getByRole("link", { name: "EN" })).toHaveClass("text-highlight/90");
    expect(screen.getByRole("link", { name: "PT-BR" })).toHaveClass("text-muted-warm/70");
  });

  it("points each option at the home route in its own locale", () => {
    renderWithIntl(<LocaleSwitcher />, { locale: "en" });
    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute("href", "/en");
    expect(screen.getByRole("link", { name: "PT-BR" })).toHaveAttribute("href", "/pt-br");
  });
});
