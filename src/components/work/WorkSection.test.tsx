import { describe, expect, it } from "vitest";
import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@/test/test-utils";
import { PROJECTS } from "@/lib/projects";
import WorkSection from "./WorkSection";

describe("WorkSection — desktop panels", () => {
  it("renders one panel per project, all collapsed by default", () => {
    renderWithIntl(<WorkSection />);
    const desktop = within(screen.getByTestId("work-desktop"));

    for (const project of PROJECTS) {
      const panel = desktop.getByRole("button", { name: project.title });
      expect(panel).toHaveAttribute("aria-expanded", "false");
    }
  });

  it("expands a panel on click and makes its links keyboard-reachable", async () => {
    renderWithIntl(<WorkSection />);
    const desktop = within(screen.getByTestId("work-desktop"));
    const panel = desktop.getByRole("button", { name: PROJECTS[0].title });

    await userEvent.click(panel);

    expect(panel).toHaveAttribute("aria-expanded", "true");
    const caseStudyLink = within(panel).getByRole("link", { name: /case study/i });
    expect(caseStudyLink).toHaveAttribute("tabIndex", "0");
  });

  it("hides a collapsed panel's links from the tab order", () => {
    renderWithIntl(<WorkSection />);
    const desktop = within(screen.getByTestId("work-desktop"));
    const panel = desktop.getByRole("button", { name: PROJECTS[0].title });

    const caseStudyLink = within(panel).getByRole("link", { name: /case study/i });
    expect(caseStudyLink).toHaveAttribute("tabIndex", "-1");
  });

  it("expands via keyboard (Enter/Space), same as a click", async () => {
    renderWithIntl(<WorkSection />);
    const desktop = within(screen.getByTestId("work-desktop"));
    const panel = desktop.getByRole("button", { name: PROJECTS[1].title });

    panel.focus();
    await userEvent.keyboard("{Enter}");
    expect(panel).toHaveAttribute("aria-expanded", "true");

    await userEvent.keyboard(" ");
    expect(panel).toHaveAttribute("aria-expanded", "false");
  });

  it("only keeps one panel expanded at a time", async () => {
    renderWithIntl(<WorkSection />);
    const desktop = within(screen.getByTestId("work-desktop"));
    const first = desktop.getByRole("button", { name: PROJECTS[0].title });
    const second = desktop.getByRole("button", { name: PROJECTS[1].title });

    await userEvent.click(first);
    expect(first).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(second);
    expect(second).toHaveAttribute("aria-expanded", "true");
    expect(first).toHaveAttribute("aria-expanded", "false");
  });

  it("only shows a 'View Live' link for projects that have a live deploy", () => {
    renderWithIntl(<WorkSection />);
    const desktop = within(screen.getByTestId("work-desktop"));

    const withLive = PROJECTS.find((p) => p.href)!;
    const withoutLive = PROJECTS.find((p) => !p.href)!;

    const livePanel = desktop.getByRole("button", { name: withLive.title });
    expect(within(livePanel).getByRole("link", { name: /view live/i })).toBeInTheDocument();

    const noLivePanel = desktop.getByRole("button", { name: withoutLive.title });
    expect(within(noLivePanel).queryByRole("link", { name: /view live/i })).not.toBeInTheDocument();
  });

  it("grows the hovered panel and shrinks its siblings, with an image parallax offset", () => {
    renderWithIntl(<WorkSection />);
    const desktop = within(screen.getByTestId("work-desktop"));
    const hovered = desktop.getByRole("button", { name: PROJECTS[0].title });
    const sibling = desktop.getByRole("button", { name: PROJECTS[1].title });
    hovered.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 200, height: 200 }) as DOMRect;

    fireEvent.mouseEnter(hovered);
    fireEvent.mouseMove(hovered, { clientX: 150, clientY: 50 });

    expect(hovered).toHaveClass("flex-[1.4]");
    expect(sibling).toHaveClass("flex-[0.85]");

    fireEvent.mouseLeave(hovered);
    expect(hovered).toHaveClass("flex-1");
    expect(sibling).toHaveClass("flex-1");
  });

  it("always shows a 'View Code' link, pointing at the repo", () => {
    renderWithIntl(<WorkSection />);
    const desktop = within(screen.getByTestId("work-desktop"));
    const panel = desktop.getByRole("button", { name: PROJECTS[0].title });

    expect(within(panel).getByRole("link", { name: /view code/i })).toHaveAttribute(
      "href",
      PROJECTS[0].repoHref
    );
  });
});

describe("WorkSection — mobile list", () => {
  it("renders one collapsed entry per project", () => {
    renderWithIntl(<WorkSection />);
    const mobile = within(screen.getByTestId("work-mobile"));

    for (const project of PROJECTS) {
      const toggle = mobile.getByRole("button", { name: new RegExp(project.title, "i") });
      expect(toggle).toHaveAttribute("aria-expanded", "false");
    }
  });

  it("expands an entry on tap, revealing its case-study/live/code links", async () => {
    renderWithIntl(<WorkSection />);
    const mobile = within(screen.getByTestId("work-mobile"));
    const toggle = mobile.getByRole("button", { name: new RegExp(PROJECTS[0].title, "i") });

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    const entry = toggle.closest('[class*="rounded-2xl"]') as HTMLElement;
    expect(within(entry).getByRole("link", { name: /case study/i })).toHaveAttribute(
      "tabIndex",
      "0"
    );
  });
});
