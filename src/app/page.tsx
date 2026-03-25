import ScrollContainer from "@/components/ScrollContainer";
import HeroSection from "@/components/hero/HeroSection";
import AboutSection from "@/components/about/AboutSection";
import WorkSection from "@/components/work/WorkSection";
import ContactSection from "@/components/contact/ContactSection";

export default function Home() {
  return (
    <ScrollContainer duration={1400}>
      <HeroSection />
      <AboutSection />
      <WorkSection />
      <ContactSection />
    </ScrollContainer>
  );
}
