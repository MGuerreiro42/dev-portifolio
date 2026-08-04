import { describe, expect, it } from "vitest";
import { PROJECTS, getProject } from "./projects";

describe("PROJECTS", () => {
  it("has at least one project", () => {
    expect(PROJECTS.length).toBeGreaterThan(0);
  });

  it("gives every project a unique id", () => {
    const ids = PROJECTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every project a repo link, tags, and an image", () => {
    for (const project of PROJECTS) {
      expect(project.repoHref, project.id).toMatch(/^https:\/\//);
      expect(project.tags.length, project.id).toBeGreaterThan(0);
      expect(project.image, project.id).toMatch(/^\//);
    }
  });
});

describe("getProject", () => {
  it("finds a project by id", () => {
    const project = getProject("miniTms");
    expect(project?.title).toBe("Mini TMS");
  });

  it("returns undefined for an unknown id", () => {
    expect(getProject("does-not-exist")).toBeUndefined();
  });
});
