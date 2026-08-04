import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import Loading from "./loading";

describe("Project page loading", () => {
  it("renders the shared LoadingScreen", () => {
    const { container } = render(<Loading />);
    expect(container.querySelectorAll("span")).toHaveLength(3);
  });
});
