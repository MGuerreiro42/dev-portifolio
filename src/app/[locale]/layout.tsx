import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Bebas_Neue, Barlow, Barlow_Condensed } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import "../globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const barlow = Barlow({
  weight: ["200", "300"],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  weight: "800",
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const title = t("title");
  const description = t("description");

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      languages: {
        en: "/en",
        "pt-BR": "/pt-br",
      },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}`,
      siteName: title,
      locale: locale === "pt-br" ? "pt_BR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={cn(bebasNeue.variable, barlow.variable, barlowCondensed.variable)}
    >
      <body>
        <JsonLd />
        <NextIntlClientProvider>
          {/* reducedMotion="user" faz todo motion.* do site respeitar
              prefers-reduced-motion automaticamente — sem isso, nenhuma
              das dezenas de animações (aqui incluindo as manuais em
              Hero/DustField/GlassBlobs, tratadas à parte) reagia à
              preferência do usuário. */}
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
