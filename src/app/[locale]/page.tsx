import { setRequestLocale } from "next-intl/server";
import ScrollContainer from "@/components/ScrollContainer";
import Brand from "@/components/nav/Brand";
import Navbar from "@/components/nav/Navbar";
import MobileMenu from "@/components/nav/MobileMenu";
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
    <ScrollContainer
      duration={1400}
      overlay={
        <>
          <Brand />
          <Navbar />
          <MobileMenu />
        </>
      }
    >
      <HeroSection />
      <AboutSection />
      <WorkSection />
      <ContactSection />
    </ScrollContainer>
  );
}
