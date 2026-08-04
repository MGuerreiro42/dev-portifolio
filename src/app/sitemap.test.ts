import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";
import { routing } from "@/i18n/routing";
import { PROJECTS } from "@/lib/projects";
import { SITE_URL } from "@/lib/site";

describe("sitemap", () => {
  it("lists the home page and every project's case-study page, per locale", () => {
    const entries = sitemap();
    const expectedCount = routing.locales.length * (1 + PROJECTS.length);
    expect(entries).toHaveLength(expectedCount);

    for (const locale of routing.locales) {
      expect(entries).toContainEqual(
        expect.objectContaining({ url: `${SITE_URL}/${locale}`, priority: 1 })
      );
      for (const project of PROJECTS) {
        expect(entries).toContainEqual(
          expect.objectContaining({
            url: `${SITE_URL}/${locale}/work/${project.id}`,
            priority: 0.7,
          })
        );
      }
    }
  });
});
