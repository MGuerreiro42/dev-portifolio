import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@/test/test-utils";
import Navbar from "./Navbar";

describe("Navbar", () => {
  it("is labeled as the primary nav landmark", () => {
    renderWithIntl(<Navbar />, { section: { currentIndex: 0 } });
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
  });

  it("renders the four section links, in order", () => {
    renderWithIntl(<Navbar />, { section: { currentIndex: 0 } });
    expect(screen.getAllByRole("button").map((btn) => btn.textContent)).toEqual([
      "Home",
      "About",
      "Work",
      "Contact",
    ]);
  });

  it("highlights the current section", () => {
    renderWithIntl(<Navbar />, { section: { currentIndex: 2 } });
    expect(screen.getByRole("button", { name: "Work" })).toHaveClass("text-highlight/85");
    expect(screen.getByRole("button", { name: "Home" })).toHaveClass("text-muted-warm/75");
  });

  it("scrolls to the clicked section", async () => {
    const scrollToIndex = vi.fn();
    renderWithIntl(<Navbar />, { section: { scrollToIndex, currentIndex: 0 } });

    await userEvent.click(screen.getByRole("button", { name: "Work" }));
    expect(scrollToIndex).toHaveBeenCalledWith(2);
  });
});
