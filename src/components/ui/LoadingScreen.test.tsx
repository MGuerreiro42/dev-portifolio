import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import LoadingScreen from "./LoadingScreen";

describe("LoadingScreen", () => {
  it("renders three pulsing dots", () => {
    const { container } = render(<LoadingScreen />);
    // No accessible text — it's a purely visual loading indicator; assert
    // on structure instead (3 animated dot spans).
    expect(container.querySelectorAll("span").length).toBe(3);
  });
});
