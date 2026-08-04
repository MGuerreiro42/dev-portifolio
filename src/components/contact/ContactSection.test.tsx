import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/test-utils";
import ContactSection from "./ContactSection";

describe("ContactSection", () => {
  it("renders a mailto link with the contact email", () => {
    renderWithIntl(<ContactSection />);
    expect(screen.getByRole("link", { name: "miguelpachiega@gmail.com" })).toHaveAttribute(
      "href",
      "mailto:miguelpachiega@gmail.com"
    );
  });

  it("renders the remote-availability line", () => {
    renderWithIntl(<ContactSection />, { locale: "en" });
    expect(screen.getByText("Open to remote opportunities, worldwide")).toBeInTheDocument();
  });

  it("links GitHub and LinkedIn out to their real profiles", () => {
    renderWithIntl(<ContactSection />);
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
      "href",
      "https://github.com/MGuerreiro42"
    );
    expect(screen.getByRole("link", { name: /linkedin/i })).toHaveAttribute(
      "href",
      "https://linkedin.com/in/miguelpguerreiro"
    );
  });

  it("downloads the English resume on the EN locale", () => {
    renderWithIntl(<ContactSection />, { locale: "en" });
    const resumeLink = screen.getByRole("link", { name: /download resume/i });
    expect(resumeLink).toHaveAttribute("href", "/resume/miguel-guerreiro-resume-en.pdf");
    expect(resumeLink).toHaveAttribute("download");
  });

  it("downloads the Portuguese résumé on the pt-br locale", () => {
    renderWithIntl(<ContactSection />, { locale: "pt-br" });
    const resumeLink = screen.getByRole("link", { name: /baixar currículo/i });
    expect(resumeLink).toHaveAttribute("href", "/resume/miguel-guerreiro-curriculo-pt-br.pdf");
  });

  it("shows the current year in the footer", () => {
    renderWithIntl(<ContactSection />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });
});
