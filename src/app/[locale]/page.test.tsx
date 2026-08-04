import { describe, expect, it, vi } from "vitest";
import { Children, isValidElement } from "react";
import ScrollContainer from "@/components/ScrollContainer";
import SkipLink from "@/components/nav/SkipLink";
import Brand from "@/components/nav/Brand";
import Navbar from "@/components/nav/Navbar";
import MobileMenu from "@/components/nav/MobileMenu";
import HeroSection from "@/components/hero/HeroSection";
import AboutSection from "@/components/about/AboutSection";
import WorkSection from "@/components/work/WorkSection";
import ContactSection from "@/components/contact/ContactSection";

const setRequestLocale = vi.fn();
vi.mock("next-intl/server", () => ({ setRequestLocale: (...args: unknown[]) => setRequestLocale(...args) }));

const { default: Home } = await import("./page");

describe("Home page", () => {
  it("marks the request locale and composes the four sections inside a ScrollContainer", async () => {
    const element = await Home({ params: Promise.resolve({ locale: "en" }) });

    expect(setRequestLocale).toHaveBeenCalledWith("en");
    expect(element.type).toBe(ScrollContainer);
    expect(element.props.duration).toBe(1400);

    const sectionTypes = Children.toArray(element.props.children)
      .filter(isValidElement)
      .map((child) => child.type);
    expect(sectionTypes).toEqual([HeroSection, AboutSection, WorkSection, ContactSection]);

    const overlayTypes = Children.toArray(element.props.overlay.props.children)
      .filter(isValidElement)
      .map((child) => child.type);
    expect(overlayTypes).toEqual([SkipLink, Brand, Navbar, MobileMenu]);
  });
});
