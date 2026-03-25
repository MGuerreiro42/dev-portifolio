"use client";

import Reveal from "@/components/ui/Reveal";

const SOCIALS = [
  { label: "Github", href: "https://github.com/" },
  { label: "LinkedIn", href: "https://linkedin.com/in/" },
  { label: "Instagram", href: "https://instagram.com/" },
];

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative w-full h-screen bg-black flex flex-col overflow-hidden sticky top-0 z-[4]"
    >
      {/* Linha divisória do topo */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.06] z-10" />

      {/* ── Metade superior ── */}
      <div className="flex flex-col items-center justify-end flex-1 pb-0 px-24">
        <Reveal delay={0.05} className="mb-8">
          <p className="font-light text-[9px] tracking-[0.55em] uppercase text-[#f0ede8]/[0.18]">
            Communication_Uplink
          </p>
        </Reveal>

        {/* Headline com reveal palavra por palavra */}
        <div className="flex gap-[0.25em] overflow-hidden">
          <Reveal delay={0.12}>
            <h2 className="font-display text-[clamp(72px,11vw,180px)] leading-[0.85] tracking-[-0.02em] uppercase text-[#f0ede8]">
              Let's
            </h2>
          </Reveal>
          <Reveal delay={0.22}>
            <h2 className="font-display text-[clamp(72px,11vw,180px)] leading-[0.85] tracking-[-0.02em] uppercase text-[#f0ede8]">
              Build
            </h2>
          </Reveal>
        </div>
      </div>

      {/* Linha divisória central */}
      <div className="w-full h-px bg-white/[0.06]" />

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
            href="mailto:miguel@email.com"
            className="font-display text-[clamp(18px,2.4vw,36px)] tracking-[0.12em] uppercase text-[#f0ede8] no-underline transition-colors duration-500 hover:text-[#f0ede8]/50"
          >
            miguel@email.com
          </a>
        </Reveal>

        {/* Socials */}
        <div className="flex items-center gap-12">
          {SOCIALS.map((social, i) => (
            <Reveal key={social.label} delay={0.18 + i * 0.08}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-light text-[9px] tracking-[0.45em] uppercase text-[#f0ede8]/[0.28] no-underline transition-colors duration-350 hover:text-[#f0ede8]/70"
              >
                {social.label}
              </a>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── Rodapé de metadados ── */}
      <div className="relative z-10 flex items-center justify-between px-24 py-5 border-t border-white/[0.06]">
        <Reveal delay={0.05}>
          <p className="font-light text-[8px] tracking-[0.4em] uppercase text-[#f0ede8]/[0.18]">
            ©2025 <span className="font-light">Miguel_Portfolio_V.01</span>
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="font-light text-[8px] tracking-[0.4em] uppercase text-[#f0ede8]/[0.18]">
            Lat: -22.7415 &nbsp;·&nbsp; Long: -47.3317 &nbsp;·&nbsp; Americana, SP · Brazil
          </p>
        </Reveal>
      </div>
    </section>
  );
}
