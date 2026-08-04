import { describe, expect, it } from "vitest";
import { TECH_ICONS, TECH_COLORS } from "./techIcons";
import { PROJECTS } from "./projects";

describe("TECH_ICONS / TECH_COLORS", () => {
  it("has an icon component for every known tech name", () => {
    for (const [name, Icon] of Object.entries(TECH_ICONS)) {
      expect(Icon, `missing icon for "${name}"`).toBeDefined();
    }
  });

  it("has a brand color for every known tech name", () => {
    for (const [name, color] of Object.entries(TECH_COLORS)) {
      expect(color, `missing color for "${name}"`).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it("has an icon for every tag referenced by a project", () => {
    const allTags = new Set(PROJECTS.flatMap((p) => p.tags));
    for (const tag of allTags) {
      expect(TECH_ICONS[tag], `no icon registered for project tag "${tag}"`).toBeDefined();
    }
  });
});
