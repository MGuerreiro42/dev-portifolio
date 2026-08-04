import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SectionIndicator from "./SectionIndicator";

describe("SectionIndicator", () => {
  it("renders one button per section", () => {
    render(<SectionIndicator current={0} onDotClick={() => {}} />);
    expect(screen.getAllByRole("button")).toHaveLength(4);
  });

  it("labels each dot for accessibility", () => {
    render(<SectionIndicator current={0} onDotClick={() => {}} />);
    expect(screen.getByRole("button", { name: "Go to section 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to section 4" })).toBeInTheDocument();
  });

  it("calls onDotClick with the clicked dot's index", async () => {
    const onDotClick = vi.fn();
    render(<SectionIndicator current={0} onDotClick={onDotClick} />);

    await userEvent.click(screen.getByRole("button", { name: "Go to section 3" }));
    expect(onDotClick).toHaveBeenCalledWith(2);
  });

  it("marks the current dot visually distinct from the rest", () => {
    render(<SectionIndicator current={1} onDotClick={() => {}} />);
    const dots = screen.getAllByRole("button");
    const activeSpan = dots[1].querySelector("span")!;
    const inactiveSpan = dots[0].querySelector("span")!;
    expect(activeSpan).toHaveClass("bg-highlight/85");
    expect(inactiveSpan).toHaveClass("bg-dim");
  });
});
