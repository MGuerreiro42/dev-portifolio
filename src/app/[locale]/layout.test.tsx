import { describe, expect, it, vi } from "vitest";
import { Children, isValidElement } from "react";
import { MotionConfig } from "framer-motion";
import { NextIntlClientProvider } from "next-intl";
import { SITE_URL } from "@/lib/site";
import JsonLd from "@/components/JsonLd";

const setRequestLocale = vi.fn();
const getTranslations = vi.fn(async ({ locale }: { locale: string }) => {
  return (key: string) => `${locale}:${key}`;
});
vi.mock("next-intl/server", () => ({
  setRequestLocale: (...args: unknown[]) => setRequestLocale(...args),
  getTranslations: (...args: Parameters<typeof getTranslations>) => getTranslations(...args),
}));

const { default: RootLayout, generateStaticParams, generateMetadata } = await import(
  "./layout"
);

describe("generateStaticParams", () => {
  it("returns one entry per supported locale", () => {
    expect(generateStaticParams()).toEqual([{ locale: "en" }, { locale: "pt-br" }]);
  });
});

describe("generateMetadata", () => {
  it("builds locale-aware metadata, including OG/Twitter tags", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: "pt-br" }) });

    expect(metadata.title).toBe("pt-br:title");
    expect(metadata.description).toBe("pt-br:description");
    expect(metadata.metadataBase).toEqual(new URL(SITE_URL));
    expect(metadata.alternates?.languages).toEqual({ en: "/en", "pt-BR": "/pt-br" });
    expect(metadata.openGraph).toMatchObject({
      title: "pt-br:title",
      url: "/pt-br",
      locale: "pt_BR",
      type: "website",
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "pt-br:title",
    });
  });

  it("maps the en locale to the en_US OpenGraph locale", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: "en" }) });
    expect(metadata.openGraph?.locale).toBe("en_US");
  });
});

describe("RootLayout", () => {
  it("sets the request locale and renders <html lang> with the providers wired up", async () => {
    setRequestLocale.mockClear();
    const element = await RootLayout({
      children: <div data-testid="page-content" />,
      params: Promise.resolve({ locale: "en" }),
    });

    expect(setRequestLocale).toHaveBeenCalledWith("en");
    expect(element.type).toBe("html");
    expect(element.props.lang).toBe("en");

    const body = element.props.children;
    expect(body.type).toBe("body");

    const bodyChildren = Children.toArray(body.props.children).filter(isValidElement);
    expect(bodyChildren.map((child) => child.type)).toEqual([
      JsonLd,
      NextIntlClientProvider,
    ]);

    const intlProvider = bodyChildren[1] as React.ReactElement<{ children: React.ReactElement }>;

    const motionConfig = intlProvider.props.children as React.ReactElement<{
      reducedMotion: string;
      children: React.ReactElement<{ "data-testid": string }>;
    }>;
    expect(motionConfig.type).toBe(MotionConfig);
    expect(motionConfig.props.reducedMotion).toBe("user");
    expect(motionConfig.props.children.props["data-testid"]).toBe("page-content");
  });

  it("404s for a locale outside the supported set", async () => {
    await expect(
      RootLayout({
        children: <div />,
        params: Promise.resolve({ locale: "fr" }),
      })
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
