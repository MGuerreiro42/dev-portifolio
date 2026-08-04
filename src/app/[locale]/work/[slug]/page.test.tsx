import { describe, expect, it, vi } from "vitest";
import { routing } from "@/i18n/routing";
import { PROJECTS } from "@/lib/projects";
import ProjectDetailView from "@/components/work/ProjectDetailView";

const setRequestLocale = vi.fn();
const getTranslations = vi.fn(async ({ locale }: { locale: string }) => {
  return (key: string) => `${locale}:${key}`;
});
vi.mock("next-intl/server", () => ({
  setRequestLocale: (...args: unknown[]) => setRequestLocale(...args),
  getTranslations: (...args: Parameters<typeof getTranslations>) => getTranslations(...args),
}));

const { default: ProjectPage, generateStaticParams, generateMetadata } = await import("./page");

describe("generateStaticParams", () => {
  it("returns one entry per locale x project combination", () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(routing.locales.length * PROJECTS.length);
    expect(params).toContainEqual({ locale: "en", slug: "miniTms" });
    expect(params).toContainEqual({ locale: "pt-br", slug: "portfolio" });
  });
});

describe("generateMetadata", () => {
  it("builds a title and translated description for a known project", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en", slug: "miniTms" }),
    });
    expect(metadata.title).toBe("Mini TMS — Miguel Guerreiro");
    expect(metadata.description).toBe("en:projects.miniTms.description");
  });

  it("returns empty metadata for an unknown slug", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en", slug: "does-not-exist" }),
    });
    expect(metadata).toEqual({});
  });
});

describe("ProjectPage", () => {
  it("sets the request locale and renders the project's detail view", async () => {
    setRequestLocale.mockClear();
    const element = await ProjectPage({
      params: Promise.resolve({ locale: "en", slug: "miniTms" }),
    });

    expect(setRequestLocale).toHaveBeenCalledWith("en");
    expect(element.type).toBe(ProjectDetailView);
    expect(element.props.project.id).toBe("miniTms");
  });

  it("404s for an unknown project slug", async () => {
    await expect(
      ProjectPage({ params: Promise.resolve({ locale: "en", slug: "does-not-exist" }) })
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
