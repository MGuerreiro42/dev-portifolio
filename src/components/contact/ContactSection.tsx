"use client";

import { useTranslations } from "next-intl";
import { SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import Reveal from "@/components/ui/Reveal";

const SOCIALS = [
  { label: "Github", href: "https://github.com/MGuerreiro42", Icon: SiGithub },
  { label: "LinkedIn", href: "https://linkedin.com/in/miguelpguerreiro", Icon: FaLinkedin },
];

export default function ContactSection() {
  const t = useTranslations("Contact");

  return (
    <section
      id="contact"
      className="relative w-full min-h-screen md:h-screen bg-black flex flex-col overflow-hidden md:sticky md:top-0 z-[4]"
    >
      {/* Linha divisória do topo */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.08] z-10" />

      {/* ── Metade superior ── */}
      <div className="flex flex-col items-center justify-end flex-1 pb-0 px-6 md:px-24">
        {/* Headline com reveal palavra por palavra */}
        <div className="flex gap-[clamp(18px,2.75vw,45px)] overflow-hidden">
          <Reveal delay={0.12}>
            <h2 className="font-display text-[clamp(72px,11vw,180px)] leading-[0.85] tracking-[-0.02em] uppercase text-highlight">
              {t("heading1")}
            </h2>
          </Reveal>
          <Reveal delay={0.22}>
            <h2 className="font-display text-[clamp(72px,11vw,180px)] leading-[0.85] tracking-[-0.02em] uppercase text-highlight">
              {t("heading2")}
            </h2>
          </Reveal>
        </div>
      </div>

      {/* Linha divisória central */}
      <div className="w-full h-px bg-white/[0.08]" />

      {/* ── Metade inferior com grid ── */}
      <div
        className="relative flex-1 flex flex-col items-center justify-center gap-12"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "88px 88px",
        }}
      >
        {/* Email */}
        <Reveal delay={0.1}>
          <a
            href="mailto:miguelpachiega@gmail.com"
            className="font-display text-[clamp(18px,2.4vw,36px)] tracking-[0.12em] uppercase text-highlight no-underline transition-colors duration-500 hover:text-muted-warm"
          >
            miguelpachiega@gmail.com
          </a>
        </Reveal>

        {/* Socials */}
        <div className="flex items-center gap-4">
          {SOCIALS.map((social, i) => (
            <Reveal key={social.label} delay={0.18 + i * 0.08}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.05] px-5 py-2.5 font-light text-[10px] tracking-[0.3em] uppercase text-body no-underline transition-colors duration-300 hover:bg-white/15 hover:border-white/30 hover:text-highlight"
              >
                <social.Icon className="w-[15px] h-[15px]" />
                {social.label}
              </a>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── Rodapé ── */}
      <div className="relative z-10 flex items-center justify-center px-6 md:px-24 py-5 border-t border-white/[0.06]">
        <Reveal delay={0.05} margin={0}>
          <p className="font-light text-[9px] tracking-[0.4em] uppercase text-dim/80">
            {t("footer", { year: new Date().getFullYear() })}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
