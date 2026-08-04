import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/test-utils";
import { getProject } from "@/lib/projects";
import ProjectDetailView from "./ProjectDetailView";

const project = getProject("miniTms")!;
const projectWithoutLive = getProject("vigilDashboard")!;

describe("ProjectDetailView", () => {
  it("renders the project title, tags and a back-to-work link", () => {
    renderWithIntl(<ProjectDetailView project={project} />);

    expect(screen.getByRole("heading", { level: 1, name: project.title })).toBeInTheDocument();
    for (const tag of project.tags) {
      expect(screen.getByText(tag)).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: /back to work/i })).toHaveAttribute("href", "/en");
  });

  it("renders overview, architecture, stack, challenge and status sections", () => {
    renderWithIntl(<ProjectDetailView project={project} />);

    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Architecture & Key Decisions")).toBeInTheDocument();
    expect(screen.getByText("Tech Stack")).toBeInTheDocument();
    expect(screen.getByText("The Challenge")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("shows a 'View Live' link when the project has a live deploy", () => {
    renderWithIntl(<ProjectDetailView project={project} />);
    expect(screen.getByRole("link", { name: /view live/i })).toHaveAttribute("href", project.href);
  });

  it("omits the 'View Live' link when there's no live deploy", () => {
    renderWithIntl(<ProjectDetailView project={projectWithoutLive} />);
    expect(screen.queryByRole("link", { name: /view live/i })).not.toBeInTheDocument();
  });

  it("always shows a 'View Code' link pointing at the repo", () => {
    renderWithIntl(<ProjectDetailView project={project} />);
    expect(screen.getByRole("link", { name: /view code/i })).toHaveAttribute(
      "href",
      project.repoHref
    );
  });
});
