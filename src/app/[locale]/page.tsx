import { setRequestLocale } from "next-intl/server";
import ScrollContainer from "@/components/ScrollContainer";
import HeroSection from "@/components/hero/HeroSection";
import AboutSection from "@/components/about/AboutSection";
import WorkSection from "@/components/work/WorkSection";
import ContactSection from "@/components/contact/ContactSection";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ScrollContainer duration={1400}>
      <HeroSection />
      <AboutSection />
      <WorkSection />
      <ContactSection />
    </ScrollContainer>
  );
}
