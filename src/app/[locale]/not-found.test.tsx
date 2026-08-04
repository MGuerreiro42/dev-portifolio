import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/test-utils";

const getTranslations = vi.fn(async () => (key: string) => `t:${key}`);
vi.mock("next-intl/server", () => ({
  getTranslations: (...args: Parameters<typeof getTranslations>) => getTranslations(...args),
}));

const { default: NotFound } = await import("./not-found");

describe("NotFound (locale-scoped)", () => {
  it("renders a 404 message with a link back home", async () => {
    const element = await NotFound();
    renderWithIntl(element);

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("t:title")).toBeInTheDocument();
    expect(screen.getByText("t:description")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /t:backHome/i })).toHaveAttribute("href", "/en");
  });
});
