import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@/test/test-utils";
import MobileMenu from "./MobileMenu";

describe("MobileMenu", () => {
  it("starts closed", () => {
    renderWithIntl(<MobileMenu />);
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(screen.queryByRole("button", { name: "Work" })).not.toBeInTheDocument();
  });

  it("opens to reveal a labeled nav landmark with the section links and locale switcher", async () => {
    renderWithIntl(<MobileMenu />, { section: { currentIndex: 0 } });
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));

    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(screen.getByRole("navigation", { name: "Mobile" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Work" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "EN" })).toBeInTheDocument();
  });

  it("navigates to the tapped section and closes the menu", async () => {
    const scrollToIndex = vi.fn();
    renderWithIntl(<MobileMenu />, { section: { scrollToIndex, currentIndex: 0 } });

    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    await userEvent.click(screen.getByRole("button", { name: "Work" }));

    expect(scrollToIndex).toHaveBeenCalledWith(2);
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("closes the menu when a locale link is tapped", async () => {
    renderWithIntl(<MobileMenu />);
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    await userEvent.click(screen.getByRole("link", { name: "PT-BR" }));

    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });
});
