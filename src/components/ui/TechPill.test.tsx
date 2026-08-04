import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import TechPill from "./TechPill";

describe("TechPill", () => {
  it("renders the label with its branded icon", () => {
    render(<TechPill label="React" />);
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("renders without an icon for an unregistered tech name", () => {
    render(<TechPill label="COBOL" />);
    expect(screen.getByText("COBOL")).toBeInTheDocument();
  });
});
